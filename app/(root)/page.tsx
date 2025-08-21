import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-amber-100 gap-8">
        <Link href={"/register"}>Register</Link>
        <Link href={"/login"}>Login</Link>
      </div>
    </>
  );
}
