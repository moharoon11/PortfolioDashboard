import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function DashboardNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <Nav>
      <NavLogo>Dashboard</NavLogo>
      <Hamburger onClick={toggleMenu}>
        {isMenuOpen ? '✖' : '☰'}
      </Hamburger>
      <NavMenu isOpen={isMenuOpen}>
        <NavItem>
          <StyledLink to="/skills">Skills</StyledLink>
        </NavItem>
        <NavItem>
          <StyledLink to="/projects">Projects</StyledLink>
        </NavItem>
        <NavItem>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </NavItem>
      </NavMenu>
    </Nav>
  );
}

// Styled components for the Navbar
const Nav = styled.nav`
  background-color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const NavLogo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: white;
`;

const Hamburger = styled.div`
  display: none;
  font-size: 28px;
  color: white;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px; /* Adjust this value based on the height of the navbar */
    left: 0;
    right: 0;
    background-color: #333;
    padding: 15px;
  }
`;

const NavItem = styled.li`
  display: inline;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;
  padding: 5px 10px;

  &:hover {
    background-color: #4caf50;
    border-radius: 5px;
  }
`;

const LogoutButton = styled.button`
  color: white;
  background-color: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    background-color: #ff4d4d;
    border-radius: 5px;
  }
`;

export default DashboardNavbar;
