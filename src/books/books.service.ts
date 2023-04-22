import Joi = require("joi");
import { env } from "process";
import bookSchema from "./books.schema";
import { Book } from "@prisma/client";
import prisma from "../utils/prisma";
import redis from "../utils/redis";
import { Request, Response } from 'express';


const REDIS_EXPIRY_TIME = parseInt(env.REDIS_EXPIRY_TIME)

export const createBook = async (req: Request, res: Response) => {
    try {
        const { value, error }: { value: Book, error: Joi.ValidationError } = bookSchema.validate(req.body)
        if (error) throw new Error(error.message)
        const book = await prisma.book.create({
            data: {
                ...value,
            }
        })
        await redis.set(`book-${book.id}`, JSON.stringify(book), {
            EX: REDIS_EXPIRY_TIME
        })
        return res.status(200).json({ success: true, message: 'Book created successfully', data: book })
    } catch (error) {
        console.log(error);
        return res.status(406).json({ success: false, message: error.message })
    }

}
export const getBook = async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId;
        if (!bookId) throw new Error("no book id provided")

        const bookFromRedis  = await redis.get(`book-${bookId}`)
        if(bookFromRedis){
            return res.status(200).json({ success: true, message: 'Book found in redis', data: JSON.parse(bookFromRedis) })
        }
        const book = await prisma.book.findFirst({
            where: {
                id: bookId
            },
            select : {
                id : true ,
                title : true ,
                content :  true ,
                User : true ,
            }
        })
        if (!book) throw new Error("no such a book found")
        await redis.set(`book-${book.id}`, JSON.stringify(book), {
            EX : REDIS_EXPIRY_TIME
        })
        return res.status(200).json({ success: true, message: 'Book found in database', data: book })
    } catch (error) {
        return res.status(406).json({ success: false, message: error.message })
    }
}
export const deleteBook = async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId;
        if (!bookId) throw new Error("no book id provided")

        const book = await prisma.book.delete({
            where: {
                id: bookId
            },
            include : {
                User : true
            }
        })
        if (!book) throw new Error("no such a book found")
        await redis.del(`book-${book.id}`)
        return res.status(200).json({ success: true, message: 'Book successfully deleted in database', data: book })
    } catch (error) {
        return res.status(406).json({ success: false, message: error.message })
    }
}
export const updateBook = async (req: Request, res: Response) => {
    try {
        const { value, error } = bookSchema.validate(req.body)
        if (error) throw new Error(error.message)
        const bookId = req.params.bookId;
        if (!bookId) throw new Error("book id not provided ")
        const book = await prisma.book.update({
            where: {
                id: bookId,
            },
            data: {
                ...value
            },
            select : {
                id :  true ,
                title:  true ,
                content : true ,
                User : true
            }
        })
        await Promise.all([
            redis.del(`book-${book.id}`),
            redis.set(`book-${book.id}`, JSON.stringify(book))
        ])
        return res.status(200).json({ success: true, message: 'Book updated successfully', data: book })
    } catch (error) {
        return res.status(406).json({ success: false, message: error.message })
    }
}