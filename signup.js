import React, { useState, useContext, createContext } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import a from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import Copyright from "./Copyright";
import axios from 'axios';

const theme = createTheme();

export default function SignUp() {

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(event.currentTarget);
    const data = new FormData(event.currentTarget);
    const [username, password, firstname, lastname, dateofbirth, mothername] =
      [data.get('email'), data.get('password'), data.get('firstName'), data.get('lastName'), data.get('dateofbirth'), data.get('mothername')];
    console.log(dateofbirth, mothername);
    const headers = { 
      'Content-Type': 'application/json'
  }
    try {
      const result = await axios.post('http://localhost:8080/api/register', {username,
      password,
      firstname,
      lastname,
      dateofbirth,
      mothername,
      isAdmin: false
      }, {headers});
    console.log(result);
    if (result.data.status !== 'ok') {
      alert(result.error);
    } else {
      alert(result.data.data);
      setTimeout(() => navigate('../login', { replace: true }));
    }
  } catch (error) {
    alert("Error: Internal server Error")
  }
};

return (
  <div>
    <ThemeProvider theme={theme}  >
      <Container component="main" maxWidth="xs" style={{ background: '#fff', marginTop: '-60px' }} className="bg" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="motherName"
                  label="Mother Name"
                  name="mothername"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="dateofbirth"
                  type="date"
                  id="dateOfBirth"
                  autoComplete="date-of-birth"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>

            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={() => console.log('sign up')}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <a href="#"
                  onClick={() => navigate('../login', { replace: true })}
                  variant="body2">
                  Already have an account? Sign in
                </a>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  </div>
);
}