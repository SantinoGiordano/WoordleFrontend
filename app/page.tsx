import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center  p-8 pb-20 gap-16 sm:p-20">
     Guess Here
     <input type="text" className="border border-gray-300 rounded-md p-2 w-full max-w-md" placeholder="Type your guess..." />
    </div>
  );
}
