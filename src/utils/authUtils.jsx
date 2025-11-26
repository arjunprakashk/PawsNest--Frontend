// src/utils/authUtils.js
export function isTokenExpired() {
  const token = localStorage.getItem("access_token");
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;
    return Date.now() > expiry; // true if expired
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}

export function logoutUser(navigate, options = { replace: true }) {
  localStorage.clear();
  if (navigate) {
    navigate("/index", options);
  } else {
    window.location.href = "/login";
  }
}
