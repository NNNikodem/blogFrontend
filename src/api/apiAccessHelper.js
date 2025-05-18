// This module provides helper functions for making API requests using fetch.
// It includes functions for GET, POST, and PUT requests, as well as loading and error state management.
let loading = false;
let error = null;

const BASE_URL = "http://localhost:8080/api/v1/";

export const getRequest = async (endpoint, options = {}) => {
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
  let response = null;
  try {
    // Check if we're dealing with FormData (for multipart/form-data requests)
    const isFormData = body instanceof FormData;

    // Set up headers based on content type
    const headers = isFormData
      ? { ...(options.headers || {}) } // Don't set Content-Type for FormData, browser will set it with boundary
      : {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ0ZXN3dEB0ZXN0LmNvbSIsImVtYWlsIjoidGVzd3RAdGVzdC5jb20iLCJyb2xlcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NDc1NjkyOTUsImV4cCI6MTc0NzU3NzkzNX0.SOCwYkF03IvtWbcB-AQRojrOsZdGYLV-Z-qbpLQd0n8MVaMYlCiCsjUTvBvIXBwl",
          ...(options.headers || {}),
        };

    response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });
    console.log("Response status:", response);
    let data = response;
    try {
      data = await response.json();
    } catch (e) {
      console.log("Response is not JSON, returning raw response:", response);
      return response;
    }
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (err) {
    error = err.message;
    console.error("POST request error:", err);
    return response;
  } finally {
    loading = false;
  }
};

// Example modification for putRequest in apiAccessHelper.js
export const putRequest = async (endpoint, body) => {
  const url = `${BASE_URL}${endpoint}`;
  console.log("Sending body:", body);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ0ZXN3dEB0ZXN0LmNvbSIsImVtYWlsIjoidGVzd3RAdGVzdC5jb20iLCJyb2xlcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9VU0VSIn1dLCJpYXQiOjE3NDc1NjkyOTUsImV4cCI6MTc0NzU3NzkzNX0.SOCwYkF03IvtWbcB-AQRojrOsZdGYLV-Z-qbpLQd0n8MVaMYlCiCsjUTvBvIXBwl",
        // Add authorization headers if needed
        // 'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Try to get error details from the response body
      let errorBody;
      try {
        errorBody = await response.text(); // Read as text first
        console.error(`Error response body from ${url}:`, errorBody);
        // Attempt to parse as JSON if it looks like JSON
        if (
          errorBody &&
          response.headers.get("content-type")?.includes("application/json")
        ) {
          errorBody = JSON.parse(errorBody);
        }
      } catch (e) {
        console.error("Could not parse error response body:", e);
        errorBody = `HTTP error! status: ${response.status}`;
      }
      throw new Error(
        typeof errorBody === "string" ? errorBody : JSON.stringify(errorBody)
      );
    }

    // Check if the response has content before parsing
    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");

    // Handle 204 No Content or responses with no content length/type indicating no body
    if (
      response.status === 204 ||
      !contentType ||
      !contentLength ||
      parseInt(contentLength, 10) === 0
    ) {
      console.log(`PUT request to ${url} successful with no content.`);
      return null; // Or return an empty object or a success indicator: { success: true }
    }

    // If there is content and it's JSON, parse it
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      //console.log(`PUT request to ${url} successful. Response data:`, data);
      return data;
    } else {
      // Handle non-JSON responses
      const textData = await response.text();
      // console.log(
      //   `PUT request to ${url} successful. Response text data:`,
      //   textData
      // );
      return textData;
    }
  } catch (error) {
    console.error(`PUT request error for ${url}:`, error);
    throw error;
  }
};

export const isLoading = () => loading;
export const getError = () => error;
