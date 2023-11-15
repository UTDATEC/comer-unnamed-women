import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Profile.css";

function Profile() {
  const [user, setUser] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // only for demonstration, will fetch the 'current' user when log in is done
        const userData = response.data.data[0];
        setUser(userData);
        console.log("User:", userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-card-container">
      <div className="user-profile-card">
        <h2 id="text-center">User Information</h2>
        <div className="user-info">
          <div>
            <strong>Net ID:</strong>
            <span>{user.email}</span>
          </div>
          <div>
            <strong>Name:</strong>
            <span>{`${user.given_name} ${user.family_name}`}</span>
          </div>
          <div>
            <strong>Password:</strong>
            <span>{"********"}</span>
            <span>
              <button className="RedButton">Reset Password</button>
            </span>
          </div>
          <div>
            <strong>User Type:</strong>
            <span>{user.is_admin ? "Admin" : "Curator"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
