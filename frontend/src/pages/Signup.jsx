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
import { motion } from "framer-motion";

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
      const uid = userCredential.user.uid;

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
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
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
            <PersonAddIcon fontSize="large" />
          </Avatar>

          <Typography variant="h5" fontWeight="bold" color="#fff" mb={2}>
            Create Account
          </Typography>

          <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.3)" }} />

          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          {/* Email */}
          <TextField
            fullWidth
            label="University Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              sx: {
                color: "rgba(0,0,0,0.7)",
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

          {/* Reg Number */}
          <TextField
            fullWidth
            label="Register Number"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            InputLabelProps={{
              sx: {
                color: "rgba(0,0,0,0.7)",
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

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              sx: {
                color: "rgba(0,0,0,0.7)",
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
              background: "linear-gradient(90deg, #1565c0, #42a5f5)",
              "&:hover": {
                background: "linear-gradient(90deg, #0d47a1, #1976d2)",
              },
              py: 1.4,
              fontWeight: "bold",
              borderRadius: "10px",
              mb: 2,
            }}
            onClick={signup}
          >
            Create Account
          </Button>

          <Grid container justifyContent="center">
            <Grid item>
              <Typography sx={{ color: "#fff" }}>
                Already have an account?{" "}
                <Link
                  to="/"
                  style={{
                    color: "#fff   ",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
}
