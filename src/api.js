// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: `https://backend-f5uk.onrender.com/api`, // your live backend
});

// -------- Doctor APIs --------
export const fetchDoctors = () => api.get("/doctors");
export const addDoctorApi = (doctor) => api.post("/doctors", doctor);
export const doctorLoginApi = (username, password) =>
  api.post(`/login?username=${username}&password=${password}`);

// -------- Patient APIs --------
export const fetchPatients = () => api.get("/patients");
export const registerPatientApi = (patient, doctorUsername) =>
  api.post(`/patients?doctorUsername=${doctorUsername}`, patient);
export const consultPatientApi = (id) => api.put(`/patients/${id}/consult`);
export const skipPatientApi = (id) => api.put(`/patients/${id}/skip`);

export default api;
