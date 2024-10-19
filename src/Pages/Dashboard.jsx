import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Skill from '../Components/Skill';
import Project from '../Components/Project';
import User from '../Components/User';

function Dashboard() {
  const location = useLocation();
  const { isUserLogged, userId } = location.state || {};

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('User');

  const handleLogout = () => {
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isUserLogged) {
      navigate('/', {
        state: {
          message: 'Login to access dashboard...',
        },
      });
    }
  }, [isUserLogged, navigate]);

  if (!isUserLogged) {
    return null;
  }

  return (
    <Container>
      <Nav>
        <NavLogo>Dashboard</NavLogo>
        <Hamburger onClick={toggleMenu}>
          {isMenuOpen ? '✖' : '☰'}
        </Hamburger>
        <NavMenu isOpen={isMenuOpen}>
          <NavItem onClick={() => setActiveTab('User')}>
            <StyledLink>User</StyledLink>
          </NavItem>
          <NavItem onClick={() => setActiveTab('Skills')}>
            <StyledLink>Skills</StyledLink>
          </NavItem>
          <NavItem onClick={() => setActiveTab('Projects')}>
            <StyledLink>Projects</StyledLink>
          </NavItem>
          <NavItem>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </NavItem>
        </NavMenu>
      </Nav>

      <Content>
        {activeTab === 'User' && <User userId={userId} />}
        {activeTab === 'Skills' && <Skill userId={userId} />}
        {activeTab === 'Projects' && <Project userId={userId} />}
      </Content>
    </Container>
  );
}

// Styled components for dashboard
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2b2b2b, #1f1f1f); /* Gradient background */
`;

const Nav = styled.nav`
  background-color: rgba(50, 50, 50, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  position: relative;
  backdrop-filter: blur(10px); /* Blurry background for a sleek effect */
`;

const NavLogo = styled.div`
  font-size: 26px;
  font-weight: bold;
  color: #ffffff;
`;

const Hamburger = styled.div`
  display: none;
  font-size: 28px;
  color: #ffffff;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: rgba(50, 50, 50, 0.8);
    padding: 15px;
  }
`;

const NavItem = styled.li`
  display: flex;
  align-items: center;
`;

const StyledLink = styled.p`
  color: #ffffff;
  font-size: 18px;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4caf50; /* Green background on hover */
  }
`;

const LogoutButton = styled.button`
  color: #ffffff;
  background-color: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f44336; /* Red background on hover */
  }
`;

const Content = styled.div`
  padding: 20px;
  background-color: #f7f7f7; /* Light background for content */
  min-height: calc(100vh - 60px); /* Ensure it fills available space below navbar */
`;

export default Dashboard;
