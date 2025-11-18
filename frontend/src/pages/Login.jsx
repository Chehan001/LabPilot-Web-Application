import { useState } from "react";
import { loginUser } from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await loginUser(email, password);
      navigate("/home");   // redirect after login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="University Email"
        onChange={(e) => setEmail(e.target.value)}
      /> 
      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br/><br/>

      <button onClick={login}>Login</button>
      <br/><br/>

      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
