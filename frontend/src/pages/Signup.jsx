import React, { useState } from "react";
import { registerUser } from "../firebase/auth";
import { saveStudentData } from "../firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Divider,
  Alert,
  Grid,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const signup = async () => {
    if (!email || !password || !regNumber) {
      showMessage("warning", "Please fill all fields");
      return;
    }
    try {
      const userCredential = await registerUser(email, password);
      const uid = userCredential.user.uid; // identify the newly created user
      await saveStudentData(uid, email, regNumber);
      showMessage("success", "Account created successfully!");
      setTimeout(() => navigate("/"), 800);
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
          <PersonAddIcon fontSize="large" />
        </Avatar>

        <Typography variant="h5" fontWeight="bold" color="#1976d2" mb={2}>
          Sign Up
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {message.text && <Alert severity={message.type}>{message.text}</Alert>}

        <TextField
          fullWidth
          label="University Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Register Number"
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value)}
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
          onClick={signup}
        >
          Create Account
        </Button>

        <Grid container justifyContent="space-between">
          <Grid item>
            <Link to="/" style={{ color: "#1976d2" }}>
             Login
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
