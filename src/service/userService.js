import axiosInstance from "./axiosConfig";

// ocupo mandar información
// registar un usuario (Signup)
// 🟢 Registrar nuevo usuario
const registerUserService = async (data) => {
  const response = await axiosInstance.post("/api/auth/signup", data);
  return response;
};
//http://localhost/api/auth/signup{json}

// 🟡 Autenticación de usuario
const loginUserService = async (data) => {
  const response = await axiosInstance.post("/api/auth/login", data);
  return response;
};
//http://localhost/api/auth/login{json}

// 🔵 Obtener información del usuario autenticado
const getMeUserService = async () => {
  const { data } = await axiosInstance.get("/users/me");
  return data;
};

export { registerUserService, loginUserService, getMeUserService };
