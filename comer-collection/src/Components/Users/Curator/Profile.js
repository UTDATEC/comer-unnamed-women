// UserProfileCard.jsx
import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';

function UserProfileCard({ netid, fullName, password, userType, deactivationDate }) {
  return (
    <Container style={{ paddingTop: '30px' }} maxWidth="xs">
      <Card style={{ border: '1px solid lightgrey' }}>
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={{ fontWeight: 'bold' }}
          >
            User Information
          </Typography>
          <div>
            <div>
              <strong>Net ID:</strong>
              <span>{netid}</span>
            </div>
            <div style={{ paddingTop: '10px' }}>
              <strong>Name:</strong>
              <span>{fullName}</span>
            </div>
            <div style={{ paddingTop: '10px' }}>
              <strong>Password:</strong>
              <span>{password}</span>
              <span style={{ paddingLeft: '10px' }}>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'red',
                      color: 'white',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  Reset Password
                </Button>
              </span>
            </div>
            <div style={{ paddingTop: '10px' }}>
              <strong>User Type:</strong>
              <span>{userType}</span>
            </div>
            <div style={{ paddingTop: '10px' }}>
              <strong>Deactivation Date:</strong>
              <span>{deactivationDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

export default UserProfileCard;
