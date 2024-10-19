import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Import Google Fonts
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

  body {
    font-family: 'Roboto', sans-serif;
  }
`;

function Skill({ userId }) {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    skillName: '',
    learnedFrom: '',
    point1: '',
    point2: '',
    point3: '',
    point4: '',
    point5: '',
    sourceLink: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editSkillId, setEditSkillId] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`http://localhost:8888/api/skills/getAll/${userId}`);
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillData = isEditing
      ? { ...formData, skillId: editSkillId, userId }
      : { ...formData, userId };

    const url = isEditing ? 'http://localhost:8888/api/skills/update' : 'http://localhost:8888/api/skills/create';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error submitting skill:', errorText);
        return;
      }

      fetchSkills();
      resetForm();
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting skill:', error);
    }
  };

  const handleDelete = async (skillId) => {
    try {
      const response = await fetch(`http://localhost:8888/api/skills/delete/${userId}/${skillId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchSkills();
      } else {
        console.error('Error deleting skill:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      skillName: '',
      learnedFrom: '',
      point1: '',
      point2: '',
      point3: '',
      point4: '',
      point5: '',
      sourceLink: '',
    });
    setIsEditing(false);
    setEditSkillId(null);
  };

  const handleEdit = (skill) => {
    setFormData({
      skillName: skill.skillName,
      learnedFrom: skill.learnedFrom,
      point1: skill.point1,
      point2: skill.point2,
      point3: skill.point3,
      point4: skill.point4,
      point5: skill.point5,
      sourceLink: skill.sourceLink,
    });
    setIsEditing(true);
    setEditSkillId(skill.skillId);
  };

  // Handle leaving the page with fade-out effect
  const handleLeavePage = () => {
    setIsLeaving(true);
    setTimeout(() => {
      // Call your navigation logic here
    }, 500); // Adjust timeout based on your fade-out duration
  };

  return (
    <SkillContainer>
      <GlobalStyle />
      <SkillForm onSubmit={handleSubmit}>
        <h2>{isEditing ? 'Edit Skill' : 'Add Skill'}</h2>
        <Input
          type="text"
          name="skillName"
          placeholder="Skill Name"
          value={formData.skillName}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          name="learnedFrom"
          placeholder="Learned From"
          value={formData.learnedFrom}
          onChange={handleInputChange}
        />
        {Array.from({ length: 5 }, (_, i) => (
          <Input
            key={i}
            type="text"
            name={`point${i + 1}`}
            placeholder={`Key Point ${i + 1}`}
            value={formData[`point${i + 1}`]}
            onChange={handleInputChange}
          />
        ))}
        <Input
          type="text"
          name="sourceLink"
          placeholder="Source Link"
          value={formData.sourceLink}
          onChange={handleInputChange}
        />
        <SubmitButton type="submit">{isEditing ? 'Update Skill' : 'Add Skill'}</SubmitButton>
        {isEditing && <CancelButton onClick={resetForm}>Cancel</CancelButton>}
      </SkillForm>

      <SkillList>
        <h2>Skills List</h2>
        <SkillGrid>
          {skills.length > 0 ? (
            skills.map((skill) => (
              <SkillItem key={skill.skillId} className={`fade-in ${isLeaving ? 'fade-out' : ''}`}>
                <SkillDetails>
                  <h3>{skill.skillName}</h3>
                  {skill.learnedFrom && (
                    <p><strong>Learned From:</strong> {skill.learnedFrom}</p>
                  )}
                  {skill.point1 || skill.point2 || skill.point3 || skill.point4 || skill.point5 ? (
                    <PointsList>
                      {skill.point1 && <li>{skill.point1}</li>}
                      {skill.point2 && <li>{skill.point2}</li>}
                      {skill.point3 && <li>{skill.point3}</li>}
                      {skill.point4 && <li>{skill.point4}</li>}
                      {skill.point5 && <li>{skill.point5}</li>}
                    </PointsList>
                  ) : null}
                  {skill.sourceLink && (
                    <SourceLink href={skill.sourceLink} target="_blank" rel="noopener noreferrer">
                      View Code
                    </SourceLink>
                  )}
                </SkillDetails>
                <SkillActions>
                  <EditButton onClick={() => handleEdit(skill)}>Edit</EditButton>
                  <DeleteButton onClick={() => handleDelete(skill.skillId)}>Delete</DeleteButton>
                </SkillActions>
              </SkillItem>
            ))
          ) : (
            <p>No skills added yet.</p>
          )}
        </SkillGrid>
      </SkillList>
    </SkillContainer>
  );
}

// Styled-components
const SkillContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

const SkillForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #e03528;
  }
`;

const SkillList = styled.div`
  margin-top: 40px;
`;

const SkillGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const SkillItem = styled.div`
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: black;  // Changed to black background
  color: white;  // Adjusted text color for contrast
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd; // Optional: Light border for distinction

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  &.fade-out {
    opacity: 0;
    transition: opacity 0.5s ease-out;
  }

  &.fade-in {
    opacity: 1;
    transition: opacity 0.5s ease-in;
  }
`;

const SkillDetails = styled.div`
  flex: 1;
`;

const PointsList = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const SourceLink = styled.a`
  color: #4caf50;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SkillActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EditButton = styled.button`
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #1976d2;
  }
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

export default Skill;
