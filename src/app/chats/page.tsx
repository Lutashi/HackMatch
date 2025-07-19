"use client";
import { MessageCircle } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

const MOCK_CHATS = [
  { id: 1, name: "Alex Kim", last: "Hey! Ready for the hackathon?" },
  { id: 2, name: "Priya Singh", last: "Let’s sync up tomorrow." },
  { id: 3, name: "Sam Lee", last: "Sent you the Figma link!" },
];

export default function ChatsPage() {
  const { data: session, status } = useSession();
  if (status === "loading")
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#282a36] via-[#5865f2] to-[#0f172a]">
        <div className="w-full max-w-md mx-auto animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 bg-[#23272a] rounded-xl shadow-lg shadow-black/20 p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-indigo-900 rounded w-1/2" />
                <div className="h-3 bg-indigo-800 rounded w-1/3" />
              </div>
            </div>
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
      <h2 className="text-2xl font-bold text-white mb-8 tracking-tight font-sans">Chats</h2>
      <div className="w-full max-w-md mx-auto space-y-8">
        {MOCK_CHATS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-5xl mb-4">🎉</div>
            <div className="text-lg text-white mb-2">You’re all caught up!</div>
            <div className="text-indigo-200 mb-4">We’ll ping you when new hackers join.</div>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded-full opacity-50 cursor-not-allowed" disabled>
              Refresh
            </button>
          </div>
        ) : (
          MOCK_CHATS.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center gap-4 bg-[#23272a] rounded-xl shadow-lg shadow-black/20 p-4 transition-all duration-150 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                {chat.name[0]}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white text-[1.125rem]">{chat.name}</div>
                <div className="text-indigo-200 text-sm truncate">{chat.last}</div>
              </div>
              <MessageCircle className="text-indigo-400 transition-all duration-150 ease-out" />
            </div>
          ))
        )}
      </div>
    </div>
  );
} 