import Link from "next/link";

export default function GaneModes() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 gap-8">
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
        </div>
      </div>
    </>
  );
}
