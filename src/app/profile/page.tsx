"use client";
import { User } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import ProfileForm from "../ProfileForm";

interface Profile {
  name: string;
  birthday: string;
  gender: string;
  programmingLanguages: string[];
  lookingFor: string[];
  skills: string[];
  timeCommitment: string;
  timezone: string;
  projectVibe: string;
  isBoosted: boolean;
  avatarUrl?: string;
  email?: string;
}

const MOCK_PROFILE = {
  name: "You",
  email: "you@campus.edu",
  skills: ["React", "Figma", "Python"],
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    getDoc(doc(db, "profiles", user.email)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProfile({
          name: data.name || "",
          birthday: data.birthday || "",
          gender: data.gender || "",
          programmingLanguages: data.programmingLanguages || [],
          lookingFor: data.lookingFor || [],
          skills: Array.isArray(data.skills) ? data.skills : (typeof data.skills === "string" ? data.skills.split(",").map((s: string) => s.trim()) : []),
          timeCommitment: data.timeCommitment || "",
          timezone: data.timezone || "",
          projectVibe: data.projectVibe || "",
          isBoosted: data.isBoosted || false,
          avatarUrl: data.avatarUrl || "",
          email: data.email || user.email,
        });
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, [session]);

  if (status === "loading" || loading)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#282a36] via-[#5865f2] to-[#0f172a]">
        <div className="w-full max-w-md mx-auto animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-indigo-900/60 rounded-xl" />
          ))}
        </div>
      </div>
    );
  if (!session) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#282a36] via-[#5865f2] to-[#0f172a] font-sans transition-colors duration-500">
        <button
          onClick={() => signIn("google")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow hover:scale-105 transition-transform text-lg mt-10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Sign in with Google to continue
        </button>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#282a36] via-[#5865f2] to-[#0f172a] flex flex-col items-center py-8 px-4">
      <h2 className="text-2xl font-bold text-white mb-8 tracking-tight font-sans">My Profile</h2>
      <div className="flex flex-col items-center gap-6 mb-8">
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-lg" />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 flex items-center justify-center text-5xl text-white border-4 border-indigo-500 shadow-lg">
            <User className="w-14 h-14" />
          </div>
        )}
        <button
          onClick={() => setShowEdit(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Edit Profile
        </button>
      </div>
      <div className="bg-[#23272a] rounded-xl shadow-lg shadow-black/20 p-6 w-full max-w-xs flex flex-col items-center">
        <div className="font-semibold text-white text-lg mb-1">{profile?.name || user?.name || ""}</div>
        <div className="text-indigo-200 text-sm mb-2">{profile?.email || user?.email || ""}</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.isArray(profile?.skills)
            ? profile.skills.map((skill: string) => (
                <span key={skill} className="bg-indigo-700/80 text-indigo-100 px-3 py-1 rounded-full text-xs font-medium shadow">
                  {skill}
                </span>
              ))
            : null}
        </div>
      </div>
      {showEdit && <ProfileForm onClose={() => setShowEdit(false)} />}
    </div>
  );
} 