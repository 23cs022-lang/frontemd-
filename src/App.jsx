import React, { useState, useEffect } from "react";
import { GlobalStyle, AppShell } from "./styles/GlobalStyles";
import AdminDashboard from "./components/AdminDashboard";
import DoctorLogin from "./components/DoctorLogin";
import DoctorDashboard from "./components/DoctorDashboard";
import PatientDisplay from "./components/PatientDisplay";
import styled from "styled-components";
import heroImage from "./styles/image1.png";
import adminLoginImage from "./styles/image2.png";

import {
  fetchDoctors,
  addDoctorApi,
  doctorLoginApi,
  registerPatientApi,
  fetchPatients,
  consultPatientApi,
} from "./api";

// ---------------- Styled Components ----------------
const LandingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #e0f7ff);
  font-family: "Arial", sans-serif;
`;

const HeroContainer = styled.div`
  display: flex;
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const HeroText = styled.div`
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    font-size: 48px;
    font-weight: bold;
    color: #0d4a85;
    margin-bottom: 20px;
  }

  p {
    font-size: 18px;
    color: #374151;
    margin-bottom: 30px;
  }

  button {
    padding: 12px 24px;
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin-right: 12px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #3b36c4;
    }
  }
`;

const HeroImage = styled.div`
  flex: 1;
  background: url(${heroImage}) center/cover no-repeat;
  background-size: cover;
`;

const AdminLoginWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: "Arial", sans-serif;
`;

const AdminFormContainer = styled.div`
  flex: 1;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 32px;
    margin-bottom: 40px;
    color: #0d4a85;
  }

  input {
    width: 100%;
    max-width: 300px;
    padding: 12px 16px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
  }

  button {
    width: 100%;
    max-width: 300px;
    padding: 12px;
    background-color: #4f46e5;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #3b36c4;
    }
  }

  p {
    color: red;
    margin-top: 10px;
  }
`;

const AdminImageContainer = styled.div`
  flex: 1;
  background: url(${adminLoginImage}) center/cover no-repeat;
`;

// ---------------- App Component ----------------
export default function App() {
  // -------- State --------
  const [currentTab, setCurrentTab] = useState("landing");
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [queue, setQueue] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [login, setLogin] = useState({ username: "", password: "" });
  const [loginMsg, setLoginMsg] = useState("");
  const [currentPatient, setCurrentPatient] = useState(null);

  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    symptom: "",
    appointment: "",
    doctor: "",
    critical: false,
  });

  const [newDoc, setNewDoc] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [adminLogin, setAdminLogin] = useState({
    username: "",
    password: "",
  });
  const [adminMsg, setAdminMsg] = useState("");

  const doctorQueue = currentDoctor
    ? queue.filter((p) => p.doctor === currentDoctor)
    : [];
  const nextPatient = queue[0];

  // -------- Fetch Doctors & Patients from API --------
  useEffect(() => {
    fetchDoctors()
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));

    fetchPatients()
      .then((res) => setQueue(res.data))
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  // -------- Helper Functions --------
  const goBack = () => {
    setCurrentTab("landing");
    setCurrentDoctor(null);
  };

  const handleAdminLogin = () => {
    const adminUsername = "admin";
    const adminPassword = "admin123";

    if (
      adminLogin.username === adminUsername &&
      adminLogin.password === adminPassword
    ) {
      setAdminMsg("");
      setCurrentTab("adminDashboard");
      setAdminLogin({ username: "", password: "" });
    } else {
      setAdminMsg("Invalid admin username or password");
    }
  };

  const doctorLogin = async () => {
    try {
      const res = await doctorLoginApi(login.username, login.password);
      if (res.data) {
        setCurrentDoctor(res.data.username);
        setLoginMsg("");
        setCurrentTab("doctor");
        setLogin({ username: "", password: "" });
      } else {
        setLoginMsg("Invalid username or password");
      }
    } catch {
      setLoginMsg("Invalid username or password");
    }
  };

  const registerPatient = async () => {
    if (!patientForm.name) return alert("Enter patient name");
    try {
      const res = await registerPatientApi(patientForm, patientForm.doctor);
      setQueue([...queue, res.data]);
      setPatientForm({
        name: "",
        age: "",
        symptom: "",
        appointment: "",
        doctor: "",
        critical: false,
      });
    } catch (err) {
      alert("Error registering patient");
    }
  };

  const addDoctor = async () => {
    if (!newDoc.name || !newDoc.username)
      return alert("Enter doctor name and username");
    try {
      const res = await addDoctorApi(newDoc);
      setDoctors([...doctors, res.data]);
      setNewDoc({ name: "", username: "", password: "" });
    } catch {
      alert("Error adding doctor");
    }
  };

  const consult = async (id) => {
    try {
      const res = await consultPatientApi(id);
      alert(`Consulting patient: ${res.data.name}`);
      setQueue(queue.filter((p) => p.id !== id));
    } catch {
      alert("Error consulting patient");
    }
  };

  // ---------------- JSX ----------------
  return (
    <>
      <GlobalStyle />
      <AppShell>
        {/* -------- Landing Page -------- */}
        {currentTab === "landing" && (
          <LandingWrapper>
            <HeroContainer>
              <HeroText>
                <h1>Your health, our priority</h1>
                <p>Caring for others is the highest expression of humanity.</p>
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                  <h1>Welcome to OPD Multi-Doctor System</h1>
                  <p>Select your portal:</p>
                  <button onClick={() => setCurrentTab("adminLogin")}>
                    Admin Login
                  </button>
                  <button onClick={() => setCurrentTab("doctorLogin")}>
                    Doctor Login
                  </button>
                  <button onClick={() => setCurrentTab("patient")}>
                    Patient Portal
                  </button>
                </div>
              </HeroText>
              <HeroImage />
            </HeroContainer>
          </LandingWrapper>
        )}

        {/* -------- Admin Login -------- */}
        {currentTab === "adminLogin" && (
          <AdminLoginWrapper>
            <AdminFormContainer>
              <h2>Admin Login</h2>
              <input
                type="text"
                placeholder="Username"
                value={adminLogin.username}
                onChange={(e) =>
                  setAdminLogin({ ...adminLogin, username: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={adminLogin.password}
                onChange={(e) =>
                  setAdminLogin({ ...adminLogin, password: e.target.value })
                }
              />
              <button onClick={handleAdminLogin}>Login</button>
              <p>{adminMsg}</p>
              <button onClick={goBack}>Back</button>
            </AdminFormContainer>
            <AdminImageContainer />
          </AdminLoginWrapper>
        )}

        {/* -------- Admin Dashboard -------- */}
        {currentTab === "adminDashboard" && (
          <>
            <AdminDashboard
              doctors={doctors}
              queue={queue}
              patientForm={patientForm}
              setPatientForm={setPatientForm}
              registerPatient={registerPatient}
              newDoc={newDoc}
              setNewDoc={setNewDoc}
              addDoctor={addDoctor}
            />
            <button onClick={goBack} style={{ marginTop: "10px" }}>
              Back
            </button>
          </>
        )}

        {/* -------- Doctor Login -------- */}
        {currentTab === "doctorLogin" && !currentDoctor && (
          <>
            <DoctorLogin
              login={login}
              setLogin={setLogin}
              doctorLogin={doctorLogin}
              loginMsg={loginMsg}
              back={goBack}
            />
            <button onClick={goBack} style={{ marginTop: "10px" }}>
              Back
            </button>
          </>
        )}

        {/* -------- Doctor Dashboard -------- */}
        {currentTab === "doctor" && currentDoctor && (
          <DoctorDashboard
            currentDoctor={currentDoctor}
            doctorQueue={doctorQueue}
            currentPatient={currentPatient}
            logout={goBack}
            doctors={doctors}
            setCurrentPatient={setCurrentPatient}
            consult={consult}
            back={goBack}
          />
        )}

        {/* -------- Patient Display -------- */}
        {currentTab === "patient" && (
          <>
            <PatientDisplay
              queue={queue}
              doctors={doctors}
              nextPatient={nextPatient}
              back={goBack}
            />
            <button onClick={goBack} style={{ marginTop: "10px" }}>
              Back
            </button>
          </>
        )}
      </AppShell>
    </>
  );
}

