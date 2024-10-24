import React, { useState, useEffect } from 'react';
import styled from 'styled-components';






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
    icon: null,
    skillId: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch(`http://ec2-13-126-99-50.ap-south-1.compute.amazonaws.com:8888/api/skills/getAll/${userId}`);
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'icon') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();

    const skillDTO = {
      skillName: formData.skillName,
      learnedFrom: formData.learnedFrom,
      point1: formData.point1,
      point2: formData.point2,
      point3: formData.point3,
      point4: formData.point4,
      point5: formData.point5,
      sourceLink: formData.sourceLink,
      userId: userId,
      skillId: isEditing ? formData.skillId : null,
    };

    formPayload.append("skillDTO", new Blob([JSON.stringify(skillDTO)], { type: 'application/json' }));

    // Change the key from "icon" to "skillIcon"
    if (formData.icon) {
      formPayload.append("skillIcon", formData.icon); // Updated key name
    }

    const url = isEditing
      ? `http://ec2-13-126-99-50.ap-south-1.compute.amazonaws.com:8888/api/skills/update`
      : `http://ec2-13-126-99-50.ap-south-1.compute.amazonaws.com:8888/api/skills/create`;

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        body: formPayload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error submitting skill:', errorText);
        alert('Failed to submit skill: ' + errorText);
        return;
      }


      alert(`Skill ${isEditing ? 'updated' : 'added'} successfully!`);
      fetchSkills(); // Refresh the skills list
      resetForm(); // Reset the form after submission
    } catch (error) {
      console.error('Error submitting skill:', error);
    }
  };

  const handleDelete = async (skillId) => {
    try {
      const response = await fetch(`http://ec2-13-126-99-50.ap-south-1.compute.amazonaws.com:8888/api/skills/delete/${userId}/${skillId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Skill deleted successfully!');
        fetchSkills(); // Refresh the skills list after deletion
      } else {
        alert("failed deleting skill")
        console.error('Error deleting skill:', response.statusText);
      }
    } catch (error) {
      alert('Error deleting skill: ' + error.message);
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
      icon: null,
      skillId: null,
    });
    setIsEditing(false);
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
      icon: null, // No file editing
      skillId: skill.skillId,
    });
    setIsEditing(true);
  };

  return (
    <SkillContainer>
      
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
        <Input
          type="file"
          name="icon"
          accept="image/*"
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
              <SkillItem key={skill.skillId}>
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
            <p>No skills found.</p>
          )}
        </SkillGrid>
      </SkillList>
    </SkillContainer>
  );
}

// Styled Components
const SkillContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
  background: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const SkillForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #218838;
  }
`;

const CancelButton = styled.button`
  padding: 10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #c82333;
  }
`;

const SkillList = styled.div`
  margin-top: 20px;
`;

const SkillGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const SkillItem = styled.div`
  background: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 10px;
  flex: 1 1 calc(33.333% - 20px); // Responsive
`;

const SkillDetails = styled.div`
  margin-bottom: 10px;
`;

const PointsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const SourceLink = styled.a`
  color: #007bff;
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
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #c82333;
  }
`;

export default Skill;
