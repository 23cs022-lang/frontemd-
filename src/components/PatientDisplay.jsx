// src/PatientRegistrationForm.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { registerPatientApi, fetchPatients } from "../api";

// ----- Styled Components -----
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fb;
  font-family: "Segoe UI", sans-serif;
`;

const FormContainer = styled.div`
  background: #fff;
  padding: 40px 48px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 420px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  font-weight: 700;
  margin-bottom: 8px;
  color: #000;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 14px;
  color: #222;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 14px;
  margin-top: 4px;
  outline: none;
  &:focus {
    border-color: #6a0dad;
    box-shadow: 0 0 0 2px rgba(106, 13, 173, 0.1);
  }
`;

const Button = styled.button`
  margin-top: 12px;
  background-color: #6a0dad;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background-color: #580bba;
  }
`;

const FooterText = styled.p`
  margin-top: 16px;
  font-size: 13px;
  color: #555;
`;

// ----- Component -----
export default function PatientRegistrationForm({ onUpdateQueue }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    symptom: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerPatientApi(form, "");
      if (onUpdateQueue) {
        const patients = await fetchPatients();
        onUpdateQueue(patients.data);
      }
      alert("Patient Registered Successfully!");
      setForm({ name: "", age: "", symptom: "", phone: "" });
    } catch (err) {
      console.error("Error registering patient:", err);
      alert("Failed to register patient. Check console for details.");
    }
  };

  return (
    <Page>
      <FormContainer>
        <Title>Register Patient</Title>
        <Subtitle>Kindly fill in this form to register a new patient.</Subtitle>

        <Form onSubmit={handleSubmit}>
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter patient name"
            />
          </div>

          <div>
            <Label>Age</Label>
            <Input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              placeholder="Enter age"
            />
          </div>

          <div>
            <Label>Symptom</Label>
            <Input
              type="text"
              name="symptom"
              value={form.symptom}
              onChange={handleChange}
              required
              placeholder="Enter symptom"
            />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              type="tel"
              name="phone"
              pattern="[0-9]{10}"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Enter 10-digit phone number"
            />
          </div>

          <Button type="submit">Register</Button>
        </Form>

        <FooterText>Already have an appointment? Contact the admin.</FooterText>
      </FormContainer>
    </Page>
  );
}
