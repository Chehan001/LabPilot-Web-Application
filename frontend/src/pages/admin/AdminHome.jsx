import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

export default function AdminHome() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    add: {},
    distribute: {},
    receive: {},
    damage: {},
  });

  const [inventory, setInventory] = useState({});
  const MIN_STOCK = 10; // alert threshold

  // Sum items by name
  const groupByName = (array) => {
    const map = {};
    array.forEach((item) => {
      const name = item.name;
      const count = Number(item.count);
      map[name] = (map[name] || 0) + count;
    });
    return map;
  };

  const fetchSummary = async () => {
    try {
      const addSnap = await getDocs(collection(db, "addEquipment"));
      const distributeSnap = await getDocs(
        collection(db, "distributeEquipment")
      );
      const receiveSnap = await getDocs(collection(db, "receiveEquipment"));
      const damageSnap = await getDocs(collection(db, "damageEquipment"));

      const addList = addSnap.docs.map((doc) => ({
        name: doc.data().equipmentName,
        count: doc.data().count,
      }));

      const distributeList = distributeSnap.docs.map((doc) => ({
        name: doc.data().equipmentName,
        count: doc.data().count,
      }));

      const receiveList = receiveSnap.docs.map((doc) => ({
        name: doc.data().equipmentName,
        count: doc.data().count,
      }));

      const damageList = damageSnap.docs.map((doc) => ({
        name: doc.data().equipmentName,
        count: doc.data().count,
      }));

      const groupedAdd = groupByName(addList);
      const groupedDistribute = groupByName(distributeList);
      const groupedReceive = groupByName(receiveList);
      const groupedDamage = groupByName(damageList);

      setSummary({
        add: groupedAdd,
        distribute: groupedDistribute,
        receive: groupedReceive,
        damage: groupedDamage,
      });

      // Combine all equipment names
      const allNames = new Set([
        ...Object.keys(groupedAdd),
        ...Object.keys(groupedDistribute),
        ...Object.keys(groupedReceive),
        ...Object.keys(groupedDamage),
      ]);

      // Calculate stock
      const inventoryCalc = {};
      allNames.forEach((name) => {
        const totalAdd = groupedAdd[name] || 0;
        const totalDistribute = groupedDistribute[name] || 0;
        const totalReceive = groupedReceive[name] || 0;
        const totalDamage = groupedDamage[name] || 0;

        const available =
          totalAdd - totalDistribute - totalDamage + totalReceive;

        inventoryCalc[name] = {
          available,
          distributed: totalDistribute,
          damaged: totalDamage,
        };
      });

      setInventory(inventoryCalc);
      setLoading(false);
    } catch (err) {
      console.error("Error loading summary:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const MotionCard = ({ children }) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          maxWidth: 1200,
          mx: "auto",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          mb={3}
          sx={{ letterSpacing: 1 }}
        >
          Equipment Inventory Overview
        </Typography>

        {loading ? (
          <Box textAlign="center" mt={4}>
            <CircularProgress />
            <Typography mt={2}>Loading inventory...</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {/* Total Available Stock */}
              <Grid item xs={12} md={4}>
                <MotionCard>
                  <Paper
                    sx={{ p: 3, borderRadius: 3, backgroundColor: "#e8f5e9" }}
                  >
                    <Typography variant="h6">Total Stock Available</Typography>
                    <Typography variant="h3" fontWeight="bold" mt={1}>
                      {Object.values(inventory).reduce(
                        (acc, i) => acc + i.available,
                        0
                      )}
                    </Typography>
                  </Paper>
                </MotionCard>
              </Grid>

              {/* Total Distributed */}
              <Grid item xs={12} md={4}>
                <MotionCard>
                  <Paper
                    sx={{ p: 3, borderRadius: 3, backgroundColor: "#fff3e0" }}
                  >
                    <Typography variant="h6">Total Distributed</Typography>
                    <Typography variant="h3" fontWeight="bold" mt={1}>
                      {Object.values(inventory).reduce(
                        (acc, i) => acc + i.distributed,
                        0
                      )}
                    </Typography>
                  </Paper>
                </MotionCard>
              </Grid>

              {/* Total Damaged */}
              <Grid item xs={12} md={4}>
                <MotionCard>
                  <Paper
                    sx={{ p: 3, borderRadius: 3, backgroundColor: "#ffebee" }}
                  >
                    <Typography variant="h6">Total Damaged</Typography>
                    <Typography variant="h3" fontWeight="bold" mt={1}>
                      {Object.values(inventory).reduce(
                        (acc, i) => acc + i.damaged,
                        0
                      )}
                    </Typography>
                  </Paper>
                </MotionCard>
              </Grid>
            </Grid>

            {/* Equipment Stock Analysis */}
            <Paper
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                backgroundColor: "#f2faffff",
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Equipment Stock Analysis
              </Typography>

              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#c6e3f9ff" }}>
                      <TableCell>
                        <strong>Equipment Name</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Available</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Distributed</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Damaged</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {Object.entries(inventory).map(([name, data]) => (
                      <TableRow
                        key={name}
                        sx={{
                          backgroundColor:
                            data.available <= MIN_STOCK
                              ? "rgba(255,0,0,0.1)"
                              : "inherit",
                        }}
                      >
                        <TableCell>{name}</TableCell>
                        <TableCell
                          align="center"
                          style={{
                            color: data.available <= MIN_STOCK ? "#d32f2f" : "",
                            fontWeight:
                              data.available <= MIN_STOCK ? "bold" : "normal",
                          }}
                        >
                          {data.available}
                        </TableCell>
                        <TableCell align="center">
                          {data.distributed}
                        </TableCell>
                        <TableCell align="center">{data.damaged}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </Paper>
    </Box>
  );
}
