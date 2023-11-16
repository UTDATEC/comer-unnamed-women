import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

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
    <Container style={{ paddingTop: "30px" }} maxWidth="xs">
      <Card style={{ border: "1px solid lightgrey" }}>
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={{ fontWeight: "bold" }}
          >
            User Information
          </Typography>
          <div>
            <div>
              <strong>Net ID: </strong>
              <span>{user.email}</span>
            </div>
            <div style={{ paddingTop: "10px" }}>
              <strong>Name: </strong>
              <span>{`${user.given_name} ${user.family_name}`}</span>
            </div>
            <div style={{ paddingTop: "10px" }}>
              <strong>Password: </strong>
              <span>{"********"}</span>
              <span style={{ paddingLeft: "10px" }}>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    "&:hover": {
                      backgroundColor: "red",
                      color: "white",
                      fontWeight: "bold",
                    },
                  }}
                >
                  Reset Password
                </Button>
              </span>
            </div>
            <div style={{ paddingTop: "10px" }}>
              <strong>User Type: </strong>
              <span>{user.is_admin ? "Admin" : "Curator"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Profile;
