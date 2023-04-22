import { Router } from 'express'
import { createUser, deleteUser, getUser, updateUser } from './users.service'

const router = Router()

router.get('/:userId', getUser)
router.post("/new", createUser)
router.delete("/:userId", deleteUser)
router.put("/:userId", updateUser)

export default router

