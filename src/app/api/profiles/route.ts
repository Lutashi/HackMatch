import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

export async function GET() {
  const snapshot = await getDocs(collection(db, "profiles"));
  const profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(profiles);
} 