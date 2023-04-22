import { env } from "process";
import prisma from "../utils/prisma";
import redis from "../utils/redis";
import userSchema from "./user.schema";
import { Request, Response } from 'express';


const REDIS_EXPIRY_TIME =  parseInt(env.REDIS_EXPIRY_TIME)
export const createUser = async (req: Request, res: Response) => {
    try {
        const { value, error } = userSchema.validate(req.body)
        if (error) throw new Error(error.message)
        const user = await prisma.user.create({
            data: {
                ...value
            }
        })
        await redis.set(`user-${user.id}`, JSON.stringify(user), {
            EX : REDIS_EXPIRY_TIME
        })
        return res.status(200).json({ success: true, message: 'User created successfully', data: user })
    } catch (error: any) {
        return res.status(406).json({ success: false, message: error.message })
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        if (!userId) throw new Error("no user id provided")

        const userfromRedis  = await redis.get(`user-${userId}`)
        if(userfromRedis){
            return res.status(200).json({ success: true, message: 'User found in redis', data: JSON.parse(userfromRedis) })
        }
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })
        if (!user) throw new Error("no such a user found")
        await redis.set(`user-${user.id}`, JSON.stringify(user), {
            EX : REDIS_EXPIRY_TIME
        })
        return res.status(200).json({ success: true, message: 'User found in database', data: user })
    } catch (error) {
        return res.status(406).json({ success: false, message: error.message })
    }
}

