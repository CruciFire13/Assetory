"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MAX_STORAGE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

function formatBytes(bytes: number) {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

interface UserData {
  name: string;
  email: string;
  storageUsed: number;
}

const StorageUsage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return <p className="text-sm text-white/60">Loading storage info...</p>;
  if (!user)
    return <p className="text-sm text-red-500">Failed to load user info.</p>;

  const percentage = Math.min(
    (user.storageUsed / MAX_STORAGE_BYTES) * 100,
    100
  );

  // Dynamic stroke color
  const color =
    percentage > 80 ? "#ef4444" : percentage > 50 ? "#facc15" : "#10b981";

  const radius = 45;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <h3 className="text-base font-semibold mb-3 tracking-wide">
        Storage Usage
      </h3>
      <svg width="120" height="120" className="mb-3 drop-shadow-xl">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="white"
          strokeOpacity="0.1"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1 }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white text-sm font-semibold"
        >
          {Math.floor(percentage)}%
        </text>
      </svg>
      <p className="text-sm text-white/70">
        <span className="font-medium text-white">
          {formatBytes(user.storageUsed)}
        </span>{" "}
        / 2 GB
      </p>
    </div>
  );
};

export default StorageUsage;
