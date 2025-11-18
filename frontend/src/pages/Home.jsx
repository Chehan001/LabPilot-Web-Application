import { auth } from "../firebase/config";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Home Page</h1>
      {user && <p>Welcome, {user.email}</p>}
    </div>
  );
}

