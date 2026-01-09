const TOKEN_KEY = "token";
const ROLE_KEY = "role";

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getRole = () => {
  return localStorage.getItem(ROLE_KEY);
};

export const setRole = (role) => {
  localStorage.setItem(ROLE_KEY, role);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};

export const isLoggedIn = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};
