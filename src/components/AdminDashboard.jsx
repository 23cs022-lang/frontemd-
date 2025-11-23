import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

// ----- Styled Components -----
const Wrapper = styled.div`
  padding: 40px;
  background: #e0f2ff;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
`;

const Section = styled.section`
  margin-bottom: 32px;
  background: #ffffff;
  padding: 28px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled.h3`
  margin-bottom: 20px;
  font-size: 22px;
  color: #1e293b;
  border-bottom: 2px solid #cbd5e1;
  padding-bottom: 6px;
`;

const Row = styled.div`
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid #cbd5e1;
  min-width: 160px;
  transition: all 0.2s;
  &:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid #cbd5e1;
  transition: all 0.2s;
  &:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #334155;
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background: linear-gradient(90deg, #1d4ed8, #2563eb);
  }
`;

const TableWrap = styled.div`
  margin-top: 16px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #f8fafc;
  border-radius: 12px;
`;

const Th = styled.th`
  text-align: left;
  padding: 14px 10px;
  color: #1e293b;
  font-weight: 600;
  background: #e2e8f0;
`;

const Td = styled.td`
  padding: 12px 10px;
  border-top: 1px solid #cbd5e1;
  cursor: pointer;
`;

const CriticalRow = styled.tr`
  background: linear-gradient(90deg, rgba(254, 202, 202, 0.3), rgba(254, 226, 226, 0.1));
`;

// ----- Component -----
export default function AdminDashboard({ children }) {
  const [doctors, setDoctors] = useState([]);
  const [queue, setQueue] = useState([]);
  const [patientForm, setPatientForm] = useState({
    _id: "",
    name: "",
    age: "",
    symptom: "",
    appointment: "",
    phone: "",
    doctor: "",
    critical: false,
  });
  const [newDoc, setNewDoc] = useState({
    name: "",
    username: "",
    password: "",
    specialization: "",
  });

  const backendUrl = "http://localhost:8080/api";

  // ---------- Fetch Doctors & Patients ----------
  useEffect(() => {
    fetchDoctors();
    fetchQueue();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${backendUrl}/doctors`);
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`${backendUrl}/patients`);
      setQueue(res.data);
    } catch (err) {
      console.error("Error fetching queue:", err);
    }
  };

  // ---------- Select Patient ----------
  const selectPatient = (p) => {
    setPatientForm({
      _id: p._id,
      name: p.name,
      age: p.age,
      symptom: p.symptom,
      appointment: p.appointment || "",
      phone: p.phone,
      doctor: p.doctor ? p.doctor.username : "",
      critical: p.critical,
    });
  };

  // ---------- Update Patient ----------
  const updatePatient = async () => {
    if (!patientForm._id) return alert("Please select a patient from the table");
    if (!patientForm.doctor) return alert("Please select a doctor");
    if (!patientForm.appointment) return alert("Please set appointment time");

    try {
      const payload = {
        doctorUsername: patientForm.doctor, // send username
        appointment: patientForm.appointment,
        name: patientForm.name,
        age: patientForm.age,
        symptom: patientForm.symptom,
        phone: patientForm.phone,
        critical: patientForm.critical,
      };

      await axios.put(`${backendUrl}/patients/${patientForm._id}/assign`, payload);
      alert("Patient updated successfully!");
      fetchQueue();

      setPatientForm({
        _id: "",
        name: "",
        age: "",
        symptom: "",
        appointment: "",
        phone: "",
        doctor: "",
        critical: false,
      });
    } catch (err) {
      console.error("Error updating patient:", err);
      alert(err.response?.data?.message || "Failed to update patient");
    }
  };

  // ---------- Add Doctor ----------
  const addDoctor = async () => {
    if (!newDoc.name || !newDoc.username || !newDoc.password || !newDoc.specialization)
      return alert("Fill all fields");
    try {
      await axios.post(`${backendUrl}/doctors`, newDoc);
      setNewDoc({ name: "", username: "", password: "", specialization: "" });
      fetchDoctors();
    } catch (err) {
      console.error("Error adding doctor:", err);
      alert(err.response?.data?.message || "Failed to add doctor");
    }
  };

  return (
    <Wrapper>
      {/* Update Patient */}
      <Section>
        <SectionTitle>Update Patient</SectionTitle>
        <Row>
          <Input
            placeholder="Patient Name"
            value={patientForm.name}
            onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Age"
            value={patientForm.age}
            onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
          />
          <Input
            placeholder="Symptom"
            value={patientForm.symptom}
            onChange={(e) => setPatientForm({ ...patientForm, symptom: e.target.value })}
          />
          <Input
            placeholder="Phone Number"
            value={patientForm.phone}
            onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
          />
          <Input
            type="time"
            value={patientForm.appointment}
            onChange={(e) => setPatientForm({ ...patientForm, appointment: e.target.value })}
          />
          <Select
            value={patientForm.doctor}
            onChange={(e) => setPatientForm({ ...patientForm, doctor: e.target.value })}
          >
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d.username} value={d.username}>
                {d.name}
              </option>
            ))}
          </Select>
          <CheckboxLabel>
            <input
              type="checkbox"
              checked={patientForm.critical}
              onChange={(e) => setPatientForm({ ...patientForm, critical: e.target.checked })}
            />
            Critical Patient
          </CheckboxLabel>
          <Button onClick={updatePatient}>Update</Button>
        </Row>

        <TableWrap>
          {queue.length === 0 ? (
            <p>No patients in queue.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Token</Th>
                  <Th>Name</Th>
                  <Th>Age</Th>
                  <Th>Symptom</Th>
                  <Th>Phone</Th>
                  <Th>Doctor</Th>
                  <Th>Appointment</Th>
                  <Th>Critical</Th>
                </tr>
              </thead>
              <tbody>
                {queue.map((p) => {
                  const RowComponent = p.critical ? CriticalRow : "tr";
                  return (
                    <RowComponent key={p.token} onClick={() => selectPatient(p)}>
                      <Td>{p.token}</Td>
                      <Td>{p.name}</Td>
                      <Td>{p.age}</Td>
                      <Td>{p.symptom}</Td>
                      <Td>{p.phone || "—"}</Td>
                      <Td>{p.doctor ? p.doctor.name : "Unknown"}</Td>
                      <Td>{p.appointment}</Td>
                      <Td>{p.critical ? "Yes" : "No"}</Td>
                    </RowComponent>
                  );
                })}
              </tbody>
            </Table>
          )}
        </TableWrap>
      </Section>

      {/* Add Doctor */}
      <Section>
        <SectionTitle>Add Doctor</SectionTitle>
        <Row>
          <Input
            placeholder="Doctor Name"
            value={newDoc.name}
            onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
          />
          <Input
            placeholder="Username"
            value={newDoc.username}
            onChange={(e) => setNewDoc({ ...newDoc, username: e.target.value })}
          />
          <Input
            placeholder="Password"
            value={newDoc.password}
            onChange={(e) => setNewDoc({ ...newDoc, password: e.target.value })}
          />
          <Input
            placeholder="Specialization"
            value={newDoc.specialization}
            onChange={(e) => setNewDoc({ ...newDoc, specialization: e.target.value })}
          />
          <Button onClick={addDoctor}>Add Doctor</Button>
        </Row>

        <h4 style={{ marginTop: 20 }}>Current Doctors</h4>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Username</Th>
                <Th>Specialization</Th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.username}>
                  <Td>{d.name}</Td>
                  <Td>{d.username}</Td>
                  <Td>{d.specialization || "—"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Section>

      {children}
    </Wrapper>
  );
}
