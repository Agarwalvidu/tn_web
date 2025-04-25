"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './techboard.css'; // Import your CSS file

const Tech = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  useEffect(() => {
    // Check if there is a mentee or mentor token in localStorage
    const menteeToken = localStorage.getItem('menteeToken');
    const mentorToken = localStorage.getItem('token');

    if (menteeToken) {
      setIsLoggedIn(true);
      setRole('mentee');
    } else if (mentorToken) {
      setIsLoggedIn(true);
      setRole('mentor');
    } else {
      setIsLoggedIn(false);
      setShowRoleSelection(true);
    }
  }, []);

  const handleRoleSelection = (role) => {
    if (role === 'mentee') {
      router.push('/mentee');
    } else if (role === 'mentor') {
      router.push('/mentor');
    } else if (role === 'new') {
      router.push('/home'); // Redirect to the contact page for new users
    }
  };

  if (isLoggedIn) {
    // Redirect based on the role
    if (role === 'mentor') {
      router.push('/mentor');
    } else if (role === 'mentee') {
      router.push('/dashboard');
    }
    return null; // Return null to prevent rendering the rest while redirecting
  }

  return (
    <div className="container">
      {showRoleSelection ? (
        <div className="techboard">
          <h2 className="heading">Oops, you are not associated with TechNeeds yet.</h2>
          <p className="subheading">Already Joined? / Want to Join?</p>
          <div className="button-container">
            <button className="role-button" onClick={() => handleRoleSelection('mentee')}>Mentee</button>
            <button className="role-button" onClick={() => handleRoleSelection('mentor')}>Mentor</button>
            <button className="role-button" onClick={() => handleRoleSelection('new')}>New Person</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Tech;
