import React, { useState, useContext, createContext } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from "@mui/material/InputLabel";
import Input from '@mui/material/Input';
import { FormHelperText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import a from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
//import Copyright from "../Components/Copyright";
import Copyright from "./Copyright";

//import { SomeContext } from '../App';


const theme = createTheme();

export default function Login() {

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const [email, password] = [data.get('email'), data.get('password')];
    const result = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
      })//
    }).then(res => res.json());

    console.log(result);
    if (result.status !== 'ok') {
      alert(result.error)
    } else {
      localStorage.setItem('proUser', JSON.stringify(result.user))
      localStorage.setItem('resultemail', result.email);
      localStorage.setItem("isAdmin", result.result);

      //location.assign('http://localhost:5173/');
      navigate('../', { replace: true });
    }

  };


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Grid container>
              <Grid item xs>
                <a
                  href="#"
                  variant="body2"
                  onClick={() => navigate('../ChangePasswordOne', { replace: true })}
                >
                  Forgot password?
                </a>
              </Grid>
              <Grid item>
                <a
                  href="#"
                  variant="body2"
                  onClick={() => navigate('../signup', { replace: true })}
                >
                  {"Don't have an account? Sign Up"}
                </a>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}