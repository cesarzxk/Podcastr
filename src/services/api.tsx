import axios from "axios";

export const api = axios.create({
    baseURL: "https://restapi-teste.herokuapp.com/",
    headers: {'Content-Type': 'application/json'}
})