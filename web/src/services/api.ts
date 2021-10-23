import axios from "axios";

export const api = axios.create({
    baseURL: 'http://18.231.87.184:4400',
})