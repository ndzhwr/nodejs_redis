import { Router } from 'express'
import { createUser, getUser } from './users.service'

const router = Router()

router.get('/:userId', getUser)
router.post("/new", createUser)

export default router

