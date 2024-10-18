import { useState, useEffect } from 'react';
import styled from 'styled-components';

const UserControlsContainer = styled.div`
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f2f2f2 30%, #e6e6e6);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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

function UserControlls({ userId }) {
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

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8888/api/users/get/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        console.log(data);
        setUserDTO({ ...data });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('userDTO', JSON.stringify(userDTO));
    if (userDTO.userImage1) formData.append('userProfile1', userDTO.userImage1);
    if (userDTO.userImage2) formData.append('userProfile2', userDTO.userImage2);
    if (userDTO.userImage3) formData.append('userProfile3', userDTO.userImage3);
    if (userDTO.resume) formData.append('resume', userDTO.resume);

    try {
        const response = await fetch('http://localhost:8888/api/users/update', {
            method: 'PUT',
            body: formData,
        
            // Don't set Content-Type header when sending FormData
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message); // Display success message
    } catch (error) {
        console.error('Error updating user data:', error);
        alert('Failed to update user data. Please try again.'); // Display an error message to the user
    }
};


  return (
    <UserControlsContainer>
      <Title>Update User Information</Title>
      <form onSubmit={handleSubmit}>
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
            onChange={(e) => setUserDTO({ ...userDTO, email: e.target.value })}
            required
          />
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
            {showPassword ? 'Hide' : 'Show'}
          </TogglePasswordButton>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="role">Role</Label>
          <Input
            type="text"
            id="role"
            value={userDTO.role}
            onChange={(e) => setUserDTO({ ...userDTO, role: e.target.value })}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="about">About</Label>
          <TextArea
            id="about"
            value={userDTO.about}
            onChange={(e) => setUserDTO({ ...userDTO, about: e.target.value })}
            rows="4"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="userImage1">Profile Image 1 (Optional)</Label>
          <Input
            type="file"
            id="userImage1"
            accept="image/*"
            onChange={(e) => setUserDTO({ ...userDTO, userImage1: e.target.files[0] })}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="userImage2">Profile Image 2 (Optional)</Label>
          <Input
            type="file"
            id="userImage2"
            accept="image/*"
            onChange={(e) => setUserDTO({ ...userDTO, userImage2: e.target.files[0] })}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="userImage3">Profile Image 3 (Optional)</Label>
          <Input
            type="file"
            id="userImage3"
            accept="image/*"
            onChange={(e) => setUserDTO({ ...userDTO, userImage3: e.target.files[0] })}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="resume">Resume (Optional)</Label>
          <Input
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setUserDTO({ ...userDTO, resume: e.target.files[0] })}
          />
        </FormGroup>

        <Button type="submit">Update User</Button>
      </form>
    </UserControlsContainer>
  );
}

export default UserControlls;
