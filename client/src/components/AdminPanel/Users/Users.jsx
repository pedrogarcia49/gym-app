import React, { useEffect, useState } from "react"
import axios from "axios"
import moment from 'moment-with-locales-es6'
import { toArray } from "gsap"

let notFoundMsg = ''

moment.locale('es')
let now = moment().format('L')


export const Users = () => {
    
    const userSearch = document.getElementById('user-search')
    const userCreate = document.getElementById('user-create')
    
    
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')

    const usersCtn = document.getElementById('users-ctn')
    
    const URL = 'http://localhost:3000/api/users'

    function stringToDate (suscripcion) {
        const sDay = parseInt(suscripcion.substring(0,2))
        const sMonth = parseInt(suscripcion.substring(3,5)) -1
        const sYear = parseInt(suscripcion.substring(6,10))
                                
        return new Date(sYear, sMonth, sDay)
    }


    function switchNav (v) {
        if(v == 1) {
            userSearch.classList.add('d-none')
            userCreate.classList.remove('d-none')
        } else if (v == 0) {
            userCreate.classList.add('d-none')
            userSearch.classList.remove('d-none')
        }
    }

    const getUsers = async () => {
        const {data} = await axios.get(URL)
        setUsers(data)
    }
    
    const searchUser = async(e) => {
        e.preventDefault()


        let DNI = e.target[0].value
        let nombre = e.target[1].value
        let apellido = e.target[2].value
        const {data} = await axios.get(`${URL}?DNI=${DNI}&name=${nombre}&lastname=${apellido}`)
        
        setUsers(data)
        if (data.length == 0) {
            if(notFoundMsg == '') {
                notFoundMsg = document.createElement('h5')
                notFoundMsg.style.color = 'red'
                notFoundMsg.innerText = 'Ningun usuraio encontrado'
                usersCtn.appendChild(notFoundMsg)
            }
        } else {
            if (!notFoundMsg == '') {
                usersCtn.removeChild(notFoundMsg)
                notFoundMsg = ''
            }
        }

    }

    const createUser = async (e) => {
        e.preventDefault()
        const DNI = e.target[0].value
        const nombre = e.target[1].value
        const apellido = e.target[2].value

        const subscriptionDays = e.target[3].value
        const expires = moment().add(subscriptionDays, 'days').format('L')

        if (typeof(DNI) == 'number' && DNI.length === 7 || DNI.length === 8) {
            try {
                const check = await axios.get(`${URL}/byDNI/${DNI}`)
                alert('Ya existe un usuario con este DNI')
            } catch (err) {
                    const {data} = await axios.post(URL, 
                        {
                            "DNI": DNI,
                            "name": nombre,
                            "lastname": apellido,
                            "subscription": expires
                        }
                        )
                        getUsers()
                        e.target[0].value = ''
                        e.target[1].value = ''
                        e.target[2].value = ''
                        e.target[3].value = 30
            }
        } else {
            window.alert('DNI Invalido')
    }
            

    }
    
    async function deleteUser (userId) {
        const id = userId
        if (window.confirm('Seguro que desea eliminar este usuario?') == true) {
            const {data} = await axios.delete(`${URL}/${id}`)
            getUsers()
        }
    }


    function showUpdateForm (id) {
        const form = document.getElementById(`form${id}`)
        form.classList.remove('d-none')
        setTimeout(() => {
            form.classList.add('d-none')
        }, 10000)
    }
    async function updateUserSub (e) {
        e.preventDefault()
        const form = e.target

        const subscriptionDays = form[0].value
        const formNames = form.name.split(',')
        const id = formNames[0]
        let suscripcionActual = formNames[1]
        const expired = formNames[2]

        if (expired == 'false') {
            suscripcionActual = stringToDate(suscripcionActual)
            suscripcionActual = moment(suscripcionActual)
    
            const expires = suscripcionActual.add(subscriptionDays, 'days').format('L')
            
            const {data} = await axios.patch(`${URL}/update/${id}`, 
                {
                    subscription: expires
                }
            )
        } else {
            const expires = moment().add(subscriptionDays, 'days').format('L')
            
            const {data} = await axios.patch(`${URL}/update/${id}`, 
                {
                    subscription: expires
                }
            )
        }

        getUsers()
        
        form.classList.add('d-none')
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <>
            <>
                <header className="navbar sticky-top navbar-light bg-light justify-content-between p-0 text-light">

                    <nav className="bg-secondary w-100 px-3 float-end p-absolute">
                        <a href="/" className="mx-2 text-light">Volver al inicio</a>
                        <a href="/checkin" className="mx-2 text-light">Checkin de usuario</a>
                    </nav>

                    <div id="user-search" className="row w-100">
                        <button onClick={() => switchNav(1)} id="user-create-btn" className="col-4 p-3 text-light text-center">
                            <h3>Agregar Usuario</h3>
                        </button>
                        <div className="col-8 p-2 ">
                            <h4 className="text-center mb-4">Buscar usuario</h4>
                            <form onSubmit={searchUser} className="form-inline">
                                <label>DNI</label>
                                <input className="w-25 mx-2 p-1" type="search" placeholder="DNI" maxLength={8} aria-label="Search"/>

                                <label>Nombre</label>
                                <input className="w-25 mx-2 p-1" type="search" placeholder="Nombre" aria-label="Search"/>

                                <label>Apellido</label>
                                <input className="w-25 mx-2 p-1" type="search" placeholder="Apellido"   aria-label="Search"/>

                                <button className="btn btn-light mx-2" type="submit">Buscar</button>
                            </form>
                        </div>
                    </div>

                    <div id="user-create" className="d-none row w-100">
                        <button onClick={() => switchNav(0)} id="user-search-btn" className="col-4 p-3 text-light text-center">
                            <h3>Buscar Usuario</h3>
                        </button>
                        <div className="col-8 p-2">
                            <h4 className="text-center mb-4">Agregar usuario</h4>
                            <form onSubmit={createUser} className="form-inline">
                                <label>DNI</label>
                                <input className="mx-2 p-1" type="text" placeholder="DNI" maxLength={8} aria-label="Search"/>

                                <label>Nombre</label>
                                <input className="mx-2 p-1" type="text" placeholder="Nombre" aria-label="Search"/>

                                <label>Apellido</label>
                                <input className="mx-2 p-1" type="text" placeholder="Apellido" aria-label="Search"/>

                                <label className="mx-4">Suscripcion-Días</label>
                                <input className="p-1" type="number" placeholder="Días" aria-label="Search" defaultValue={30}/>

                                <button className="btn btn-light mx-2" type="submit">Enviar</button>
                            </form>
                        </div>
                    </div>

                </header>
            </>
            < >
                <div id="users-ctn" className="mt-2 row g-2">
                    {users.map(user =>{
                        let suscripcion = user.suscripcion

                        let nowDate = moment().subtract(1, 'days').format('L')
                        nowDate = stringToDate(nowDate)
                                                
                        const suscripcionDate = stringToDate(suscripcion)
                        if (suscripcionDate.getTime() > nowDate.getTime()) {

                            const expired = false
                            return (
                                <div className="col-4 card">
                                    <div className="card-body text-center">
                                        <h1>{user.nombre + ' ' + user.apellido}</h1>
                                        <h3>{user.DNI}</h3>
                                        
                                        <div id="suscripcion-ctn" className="w-75 px-1 container text-light p-2 float-start my-3">
                                            Suscripcion <span className="bg-success text-light p-1">Expira el {suscripcion}</span>

                                            <button onClick={() => showUpdateForm(user.id)} className="btn btn-primary float-end d-inline m-1">Actualizar</button>

                                            <form id={'form' + user.id} name={[user.id, suscripcion, expired]} onSubmit={updateUserSub} className="m-2 float-end d-none">
                                                <label className="mx-2">+ Dias</label>
                                                <input className="my-2" type="number" defaultValue={30}></input>
                                                <button className="btn btn-secondary my-2 mx-2 float-end" type="submit">Enviar</button>
                                            </form>
                                        </div>
                                        <div id="delete-btn" onClick={() => deleteUser(user.id)} className="btn btn-danger float-end float-bottom">Eliminar</div>
                                    </div>
                                </div>
                            )
                        } else {

                            const expired = 'true'
                            suscripcion = 'Expirada'

                            return (
                                <div className="col-4 card">
                                    <div className="card-body text-center">
                                        <h1>{user.nombre + ' ' + user.apellido}</h1>
                                        <h3>{user.DNI}</h3>

                                        <div id="suscripcion-ctn"  className="w-75 px-1 p-2 container text-light float-start my-3">
                                            Suscripcion <span className="bg-danger text-light p-1">Expirada el {user.suscripcion}</span>
                                            <button onClick={() => showUpdateForm(user.id)} className="btn btn-primary float-end d-inline m-1">Actualizar</button>

                                            <form id={'form' + user.id} name={[user.id, suscripcion, expired]} onSubmit={updateUserSub} className="m-2 float-end d-none">
                                                <label className="mx-2">Dias</label>
                                                <input className="my-2" type="number" defaultValue={30}></input>
                                                <button className="btn btn-secondary my-2 mx-2 float-end" type="submit">Enviar</button>
                                            </form>

                                        </div>
                                        <div id="delete-btn" onClick={() => deleteUser(user.id)} className="btn btn-danger float-end">Eliminar</div>
                                    </div>
                                </div>
                            )
                        }
                        
                    })}
                </div>
            </>
        </>
    )
}