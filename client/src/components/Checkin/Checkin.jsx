import React from "react"
import axios from "axios"
import { Howl } from "howler"
import moment from 'moment-with-locales-es6'
import rAudioSrc from './sounds/registered.mp3'
import nrAudioSrc from './sounds/nonregistered.mp3'
import eAudioSrc from './sounds/expired.mp3'

let now = moment().format('L')

function stringToDate (suscripcion) {
    const sDay = parseInt(suscripcion.substring(0,2))
    const sMonth = parseInt(suscripcion.substring(3,5)) -1
    const sYear = parseInt(suscripcion.substring(6,10))
                            
    return new Date(sYear, sMonth, sDay)
}


const registeredAudio = new Howl({
    src: [rAudioSrc],
    html5: true
})

const nonRegisteredAudio = new Howl({
    src: [nrAudioSrc],
    html5: true
})

const expiredAudio = new Howl({
    src: [eAudioSrc],
    html5: true
})

let invalidBox = undefined


const getUser = async(e) => {

    const cardBody = document.getElementById('checkin-card-body')
    const cardTitle = document.getElementById('card-title')

    function invalidValue () {
        if (!invalidBox) {
            invalidBox = document.createElement('div')
            invalidBox.innerText = 'El valor ingresado es invalido'
            invalidBox.style.backgroundColor = 'lightyellow'
            cardBody.appendChild(invalidBox)
            setTimeout(() => {
                cardBody.removeChild(invalidBox)
                invalidBox = undefined
            }, 3800)
        }
    }

    e.preventDefault()
    let value = e.target[0].value

    if (value.length == 8 || value.length == 7) {
        value = parseInt(value)
        if (value) {
            try {
                const {data} = await axios.get(`http://localhost:3000/api/users/byDNI/${value}`)
                
                const suscripcion = data.suscripcion
                

                let nowDate = moment().subtract(1, 'days').format('L')
                console.log(nowDate)
                nowDate = stringToDate(nowDate)
                let suscripcionDate = stringToDate(suscripcion)

                let difference = moment().diff( suscripcionDate, "days" )
                difference = Math.abs(difference)
                console.log(difference)
                
                if (suscripcionDate.getTime() > nowDate.getTime()) {
                    registeredAudio.play()
                    const subContainer = document.createElement('div')

                    subContainer.innerText = `Suscripcion activa, ${difference} días restantes`
                    cardBody.appendChild(subContainer)
    
                    cardTitle.innerText = `Bienvenido: ${data.nombre + " " + data.apellido}`
                    cardTitle.classList.add('text-light')
                    cardBody.style.backgroundColor = 'rgb(7, 222, 0)'
                    setTimeout(()=> {
                        cardTitle.innerText = 'Inserte su DNI'
                        cardTitle.classList.remove('text-light')
                        cardBody.removeChild(subContainer)
                        cardBody.style.backgroundColor = ''
                        e.target[0].value = ''
                    }, 6500)
                } else {
                    expiredAudio.play()
                    const subContainer = document.createElement('div')
                    subContainer.innerText = `Suscripcion expirada el ${suscripcion}`
                    cardBody.appendChild(subContainer)
    
                    cardTitle.innerText = `Bienvenido: ${data.nombre + " " + data.apellido}`
                    cardTitle.classList.add('text-light')
                    cardBody.style.backgroundColor = 'rgb(255, 203, 10)'
                    setTimeout(()=> {
                        cardTitle.innerText = 'Inserte su DNI'
                        cardTitle.classList.remove('text-light')
                        cardBody.removeChild(subContainer)
                        cardBody.style.backgroundColor = ''
                        e.target[0].value = ''
                    }, 6500)
                }
            }
            catch(err) {
                nonRegisteredAudio.play()
                cardTitle.innerText = `Usuario no encontrado`
                cardTitle.classList.add('text-light')
                cardBody.style.backgroundColor = 'rgba(255, 80, 80, 0.9)'
                setTimeout(()=> {
                    cardTitle.innerText = 'Inserte su DNI'
                    cardTitle.classList.remove('text-light')
                    cardBody.style.backgroundColor = ''
                    e.target[0].value = ''
                }, 5800)
            }
        } else {
            invalidValue()
        }
    } else if(value == '') {
        return
    } else {
        invalidValue()
    }
    
}

const Checkin = () => {
    return (
        <div className="vertical-center">
            <a style={{position: 'absolute', top: 0}} href="/">Volver al inicio</a>
            <div className="card mx-auto w-25 text-center">
                <div className="card-header">
                    Checkin de usuario
                </div>
                <div id="checkin-card-body" className="card-body p-5" >
                <h5 id="card-title" className="card-title">Inserte su DNI</h5>
                <form onSubmit={getUser}>
                    <input type="text" maxLength={8} placeholder="DNI" className="p-1"></input>
                    <button type="submit" className="btn btn-outline-secondary m-2">Enviar</button>
                </form>
                </div>
            </div>
        </div>
    )
}

export default Checkin