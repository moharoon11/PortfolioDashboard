import {useState, useEffect} from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import DashboardNavbar from '../Components/DashboardNavbar';
import UserControlls from '../Components/UserControlls';

function Dashboard() {

  const location = useLocation();
  const navigate = useNavigate();
  const {isUserLogged, userId} = location.state || {};

  useEffect(() => {
    if (!isUserLogged) {
      navigate('/', {
        state: {
          message: "Login to access dashboard...",
        }
      });
    }
  }, [isUserLogged, navigate]); // The effect will run when `isUserLogged` changes

  if (!isUserLogged) {
    return null; // Return nothing while the user is being redirected
  }

  return (
    <>
       <DashboardNavbar/>
       <UserControlls userId={userId}/>
    </>
   
  );
}

export default Dashboard;
