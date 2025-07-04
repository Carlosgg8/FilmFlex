export const getAuthToken = () => {
    return localStorage.getItem("jwt"); // Retrieve JWT from storage
  };