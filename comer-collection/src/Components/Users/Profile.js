import React from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";

const Profile = (props) => {

  const { user, setUser, selectedNavItem, setSelectedNavItem } = props;
  setSelectedNavItem("Profile");

  return (
    <Container style={{ paddingTop: "30px" }} maxWidth="xs">
      <Card style={{ border: "1px solid lightgrey" }}>
        <CardContent>
          <Stack direction="column" spacing={2}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={{ fontWeight: "bold" }}
          >
            User Information
          </Typography>
            <div>
              <strong>Net ID: </strong>
              <span>{user.email}</span>
            </div>
            <div>
              <strong>Name: </strong>
              <span>{`${user.given_name} ${user.family_name}`}</span>
            </div>
            <div>
              <strong>Password Last Updated: </strong>
              <span>{new Date(user.pw_updated).toLocaleString()}</span>
              <span style={{ paddingLeft: "10px" }}>
                <Button variant="outlined" color="primary" disabled>
                  Change Password
                </Button>
              </span>
            </div>
            <div>
              <strong>User Type: </strong>
              <span>{user.is_admin ? "Admin" : "Curator"}</span>
            </div>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Profile;
