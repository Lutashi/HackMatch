"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import ProfileForm from "./ProfileForm";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [showProfile, setShowProfile] = useState(false);

  if (status === "loading") return <div>Loading...</div>;
  if (!session)
    return (
      <button onClick={() => signIn("google")} className="px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow hover:scale-105 transition-transform">
        Sign in with Google
      </button>
    );
  return (
    <div className="flex items-center gap-3">
      <span className="text-white font-medium">{session.user?.email}</span>
      <button
        onClick={() => setShowProfile(true)}
        className="px-3 py-1 bg-indigo-700 text-white rounded-full font-semibold hover:scale-105 transition-transform"
      >
        My Profile
      </button>
      <button onClick={() => signOut()} className="px-3 py-1 bg-gray-700 text-white rounded-full font-semibold hover:scale-105 transition-transform">
        Sign out
      </button>
      {showProfile && <ProfileForm onClose={() => setShowProfile(false)} />}
    </div>
  );
} 