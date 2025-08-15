"use client";
import { Animal } from "@/types/types";
import { useEffect, useState } from "react";


export default function Home() {
  const [word, setWord] = useState("");
  const [guess, setGuess] = useState("");
  const [items, setItems] = useState<Animal[]>([]);

  const handleSubmit = () => {
    if (guess.trim().toLowerCase() === "123") return;
    console.log("Submitted guess:", guess.trim().toLowerCase());
    setGuess(""); 
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/words")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setWord(data[randomIndex].name.toLowerCase());
        }
      });
  }, []);

  return (
    <>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
        Guess Here
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full max-w-md"
          placeholder="Type your guess..."
        />
        <button
          onClick={() => handleSubmit()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit Guess
        </button>
      </div>

      {word && (
        <div className="p-4">
          <p className="text-sm text-gray-500">Random word: {word}</p>
        </div>
      )}


      {/* {items.map((item) => (
        <div key={item._id} className="p-4 border-b">
          <h2 className="text-lg font-semibold">{item.name}</h2>
        </div>
      ))} */}
    </>
  );
}