import axios from "axios";

const api = axios.create({
  // move this to a .env file (todo)
  baseURL: "http://localhost:5513/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (data: { email: string; password: string }) => {
  return api.post("/users/login", data);
};

// end code
