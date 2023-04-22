import { Router } from 'express'
import { createBook, getBook } from './books.service'

const router = Router()

router.get('/:bookId', getBook)
router.post("/new", createBook)

export default router

