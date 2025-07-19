"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface Profile {
  name: string;
  birthday: string;
  gender: string;
  programmingLanguages: string[];
  timezone: string;
  avatarUrl?: string;
  photos: string[];
}

const defaultProfile: Profile = {
  name: "",
  birthday: "",
  gender: "",
  programmingLanguages: [],
  timezone: "",
  avatarUrl: "",
  photos: [],
};

export default function ProfileForm({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [langInput, setLangInput] = useState("");
  const lookingForSuggestions = [
    "Hackathon Mates",
    "Startup members",
    "Just friends",
    "Figuring it out",
  ];
  const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!email) return;
    setLoadingProfile(true);
    getDoc(doc(db, "profiles", email)).then((snap) => {
      if (snap.exists()) {
        const data = { ...defaultProfile, ...snap.data() };
        setProfile(data);
        setPhotoPreviews(data.photos || []);
      }
      setLoadingProfile(false);
    });
  }, [email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setProfile((p) => ({ ...p, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setProfile((p) => ({ ...p, [name]: value }));
    }
  };

  const handleLangKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && langInput.trim()) {
      e.preventDefault();
      if (!profile.programmingLanguages.includes(langInput.trim())) {
        setProfile((p) => ({ ...p, programmingLanguages: [...p.programmingLanguages, langInput.trim()] }));
      }
      setLangInput("");
    }
  };

  const handleLangRemove = (lang: string) => {
    setProfile((p) => ({ ...p, programmingLanguages: p.programmingLanguages.filter((l: string) => l !== lang) }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photoPreviews.length > 9) return;
    setPhotoFiles((prev) => [...prev, ...files]);
    setPhotoPreviews((prev) => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx || i < photoPreviews.length - photoFiles.length));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    if (photoPreviews.length < 2) return;
    setSaving(true);
    let uploadedUrls = [...(profile.photos || [])];
    // Upload new files
    for (let i = 0; i < photoFiles.length; ++i) {
      const file = photoFiles[i];
      // Only upload files that are not already URLs
      if (typeof file === "string") continue;
      const storageRef = ref(storage, `photos/${email}_${Date.now()}_${i}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedUrls.push(url);
    }
    // Only keep up to 9
    uploadedUrls = uploadedUrls.slice(0, 9);
    // Use first photo as avatar
    const avatarUrl = uploadedUrls[0] || "";
    await setDoc(doc(db, "profiles", email), {
      ...profile,
      avatarUrl,
      photos: uploadedUrls,
      email,
    });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  const timezones = [
    { value: "Pacific/Midway", label: "(UTC-11:00) Pacific/Midway" },
    { value: "America/Anchorage", label: "(UTC-09:00) America/Anchorage" },
    { value: "America/Los_Angeles", label: "(UTC-08:00) America/Los_Angeles" },
    { value: "America/Denver", label: "(UTC-07:00) America/Denver" },
    { value: "America/Chicago", label: "(UTC-06:00) America/Chicago" },
    { value: "America/New_York", label: "(UTC-05:00) America/New_York" },
    { value: "America/Sao_Paulo", label: "(UTC-03:00) America/Sao_Paulo" },
    { value: "Europe/London", label: "(UTC+00:00) Europe/London" },
    { value: "Europe/Berlin", label: "(UTC+01:00) Europe/Berlin" },
    { value: "Europe/Moscow", label: "(UTC+03:00) Europe/Moscow" },
    { value: "Asia/Dubai", label: "(UTC+04:00) Asia/Dubai" },
    { value: "Asia/Karachi", label: "(UTC+05:00) Asia/Karachi" },
    { value: "Asia/Dhaka", label: "(UTC+06:00) Asia/Dhaka" },
    { value: "Asia/Bangkok", label: "(UTC+07:00) Asia/Bangkok" },
    { value: "Asia/Hong_Kong", label: "(UTC+08:00) Asia/Hong_Kong" },
    { value: "Asia/Tokyo", label: "(UTC+09:00) Asia/Tokyo" },
    { value: "Australia/Sydney", label: "(UTC+10:00) Australia/Sydney" },
    { value: "Pacific/Auckland", label: "(UTC+12:00) Pacific/Auckland" },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 modern-scrollbar">
      <form
        onSubmit={handleSubmit}
        className="bg-[#23272a] rounded-2xl p-8 w-[95vw] max-w-md shadow-2xl flex flex-col gap-4 relative overflow-y-auto max-h-[90vh]"
        style={{ opacity: loadingProfile ? 0.5 : 1, pointerEvents: loadingProfile ? 'none' : 'auto' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-full transition"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-white mb-2">My Profile</h2>
        <div className="flex flex-col items-center gap-2 mb-2">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-lg" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-900 flex items-center justify-center text-4xl text-indigo-300 border-4 border-indigo-500 shadow-lg">
                <span>+</span>
              </div>
            )}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
          <span className="text-indigo-200 text-xs">Click to upload avatar</span>
        </div>
        <div className="flex flex-col items-center gap-2 mb-2">
          <label htmlFor="photos-upload" className="cursor-pointer">
            <div className="flex flex-wrap gap-2 justify-center">
              {photoPreviews.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img src={src} alt={`Photo ${idx + 1}`} className={`w-20 h-20 rounded-lg object-cover border-2 ${idx === 0 ? 'border-indigo-500' : 'border-gray-700'} shadow-lg`} />
                  <button type="button" onClick={() => handleRemovePhoto(idx)} className="absolute top-0 right-0 bg-black/60 text-white rounded-full px-1 py-0.5 text-xs opacity-0 group-hover:opacity-100 transition">×</button>
                  {idx === 0 && <span className="absolute bottom-0 left-0 bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-tr-lg rounded-bl-lg">Avatar</span>}
                </div>
              ))}
              {photoPreviews.length < 9 && (
                <div className="w-20 h-20 rounded-lg bg-indigo-900 flex items-center justify-center text-3xl text-indigo-300 border-2 border-dashed border-indigo-500 shadow-lg">
                  +
                </div>
              )}
            </div>
            <input
              id="photos-upload"
              type="file"
              accept="image/*"
              className="hidden"
              multiple
              onChange={handlePhotosChange}
            />
          </label>
          <span className="text-indigo-200 text-xs">Upload 2-9 photos. First photo is your avatar.</span>
        </div>
        <label className="text-indigo-200 text-sm">
          Name
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-[#2c2f36] text-white"
            required
          />
        </label>
        <label className="text-indigo-200 text-sm">
          Birthday
          <input
            type="date"
            name="birthday"
            value={profile.birthday}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-[#2c2f36] text-white"
            required
          />
        </label>
        <label className="text-indigo-200 text-sm">
          Gender
          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-[#2c2f36] text-white"
            required
          >
            <option value="">Select gender</option>
            {genderOptions.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className="text-indigo-200 text-sm">
          Programming Languages/Frameworks (press Enter or comma to add)
          <div className="flex flex-wrap gap-2 mt-1 mb-1">
            {profile.programmingLanguages.map((lang: string) => (
              <span key={lang} className="bg-indigo-700/80 text-indigo-100 px-3 py-1 rounded-full text-xs font-medium shadow flex items-center gap-1">
                {lang}
                <button type="button" className="ml-1 text-red-300 hover:text-red-500" onClick={() => handleLangRemove(lang)}>&times;</button>
              </span>
            ))}
          </div>
          <input
            name="programmingLanguagesInput"
            value={langInput}
            onChange={e => setLangInput(e.target.value)}
            onKeyDown={handleLangKeyDown}
            className="w-full p-2 rounded bg-[#2c2f36] text-white"
            placeholder="Type and press Enter or comma..."
          />
        </label>
        <label className="text-indigo-200 text-sm">
          Timezone
          <select
            name="timezone"
            value={profile.timezone}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-[#2c2f36] text-white modern-scrollbar"
            required
          >
            <option value="">Select timezone</option>
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>{tz.label.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="mt-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
          disabled={saving || loadingProfile || photoPreviews.length < 2}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {success && <div className="text-green-400 text-center mt-2">Profile saved!</div>}
      </form>
      {loadingProfile && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <div className="text-indigo-200 text-lg animate-pulse">Loading profile…</div>
        </div>
      )}
    </div>
  );
} 