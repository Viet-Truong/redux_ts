import axios, { AxiosInstance } from 'axios'

class Request {
    instance: AxiosInstance
    constructor() {
        this.instance = axios.create({
            baseURL: 'http://localhost:4000/',
            timeout: 10000
        })
    }
}

const request = new Request().instance
export default request
