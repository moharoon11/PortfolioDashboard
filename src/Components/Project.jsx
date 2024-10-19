import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled components
const FormContainer = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const StyledButton = styled.button`
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const FileInputLabel = styled.label`
  margin: 10px 0;
  cursor: pointer;
  color: #007bff;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 10px;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #f9f9f9;
  }

  img {
    width: 50px; /* Thumbnail size */
    height: auto; /* Maintain aspect ratio */
  }
`;

function Project({ userId }) {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(null); // For editing a project
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [codeLink, setCodeLink] = useState('');
  const [technology, setTechnology] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(''); // To store the image preview URL

  const fetchProjects = async () => {
    try {
      const response = await fetch(`http://localhost:8888/api/projects/user/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      console.log(data);
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Fetch projects when the component mounts
  useEffect(() => {
   

    fetchProjects();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectDTO = {
      projectId, // Include projectId for updates
      projectName,
      projectDescription,
      liveLink,
      codeLink,
      technology,
      userId,
    };

    const formData = new FormData();
    formData.append('projectDTO', new Blob([JSON.stringify(projectDTO)], { type: 'application/json' }));
    if (imageFile) {
      formData.append('file', imageFile);
    }

    try {
      const response = projectId
        ? await fetch('http://localhost:8888/api/projects/update', {
            method: 'PUT',
            body: formData,
          })
        : await fetch('http://localhost:8888/api/projects/create', {
            method: 'POST',
            body: formData,
          });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Project saved successfully:', data);
      // Reset form after submission
      resetForm();
      fetchProjects(); // Refresh the project list
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const resetForm = () => {
    setProjectId(null);
    setProjectName('');
    setProjectDescription('');
    setLiveLink('');
    setCodeLink('');
    setTechnology('');
    setImageFile(null);
    setImagePreview(''); // Reset the image preview
  };

  const handleEdit = (project) => {
    setProjectId(project.projectId);
    setProjectName(project.projectName);
    setProjectDescription(project.projectDescription);
    setLiveLink(project.liveLink);
    setCodeLink(project.codeLink);
    setTechnology(project.technology);
    setImagePreview(project.imageURL); // Set the preview from the project data if available
  };

  const handleDelete = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:8888/api/projects/delete/${userId}/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data.message); // Log deletion message
      fetchProjects(); // Refresh the project list after deletion
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Handle image selection and set the preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the image preview
      };
      reader.readAsDataURL(file); // Convert file to base64 URL
    } else {
      setImagePreview(''); // Reset if no file selected
    }
  };

  return (
    <>
      <FormContainer>
        <StyledForm onSubmit={handleSubmit}>
          <StyledInput
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
            required
          />
          <StyledInput
            type="text"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Project Description"
            required
          />
          <StyledInput
            type="text"
            value={liveLink}
            onChange={(e) => setLiveLink(e.target.value)}
            placeholder="Live Link"
            required
          />
          <StyledInput
            type="text"
            value={codeLink}
            onChange={(e) => setCodeLink(e.target.value)}
            placeholder="Code Link"
            required
          />
          <StyledInput
            type="text"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            placeholder="Technology"
            required
          />
          <FileInputLabel>
            Upload Image
            <StyledInput
              type="file"
              onChange={handleImageChange} // Use the new handler
              accept="image/*"
              style={{ display: 'none' }} // Hide the default file input
            />
          </FileInputLabel>
          {imagePreview && <ImagePreview src={imagePreview} alt="Image preview" />} {/* Display selected image */}
          <StyledButton type="submit">{projectId ? 'Update Project' : 'Create Project'}</StyledButton>
        </StyledForm>
      </FormContainer>

      <Table>
        <thead>
          <tr>
            <th>Project Image</th> {/* New column for image */}
            <th>Project Name</th>
            <th>Description</th>
            <th>Live Link</th>
            <th>Code Link</th>
            <th>Technology</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.projectId}>
              <td> 
                <img src={`data:${project.imageType};base64,${project.imageDate}`} alt={project.imageName} /> {/* Display project image */}
              </td>
              <td>{project.projectName}</td>
              <td>{project.projectDescription}</td>
              <td><a href={project.liveLink} target="_blank" rel="noopener noreferrer">View</a></td>
              <td><a href={project.codeLink} target="_blank" rel="noopener noreferrer">View</a></td>
              <td>{project.technology}</td>
              <td>
                <StyledButton onClick={() => handleEdit(project)}>Edit</StyledButton>
                <StyledButton onClick={() => handleDelete(project.projectId)}>Delete</StyledButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Project;
