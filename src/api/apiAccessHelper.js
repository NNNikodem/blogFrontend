// This module provides helper functions for making API requests using fetch.
// It includes functions for GET and POST requests, as well as loading and error state management.
let loading = false;
let error = null;

const BASE_URL = "http://localhost:8080/api/v1/";

export const getRequest = async (endpoint, options = {}) => {
  console.log("Making GET request to:", `${BASE_URL}${endpoint}`);
  loading = true;
  error = null;

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json();
    console.log("Response data:", data);
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (err) {
    error = err.message;
    console.error("GET request error:", err);
    return null;
  } finally {
    loading = false;
  }
};

export const postRequest = async (endpoint, body = {}, options = {}) => {
  loading = true;
  error = null;

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: JSON.stringify(body),
      ...options,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (err) {
    error = err.message;
    console.error("POST request error:", err);
    return null;
  } finally {
    loading = false;
  }
};

export const isLoading = () => loading;
export const getError = () => error;
