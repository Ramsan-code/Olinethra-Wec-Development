"use client"

import * as React from "react"
import GameHeader from "./GameHeader"
import ScoreDisplay from "./ScoreDisplay"
import GameResult from "./GameResult"
import DifficultyBadge from "./DifficultyBadge"
import { LOGIC_PUZZLES, LogicPuzzle } from "@/data/playground/logic-puzzles"
import { Button } from "@/components/ui/button"
import { Check, X, ArrowRight, Brain, BookOpen } from "lucide-react"

export default function LogicPuzzleGame() {
  const ROUND_SIZE = 5

  const [activePuzzles, setActivePuzzles] = React.useState<LogicPuzzle[]>([])
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
      const saved = localStorage.getItem("olinethra_logic_best")
      if (saved) setHighScore(parseInt(saved, 10))
    } catch {
      // ignore
    }
    startNewRound()
  }, [])

  const startNewRound = () => {
    const shuffled = [...LOGIC_PUZZLES].sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE)
    setActivePuzzles(shuffled)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setCorrectCount(0)
    setStreak(0)
    setIsRoundComplete(false)
  }

  const currentPuzzle = activePuzzles[currentIndex]

  const handleAnswerSelect = (index: number) => {
    if (isAnswered || !currentPuzzle) return

    setSelectedAnswer(index)
    setIsAnswered(true)

    const isCorrect = index === currentPuzzle.correctAnswer
    if (isCorrect) {
      const addedXp = 100 + streak * 25
      const newScore = score + addedXp
      setScore(newScore)
      setCorrectCount((prev) => prev + 1)
      setStreak((prev) => prev + 1)

      try {
        if (newScore > highScore) {
          setHighScore(newScore)
          localStorage.setItem("olinethra_logic_best", newScore.toString())
        }
      } catch {
        // ignore
      }
    } else {
      setStreak(0)
    }
  }

  const handleNextPuzzle = () => {
    if (currentIndex + 1 < activePuzzles.length) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setIsRoundComplete(true)
    }
  }

  // Keyboard controls
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isRoundComplete || !currentPuzzle) return

      if (!isAnswered) {
        if (["1", "2", "3", "4"].includes(e.key)) {
          const idx = parseInt(e.key, 10) - 1
          if (idx < currentPuzzle.options.length) {
            handleAnswerSelect(idx)
          }
        }
      } else {
        if (e.key === "Enter") {
          handleNextPuzzle()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isAnswered, isRoundComplete, currentPuzzle, currentIndex])

  if (!currentPuzzle && !isRoundComplete) {
    return (
      <div className="p-12 text-center font-mono text-xs text-neutral-500">
        Loading logic puzzles...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <GameHeader
        title="Logic Puzzle"
        subtitle="Test your pattern recognition, sequence deduction, and boolean logic."
        onReset={startNewRound}
      />

      <div className="flex items-center justify-between">
        <ScoreDisplay
          score={score}
          streak={streak}
          round={currentIndex + 1}
          totalRounds={activePuzzles.length}
          highScore={highScore}
        />
      </div>

      {isRoundComplete ? (
        <GameResult
          title="Logic Round Complete!"
          score={score}
          totalQuestions={activePuzzles.length}
          correctAnswers={correctCount}
          onRestart={startNewRound}
          ctaType="CLIENT"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Puzzle Prompt (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950 shadow-sm space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">
                    {currentPuzzle.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 font-bold uppercase">
                    {currentPuzzle.category}
                  </span>
                  <DifficultyBadge difficulty={currentPuzzle.difficulty} />
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/60 font-mono text-base font-bold leading-relaxed whitespace-pre-wrap text-neutral-950 dark:text-neutral-50">
                {currentPuzzle.question}
              </div>

              {currentPuzzle.codeSnippet && (
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-xs text-neutral-200 overflow-x-auto">
                  <pre><code>{currentPuzzle.codeSnippet}</code></pre>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Answer Options & Explanation (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase text-neutral-400 font-bold tracking-wider">
                Select Solution (Keys 1-4):
              </span>

              {currentPuzzle.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx
                const isCorrect = idx === currentPuzzle.correctAnswer
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
                    className={`w-full text-left rounded-xl border p-4 font-mono text-xs transition-all flex items-center justify-between gap-3 ${buttonStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-neutral-100 text-xs font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm">{option}</span>
                    </div>

                    {isAnswered && isCorrect && <Check className="h-4 w-4 shrink-0 text-emerald-500" />}
                    {isAnswered && isSelected && !isCorrect && <X className="h-4 w-4 shrink-0 text-red-500" />}
                  </button>
                )
              })}
            </div>

            {/* Explanation Box */}
            {isAnswered && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                  <BookOpen className="h-4 w-4" />
                  <span>Logic Breakdown:</span>
                </div>

                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                  {currentPuzzle.explanation}
                </p>

                <Button
                  onClick={handleNextPuzzle}
                  className="w-full font-mono text-xs gap-2 bg-purple-600 hover:bg-purple-700 text-white mt-2"
                >
                  <span>
                    {currentIndex + 1 < activePuzzles.length ? "Next Puzzle" : "View Final Score"}
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
