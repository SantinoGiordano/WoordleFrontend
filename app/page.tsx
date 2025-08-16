"use client";
import { Animal } from "@/types/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [word, setWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>(["", "", "", "", ""]);
  const [guessCounter, setGuessCounter] = useState(0);
  const [items, setItems] = useState<Animal[]>([]);
  const [validationResults, setValidationResults] = useState<boolean[]>(Array(5).fill(false));
  const [score, setScore] = useState(0);
  const [randomWordList, setRandomWordList] = useState<string[]>([]);

  const guessCounterFunc = () => {
    setGuessCounter((prev) => prev + 1);
  };

  const incrementScore = (currentValidation: boolean[]) => {
  if (currentValidation.every(isCorrect => isCorrect)) {
    setScore((prev) => prev + 100);
  } else {
    setScore((prev) => prev - 50);
  }
};


  const handleSubmit = () => {
  if (guesses.some(guess => guess.trim() === "")) {
    alert("Please fill all fields");
    return;
  }

  const currentValidation = guesses.map((letter, index) =>
    letter.toLowerCase() === word[index]?.toLowerCase()
  );

  console.log("Guesses:", guesses);
  console.log("Word:", word);
  console.log("Validation:", currentValidation);

  setValidationResults(currentValidation);

  setGuesses(prevGuesses =>
    prevGuesses.map((guess, index) =>
      currentValidation[index] ? guess : ""
    )
  );

  guessCounterFunc();

  const firstIncorrectIndex = currentValidation.findIndex(isCorrect => !isCorrect);
  if (firstIncorrectIndex >= 0) {
    const input = document.getElementById(`input-${firstIncorrectIndex}`);
    if (input) input.focus();
  }

  incrementScore(currentValidation); 
};


  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    
    const newGuesses = [...guesses];
    newGuesses[index] = value;
    setGuesses(newGuesses);
    
    if (value && index < 4) {
      const nextInput = document.getElementById(`input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const shuffleArray = (array: Animal[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/words")
      .then((res) => res.json())
      .then((animalNames) => {
        setItems(animalNames);
        if (animalNames.length > 0) {
          // Create array of just the names
          const names = animalNames.map((animal: Animal) => animal.name.toLowerCase());
          // Shuffle the array
          const shuffledNames = shuffleArray(names);
          setRandomWordList(shuffledNames);
          // Set the first word as the word to guess
          setWord(shuffledNames[0]);
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

      {randomWordList.length > 0 && (
        <div className="p-4">
          <p className="text-sm text-gray-500">Word to guess: {word}</p>
          <p className="text-sm text-gray-500">Random word list: {randomWordList.join(", ")}</p>
          <p className="text-sm text-gray-500">Score: {score}</p>
        </div>
      )}
    </>
  );
}