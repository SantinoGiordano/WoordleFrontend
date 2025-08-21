"use client";
import { Animal } from "@/types/types";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [hintLimit, setHintLimit] = useState(5); // Total hints for the whole game
  const [guesses, setGuesses] = useState<string[]>(["", "", "", "", ""]);
  const [guessCounter, setGuessCounter] = useState(0);
  const [items, setItems] = useState<Animal[]>([]);
  const [validationResults, setValidationResults] = useState<boolean[]>(
    Array(5).fill(false)
  );
  const [score, setScore] = useState(0);
  const [randomWordList, setRandomWordList] = useState<string[]>([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const guessCounterFunc = () => {
    setGuessCounter((prev) => prev + 1);
  };

  const incrementScore = (currentValidation: boolean[]) => {
    if (currentValidation.every((isCorrect) => isCorrect)) {
      setScore((prev) => prev + 1000);
    } else {
      setScore((prev) => prev - 50);
    }
  };

  const handleSubmit = () => {
    setIsDisabled(true); // Disable button immediately
    setTimeout(() => {
      setIsDisabled(false); // Re-enable after 1 second
    }, 1000);

    const currentValidation = guesses.map(
      (letter, index) => letter.toLowerCase() === word[index]?.toLowerCase()
    );

    setValidationResults(currentValidation);

    setGuesses((prevGuesses) =>
      prevGuesses.map((guess, index) => (currentValidation[index] ? guess : ""))
    );

    guessCounterFunc();

    incrementScore(currentValidation);

    if (currentValidation.every((isCorrect) => isCorrect)) {
      const currentIndex = randomWordList.indexOf(word);

      const nextIndex = (currentIndex + 1) % randomWordList.length;
      const nextWord = randomWordList[nextIndex];

      setTimeout(() => {
        setWord(nextWord);
        setGuesses(["", "", "", "", ""]);
        setHint("");
        setValidationResults(Array(5).fill(false));
        setHintUsed(false); // Only disables hint for current word, not total
      }, 500);
    } else {
      const firstIncorrectIndex = currentValidation.findIndex(
        (isCorrect) => !isCorrect
      );
      if (firstIncorrectIndex >= 0) {
        const input = document.getElementById(`input-${firstIncorrectIndex}`);
        if (input) input.focus();
      }
    }
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

  // Only allow 5 hints for the whole game
  const handleHintReveal = () => {
    if (hintLimit > 0 && !hintUsed) {
      const animal = items.find(
        (animal) => animal.name.toLowerCase() === word.toLowerCase()
      );
      if (animal) {
        setHint(animal.hint);
        setScore((prev) => prev - 250);
      } else {
        setHint("No hint available for this word.");
      }
      setHintUsed(true);
      setHintLimit((prev) => prev - 1); // Decrement total hints
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
          const names = animalNames.map((animal: Animal) =>
            animal.name.toLowerCase()
          );
          const shuffledNames = shuffleArray(names);
          setRandomWordList(shuffledNames);
          setWord(shuffledNames[0]);
        }
      });
  }, []);

  return (
    <>
      <div className="fixed top-6 left-6 z-50">
        <Link href="/" aria-label="Back to Home">
          <button className="w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-amber-100">
        <div className="flex flex-col items-center font-bold text-3xl w-full max-w-xs">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800">Score</h1>
          <div className="relative w-full h-6 rounded-full bg-black shadow-lg mb-2">
            <div
              className="absolute top-0 left-0 h-6 rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${Math.min((score / 5000) * 100, 100)}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-base drop-shadow">
              {score} / 5000
            </span>
          </div>
        </div>
        <span className="mb-4 font-sans text-lg">Guess Here</span>
        <div className="flex gap-4 w-full max-w-md justify-center">
          {guesses.map((guess, index) => (
            <input
              key={index}
              id={`input-${index}`}
              type="text"
              maxLength={1}
              value={guess}
              disabled={score >= 5000}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className={` bg-white border-2 rounded-md p-2 w-full max-w-10 text-center text-xl font-bold ${
                validationResults[index]
                  ? "border-green-500"
                  : guessCounter > 0
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          disabled={score >= 5000 || isDisabled}
        >
          Submit Guess
        </button>
        <button
          disabled={score >= 5000 || hintUsed || hintLimit <= 0}
          onClick={handleHintReveal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Reveal Hint
        </button>
        <div>
          <p className="text-gray-700">
            Hints left: {hintLimit} / 5
          </p>
        </div>

        {hint && (
          <div className="w-full max-w-md mt-4 bg-white/80 border border-blue-200 rounded-lg shadow-md p-4 flex items-center justify-center">
            <p className="animate-pulse text-gray-700 font-medium text-center">
              {hint}
            </p>
          </div>
        )}
      </div>

      {randomWordList.length > 0 && (
        <div className="p-4">
          <p className="text-sm text-gray-500">Word to guess: {word}</p>
        </div>
      )}
    </>
  );
}
