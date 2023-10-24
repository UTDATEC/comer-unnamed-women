import React from 'react';
import AdminNav from '../Nav/AdminNav';
import "./Profile.css"

function UserProfileCard({ fullName, userType }) {
  return (
    <div className="user-card-container">
      <div className="user-profile-card">
        
        <h2>User Information</h2>

        <div className="user-info">

          <div>
            <strong>Name:</strong>
            <span>{fullName}</span>
          </div>
          <div>
            <strong>User Type:</strong>
            <span>{userType}</span>
          </div>
        </div>

      </div>
    </div>
  );
}


function Profile() {
  return (
    <div className="ProfileContainer">

      <UserProfileCard fullName="John Doe" userType="Admin" />

    </div>
  );
}

export default Profile;
