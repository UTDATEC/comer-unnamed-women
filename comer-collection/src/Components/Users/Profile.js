import React, { useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router";

const Profile = (props) => {

  const { appUser, setAppUser, selectedNavItem, setSelectedNavItem } = props;
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedNavItem("Profile");
  }, [])

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
              <span>{appUser.email}</span>
            </div>
            <div>
              <strong>Name: </strong>
              <span>{`${appUser.given_name} ${appUser.family_name}`}</span>
            </div>
            <div>
              <strong>Password Last Updated: </strong>
              <span>{new Date(appUser.pw_updated).toLocaleString()}</span>
              <span style={{ paddingLeft: "10px" }}>
                <Button variant="outlined" color="primary" onClick={() => {
                  navigate('/Account/ChangePassword')
                }}>
                  <Typography>Change Password</Typography>
                </Button>
              </span>
            </div>
            <div>
              <strong>User Type: </strong>
              <span>{appUser.is_admin ? "Admin" : "Curator"}</span>
            </div>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Profile;
