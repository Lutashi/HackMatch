"use client";
import React, { useState } from "react";
import { Settings, Flame, Heart, MessageCircle, User, Compass } from "lucide-react";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { signOut, useSession, signIn } from "next-auth/react";

const navItems = [
  { href: "/", label: "Home", icon: Flame },
  { href: "/likes", label: "Likes", icon: Heart },
  { href: "/chats", label: "Chats", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/explore", label: "Explore", icon: Compass },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#2e2fee] to-[#8b5cf6] dark">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <span className="font-bold text-xl bg-gradient-to-r from-[#8b5cf6] to-[#2e2fee] bg-clip-text text-transparent select-none">
          HackMatch
        </span>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition duration-200"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
        >
          <Settings className="text-gray-200" />
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-md mx-auto px-2 pb-20">{children}</main>

      {/* Footer nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 w-full max-w-md mx-auto px-2 pb-2">
        <div className="flex justify-between items-center rounded-2xl backdrop-blur-md bg-black/60 text-gray-200 shadow-lg shadow-black/20 px-2 py-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center flex-1 py-2 transition duration-200 hover:scale-105"
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Settings Slide-Over */}
      <Dialog open={settingsOpen} onClose={setSettingsOpen} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <Dialog.Panel className="w-80 bg-[#18181b] p-6 shadow-xl h-full flex flex-col">
            <Dialog.Title className="font-bold text-lg mb-4 text-gray-100">Settings</Dialog.Title>
            {session ? (
              <button
                className="mb-4 px-4 py-2 rounded-lg bg-[#8b5cf6] text-white font-semibold hover:bg-[#7c3aed] transition"
                onClick={() => signOut()}
              >
                Logout
              </button>
            ) : (
              <button
                className="mb-4 px-4 py-2 rounded-lg bg-[#8b5cf6] text-white font-semibold hover:bg-[#7c3aed] transition"
                onClick={() => signIn("google")}
              >
                Sign in
              </button>
            )}
            <a
              href="#"
              className="text-[#8b5cf6] underline hover:text-[#a259f7]"
              onClick={() => alert('Feedback link stub')}
            >
              Feedback
            </a>
            <button
              className="mt-auto self-end text-gray-400 hover:text-gray-200"
              onClick={() => setSettingsOpen(false)}
              aria-label="Close settings"
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 