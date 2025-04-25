"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './techboard.css';

const Tech = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Check if there is a mentee or mentor token in localStorage
    const menteeToken = localStorage.getItem('menteeToken');
    const mentorToken = localStorage.getItem('token');

    if (menteeToken) {
      setIsLoggedIn(true);
      setRole('mentee');
      setShouldRedirect(true);
    } else if (mentorToken) {
      setIsLoggedIn(true);
      setRole('mentor');
      setShouldRedirect(true);
    } else {
      setIsLoggedIn(false);
      setShowRoleSelection(true);
    }
  }, []);

  useEffect(() => {
    if (shouldRedirect) {
      if (role === 'mentor') {
        router.push('/mentor');
      } else if (role === 'mentee') {
        router.push('/dashboard');
      }
    }
  }, [shouldRedirect, role, router]);

  const handleRoleSelection = (selectedRole) => {
    if (selectedRole === 'mentee') {
      router.push('/mentee');
    } else if (selectedRole === 'mentor') {
      router.push('/mentor');
    } else if (selectedRole === 'new') {
      router.push('/home');
    }
  };

  if (!showRoleSelection && !shouldRedirect) {
    return <p>Loading...</p>;
  }

  return (
    <div className="tech-container">
      {showRoleSelection && (
        <div className="techboard">
          <h2 className="heading">Oops, you are not associated with TechNeeds yet.</h2>
          <p className="subheading">Already Joined? / Want to Join?</p>
          <div className="button-container">
            <button className="role-button" onClick={() => handleRoleSelection('mentee')}>Mentee</button>
            <button className="role-button" onClick={() => handleRoleSelection('mentor')}>Mentor</button>
            <button className="role-button" onClick={() => handleRoleSelection('new')}>New Person</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tech;