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
  headers: {
    // "X-CSRFToken": getCSRFToken(),
  },
});

export default apiClient;
