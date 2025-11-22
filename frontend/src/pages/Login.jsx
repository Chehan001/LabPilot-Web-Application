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
import { motion } from "framer-motion";

// Admin 
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

// path --> admin dashboard
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

    //  ADMIN LOGIN 
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      showMessage("success", "Admin login successful!");

      //admin locally
      localStorage.setItem("admin", "true");

      // ALSO authenticate admin in Firebase to allow Firestore writes
      try {
        await loginUser(ADMIN_EMAIL, ADMIN_PASSWORD);
      } catch (err) {
        console.error("Admin Firebase login error:", err);
      }

      setTimeout(() => {
        navigate("/admin");
        window.location.reload(); // Ensures Firebase session is active
      }, 800);

      return;
    }

    // USER LOGIN 
    try {
      const user = await loginUser(email, password);

      // Ensure Firebase session exists
      if (user && user.user) {
        showMessage("success", "Login successful!");

        setTimeout(() => {
          navigate("/home");
          window.location.reload(); // Important for Firestore access
        }, 800);
      }
    } catch (error) {
      showMessage("error", error.message);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: "100%" }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: "25px",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "rgba(255,255,255,0.25)",
              color: "#fff",
              mx: "auto",
              mb: 2,
              width: 65,
              height: 65,
              backdropFilter: "blur(10px)",
            }}
          >
            <LockOutlinedIcon fontSize="large" />
          </Avatar>

          <Typography variant="h5" fontWeight="bold" color="#fff" mb={2}>
            Welcome Back
          </Typography>

          <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.3)" }} />

          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          <TextField
            fullWidth
            label="University Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              sx: {
                color: "rgba(0, 0, 0, 0.7)",
                "&.Mui-focused": { color: "#0c0472ff" },
              },
            }}
            InputProps={{
              sx: {
                backgroundColor: "rgba(255,255,255,0.85)",
                borderRadius: "10px",
              },
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              sx: {
                color: "rgba(0, 0, 0, 0.7)",
                "&.Mui-focused": { color: "#0c0472ff" },
              },
            }}
            InputProps={{
              sx: {
                backgroundColor: "rgba(255,255,255,0.85)",
                borderRadius: "10px",
              },
            }}
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #8ebbeeff, #4e9ad8ff)",
              "&:hover": {
                background: "linear-gradient(90deg, #0d47a1, #1976d2)",
              },
              py: 1.4,
              fontWeight: "bold",
              borderRadius: "10px",
              mb: 2,
            }}
            onClick={login}
          >
            Login
          </Button>

          <Grid container justifyContent="center">
            <Grid item>
              <Typography sx={{ color: "#fff" }}>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
}
