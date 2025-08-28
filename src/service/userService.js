import axiosInstance from "./axiosConfig"

// ocupo mandar información
// registar un usuario (Signup)
const registerUserService = async (data) => {
    const response = await axiosInstance.post("/register", data)
    return response; // retornamos toda la respuesta para manejar status
}
//http://localhost/register{json}

// autenticar un usuario (Login)
const loginUserService = async (data) => {
    const response = await axiosInstance.post("/login", data)
}
//http://localhost/login{json}

export {
    registerUserService,
    loginUserService
}