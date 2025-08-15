import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  const [word, setWord] = useState("");
  const [guess, setGuess] = useState("");

  useEffect(() => {

  }, []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center  p-8 pb-20 gap-16 sm:p-20">
     Guess Here
     <input type="text" className="border border-gray-300 rounded-md p-2 w-full max-w-md" placeholder="Type your guess..." />
    </div>
  );
}
