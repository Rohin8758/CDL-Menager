import React, { useState } from 'react';
import { auth } from '../firebase';

const SignOut = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');
      localStorage.removeItem('isloggedin');
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div>
      <h2>Logout</h2>
      <p>Are you sure you want to logout?</p>
      <button onClick={() => setIsDialogOpen(true)}>Logout</button>

      {isDialogOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Logout</h3>
            <p>Are you sure you want to logout?</p>
            <button onClick={handleSignOut}>Yes</button>
            <button onClick={() => setIsDialogOpen(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignOut;
