import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';
import Register from '../Components/Register';
import Login from '../Components/Login';

function Index() {
  const [activeTab, setActiveTab] = useState('Login');
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Navbar>
        <Logo>Portfolio Manager</Logo>
        <Hamburger onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </Hamburger>
        <NavMenu isOpen={isOpen}>
          <NavItem
            isActive={activeTab === 'Register'}
            onClick={() => {
              setActiveTab('Register');
              setIsOpen(false);
            }}
          >
            Register
          </NavItem>
          <NavItem
            isActive={activeTab === 'Login'}
            onClick={() => {
              setActiveTab('Login');
              setIsOpen(false);
            }}
          >
            Login
          </NavItem>
        </NavMenu>
      </Navbar>

      <MainContent>
        {activeTab === 'Register' && <Register />}
        {activeTab === 'Login' && <Login />}
      </MainContent>
    </>
  );
}

// Styled-components

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #333;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 10px 20px;
  }
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  color: #fff;
`;

const Hamburger = styled.div`
  display: none;
  font-size: 28px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
    color: white;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    right: 0;
    height: 100vh;
    width: 100%;
    background-color: #333;
    flex-direction: column;
    justify-content: center;
    transform: ${(props) => (props.isOpen ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s ease-in-out;
  }
`;

const NavItem = styled.div`
  margin-left: 30px;
  padding: 10px;
  cursor: pointer;
  color: ${(props) => (props.isActive ? '#4CAF50' : '#fff')};
  border-bottom: ${(props) => (props.isActive ? '2px solid #4CAF50' : 'none')};
  transition: color 0.3s ease, border-bottom 0.3s ease;

  &:hover {
    color: #4CAF50;
  }

  @media (max-width: 768px) {
    margin: 20px 0;
    font-size: 24px;
    width: 100%;
    text-align: center;
  }
`;

const MainContent = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  min-height: calc(100vh - 60px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Export the component
export default Index;
