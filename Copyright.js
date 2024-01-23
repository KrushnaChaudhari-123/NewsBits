import React from "react";
import { Typography } from "@mui/material";

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <a color="inherit" href="https://mui.com/">
          Your Website
        </a>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  export default Copyright;