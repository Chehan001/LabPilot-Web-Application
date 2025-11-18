import { db } from "./config";
import { doc, setDoc } from "firebase/firestore";

export const saveStudentData = async (uid, email, regNumber) => {
  await setDoc(doc(db, "students", uid), {
    email,
    regNumber,
    createdAt: new Date(),
  });
};
