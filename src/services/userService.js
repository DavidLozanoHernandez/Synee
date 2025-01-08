import apiClient from "../Config/apiClient";

export const getAllUsers = async () => {
    try {
        const response = await apiClient.get('/users');  // Endpoint corregido
        return response.data;
    } catch (error) {
        console.error("Error al cargar todos los usuarios:", error);
        throw error;
    }
};

export const getUser = async (id) => {  // Necesitamos recibir el ID
    try {
        const response = await apiClient.get(`/users/${id}`);  // Endpoint corregido
        return response.data;
    } catch (error) {
        console.error("Error al cargar el usuario:", error);
        throw error;
    }
};

export const createUser = async (userData) => {  // Recibe la data para crear
    try {
        const response = await apiClient.post('/users', userData);  // Endpoint corregido
        return response.data;
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        throw error;
    }
};

export const updateUser = async (id, userData) => {  // Recibe el ID y los datos para actualizar
    try {
        const response = await apiClient.put(`/users/${id}`, userData);  // Endpoint corregido
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        throw error;
    }
};

export const deleteUser = async (id) => {  // Recibe el ID del usuario a eliminar
    try {
        const response = await apiClient.delete(`/users/${id}`);  // Endpoint corregido
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        throw error;
    }
};
