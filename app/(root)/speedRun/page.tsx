"use client";
import { Animal } from "@/types/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import TimerProgress from "@/app/componet/timer";

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
  const [hintUsed, setHintUsed] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timerDone, setTimerDone] = useState(false); 
  const [timerProgress, setTimerProgress] = useState(0);

  useEffect(() => {
    const totalTime = 180; 
    let timeElapsed = 0;
    const interval = setInterval(() => {
      timeElapsed++;
      const percent = Math.min((timeElapsed / totalTime) * 100, 100);
      setTimerProgress(percent);
      if (timeElapsed >= totalTime) {
        clearInterval(interval);
        setTimerDone(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Custom TimerProgress with callback
  function TimerProgressWithCallback({ onFinish }: { onFinish: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const totalTime = 180;
      let timeElapsed = 0;
      const interval = setInterval(() => {
        timeElapsed++;
        const percent = Math.min((timeElapsed / totalTime) * 100, 100);
        setProgress(percent);
        if (timeElapsed >= totalTime) {
          clearInterval(interval);
          onFinish();
        }
      }, 1000);
      return () => clearInterval(interval);
    }, [onFinish]);

    return (
      <div className="flex flex-col items-center gap-2 w-full max-w-xs">
        <div
          className="radial-progress"
          style={{ ["--value" as any]: progress } as React.CSSProperties}
          aria-valuenow={progress}
          role="progressbar"
        >
          <span className="text-xs font-semibold">{Math.round(progress)}%</span>
        </div>
      </div>
    );
  }

  const guessCounterFunc = () => setGuessCounter((prev) => prev + 1);

  const incrementScore = (currentValidation: boolean[]) => {
    if (currentValidation.every((isCorrect) => isCorrect)) {
      setScore((prev) => prev + 1000);
    } else {
      setScore((prev) => prev - 50);
    }
  };

  const handleSubmit = () => {
    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), 1000);

    const currentValidation = guesses.map(
      (letter, index) => letter.toLowerCase() === word[index]?.toLowerCase()
    );

    setValidationResults(currentValidation);

    setGuesses((prev) => prev.map((g, i) => (currentValidation[i] ? g : "")));

    guessCounterFunc();
    incrementScore(currentValidation);

    if (currentValidation.every((isCorrect) => isCorrect)) {
      const currentIndex = randomWordList.indexOf(word);
      const nextWord =
        randomWordList[(currentIndex + 1) % randomWordList.length];

      setTimeout(() => {
        setWord(nextWord);
        setGuesses(["", "", "", "", ""]);
        setHint("");
        setValidationResults(Array(5).fill(false));
        setHintUsed(false);
      }, 500);
    } else {
      const firstIncorrectIndex = currentValidation.findIndex((x) => !x);
      if (firstIncorrectIndex >= 0) {
        const input = document.getElementById(`input-${firstIncorrectIndex}`);
        if (input) input.focus();
      }
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];

    const newGuesses = [...guesses];
    newGuesses[index] = value;
    setGuesses(newGuesses);

    if (value && index < 4) {
      const nextInput = document.getElementById(`input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const shuffleArray = (array: string[]) => {
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
    setHintUsed(true);
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

  useEffect(() => {
    if (timerDone) {
      const userId = localStorage.getItem("userId");
      console.log("Sending score update:", { userId, score });
      if (userId) {
        fetch(`http://localhost:8080/api/score`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, score }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Score updated:", data);
          })
          .catch((err) => console.error("Error updating score:", err));
      }
    }
  }, [timerDone, score]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-amber-200 relative">
      <div className="absolute top-6 left-6">
        <Link href="/homePage" aria-label="Back to Home">
          <button className="btn btn-circle btn-outline bg-white shadow hover:scale-110 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
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

      <div className="card w-full max-w-sm shadow-xl bg-white/90 border border-amber-300 mb-8">
        <div className="card-body items-center">
          <TimerProgress progress={timerProgress} />
          <h2 className="text-lg font-semibold text-gray-700 mt-4">Score</h2>
          <span className="inset-0 flex items-center justify-center text-gray-800 font-bold text-sm">
            {score}
          </span>
        </div>
      </div>

      <span className="mb-2 text-lg font-medium text-gray-700">
        Guess the Word
      </span>
      <div className="flex gap-3 mb-6">
        {guesses.map((guess, i) => (
          <input
            key={i}
            id={`input-${i}`}
            type="text"
            maxLength={1}
            value={guess}
            disabled={timerDone}
            onChange={(e) => handleInputChange(i, e.target.value)}
            className={`input input-bordered w-12 h-12 text-center text-xl font-bold 
              ${
                validationResults[i]
                  ? "border-green-500 text-green-600"
                  : guessCounter > 0
                  ? "border-red-400 text-red-500"
                  : "border-gray-300"
              }`}
          />
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={isDisabled || timerDone}
          className="btn btn-primary px-6"
        >
          Submit Guess
        </button>
        <button
          onClick={handleHintReveal}
          disabled={hintUsed || timerDone}
          className="btn btn-accent px-6"
        >
          Reveal Hint
        </button>
      </div>

      {hint && (
        <div className="mt-6 w-full max-w-sm bg-white border border-blue-200 rounded-lg shadow-md p-4 text-center">
          <p className="animate-pulse text-gray-700 font-medium">{hint}</p>
        </div>
      )}

      {randomWordList.length > 0 && (
        <p className="absolute bottom-4 text-xs text-gray-400">
          Word to guess: {word}
        </p>
      )}
      {timerDone && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Time&apos;s Up!
            </h2>
            <p className="text-lg text-gray-700">
              Your final score: <span className="font-bold">{score}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
