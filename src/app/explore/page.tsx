"use client";
import { useSession, signIn } from "next-auth/react";

export default function ExplorePage() {
  const { data: session, status } = useSession();
  if (status === "loading")
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#282a36] via-[#5865f2] to-[#0f172a]">
        <div className="w-full max-w-md mx-auto animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-indigo-900/60 rounded-xl" />
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#282a36] via-[#5865f2] to-[#0f172a] px-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8 py-16">
        <span className="text-2xl font-bold text-white mb-2 tracking-tight font-sans">Coming soon</span>
        <span className="text-indigo-200 text-lg text-center">New ways to discover teams and projects are on the way!</span>
        <div className="text-5xl">🚀</div>
      </div>
    </div>
  );
} 