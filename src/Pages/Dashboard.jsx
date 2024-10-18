import {useState, useEffect, React } from 'react'
import {useLocation} from "react-router-dom";

function Dashboard() {

    const location = useLocation();

  const {isUserLogged, userId} = location.state || {};
  useEffect(() => {

  })

  return (
    <div>
        {
            isUserLogged? (
              <p>LOgged with id: {userId}</p>

            ) : (
              <p>Please login to acess the dashboard</p>
            )
        }
    </div>
  )
}

export default Dashboard;
