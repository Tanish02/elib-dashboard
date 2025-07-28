import axios from "axios";
import type { Book } from "../../types";
import useTokenStore from "@/store";

const api = axios.create({
  // move this to a .env file (todo)
  baseURL: "http://localhost:5513/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token;

  if (token) {
    config.headers ??= {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const login = async (data: { email: string; password: string }) =>
  api.post("/users/login", data);

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/users/register", data);

export const getBooks = () => api.get<Book[]>("/books");

export const createBook = async (data: FormData) =>
  api.post("/books", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getBook = async (bookId: string) =>
  api.get<Book>(`/books/${bookId}`);

export const updateBook = async (bookId: string, data: FormData) =>
  api.patch(`/books/${bookId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteBook = async (bookId: string) =>
  api.delete(`/books/${bookId}`);

export const getDashboardStats = async () => api.get("/dashboard/stats");

export const getUsers = async () => api.get("/users");

/// end code
