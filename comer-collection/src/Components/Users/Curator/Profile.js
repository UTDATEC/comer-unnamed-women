import React from 'react';
import "../Profile.css"

function UserProfileCard({ netid, fullName, password, userType, deactivationDate }) {
  return (
    <div className="user-card-container">
      <div className="user-profile-card">
        
        <h2 id='text-center'>User Information</h2>

        <div className="user-info">
        <div>
            <strong>Net ID:</strong>
            <span>{netid}</span>
          </div>
          <div>
            <strong>Name:</strong>
            <span>{fullName}</span>
          </div>
          <div>
            <strong>Password:</strong>
            <span>{password}</span>
            <span><button className='RedButton'>Reset Password</button></span>
          </div>
          <div>
            <strong>User Type:</strong>
            <span>{userType}</span>
          </div>
          <div>
            <strong>Deactivation Date:</strong>
            <span>{deactivationDate}</span>
          </div>
        </div>

      </div>
    </div>
  );
}


function Profile() {
  return (
    <div className="ProfileContainer">

      <UserProfileCard netid='abc1234567' fullName="John Doe" password="********" userType="Curator" deactivationDate="2024-01-01"/>

    </div>
  );
}

export default Profile;
