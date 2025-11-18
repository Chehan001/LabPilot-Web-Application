import React, { useState } from "react";
import { loginUser } from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Avatar,
  Divider,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const login = async () => {
    if (!email || !password) {
      showMessage("warning", "Please enter email and password.");
      return;
    }
    try {
      await loginUser(email, password);
      showMessage("success", "Login successful!");
      setTimeout(() => navigate("/home"), 800);
    } catch (error) {
      showMessage("error", error.message);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: "20px",
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <Avatar
          sx={{ bgcolor: "#2196f3", mx: "auto", mb: 2, width: 60, height: 60 }}
        >
          <LockOutlinedIcon fontSize="large" />
        </Avatar>

        <Typography variant="h5" fontWeight="bold" color="#1976d2" mb={2}>
          Sign In
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {message.text && <Alert severity={message.type}>{message.text}</Alert>}

        <TextField
          fullWidth
          label="University Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
            mb: 2,
            py: 1.2,
            fontWeight: "bold",
          }}
          onClick={login}
        >
          Login
        </Button>

        <Grid container justifyContent="space-between">
          <Grid item>
            <Link to="/signup" style={{ color: "#1976d2" }}>
               Sign Up
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
