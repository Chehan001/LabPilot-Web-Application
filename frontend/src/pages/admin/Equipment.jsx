import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";

import { db, auth } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Equipment() {
  const [tabIndex, setTabIndex] = useState(0);

  // FORM STATES
  const [addData, setAddData] = useState({
    equipmentName: "",
    count: "",
    labName: "",
  });

  const [distributeData, setDistributeData] = useState({
    badgeNumber: "",
    equipmentName: "",
    count: "",
    labName: "",
  });

  const [receiveData, setReceiveData] = useState({
    badgeNumber: "",
    equipmentName: "",
    count: "",
    labName: "",
  });

  const [damageData, setDamageData] = useState({
    badgeNumber: "",
    studentRegNumber: "",
    equipmentName: "",
    count: "",
    labName: "",
  });

  //  AUTH + FIRESTORE SUBMITTER
  const handleSubmit = async (collectionName, data, resetFunc) => {
    if (!auth.currentUser && !localStorage.getItem("admin")) {
      alert("You must be logged in as Admin to add equipment.");
      return;
    }

    try {
      await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
      });

      alert("Saved successfully!");
      resetFunc();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data: " + error.message);
    }
  };

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Tabs value={tabIndex} onChange={handleTabChange} centered sx={{ mb: 3 }}>
        <Tab label="Add Equipment" />
        <Tab label="Distribute Equipment" />
        <Tab label="Receive Equipment" />
        <Tab label="Damage Equipment" />
      </Tabs>

      {/* ADD EQUIPMENT */}
      {tabIndex === 0 && (
        <Card sx={{ maxWidth: 500, mx: "auto", p: 2 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Add Equipment
            </Typography>

            <TextField
              label="Equipment Name"
              fullWidth
              value={addData.equipmentName}
              onChange={(e) =>
                setAddData({ ...addData, equipmentName: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Count"
              type="number"
              fullWidth
              value={addData.count}
              onChange={(e) =>
                setAddData({ ...addData, count: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Lab Name"
              fullWidth
              value={addData.labName}
              onChange={(e) =>
                setAddData({ ...addData, labName: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={() =>
                handleSubmit("addEquipment", addData, () =>
                  setAddData({ equipmentName: "", count: "", labName: "" })
                )
              }
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* DISTRIBUTE EQUIPMENT */}
      {tabIndex === 1 && (
        <Card sx={{ maxWidth: 500, mx: "auto", p: 2 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Distribute Equipment
            </Typography>

            <TextField
              label="Badge Number"
              fullWidth
              value={distributeData.badgeNumber}
              onChange={(e) =>
                setDistributeData({
                  ...distributeData,
                  badgeNumber: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Equipment Name"
              fullWidth
              value={distributeData.equipmentName}
              onChange={(e) =>
                setDistributeData({
                  ...distributeData,
                  equipmentName: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Count"
              type="number"
              fullWidth
              value={distributeData.count}
              onChange={(e) =>
                setDistributeData({ ...distributeData, count: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Lab Name"
              fullWidth
              value={distributeData.labName}
              onChange={(e) =>
                setDistributeData({ ...distributeData, labName: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={() =>
                handleSubmit("distributeEquipment", distributeData, () =>
                  setDistributeData({
                    badgeNumber: "",
                    equipmentName: "",
                    count: "",
                    labName: "",
                  })
                )
              }
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* RECEIVE EQUIPMENT */}
      {tabIndex === 2 && (
        <Card sx={{ maxWidth: 500, mx: "auto", p: 2 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Receive Equipment
            </Typography>

            <TextField
              label="Badge Number"
              fullWidth
              value={receiveData.badgeNumber}
              onChange={(e) =>
                setReceiveData({
                  ...receiveData,
                  badgeNumber: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Equipment Name"
              fullWidth
              value={receiveData.equipmentName}
              onChange={(e) =>
                setReceiveData({
                  ...receiveData,
                  equipmentName: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Count"
              type="number"
              fullWidth
              value={receiveData.count}
              onChange={(e) =>
                setReceiveData({ ...receiveData, count: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Lab Name"
              fullWidth
              value={receiveData.labName}
              onChange={(e) =>
                setReceiveData({ ...receiveData, labName: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={() =>
                handleSubmit("receiveEquipment", receiveData, () =>
                  setReceiveData({
                    badgeNumber: "",
                    equipmentName: "",
                    count: "",
                    labName: "",
                  })
                )
              }
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* DAMAGE EQUIPMENT */}
      {tabIndex === 3 && (
        <Card sx={{ maxWidth: 500, mx: "auto", p: 2 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Damage Equipment
            </Typography>

            <TextField
              label="Badge Number"
              fullWidth
              value={damageData.badgeNumber}
              onChange={(e) =>
                setDamageData({
                  ...damageData,
                  badgeNumber: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Student Register Number"
              fullWidth
              value={damageData.studentRegNumber}
              onChange={(e) =>
                setDamageData({
                  ...damageData,
                  studentRegNumber: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Equipment Name"
              fullWidth
              value={damageData.equipmentName}
              onChange={(e) =>
                setDamageData({
                  ...damageData,
                  equipmentName: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Count"
              type="number"
              fullWidth
              value={damageData.count}
              onChange={(e) =>
                setDamageData({ ...damageData, count: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Lab Name"
              fullWidth
              value={damageData.labName}
              onChange={(e) =>
                setDamageData({ ...damageData, labName: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={() =>
                handleSubmit("damageEquipment", damageData, () =>
                  setDamageData({
                    badgeNumber: "",
                    studentRegNumber: "",
                    equipmentName: "",
                    count: "",
                    labName: "",
                  })
                )
              }
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
