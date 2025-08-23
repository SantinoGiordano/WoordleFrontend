"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type User = {
  _id: string;
  username: string;
  score: number;
};

export default function LeaderboardPage() {
  const [items, setItems] = useState<User[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((res) => res.json())
      .then((userInfo: User[]) => {
        const sorted = [...userInfo].sort((a, b) => b.score - a.score);
        setItems(sorted);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
      <div className="absolute top-6 left-6">
        <Link href="/homePage" aria-label="Back to Home">
          <button className="btn btn-circle btn-outline bg-white shadow hover:scale-110 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </Link>
      </div>
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
        🏆 Leaderboard
      </h1>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
        {items.length === 0 ? (
          <p className="text-center text-gray-500">No players yet</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items.map((item, index) => {
              let rankColor = "text-gray-500";
              if (index === 0) rankColor = "animate-pulse text-yellow-500 font-bold";
              if (index === 1) rankColor = "animate-pulse text-gray-500 font-bold";
              if (index === 2) rankColor = "animate-pulse text-orange-500 font-bold";

              return (
                <li
                  key={item._id}
                  className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition"
                >
                  <span className={`text-lg ${rankColor}`}>
                    #{index + 1} {item.username}
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    {item.score}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
