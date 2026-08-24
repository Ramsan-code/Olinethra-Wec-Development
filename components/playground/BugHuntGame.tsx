"use client"

import * as React from "react"
import GameHeader from "./GameHeader"
import ScoreDisplay from "./ScoreDisplay"
import GameResult from "./GameResult"
import DifficultyBadge from "./DifficultyBadge"
import { BUG_HUNT_CHALLENGES, BugHuntChallenge, Difficulty } from "@/data/playground/bug-hunt"
import { Button } from "@/components/ui/button"
import { Check, X, ArrowRight, Bug, Code2, Sparkles, BookOpen } from "lucide-react"

export default function BugHuntGame() {
  const ROUND_SIZE = 5

  const [selectedDifficulty, setSelectedDifficulty] = React.useState<Difficulty | "ALL">("ALL")
  const [activeChallenges, setActiveChallenges] = React.useState<BugHuntChallenge[]>([])
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null)
  const [isAnswered, setIsAnswered] = React.useState(false)
  const [score, setScore] = React.useState(0)
  const [correctCount, setCorrectCount] = React.useState(0)
  const [streak, setStreak] = React.useState(0)
  const [isRoundComplete, setIsRoundComplete] = React.useState(false)
  const [highScore, setHighScore] = React.useState<number>(0)

  // Load high score
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("olinethra_bughunt_best")
      if (saved) setHighScore(parseInt(saved, 10))
    } catch {
      // ignore
    }
  }, [])

  // Initialize round
  const startNewRound = React.useCallback(() => {
    let pool = BUG_HUNT_CHALLENGES
    if (selectedDifficulty !== "ALL") {
      pool = pool.filter((c) => c.difficulty === selectedDifficulty)
    }
    // Shuffle array
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE)
    setActiveChallenges(shuffled)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setCorrectCount(0)
    setStreak(0)
    setIsRoundComplete(false)
  }, [selectedDifficulty])

  React.useEffect(() => {
    startNewRound()
  }, [startNewRound])

  const currentChallenge = activeChallenges[currentIndex]

  const handleAnswerSelect = (index: number) => {
    if (isAnswered || !currentChallenge) return

    setSelectedAnswer(index)
    setIsAnswered(true)

    const isCorrect = index === currentChallenge.correctAnswer
    if (isCorrect) {
      const addedXp = 100 + streak * 20
      const newScore = score + addedXp
      setScore(newScore)
      setCorrectCount((prev) => prev + 1)
      setStreak((prev) => prev + 1)

      // Update High score
      try {
        if (newScore > highScore) {
          setHighScore(newScore)
          localStorage.setItem("olinethra_bughunt_best", newScore.toString())
        }
      } catch {
        // ignore
      }
    } else {
      setStreak(0)
    }
  }

  const handleNextChallenge = () => {
    if (currentIndex + 1 < activeChallenges.length) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setIsRoundComplete(true)
    }
  }

  // Keyboard shortcut listener (1, 2, 3, 4, Enter)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isRoundComplete || !currentChallenge) return

      if (!isAnswered) {
        if (["1", "2", "3", "4"].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1
          if (idx < currentChallenge.answers.length) {
            handleAnswerSelect(idx)
          }
        }
      } else {
        if (e.key === "Enter") {
          handleNextChallenge()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isAnswered, isRoundComplete, currentChallenge, currentIndex])

  if (!currentChallenge && !isRoundComplete) {
    return (
      <div className="p-12 text-center font-mono text-xs text-neutral-500">
        Loading challenges...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <GameHeader
        title="Bug Hunt"
        subtitle="Identify logic traps, state mutations, and syntax issues in code snippets."
        onReset={startNewRound}
      />

      {/* Control Bar: Difficulty filter & Score */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ScoreDisplay
          score={score}
          streak={streak}
          round={currentIndex + 1}
          totalRounds={activeChallenges.length}
          highScore={highScore}
        />

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-neutral-500 text-[11px]">Difficulty:</span>
          {(["ALL", "EASY", "MEDIUM", "HARD"] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase transition-all ${
                selectedDifficulty === diff
                  ? "bg-neutral-950 text-white dark:bg-neutral-100 dark:text-neutral-950"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {isRoundComplete ? (
        <GameResult
          title="Bug Hunt Complete!"
          score={score}
          totalQuestions={activeChallenges.length}
          correctAnswers={correctCount}
          onRestart={startNewRound}
          ctaType="CAREERS"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Code Display (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950 shadow-sm space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Bug className="h-4 w-4 text-emerald-500" />
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">
                    {currentChallenge.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 font-bold uppercase">
                    {currentChallenge.category}
                  </span>
                  <DifficultyBadge difficulty={currentChallenge.difficulty} />
                </div>
              </div>

              {/* Code Snippet Container */}
              <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs text-neutral-200 overflow-x-auto">
                <pre className="leading-relaxed">
                  <code>{currentChallenge.code}</code>
                </pre>
              </div>

              <p className="font-bold text-sm text-neutral-900 dark:text-neutral-100 pt-1">
                {currentChallenge.question}
              </p>
            </div>
          </div>

          {/* Right Column: Answers & Explanation (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase text-neutral-400 font-bold tracking-wider">
                Select Option (Keys 1-4):
              </span>

              {currentChallenge.answers.map((answer, idx) => {
                const isSelected = selectedAnswer === idx
                const isCorrect = idx === currentChallenge.correctAnswer
                let buttonStyle =
                  "border-neutral-200 bg-white hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 text-neutral-900 dark:text-neutral-100"

                if (isAnswered) {
                  if (isCorrect) {
                    buttonStyle =
                      "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold"
                  } else if (isSelected && !isCorrect) {
                    buttonStyle =
                      "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300 font-bold"
                  } else {
                    buttonStyle = "border-neutral-200 bg-neutral-50 text-neutral-400 opacity-60 dark:border-neutral-800 dark:bg-neutral-950"
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full text-left rounded-xl border p-4 font-mono text-xs transition-all flex items-start justify-between gap-3 ${buttonStyle}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-neutral-100 text-[10px] font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{answer}</span>
                    </div>

                    {isAnswered && isCorrect && <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />}
                    {isAnswered && isSelected && !isCorrect && <X className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />}
                  </button>
                )
              })}
            </div>

            {/* Explanation Box when Answered */}
            {isAnswered && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <BookOpen className="h-4 w-4" />
                  <span>Technical Explanation:</span>
                </div>

                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                  {currentChallenge.explanation}
                </p>

                <Button
                  onClick={handleNextChallenge}
                  className="w-full font-mono text-xs gap-2 bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
                >
                  <span>
                    {currentIndex + 1 < activeChallenges.length ? "Next Challenge" : "View Final Results"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
