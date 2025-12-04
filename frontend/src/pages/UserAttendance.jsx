import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/config";

export default function UserAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchAttendance = async () => {
      try {
        const q = query(
          collection(db, "attendance"),
          where("regNo", "==", user.email?.split("@")[0].toUpperCase())
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAttendance(data);
      } catch (err) {
        setError("Failed to load attendance");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        My Attendance
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && attendance.length === 0 && (
        <Alert severity="info">No attendance records found.</Alert>
      )}

      {!loading && attendance.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Time</strong></TableCell>
                <TableCell><strong>Lab</strong></TableCell>
                <TableCell><strong>Badge</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {attendance.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.lab}</TableCell>
                  <TableCell>{row.badge}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
