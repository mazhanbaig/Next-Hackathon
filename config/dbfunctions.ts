// import api from "./api";

// // Register user
// const registerUser = async (email: string, password: string,name?:string,role?:string) => {
//   try {
//     const res = await api.post("/api/auth/register", {
//       email,
//       password,
//       name,
//         role
//     });
//     return res.data;  // <-- return the data
//   } catch (error: any) {
//     throw error.response?.data
//   }
// };

// // Login user
// const loginUser = async (email: string, password: string) => {
//   try {
//     const res = await api.post("/api/auth/login", {
//         email,
//         password
//     });
//     return res.data;  // <-- return the data
//   } catch (error: any) {
//     throw error.response?.data
//   }
// };

// const logoutUser = async () => {
//   try {
//     // Clear local storage
//     localStorage.removeItem("userInfo");
//     window.location.replace("/auth/login")

//     return true;
//   } catch (error: any) {
//     return false;
//   }
// };

// export { registerUser, loginUser,logoutUser };


import api from "./api";

// Corrected order: name, email, password, role
const registerUser = async (name: string, email: string, password: string, role: string) => {
  try {
    const res = await api.post("/api/auth/register", { name, email, password, role });
    return res.data;
  } catch (error: any) {
    throw error.response?.data;
  }
};

const loginUser = async (email: string, password: string) => {
  try {
    const res = await api.post("/api/auth/login", { email, password });
    return res.data;
  } catch (error: any) {
    throw error.response?.data;
  }
};

const logoutUser = async () => {
  try {
    localStorage.removeItem("userInfo");
    window.location.replace("/auth/login");
    return true;
  } catch (error: any) {
    return false;
  }
};

export { registerUser, loginUser, logoutUser };