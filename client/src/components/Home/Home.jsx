import React from "react"

import logo from './images/logo-gym.png'

const redirAdmin = () => {
    window.location.href = '/admin'
}

const redirCheckin = () => {
    window.location.href = '/checkin'
}

const Home = () => {
    return (
        <div id="home-ctn" className="text-center py-4">
            <img src={logo}></img>
            <div className="row text-center m-4 gx-5 h-50" >
                <button onClick={redirAdmin} className="btn btn-outline-primary w-50">
                    <h1>Panel de administrador</h1>
                </button>
                <button onClick={redirCheckin} className="btn btn-outline-secondary w-50">
                    <h1>Checkin de usuario</h1>
                </button>
            </div>
        </div>
    )
}

export default Home