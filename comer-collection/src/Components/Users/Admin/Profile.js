import React from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

const Profile = (props) => {

  const { user, setUser } = props;


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
