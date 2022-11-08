import {pool} from '../db.js'

export const getUsers = async (req, res) => {
    if (req.query.DNI || req.query.name || req.query.lastname) {
        let DNI = req.query.DNI
        let nombre = req.query.name
        let apellido = req.query.lastname
        if (!DNI) {
            DNI = ''
        } else {
            DNI = `%${DNI}%`
        }
        if(!nombre){
            nombre = ''
        } else {
            nombre = `%${nombre}%`
        }
        if (!apellido){
            apellido = ''
        } else {
            apellido = `%${apellido}%`
        }
        console.log(DNI, nombre, apellido)
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE DNI LIKE ? || nombre LIKE ? || apellido LIKE ?', [DNI, nombre, apellido])
        res.json(rows)
    } else {
        const [rows] = await pool.query('SELECT * FROM usuarios')
        res.json(rows)
    }
}

export const getUser = async (req, res) => {
    const id = req.params.id
    const [rows] = await pool.query('SELECT * FROM usuarios where id = ?', [id])
    console.log(rows)
    if(!rows[0]) {
        res.status(404).json('Usuario no encontrado')
    } else {
        res.json(rows[0])
    }
}

export const getUserByDNI = async (req, res) => {
    const DNI = req.params.DNI
    const [rows] = await pool.query('SELECT * FROM usuarios where DNI = ?', [DNI])
    console.log(rows)
    if(!rows[0]) {
        res.status(404).json('Usuario no encontrado')
    } else {
        res.json(rows[0])
    }
}

export const addUser = async (req,res) => {
    if (req.body.DNI && req.body.name && req.body.lastname) {
        const DNI = req.body.DNI
        const nombre = req.body.name
        const apellido = req.body.lastname
        const suscripcion = req.body.subscription.toString()
        console.log(DNI, nombre, apellido, suscripcion)
        const [rows] = await pool.query('INSERT INTO usuarios (DNI, nombre, apellido, suscripcion) VALUES (?, ?, ?, ?)', [DNI, nombre, apellido, suscripcion])
        res.json(rows)
    } else {
        res.status(400).json({message: "Peticion ingresada incorrectamente"})
    }
}

export const editUser = async (req, res) => {
    if (req.params.id && req.body.DNI) {
        const DNI = req.body.DNI
        const id = req.params.id
        const [rows] = await pool.query('UPDATE usuarios SET DNI = ? WHERE id = ?', [DNI, id])
        res.json(rows)
    } else if (req.params.id && req.body.name) {
        const nombre = req.body.name
        const id = req.params.id
        const [rows] = await pool.query('UPDATE usuarios SET nombre = ? WHERE id = ?', [nombre, id])
        res.json(rows)
    } else if (req.params.id && req.body.lastname) {
        const apellido = req.body.lastname
        const id = req.params.id
        const [rows] = await pool.query('UPDATE usuarios SET apellido = ? WHERE id = ?', [apellido, id])
        res.json(rows)
    } else {
        res.status(400).json({message: ""})
    }
}

export const updateUserSub = async (req, res) => {
    const id = parseInt(req.params.id)
    if(req.body.subscription) {
        const suscripcion = req.body.subscription
        const [rows] = await pool.query('UPDATE usuarios SET suscripcion = ? WHERE id = ?', [suscripcion, id])
        res.json(rows)
    } else {
        res.status(400).json({message:"Peticion ingresada incorrectamente"})
    }
}

export const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id) 
    const [rows] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id])
    res.json(rows)
}