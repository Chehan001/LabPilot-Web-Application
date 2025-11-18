import { auth } from "./config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// SIGN UP
export const registerUser = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// LOGIN
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};
