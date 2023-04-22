import { Router } from 'express'
import { createBook, getBook } from './books.service'

const router = Router()

router.get('/:bookId', getBook)
router.post("/new", createBook)
router.delete("/:bookId", createBook)
router.put("/:bookId", createBook)

export default router

