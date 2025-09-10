import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-blue-800">Welcome</h1>
        <p className="text-gray-600">Choose an option to continue</p>

        <div className="flex gap-4 mt-4">
          <Link
            href="/register"
            className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
          >
            Register
          </Link>

          <Link
            href="/login"
            className="px-6 py-2 bg-gray-700 text-white rounded-xl shadow hover:bg-gray-800 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
