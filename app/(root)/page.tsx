import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 gap-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 drop-shadow-lg">
          Game Modes
        </h1>
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <Link
            className="bg-amber-100 text-center text-black text-2xl font-bold py-6 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
            href={"/mainGame"}
          >
            Play Classic
          </Link>
          <Link
            href={"/mainGame"}
            className="bg-amber-100 text-center text-black text-2xl font-bold py-6 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Hard Mode
          </Link>
          <Link
            href={"/mainGame"}
            className="bg-amber-100 text-center text-black text-2xl font-bold py-6 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Speed Run
          </Link>
        </div>
      </div>
    </>
  );
}
