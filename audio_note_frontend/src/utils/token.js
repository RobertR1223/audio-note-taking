export const storeTokens = (access, refresh) => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
};

export const getAccessToken = () => localStorage.getItem("access_token");

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
