"use client";
import { Animal } from "@/types/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [guesses, setGuesses] = useState<string[]>(["", "", "", "", ""]);
  const [guessCounter, setGuessCounter] = useState(0);
  const [items, setItems] = useState<Animal[]>([]);
  const [validationResults, setValidationResults] = useState<boolean[]>(
    Array(5).fill(false)
  );
  const [score, setScore] = useState(0);
  const [randomWordList, setRandomWordList] = useState<string[]>([]);

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

  const shuffleArray = (array: Animal[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleHintReveal = () => {
    const animal = items.find(
      (animal) => animal.name.toLowerCase() === word.toLowerCase()
    );
    if (animal) {
      setHint(animal.hint);
      setScore((prev) => prev - 250);
    } else {
      setHint("No hint available for this word.");
    }
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
      <div className="flex flex-col justify-center items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-amber-100">
        <div className="flex flex-col items-center font-bold text-3xl w-full max-w-xs">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800">Score</h1>
          <div className="relative w-full h-6 rounded-full bg-black shadow-lg mb-2">
            <div
              className="absolute top-0 left-0 h-6 rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${Math.min((score / 3000) * 100, 100)}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-base drop-shadow">
              {score} / 3000
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
              disabled={score >= 3000}
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
          disabled={score >= 3000}
        >
          Submit Guess
        </button>
        <button
          disabled={score >= 3000}
          onClick={handleHintReveal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Reveal Hint
        </button>

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
