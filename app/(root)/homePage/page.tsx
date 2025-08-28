"use client";

import Link from "next/link";
import { useUserStore } from "@/app/store/userStore";
export default function GaneModes() {
  const username = useUserStore((state) => state.username);
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 gap-8">
        <div className="flex items-center gap-2 mt-4">
          <span className="text-2xl font-bold text-blue-700 drop-shadow">
            Welcome to Woordle
          </span>
          {username && (
            <span className="px-4 py-2 rounded-full bg-white/80 text-pink-600 font-extrabold text-xl shadow border border-pink-300 ml-2">
              {username}
            </span>
          )}
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 drop-shadow-lg">
          Game Modes
        </h1>
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <Link
            data-tip="Noraml Game with hints, no time limit, and goal of 3000 points"
            className="tooltip tooltip-right bg-amber-100 text-center text-black text-2xl font-bold py-6 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
            href={"/mainGame"}
          >
            Play Classic
          </Link>
          <Link
            data-tip="Normal gameplay with limit hints, no time limit, and goal of 5000 points"
            href={"/hardMode"}
            className="tooltip tooltip-right bg-amber-100 text-center text-black text-2xl font-bold py-6 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Hard Mode
          </Link>
          <Link
            data-tip="Normal gameplay with hints, a time limit of 3 min, try to answer as many as you can"
            href={"/speedRun"}
            className="tooltip tooltip-right bg-amber-100 text-center text-black text-2xl font-bold py-6 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Speed Run
          </Link>
          <Link
            data-tip="Learn the game with easy questions and helpful hints"
            href={"/tutorial"}
            className="tooltip tooltip-right bg-amber-100 text-center text-black text-2xl font-bold py-6 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Tutorial
          </Link>
          <Link
            data-tip="Check to see who's the best!"
            href={"/leaderboards"}
            className="tooltip tooltip-right bg-amber-100 text-center text-black text-2xl font-bold py-6 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Leaderboards
          </Link>
        </div>
        <Link
          href="/"
          className="bg-white mt-8 inline-block text-blue-700 font-semibold  hover:text-white hover:bg-blue-700 transition-colors px-6 py-2 rounded-full shadow-sm"
        >
          ← Back to Sign In
        </Link>
      </div>
    </>
  );
}
