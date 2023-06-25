const REQUEST_DELAY = 100
const pokemonNames = require('./pokemonNames.json')
const axios = require('axios')
const API_URL="http://localhost:3000"

const send = async () =>{
    const ans = await Promise.allSettled( pokemonNames.filter((_,i)=>i<40).map((name, i)=>{
        setTimeout(()=>{
            console.log("===> name : ", `${API_URL}/pokemon/${name}`)
            return axios.get(`${API_URL}/pokemon/${name}`)
        },i*REQUEST_DELAY)
    }))
}

send()