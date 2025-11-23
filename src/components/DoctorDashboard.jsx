import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Wrap = styled.div`
  padding: 24px;
`;

const Card = styled.div`
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(20, 20, 40, 0.06);
  margin-bottom: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 8px;
`;

const Td = styled.td`
  padding: 8px;
  border-top: 1px solid #f1f3f7;
`;

const Button = styled.button`
  padding: 8px 10px;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
`;

export default function DoctorDashboard({
  currentDoctor,
  currentPatient,
  setCurrentPatient,
  logout,
  back,
  doctors,
}) {
  const [doctorQueue, setDoctorQueue] = useState([]);
  const backendUrl = "http://localhost:8080/api";

  // ---------- Load Doctor Queue ----------
  useEffect(() => {
    fetchDoctorQueue();
    // eslint-disable-next-line
  }, []);

  const fetchDoctorQueue = async () => {
    try {
      // ✅ corrected API endpoint
      const res = await axios.get(`${backendUrl}/patients/doctor/${currentDoctor}`);
      setDoctorQueue(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching doctor queue:", err);
    }
  };

  // ---------- Consult Patient ----------
  const consult = async (token) => {
    try {
      const patient = doctorQueue.find((p) => p.token === token);
      if (!patient) {
        console.warn("⚠️ Patient not found for token:", token);
        return;
      }

      console.log("Consulting patient:", patient);

      // ✅ endpoint matches backend route
      const res = await axios.put(
        `${backendUrl}/patients/${patient.token}/consult`,
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ Consult response:", res.data);

      // Set current patient
      setCurrentPatient(patient);

      // Refresh doctor queue
      fetchDoctorQueue();
    } catch (err) {
      console.error("❌ Error consulting patient:", err.response || err.message);
    }
  };

  // ---------- JSX ----------
  return (
    <Wrap>
      <Card>
        <h3>
          Doctor Dashboard —{" "}
          {doctors.find((d) => d.username === currentDoctor)?.name || currentDoctor}
        </h3>

        <div id="current" style={{ marginBottom: 12 }}>
          {currentPatient ? (
            <strong>
              Now Consulting: Token {currentPatient.token} — {currentPatient.name}
            </strong>
          ) : (
            <em>No patient being consulted.</em>
          )}
        </div>

        <h4>Queue</h4>
        {doctorQueue.length === 0 ? (
          <p>No patients waiting.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Token</Th>
                <Th>Name</Th>
                <Th>Age</Th>
                <Th>Symptom</Th>
                <Th>Appointment</Th>
                <Th>Critical</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {doctorQueue.map((p) => (
                <tr
                  key={p.token}
                  style={{
                    background: p.critical
                      ? "linear-gradient(90deg,#fff7ed,#fdf2f8)"
                      : "transparent",
                  }}
                >
                  <Td>{p.token}</Td>
                  <Td>{p.name}</Td>
                  <Td>{p.age}</Td>
                  <Td>{p.symptom}</Td>
                  <Td>{p.appointment}</Td>
                  <Td>{p.critical ? "Yes" : "No"}</Td>
                  <Td>
                    <Button
                      onClick={() => consult(p.token)}
                      style={{
                        background: "#4f46e5",
                        color: "white",
                        marginRight: 8,
                      }}
                    >
                      Consult
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <div style={{ marginTop: 12 }}>
          <Button
            onClick={back}
            style={{ background: "#6b7280", color: "white", marginRight: 8 }}
          >
            Back
          </Button>
          <Button
            onClick={logout}
            style={{ background: "#ef4444", color: "white" }}
          >
            Logout
          </Button>
        </div>
      </Card>
    </Wrap>
  );
}
