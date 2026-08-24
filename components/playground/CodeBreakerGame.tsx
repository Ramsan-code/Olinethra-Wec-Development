"use client"

import * as React from "react"
import GameHeader from "./GameHeader"
import ScoreDisplay from "./ScoreDisplay"
import GameResult from "./GameResult"
import { Button } from "@/components/ui/button"
import { Check, Delete, Eye, HelpCircle, Key, Lock, Sparkles } from "lucide-react"

export default function CodeBreakerGame() {
  const MAX_ATTEMPTS = 8
  const CODE_LENGTH = 4

  const [secret, setSecret] = React.useState<number[]>([5, 2, 8, 1])
  const [currentGuess, setCurrentGuess] = React.useState<number[]>([])
  const [history, setHistory] = React.useState<
    { guess: number[]; exact: number; partial: number }[]
  >([])
  const [gameState, setGameState] = React.useState<"PLAYING" | "WON" | "LOST" | "GAVE_UP">("PLAYING")
  const [score, setScore] = React.useState(0)
  const [highScoreAttempts, setHighScoreAttempts] = React.useState<number | null>(null)

  // Load high score from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("olinethra_codebreaker_best")
      if (saved) setHighScoreAttempts(parseInt(saved, 10))
    } catch {
      // localStorage may be disabled
    }
    generateNewSecret()
  }, [])

  const generateNewSecret = () => {
    const newSecret: number[] = []
    while (newSecret.length < CODE_LENGTH) {
      const digit = Math.floor(Math.random() * 10)
      newSecret.push(digit)
    }
    setSecret(newSecret)
    setCurrentGuess([])
    setHistory([])
    setGameState("PLAYING")
  }

  const handleDigitClick = (digit: number) => {
    if (gameState !== "PLAYING") return
    if (currentGuess.length < CODE_LENGTH) {
      setCurrentGuess([...currentGuess, digit])
    }
  }

  const handleBackspace = () => {
    if (gameState !== "PLAYING") return
    setCurrentGuess(currentGuess.slice(0, -1))
  }

  const handleClear = () => {
    if (gameState !== "PLAYING") return
    setCurrentGuess([])
  }

  const handleSubmitGuess = () => {
    if (gameState !== "PLAYING" || currentGuess.length !== CODE_LENGTH) return

    // Calculate exact & partial matches
    let exact = 0
    let partial = 0

    const secretCopy = [...secret]
    const guessCopy = [...currentGuess]

    // First pass: exact matches
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        exact++
        secretCopy[i] = -1
        guessCopy[i] = -2
      }
    }

    // Second pass: partial matches
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessCopy[i] >= 0) {
        const foundIdx = secretCopy.indexOf(guessCopy[i])
        if (foundIdx !== -1) {
          partial++
          secretCopy[foundIdx] = -1
        }
      }
    }

    const newHistory = [...history, { guess: currentGuess, exact, partial }]
    setHistory(newHistory)
    setCurrentGuess([])

    // Check Win/Loss
    if (exact === CODE_LENGTH) {
      setGameState("WON")
      const attemptsCount = newHistory.length
      const earnedXp = Math.max(100, (MAX_ATTEMPTS - attemptsCount + 1) * 150)
      setScore(earnedXp)

      // Save high score
      try {
        if (!highScoreAttempts || attemptsCount < highScoreAttempts) {
          setHighScoreAttempts(attemptsCount)
          localStorage.setItem("olinethra_codebreaker_best", attemptsCount.toString())
        }
      } catch {
        // ignore
      }
    } else if (newHistory.length >= MAX_ATTEMPTS) {
      setGameState("LOST")
    }
  }

  const handleGiveUp = () => {
    if (gameState === "PLAYING") {
      setGameState("GAVE_UP")
    }
  }

  // Keyboard controls
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "PLAYING") return
      if (e.key >= "0" && e.key <= "9") {
        handleDigitClick(parseInt(e.key, 10))
      } else if (e.key === "Backspace") {
        handleBackspace()
      } else if (e.key === "Enter") {
        handleSubmitGuess()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState, currentGuess, secret, history])

  return (
    <div className="space-y-6">
      <GameHeader
        title="Code Breaker"
        subtitle="Decode the secret 4-digit combination using position and digit feedback."
        onReset={generateNewSecret}
      />

      {/* Top Banner Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ScoreDisplay
          score={score}
          attempts={history.length}
          maxAttempts={MAX_ATTEMPTS}
          highScore={highScoreAttempts ? (MAX_ATTEMPTS - highScoreAttempts + 1) * 150 : undefined}
        />

        {gameState === "PLAYING" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGiveUp}
            className="font-mono text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Give Up & Reveal</span>
          </Button>
        )}
      </div>

      {gameState === "WON" ? (
        <GameResult
          title="Code Decoded!"
          score={score}
          attempts={history.length}
          onRestart={generateNewSecret}
          ctaType="CAREERS"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Code Keypad & Active Guess Slot (6 Cols) */}
          <div className="lg:col-span-6 space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950 shadow-sm">
            <div className="space-y-2 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                [ CURRENT ATTEMPT #{history.length + 1} ]
              </span>
              <h3 className="font-mono text-sm font-bold text-neutral-800 dark:text-neutral-200">
                Enter 4 Digits:
              </h3>

              {/* 4 Digit Slots */}
              <div className="flex justify-center items-center gap-3 py-4">
                {Array.from({ length: CODE_LENGTH }).map((_, i) => {
                  const digit = currentGuess[i]
                  const hasDigit = digit !== undefined
                  return (
                    <div
                      key={i}
                      className={`flex h-16 w-14 items-center justify-center rounded-xl border-2 font-mono text-2xl font-black transition-all ${
                        hasDigit
                          ? "border-neutral-950 bg-neutral-950 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950 scale-105"
                          : "border-neutral-200 bg-neutral-50 text-neutral-300 dark:border-neutral-800 dark:bg-neutral-900"
                      }`}
                    >
                      {hasDigit ? digit : "•"}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Numeric Keypad Grid */}
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  size="lg"
                  disabled={gameState !== "PLAYING" || currentGuess.length >= CODE_LENGTH}
                  onClick={() => handleDigitClick(num)}
                  className="h-12 font-mono text-lg font-bold border-neutral-200 hover:border-neutral-900 dark:border-neutral-800 dark:hover:border-neutral-100"
                >
                  {num}
                </Button>
              ))}

              <Button
                variant="outline"
                size="lg"
                disabled={gameState !== "PLAYING" || currentGuess.length === 0}
                onClick={handleBackspace}
                className="h-12 font-mono text-xs border-neutral-200 text-neutral-500 dark:border-neutral-800"
              >
                <Delete className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                disabled={gameState !== "PLAYING" || currentGuess.length >= CODE_LENGTH}
                onClick={() => handleDigitClick(0)}
                className="h-12 font-mono text-lg font-bold border-neutral-200 hover:border-neutral-900 dark:border-neutral-800 dark:hover:border-neutral-100"
              >
                0
              </Button>

              <Button
                size="lg"
                disabled={gameState !== "PLAYING" || currentGuess.length !== CODE_LENGTH}
                onClick={handleSubmitGuess}
                className="h-12 font-mono text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Check className="h-4 w-4" />
                <span>Submit</span>
              </Button>
            </div>

            {(gameState === "LOST" || gameState === "GAVE_UP") && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center space-y-2">
                <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                  {gameState === "GAVE_UP" ? "Game Over — Revealed" : "Attempts Exhausted!"}
                </span>
                <p className="font-mono text-sm">
                  Secret combination was:{" "}
                  <strong className="tracking-widest text-neutral-950 dark:text-neutral-50 text-lg">
                    {secret.join(" ")}
                  </strong>
                </p>
                <Button onClick={generateNewSecret} size="sm" className="font-mono text-xs mt-2">
                  Try Again
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Guess History & Rules (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
                <h3 className="font-mono text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  <Key className="h-4 w-4 text-emerald-500" />
                  <span>Guess History ({history.length}/{MAX_ATTEMPTS})</span>
                </h3>
              </div>

              {history.length === 0 ? (
                <div className="py-12 text-center font-mono text-xs text-neutral-400 space-y-2">
                  <HelpCircle className="h-8 w-8 mx-auto text-neutral-300 dark:text-neutral-700" />
                  <p>No attempts yet. Enter 4 digits and press Submit or Enter.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {history.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-3 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-900"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-400 text-[10px]">#{idx + 1}</span>
                        <span className="font-bold tracking-widest text-neutral-900 dark:text-neutral-100 text-sm">
                          {entry.guess.join(" ")}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-emerald-600 dark:text-emerald-400 font-bold">
                          {entry.exact} Correct Spot
                        </span>
                        <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-amber-600 dark:text-amber-400">
                          {entry.partial} Wrong Spot
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rules explanation box */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400 space-y-2">
              <h4 className="font-mono text-xs font-bold uppercase text-neutral-800 dark:text-neutral-200">
                How to Play:
              </h4>
              <ul className="list-disc pl-4 space-y-1 font-mono text-[11px]">
                <li>Guess the hidden 4-digit code in 8 attempts or fewer.</li>
                <li><strong>Correct Spot:</strong> Digit is right and in the exact position.</li>
                <li><strong>Wrong Spot:</strong> Digit is in the secret code but in a different position.</li>
                <li>Keyboard shortcuts: Use keys <strong>0-9</strong>, <strong>Backspace</strong>, and <strong>Enter</strong>.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
