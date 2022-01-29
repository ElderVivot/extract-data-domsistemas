import axios from 'axios'

const host = process.env.API_HOST || 'http://localhost:3330/v1'

const api = axios.create({
    baseURL: host
})

export { api }