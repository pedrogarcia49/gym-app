import {Router}  from 'express'
const router = Router()

import {getUsers, addUser, getUser, getUserByDNI, editUser, updateUserSub, deleteUser} from '../controllers/users.controllers.js'

router.get('/api/users', getUsers)

router.get('/api/users/:id', getUser)

router.get('/api/users/byDNI/:DNI', getUserByDNI)

router.post('/api/users', addUser)

router.patch('/api/users/:id', editUser)

router.patch('/api/users/update/:id', updateUserSub)

router.delete('/api/users/:id', deleteUser)

export default router