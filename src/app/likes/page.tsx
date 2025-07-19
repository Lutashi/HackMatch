"use client";
import { Heart } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

interface Profile {
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}

export default function LikesPage() {
  const { data: session, status } = useSession();
  const [likes, setLikes] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch("/api/likes")
      .then(res => res.json())
      .then(data => {
        setLikes(data);
        setLoading(false);
      });
  }, [session]);

  if (status === "loading" || loading)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#282a36] via-[#5865f2] to-[#0f172a]">
        <div className="w-full max-w-md mx-auto animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
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
      <h2 className="text-2xl font-bold text-white mb-8 tracking-tight font-sans">Liked Profiles</h2>
      <div className="w-full max-w-lg mx-auto grid grid-cols-2 sm:grid-cols-3 gap-8 p-4 bg-black/30 border-2 border-dotted border-indigo-400 rounded-2xl">
        {likes.length === 0 ? (
          <div className="col-span-2 sm:col-span-3 flex flex-col items-center justify-center py-8">
            <div className="text-5xl mb-2">💜</div>
            <span className="text-indigo-200 text-lg mb-2">No liked profiles yet.</span>
            <span className="text-indigo-400 text-sm">Start swiping to find your matches!</span>
          </div>
        ) : likes.map((profile) => {
          // Only show first name, hide surname and email
          const firstName = profile.name.split(' ')[0];
          return (
            <div key={profile.id} className="flex flex-col items-center justify-center bg-[#23272a] rounded-2xl shadow-lg shadow-black/20 p-8 min-h-[180px] min-w-[140px] transition-all duration-150 hover:scale-105">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 flex items-center justify-center mb-4">
                <Heart className="text-white w-10 h-10" />
              </div>
              <span className="text-white text-lg font-semibold text-center">{firstName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 