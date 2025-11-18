import { useState } from "react";
import { registerUser } from "../firebase/auth";
import { saveStudentData } from "../firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    if (!email || !password || !regNumber) {
      alert("Please fill all fields");
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await registerUser(email, password);
      const uid = userCredential.user.uid;

      // Save extra data in Firestore
      await saveStudentData(uid, email, regNumber);

      alert("Account created successfully!");
      navigate("/"); // go to login page
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Sign Up</h1>
      <input
        type="email"
        placeholder="University Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />
      <input
        type="text"
        placeholder="Register Number"
        value={regNumber}
        onChange={(e) => setRegNumber(e.target.value)}
      />
      <br /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <button onClick={signup}>Create Account</button>
      <br /><br />
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}
