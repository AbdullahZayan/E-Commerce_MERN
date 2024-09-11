import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { brown } from "@mui/material/colors";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/baseURL";
import {useAuth} from "../context/Auth/AuthContext"
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const {login} = useAuth();

  

  const onSubmit = async () => {
    
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    //validate the form data
    if( !email || !password) {
        setError('Check submitted data')
        return;
    }



    // Make the call to API to create the user
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      setError(
        "Unable to Login user, please try sure your email or password!"
      );
      return;
    }

    const token = await response.json();

    if(!token) {
        setError("Incorrect token")
        return;
    }

    login(email, token)

    navigate("/")
  };
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Typography variant="h4">Login to Your Account</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
            border: 1,
            padding: 2,
            borderColor: brown,
          }}
        >
         
          <TextField inputRef={emailRef} label="Email" name="email" />
          <TextField
            inputRef={passwordRef}
            type="password"
            label="Password"
            name="password"
          />
          <Button onClick={onSubmit} variant="contained">
            Login
          </Button>
          {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
