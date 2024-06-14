import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://flopproject.onrender.com/",
});

export default apiClient;
