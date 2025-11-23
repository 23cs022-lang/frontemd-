import React from 'react';
import styled from 'styled-components';
import doctorImage from "../styles/image3.png";

// 🔹 Full Page Background
const PageWrap = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Background doctor image */
  background: url(${doctorImage}) no-repeat center center/cover;

  /* Optional overlay tint */
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.35); /* Dark overlay for contrast */
  }
`;

// 🔹 Login Box
const LoginWrap = styled.div`
  position: relative; /* ensure above overlay */
  padding: 32px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  width: 340px;
  text-align: center;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.3);
  z-index: 2;
`;

const Title = styled.h3`
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
`;

const Input = styled.input`
  display: block;
  margin: 12px auto;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  width: 85%;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
`;

const Button = styled.button`
  padding: 12px 16px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 14px;
  cursor: pointer;
  width: 90%;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #1e40af, #2563eb);
  }
`;

const Error = styled.p`
  margin-top: 12px;
  color: #ef4444;
  font-size: 0.9rem;
`;

export default function DoctorLogin({ login, setLogin, doctorLogin, loginMsg }) {
  return (
    <PageWrap>
      <LoginWrap>
        <Title>Doctor Login</Title>
        <Input
          placeholder="Username"
          value={login.username}
          onChange={(e) => setLogin({ ...login, username: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          value={login.password}
          onChange={(e) => setLogin({ ...login, password: e.target.value })}
        />
        <Button onClick={doctorLogin}>Log In</Button>
        {loginMsg && <Error>{loginMsg}</Error>}
      </LoginWrap>
    </PageWrap>
  );
}

