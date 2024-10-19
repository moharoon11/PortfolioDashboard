import { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components for the container and forms
const UserControlsContainer = styled.div`
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f2f2f2 30%, #e6e6e6);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const TogglePasswordButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  margin-top: 5px;
  padding: 0;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

const FormSection = styled.div`
  margin-bottom: 30px; // Space between form sections
`;

function User({ userId }) {
  const [userDTO, setUserDTO] = useState({
    userId: userId,
    email: '',
    password: '',
    name: '',
    role: '',
    about: '',
    userImage1: null,
    userImage2: null,
    userImage3: null,
    resume: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8888/api/users/get/${userId}`);
        const data = await response.json();
        setUserDTO({ ...data });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Password validation function
  const validatePassword = (password) => {
    const minLength = 6;
    const hasNumber = /\d/; // Regular expression to check for at least one number

    return password.length >= minLength && hasNumber.test(password);
  };

  // New email validation function
  const isValidEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Updated regex pattern
    const trimmedEmail = email.trim(); // Trim leading/trailing whitespace

    // Check if the email is valid and not empty
    return trimmedEmail && pattern.test(trimmedEmail);
  };

  // Handle text field updates
  const handleTextFieldUpdate = async (e) => {
    e.preventDefault();

    // Validate password before submitting
    if (!validatePassword(userDTO.password)) {
      alert('Password must be at least 6 characters long and contain at least one number.');
      return;
    }

    // Validate email
    if (!isValidEmail(userDTO.email)) {
      setEmailError('Please enter a valid email address in the format: example@domain.com');
      return;
    }

    setEmailError(''); // Clear previous error message

    try {
      const response = await fetch(`http://localhost:8888/api/users/update/info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDTO),
      });

      if (!response.ok) {
        const errorResponse = await response.json(); // Get the error response body

        // Check if the errorResponse has a message property
        const errorMessage = errorResponse.message || 'An error occurred. Please try again.';
        throw new Error(errorMessage); // Throw an error with the specific message
      }

      const result = await response.json();
      alert(result.message); // Display success message
    } catch (error) {
      console.error('Error updating user fields:', error);
      alert(`Failed to update user fields: ${error.message}`); // Show backend error message
    }
  };

  // Handle file uploads
  const handleFileUpload = async (fileType) => {
    const formData = new FormData();
    if (fileType === 'userImage1' && userDTO.userImage1) {
      formData.append('userImage1', userDTO.userImage1);
    } else if (fileType === 'userImage2' && userDTO.userImage2) {
      formData.append('userImage2', userDTO.userImage2);
    } else if (fileType === 'userImage3' && userDTO.userImage3) {
      formData.append('userImage3', userDTO.userImage3);
    } else if (fileType === 'resume' && userDTO.resume) {
      formData.append('resume', userDTO.resume);
    }

    try {
      const response = await fetch(`http://localhost:8888/api/users/update/${fileType}/${userId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update file');
      }

      const result = await response.json();
      alert(result.message); // Display success message
    } catch (error) {
      console.error('Error updating file:', error);
      alert('Failed to update file. Please try again.');
    }
  };

  return (
    <UserControlsContainer>
      <Title>Update User Information</Title>

      {/* User Info Update Form */}
      <FormSection>
        <form onSubmit={handleTextFieldUpdate}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={userDTO.name}
              onChange={(e) => setUserDTO({ ...userDTO, name: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={userDTO.email}
              onChange={(e) => {
                setUserDTO({ ...userDTO, email: e.target.value });
                setEmailError(''); // Clear error on input change
              }}
              required
            />
            {emailError && <ErrorMessage>{emailError}</ErrorMessage>} {/* Display email error */}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={userDTO.password}
              onChange={(e) => setUserDTO({ ...userDTO, password: e.target.value })}
              required
            />
            <TogglePasswordButton type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'} Password
            </TogglePasswordButton>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="role">Role</Label>
            <Input
              type="text"
              id="role"
              value={userDTO.role}
              onChange={(e) => setUserDTO({ ...userDTO, role: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="about">About</Label>
            <TextArea
              id="about"
              value={userDTO.about}
              onChange={(e) => setUserDTO({ ...userDTO, about: e.target.value })}
              required
            />
          </FormGroup>

          <Button type="submit">Update Information</Button>
        </form>
      </FormSection>

      {/* Profile Image Uploads */}
      <FormSection>
        <Title>Upload Profile Images</Title>
        {Array.from({ length: 4 }, (_, index) => (
          <FormGroup key={index}>
            <Label htmlFor={`userImage${index + 1}`}>Profile Image {index + 1}</Label>
            <Input
              type="file"
              id={`userImage${index + 1}`}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setUserDTO({ ...userDTO, [`userImage${index + 1}`]: file });
                }
              }}
              accept="image/*"
            />
            <Button type="button" onClick={() => handleFileUpload(`userImage${index + 1}`)}>
              Upload Image {index + 1}
            </Button>
          </FormGroup>
        ))}
      </FormSection>

      {/* Resume Upload */}
      <FormSection>
        <FormGroup>
          <Label htmlFor="resume">Upload Resume</Label>
          <Input
            type="file"
            id="resume"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setUserDTO({ ...userDTO, resume: file });
              }
            }}
            accept=".pdf"
          />
          <Button type="button" onClick={() => handleFileUpload('resume')}>
            Upload Resume
          </Button>
        </FormGroup>
      </FormSection>
    </UserControlsContainer>
  );
}

export default User;
