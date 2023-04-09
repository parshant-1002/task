import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";


export const validEmail = new RegExp(
    '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'
 );

