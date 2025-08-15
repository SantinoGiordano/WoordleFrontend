"use client";
import { Animal } from "@/types/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [word, setWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>(["", "", "", "", ""]);
  const [guessCounter, setGuessCounter] = useState(0);
  const [items, setItems] = useState<Animal[]>([]);
  const [validationResults, setValidationResults] = useState<boolean[]>(Array(5).fill(false));

  const guessCounterFunc = () => {
    setGuessCounter((prev) => prev + 1);
  };

  const handleSubmit = () => {
    if (guesses.some(guess => guess.trim() === "")) {
      alert("Please fill all fields");
      return;
    }
    
    // Validate each letter
    const currentValidation = guesses.map((letter, index) => 
      letter.toLowerCase() === word[index]?.toLowerCase()
    );
    setValidationResults(currentValidation);
    
    // Clear only incorrect guesses
    setGuesses(prevGuesses => 
      prevGuesses.map((guess, index) => 
        currentValidation[index] ? guess : ""
      )
    );
    
    guessCounterFunc();
    
    // Focus on first empty input (if any)
    const firstIncorrectIndex = currentValidation.findIndex(isCorrect => !isCorrect);
    if (firstIncorrectIndex >= 0) {
      const input = document.getElementById(`input-${firstIncorrectIndex}`);
      if (input) input.focus();
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1]; // Take only the last character
    }
    
    const newGuesses = [...guesses];
    newGuesses[index] = value;
    setGuesses(newGuesses);
    
    // Auto-focus to next input if a letter was entered and it's not the last one
    if (value && index < 4) {
      const nextInput = document.getElementById(`input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/words")
      .then((res) => res.json())
      .then((animalName) => {
        setItems(animalName);
        if (animalName.length > 0) {
          const randomIndex = Math.floor(Math.random() * animalName.length);
          setWord(animalName[randomIndex].name.toLowerCase());
        }
      });
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen p-8 pb-20 gap-8 sm:p-20">
        <span className="mb-4 font-sans text-lg">Guess Here</span>
        <div className="flex gap-4 w-full max-w-md justify-center">
          {guesses.map((guess, index) => (
            <input
              key={index}
              id={`input-${index}`}
              type="text"
              maxLength={1}
              value={guess}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className={`border-2 rounded-md p-2 w-full max-w-10 text-center text-xl font-bold ${
                validationResults[index] ? "border-green-500" : guessCounter > 0 ? "border-red-500" : "border-gray-300"
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
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
    </>
  );
}