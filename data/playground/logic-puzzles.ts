export type LogicCategory =
  | "PATTERNS"
  | "SEQUENCES"
  | "DEDUCTION"
  | "NUMBERS"
  | "BOOLEAN"
  | "PROBLEM_SOLVING"

export interface LogicPuzzle {
  id: string
  title: string
  category: LogicCategory
  difficulty: "EASY" | "MEDIUM" | "HARD"
  question: string
  codeSnippet?: string
  options: string[]
  correctAnswer: number // 0-indexed
  explanation: string
}

export const LOGIC_PUZZLES: LogicPuzzle[] = [
  {
    id: "seq-001",
    title: "The Growing Differences",
    category: "SEQUENCES",
    difficulty: "EASY",
    question: "What comes next in the sequence?\n2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "44"],
    correctAnswer: 2,
    explanation: "The differences between consecutive numbers increase by +2 each step: +4, +6, +8, +10. The next difference is +12, so 30 + 12 = 42."
  },
  {
    id: "bool-002",
    title: "Boolean Short-Circuiting",
    category: "BOOLEAN",
    difficulty: "EASY",
    question: "Given A = true, B = false, C = true, what is the result of:\n!(A && B) || (B && C)?",
    options: ["true", "false", "undefined", "null"],
    correctAnswer: 0,
    explanation: "(A && B) evaluates to false because B is false. !(false) becomes true. Since true || anything evaluates to true instantly, the answer is true."
  },
  {
    id: "pat-003",
    title: "Binary Doubling",
    category: "NUMBERS",
    difficulty: "EASY",
    question: "Which number completes the pattern?\n1, 3, 7, 15, 31, ?",
    options: ["60", "63", "64", "65"],
    correctAnswer: 1,
    explanation: "Each number is calculated by x * 2 + 1. (31 * 2) + 1 = 63. Alternatively, powers of 2 minus 1 (2⁶ - 1 = 63)."
  },
  {
    id: "ded-004",
    title: "Server Deployment Logic",
    category: "DEDUCTION",
    difficulty: "MEDIUM",
    question: "Three servers (Alpha, Beta, Gamma) hosted an app. Alpha is faster than Beta. Gamma is not slower than Alpha. Which statement is guaranteed true?",
    options: [
      "Beta is the fastest server",
      "Gamma is the fastest (or tied for fastest) server",
      "Alpha and Beta are identical speed",
      "Gamma is slower than Beta"
    ],
    correctAnswer: 1,
    explanation: "Speed order: Alpha > Beta. Gamma ≥ Alpha. Since Gamma is greater than or equal to Alpha, Gamma is at least as fast as Alpha, making Gamma the fastest server."
  },
  {
    id: "pat-005",
    title: "Fibonacci Index Trap",
    category: "SEQUENCES",
    difficulty: "MEDIUM",
    question: "Consider: 1, 1, 2, 3, 5, 8, 13, 21. What is the sum of the 9th and 10th terms?",
    options: ["55", "89", "144", "120"],
    correctAnswer: 2,
    explanation: "The 9th term is 13 + 21 = 34. The 10th term is 21 + 34 = 55. The sum of the 9th and 10th terms is 34 + 55 = 89 + 55 = 144 (which is also the 12th Fibonacci number)."
  },
  {
    id: "code-006",
    title: "Recursive Call Count",
    category: "PROBLEM_SOLVING",
    difficulty: "MEDIUM",
    codeSnippet: `function fn(n) {
  if (n <= 1) return 1;
  return fn(n - 1) + fn(n - 2);
}`,
    question: "How many total calls to fn() are made when calculating fn(4)?",
    options: ["5", "7", "9", "11"],
    correctAnswer: 2,
    explanation: "fn(4) calls fn(3) and fn(2). fn(3) calls fn(2) and fn(1). fn(2) calls fn(1) and fn(0). Total function executions: fn(4)[1] + fn(3)[1] + fn(2)[2] + fn(1)[3] + fn(0)[2] = 9 total calls."
  },
  {
    id: "bool-007",
    title: "De Morgan's Laws",
    category: "BOOLEAN",
    difficulty: "HARD",
    question: "According to De Morgan's Laws, the logical expression !(X || Y) is logically equivalent to:",
    options: [
      "!X || !Y",
      "!X && !Y",
      "X && Y",
      "!(X && Y)"
    ],
    correctAnswer: 1,
    explanation: "De Morgan's law states that negating a disjunction !(X || Y) produces the conjunction of negations: !X && !Y."
  },
  {
    id: "prob-008",
    title: "The Water Jug Riddle",
    category: "PROBLEM_SOLVING",
    difficulty: "HARD",
    question: "You have a 5-liter jug and a 3-liter jug with unlimited water. How can you measure exactly 4 liters?",
    options: [
      "Fill 5L, pour into 3L (leaving 2L in 5L). Empty 3L, pour the 2L into 3L. Fill 5L again, pour into 3L until full (pouring 1L). 4L remains in 5L jug.",
      "Fill 3L twice and pour into 5L until full.",
      "Fill 5L halfway",
      "It is mathematically impossible with prime numbers"
    ],
    correctAnswer: 0,
    explanation: "Filling 5L, transferring 3L leaves 2L in 5L. Moving 2L into empty 3L jug leaves 1L space in 3L jug. Filling 5L and filling the remaining 1L of 3L leaves exactly 4L in the 5L jug."
  },
  {
    id: "seq-009",
    title: "Alternating Multipliers",
    category: "SEQUENCES",
    difficulty: "MEDIUM",
    question: "What number comes next?\n3, 6, 12, 15, 30, 33, ?",
    options: ["36", "66", "60", "99"],
    correctAnswer: 1,
    explanation: "The pattern alternates operations: (* 2), (+ 3), (* 2), (+ 3), (* 2), (+ 3). After 33 (+ 3 step), the next operation is * 2. 33 * 2 = 66."
  },
  {
    id: "ded-010",
    title: "Bug Priority Ordering",
    category: "DEDUCTION",
    difficulty: "EASY",
    question: "Bug P is higher priority than Bug Q. Bug R is lower priority than Bug Q. Bug S is higher priority than Bug P. Which bug has the lowest priority?",
    options: ["Bug P", "Bug Q", "Bug R", "Bug S"],
    correctAnswer: 2,
    explanation: "Priority rank from highest to lowest: Bug S > Bug P > Bug Q > Bug R. Bug R is at the very bottom."
  }
]
