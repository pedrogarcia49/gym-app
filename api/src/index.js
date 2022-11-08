import express from 'express'
import colors from 'colors'
import morgan from 'morgan'
import cors from 'cors'

import UserRoutes from './routes/users.routes.js'

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.use(UserRoutes)

app.use(express.static('./src/public/'))

app.listen(3000, () => {
    console.log('Server listen at port 3000'.bgMagenta)
})