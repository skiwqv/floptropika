import axios from "axios";

// function getCSRFToken() {
//   const cookieValue = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("csrftoken="))
//     .split("=")[1];
//   return cookieValue;
// }

const apiClient = axios.create({
  baseURL: "https://flopproject.onrender.com/",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    // "X-CSRFToken": getCSRFToken(),
  },
});

export default apiClient;
