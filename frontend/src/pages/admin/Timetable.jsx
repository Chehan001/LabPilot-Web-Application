import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function Timetable() {
  const [tabIndex, setTabIndex] = useState(0);

  const [badge, setBadge] = useState("");
  const [lab, setLab] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [searchLab, setSearchLab] = useState("");
  const [searchBadge, setSearchBadge] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const handleAddSlot = async () => {
    if (!badge || !lab || !day || !startTime || !endTime) {
      alert("Please complete all fields.");
      return;
    }

    await addDoc(collection(db, "timetable"), {
      badge,
      lab,
      day,
      startTime,
      endTime,
      createdAt: new Date(),
    });

    alert("Time slot added successfully!");

    setBadge("");
    setLab("");
    setDay("");
    setStartTime("");
    setEndTime("");
  };

  const fetchLabTimetable = async () => {
    const q = query(collection(db, "timetable"), where("lab", "==", searchLab));
    const snapshot = await getDocs(q);
    setTimeSlots(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const fetchBadgeTimetable = async () => {
    const q = query(
      collection(db, "timetable"),
      where("badge", "==", searchBadge)
    );
    const snapshot = await getDocs(q);
    setTimeSlots(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const dayColors = {
    Monday: "#E3F2FD",
    Tuesday: "#FCE4EC",
    Wednesday: "#E8F5E9",
    Thursday: "#FFF3E0",
    Friday: "#F3E5F5",
  };

  return (
    <Box p={3}>


      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={(e, v) => setTabIndex(v)}
        centered
        TabIndicatorProps={{
          style: {
            height: 4,
            borderRadius: 4,
            background: "linear-gradient(90deg,#1976d2,#42a5f5)",
          },
        }}
        sx={{
          mb: 4,
          "& .MuiTab-root": {
            fontSize: "16px",
            fontWeight: 700,
            textTransform: "none",
            px: 3,
            transition: "0.2s",
            "&:hover": { color: "#1976d2" },
          },
        }}
      >
        <Tab label="Add Time Slot" />
        <Tab label="Show Timetable" />
      </Tabs>



      {/* ADD TIME SLOT */}
      {tabIndex === 0 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 5,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              maxWidth: 600,
              mx: "auto",
              mt: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "22px",
                mb: 3,
                textAlign: "center",
              }}
            >
              Add New Time Slot
            </Typography>

            <Grid container spacing={4}>
              {/* Badge */}
              <Grid item xs={12}>
                <TextField
                  label="Badge"
                  fullWidth
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.75)",
                      transition: "0.25s",
                      "&:hover": {
                        background: "rgba(255,255,255,0.9)",
                        boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 14px rgba(25,118,210,0.25)",
                      },
                    },
                  }}
                />
              </Grid>

              {/* Lab */}
              <Grid item xs={12}>
                <TextField
                  label="Lab Name"
                  fullWidth
                  value={lab}
                  onChange={(e) => setLab(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.75)",
                      transition: "0.25s",
                      
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} mt={3}>
              {/* Day */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Select Day"
                  fullWidth
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  helperText={!day ? "Please select a day to continue" : ""}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.75)",
                      transition: "0.25s",
                      "&:hover": {
                        background: "rgba(255,255,255,0.9)",
                        boxShadow: "0 3px 12px rgba(0,0,0,0.06)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 4px 14px rgba(25,118,210,0.25)",
                      },
                    },
                  }}
                >
                  {days.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Start Time */}
              <Grid item xs={12} sm={6}>
                <TextField
                  type="time"
                  label="Start Time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.75)",
                    },
                  }}
                />
              </Grid>

              {/* End Time */}
              <Grid item xs={12} sm={6}>
                <TextField
                  type="time"
                  label="End Time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.75)",
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* BUTTON */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.3,
                borderRadius: "50px",
                fontSize: "17px",
                fontWeight: 600,
                textTransform: "none",
                background: "linear-gradient(90deg, #1565c0, #42a5f5)",
                boxShadow: "0px 4px 16px rgba(25,118,210,0.35)",
                transition: "0.25s",
                "&:hover": {
                  boxShadow: "0px 6px 20px rgba(25,118,210,0.45)",
                },
              }}
              onClick={handleAddSlot}
            >
              Submit
            </Button>
          </Paper>
        </motion.div>
      )}



      {/* SHOW TIMETABLE */}
      {tabIndex === 1 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 5,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              maxWidth: 900,
              mx: "auto",
              boxShadow: "0 4px 18px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Search Timetable
            </Typography>

            <Grid container spacing={4}>
              {/* Search Lab */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Search by Lab Name"
                  fullWidth
                  value={searchLab}
                  onChange={(e) => setSearchLab(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.75)",
                    },
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    py: 1.3,
                    borderRadius: "40px",
                    background: "linear-gradient(90deg,#1976d2,#42a5f5)",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                  }}
                  onClick={fetchLabTimetable}
                >
                  View Lab Timetable
                </Button>
              </Grid>

              {/* Search Badge */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Search by Badge"
                  fullWidth
                  value={searchBadge}
                  onChange={(e) => setSearchBadge(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      background: "rgba(255,255,255,0.75)",
                    },
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    py: 1.3,
                    borderRadius: "40px",
                    background: "linear-gradient(90deg,#1976d2,#42a5f5)",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                  }}
                  onClick={fetchBadgeTimetable}
                >
                  View Badge Timetable
                </Button>
              </Grid>
            </Grid>
          </Paper>



          {/* Timetable Results */}
          <Card
            elevation={6}
            sx={{
              mt: 4,
              borderRadius: 5,
              background: "rgba(255,255,255,0.93)",
              boxShadow: "0px 4px 14px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                Timetable Results
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Day</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Badge</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Lab</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Start</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>End</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {timeSlots.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        No records found.
                      </TableCell>
                    </TableRow>
                  )}

                  {timeSlots.map((slot) => (
                    <TableRow
                      key={slot.id}
                      sx={{
                        backgroundColor: dayColors[slot.day],
                        transition: "0.25s",
                        "&:hover": {
                          transform: "scale(1.01)",
                          boxShadow: "0px 4px 14px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <TableCell>{slot.day}</TableCell>
                      <TableCell>{slot.badge}</TableCell>
                      <TableCell>{slot.lab}</TableCell>
                      <TableCell>{slot.startTime}</TableCell>
                      <TableCell>{slot.endTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
}
