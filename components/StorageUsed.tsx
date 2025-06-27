"use client";

import { useEffect, useState } from "react";

const MAX_STORAGE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

function formatBytes(bytes: number) {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) {
    return `${gb.toFixed(2)} GB`;
  }
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

  if (loading) {
    return <p>Loading storage info...</p>;
  }

  if (!user) {
    return <p>Failed to load user info.</p>;
  }

  const percentage = Math.min(
    (user.storageUsed / MAX_STORAGE_BYTES) * 100,
    100
  );

  let barColor = "bg-green-600";
  if (percentage > 80) {
    barColor = "bg-red-600";
  } else if (percentage > 50) {
    barColor = "bg-yellow-500";
  }

  return (
    <div className="w-full p-4 border rounded shadow-sm mt-auto">
      <h3 className="text-lg font-semibold mb-2">Storage Usage</h3>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 ${barColor} transition-all`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-700">
        Used:{" "}
        <span className="font-medium">
          {formatBytes(user.storageUsed)}
        </span>{" "}
        / 2 GB
      </p>
    </div>
  );
};

export default StorageUsage;