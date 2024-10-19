import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
`;

const Form = styled.form`
  background: #fff;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const IconButton = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 20px;
`;

const Button = styled.button`
  padding: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  margin-top: 15px;
  color: ${(props) => (props.success ? 'green' : 'red')};
`;

const Login = () => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const loginRequest = {
      userId: userId,
      email: email,
      password: password,
    };
  
    try {
      const response = await fetch('http://localhost:8888/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest) // Corrected JSON.stringify() method
      });
  
      if (response.ok) {
        setMessage('Login successful');
        navigate('/dashboard', {
          state: {
            isUserLogged: true,
            userId: loginRequest.userId,
          },
        });
      } else {
        const errorMessage = await response.text();
        setMessage(errorMessage);
      }
    } catch (error) {
      setMessage('Error logging in. Please try again later.');
    }
  };
  

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <InputField>
          <Label>User ID</Label>
          <Input
            type="number"
            placeholder="Enter your User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </InputField>

        <InputField>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputField>

        <InputField>
          <Label>Password</Label>
          <PasswordWrapper>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <IconButton onClick={togglePasswordVisibility}>
              {showPassword ? '🫣' : '👀'}
            </IconButton>
          </PasswordWrapper>
        </InputField>

        <Button type="submit">Login</Button>

        {message && <Message success={message === 'Login successful'}>{message}</Message>}
      </Form>
    </Container>
  );
};

export default Login;
