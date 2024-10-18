import React, { useState } from 'react';
import styled from 'styled-components';
import { FaFileUpload, FaEye, FaEyeSlash } from 'react-icons/fa';



const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
`;

const Form = styled.form`
  background: #fff;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 700px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stacks fields vertically on smaller screens */
  }
`;

const Title = styled.h2`
  grid-column: span 2;
  font-size: 26px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  margin-left: 10px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  height: 100px; /* Make the text area larger */
  resize: vertical; /* Allow users to resize vertically */
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
  position: relative; /* Add this to position the icon */
`;

const FileUploadButton = styled.label`
  padding: 20px;
  background-color: #e9ecef;
  border: 2px dashed #adb5bd;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #dee2e6;
  }
`;

const Button = styled.button`
  grid-column: span 2;
  padding: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const ErrorMessage = styled.p`
  grid-column: span 2;
  color: red;
  font-size: 14px;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const SuccessMessage = styled.p`
  grid-column: span 2;
  color: green;
  font-size: 14px;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const FileName = styled.p`
  margin: 5px 0 0;
  font-size: 14px;
  color: #555;
`;

const PasswordWrapper = styled.div`
  display: flex;
  align-items: center; /* Center the icon vertically */
`;

const PasswordInput = styled(Input)`
  flex-grow: 1; /* Make input take remaining space */
`;

function Register() {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    password: '',
    role: '',
    about: '',
    userProfile1: null,
    userProfile2: null,
    userProfile3: null,
    resume: null,
    userProfile1Name: '',
    userProfile2Name: '',
    userProfile3Name: '',
    resumeName: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // State for success message
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const fileName = files[0] ? files[0].name : ''; // Get the name of the selected file
    setFormData({ ...formData, [name]: files[0], [`${name}Name`]: fileName });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userIdPattern = /^[0-9]{8}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 chars, 1 letter and 1 number

    if (!userIdPattern.test(formData.userId)) {
        setError('User ID must be exactly 8 digits.');
        return;
    }

    if (!emailPattern.test(formData.email)) {
        setError('Invalid email format.');
        return;
    }

    if (!passwordPattern.test(formData.password)) {
        setError('Password must be at least 8 characters long and contain at least one letter and one number.');
        return;
    }

    const data = new FormData();
    data.append('userDTO', new Blob([JSON.stringify({
        userId: formData.userId,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        about: formData.about,
    })], { type: 'application/json' }));

    data.append('userProfile1', formData.userProfile1);
    data.append('userProfile2', formData.userProfile2);
    data.append('userProfile3', formData.userProfile3);
    data.append('resume', formData.resume);

    try {
        const response = await fetch('http://localhost:8888/api/users/register', {
            method: 'POST',
            body: data,
        });

        const result = await response.json(); // Parse the JSON response

        if (!response.ok) {
            throw new Error(result.message || 'Error registering user.');
        }

        

        console.log('User registered successfully:', result);
        setError('');
        setSuccess(result.message); // Set success message from the response
        

    } catch (err) {
        console.error('Error registering user:', err);
        setError(err.message || 'Error registering user.');
        setSuccess(''); // Clear success message on error
    }
};

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Register</Title>

        <InputField>
          <Label>User ID (8 digits)</Label>
          <Input
            type="number"
            name="userId"
            placeholder="Enter your User ID"
            value={formData.userId}
            onChange={handleChange}
            required
          />
        </InputField>

        <InputField>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </InputField>

        <InputField>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </InputField>

        <InputField>
          <Label>Password</Label>
          <PasswordWrapper>
            <PasswordInput
              type={showPassword ? "text" : "password"} // Toggle input type
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 10px' }}>
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show/hide icon */}
            </button>
          </PasswordWrapper>
        </InputField>

        <InputField>
          <Label>Role</Label>
          <Input
            type="text"
            name="role"
            placeholder="Enter your role"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </InputField>

        <InputField>
          <Label>About</Label>
          <TextArea
            name="about"
            placeholder="Tell us about yourself"
            value={formData.about}
            onChange={handleChange}
            required
          />
        </InputField>

        <InputField>
          <FileUploadButton>
            Upload Profile Image 1
            <input
              type="file"
              name="userProfile1"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              required
            />
          </FileUploadButton>
          {formData.userProfile1Name && <FileName>{formData.userProfile1Name}</FileName>}
        </InputField>

        <InputField>
          <FileUploadButton>
            Upload Profile Image 2
            <input
              type="file"
              name="userProfile2"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              required
            />
          </FileUploadButton>
          {formData.userProfile2Name && <FileName>{formData.userProfile2Name}</FileName>}
        </InputField>

        <InputField>
          <FileUploadButton>
            Upload Profile Image 3
            <input
              type="file"
              name="userProfile3"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              required
            />
          </FileUploadButton>
          {formData.userProfile3Name && <FileName>{formData.userProfile3Name}</FileName>}
        </InputField>

        <InputField>
          <FileUploadButton>
            Upload Resume
            <input
              type="file"
              name="resume"
              accept=".pdf, .doc, .docx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              required
            />
          </FileUploadButton>
          {formData.resumeName && <FileName>{formData.resumeName}</FileName>}
        </InputField>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>} {/* Display success message */}

        <Button type="submit">Register</Button>
      </Form>
    </Container>
  );
}

export default Register;
