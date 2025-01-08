import apiClient from "../Config/apiClient";

// Obtener todos los productos
export const getAllProducts = async () => {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };
  
  export const getProduct = async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  // Crear un nuevo producto
  export const createProduct = async (product) => {
    try {
      const response = await apiClient.post('/products', product);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };
  
  // Actualizar un producto
  export const updateProduct = async (id, product) => {
    try {
      const response = await apiClient.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };
  
  // Eliminar un producto
  export const deleteProduct = async (id) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };