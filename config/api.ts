import axios from "axios";

let token:any=localStorage.getItem("token")
const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Authorization": `Bearer ${token}`

  }
});

export default api