"use client";
import { useEffect, useState, useCallback } from "react";
import TinderCard from "react-tinder-card";
import { XMarkIcon, HeartIcon, StarIcon } from "@heroicons/react/24/solid";
import AuthButton from "./AuthButton";
import { useSession, signIn } from "next-auth/react";

interface Profile {
  id: number;
  name: string;
  email: string;
  skills: string[];
  timeCommitment: string;
  timezone: string;
  projectVibe: string;
  isBoosted: boolean;
}

async function fetchProfiles() {
  const res = await fetch("/api/profiles");
  return res.json();
}

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="relative w-[340px] max-w-[95vw] bg-[#23272a]/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6 border border-[#5865f2]/10 hover:scale-105 transition-transform duration-200">
      {profile.isBoosted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white px-3 py-1 rounded-full shadow-lg text-xs font-semibold z-10">
          <StarIcon className="w-4 h-4 text-yellow-300" />
          ★ Priority Match
        </div>
      )}
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 flex items-center justify-center text-3xl text-white font-bold mb-2">
        {profile.name[0]}
      </div>
      <div className="flex flex-col items-center gap-1 mt-2">
        <span className="text-xl font-bold text-white drop-shadow tracking-tight font-sans">{profile.name}</span>
        <span className="text-sm text-indigo-200">{profile.email}</span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {profile.skills.map((skill: string) => (
          <span key={skill} className="bg-indigo-700/80 text-indigo-100 px-3 py-1 rounded-full text-xs font-medium shadow">
            {skill}
          </span>
        ))}
      </div>
      <div className="flex gap-4 mt-2 text-sm text-indigo-100">
        <span className="bg-indigo-900/60 px-2 py-1 rounded-lg">{profile.timeCommitment}</span>
        <span className="bg-fuchsia-900/60 px-2 py-1 rounded-lg">{profile.timezone}</span>
      </div>
      <div className="mt-3 text-center text-indigo-100 italic text-base">“{profile.projectVibe}”</div>
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [swipedIds, setSwipedIds] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles().then((data: Profile[]) => {
      setProfiles(data);
      setLoading(false);
    });
    // Fetch swiped profile IDs for the current user
    fetch("/api/swipes")
      .then(res => res.json())
      .then(data => setSwipedIds(data.swipedIds || []));
  }, []);

  // Filter out already-swiped profiles and self
  const filteredProfiles = profiles.filter(
    (profile) =>
      !swipedIds.includes(profile.email) &&
      profile.email !== session?.user?.email
  );
  const showProfile = filteredProfiles[current];
  const isEmpty = !loading && current >= filteredProfiles.length;

  const handleSwipe = useCallback(
    (dir: "left" | "right" | "up" | "down") => {
      if (!showProfile) return;
      if (dir === "left" || dir === "right") {
        // Record swipe in backend
        fetch("/api/swipes", {
          method: "POST",
          body: JSON.stringify({ to: showProfile.email, direction: dir }),
          headers: { "Content-Type": "application/json" },
        });
        setSwipedIds((prev) => [...prev, showProfile.email]);
        setCurrent((prev) => prev + 1);
      }
    },
    [showProfile]
  );

  if (status === "loading")
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#282a36] via-[#5865f2] to-[#0f172a]">
        <div className="w-full max-w-md mx-auto animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-indigo-900/60 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  if (!session) {
    return (
      <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#282a36] via-[#5865f2] to-[#0f172a] font-sans transition-colors duration-500">
        <div className="w-full" style={{ height: "calc(100vh - 96px)" }}>
          <div className="flex items-center justify-center h-full">
            <button
              onClick={() => signIn("google")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow hover:scale-105 transition-transform text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Sign in with Google to continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#282a36] via-[#5865f2] to-[#0f172a] font-sans transition-colors duration-500 px-4 overflow-hidden">
      <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg text-center select-none tracking-tight">HackMatch</h1>
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {loading ? (
          <div className="w-full max-w-md mx-auto animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-indigo-900/60 rounded-3xl" />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="w-full" style={{ height: "calc(100vh - 96px)" }}>
            <div className="flex flex-col items-center pb-32 justify-center h-full">
              <div className="text-5xl mb-4">🎉</div>
              <div className="text-white text-xl font-semibold mb-2">You’re all caught up!</div>
              <div className="text-indigo-200 text-base mb-4">We’ll ping you when new hackers join.</div>
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-full opacity-50 cursor-not-allowed" disabled>
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center">
            <TinderCard
              key={showProfile?.email}
              onSwipe={handleSwipe}
              preventSwipe={['up', 'down']}
              className="select-none"
            >
              <ProfileCard profile={showProfile} />
            </TinderCard>
            <div className="flex gap-8 mt-8 justify-center">
              <button
                aria-label="Swipe left"
                onClick={() => handleSwipe("left")}
                className="bg-[#23272a] hover:bg-red-600 text-white rounded-full p-4 shadow-lg transition-all duration-200 active:scale-90 border-2 border-[#23272a] hover:border-red-400"
              >
                <XMarkIcon className="w-7 h-7" />
              </button>
              <button
                aria-label="Swipe right"
                onClick={() => handleSwipe("right")}
                className="bg-[#23272a] hover:bg-pink-600 text-white rounded-full p-4 shadow-lg transition-all duration-200 active:scale-90 border-2 border-[#23272a] hover:border-pink-400"
              >
                <HeartIcon className="w-7 h-7" />
              </button>
            </div>
          </div>
        )}
      </div>
      <footer className="text-indigo-200 text-xs mt-10 mb-4 opacity-80 select-none">
        &copy; {new Date().getFullYear()} HackMatch. Not affiliated with any university.
      </footer>
    </div>
  );
}
