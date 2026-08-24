export type Difficulty = "EASY" | "MEDIUM" | "HARD"

export type BugCategory =
  | "JAVASCRIPT"
  | "TYPESCRIPT"
  | "REACT"
  | "NEXTJS"
  | "CSS"
  | "NODEJS"
  | "SECURITY"

export interface BugHuntChallenge {
  id: string
  title: string
  category: BugCategory
  difficulty: Difficulty
  code: string
  question: string
  answers: string[]
  correctAnswer: number // 0-indexed
  explanation: string
}

export const BUG_HUNT_CHALLENGES: BugHuntChallenge[] = [
  {
    id: "js-loop-001",
    title: "Array Loop Out of Bounds",
    category: "JAVASCRIPT",
    difficulty: "EASY",
    code: `const numbers = [1, 2, 3, 4];

for (let i = 0; i <= numbers.length; i++) {
  console.log(numbers[i]);
}`,
    question: "What issue will occur when executing this loop?",
    answers: [
      "The loop will crash with a SyntaxError",
      "Using <= causes an extra iteration logging undefined at the end",
      "console.log cannot access array elements inside loops",
      "Nothing, the code runs correctly and prints 1, 2, 3, 4"
    ],
    correctAnswer: 1,
    explanation: "Using i <= numbers.length causes the loop to run numbers.length + 1 times. On the last iteration (i = 4), numbers[4] is undefined because zero-indexed arrays end at length - 1."
  },
  {
    id: "js-closure-002",
    title: "Var Loop Scope Trap",
    category: "JAVASCRIPT",
    difficulty: "EASY",
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}`,
    question: "What will be printed to the console after 100ms?",
    answers: [
      "0, 1, 2",
      "3, 3, 3",
      "0, 0, 0",
      "undefined, undefined, undefined"
    ],
    correctAnswer: 1,
    explanation: "Because var is function-scoped rather than block-scoped, all callback functions share the single variable i. By the time the callbacks execute, i has already reached 3."
  },
  {
    id: "react-mutation-003",
    title: "Direct State Mutation in React",
    category: "REACT",
    difficulty: "MEDIUM",
    code: `const [items, setItems] = useState(["Apple", "Banana"]);

const addItem = (newItem: string) => {
  items.push(newItem);
  setItems(items);
};`,
    question: "Why does React fail to re-render when addItem is called?",
    answers: [
      "items.push is an async function in React",
      "setItems requires a string argument, not an array",
      "Mutating the existing state array keeps the object reference identical, so React skips the re-render",
      "State variables created with useState cannot store arrays"
    ],
    correctAnswer: 2,
    explanation: "React relies on Object.is reference equality to detect state changes. Mutating the existing array with push() maintains the exact same array reference in setItems(items), causing React to bail out of re-rendering."
  },
  {
    id: "ts-any-type-004",
    title: "TypeScript Exhaustiveness Guard",
    category: "TYPESCRIPT",
    difficulty: "MEDIUM",
    code: `type Action = { type: "START" } | { type: "STOP" };

function handleAction(action: Action) {
  switch (action.type) {
    case "START":
      return "Starting";
    case "STOP":
      return "Stopping";
    default:
      const _exhaustiveCheck: never = action;
      return _exhaustiveCheck;
  }
}`,
    question: "What happens in TypeScript if a new action { type: 'PAUSE' } is added to the Action union?",
    answers: [
      "TypeScript compiles silently and defaults to returning 'Stopping'",
      "TypeScript raises a compile error because action cannot be assigned to type never",
      "It throws a runtime ReferenceError",
      "The switch statement throws a TypeMismatchException at runtime"
    ],
    correctAnswer: 1,
    explanation: "Assigning action to type 'never' in default guarantees compile-time exhaustiveness checks. Adding an unhandled member 'PAUSE' to the union forces a TypeScript compiler error."
  },
  {
    id: "react-stale-closure-005",
    title: "Stale Closure in useEffect",
    category: "REACT",
    difficulty: "HARD",
    code: `const [count, setCount] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);`,
    question: "What will happen to the count state value after 5 seconds?",
    answers: [
      "It increments to 5 normally",
      "It remains stuck at 1 because count in the closure is trapped at 0",
      "It throws a re-render limit exceeded exception",
      "The timer is destroyed immediately so count never increments"
    ],
    correctAnswer: 1,
    explanation: "Because useEffect has an empty dependency array [], the interval closure captures the initial count value (0). Every second, it executes setCount(0 + 1), resetting count repeatedly to 1."
  },
  {
    id: "nextjs-hydration-006",
    title: "Hydration Mismatch Trap",
    category: "NEXTJS",
    difficulty: "MEDIUM",
    code: `export default function DateHeader() {
  return (
    <div>
      Current Time: {new Date().toLocaleTimeString()}
    </div>
  );
}`,
    question: "What error will Next.js produce when rendering this component on the server and client?",
    answers: [
      "Server Component Execution Timeout",
      "Hydration Mismatch Error because server output differs from client initial render",
      "Static Generation Failed due to missing useEffect",
      "Security Warning for exposing browser clock"
    ],
    correctAnswer: 1,
    explanation: "Server-side HTML rendering bakes in the server's time timestamp. When the browser hydrates the client bundle a moment later, the time string is different, causing React to throw a Hydration Mismatch error."
  },
  {
    id: "nodejs-async-007",
    title: "Unhandled Promise Rejection",
    category: "NODEJS",
    difficulty: "EASY",
    code: `async function fetchData() {
  throw new Error("Network Timeout");
}

function process() {
  fetchData();
  console.log("Processing finished");
}`,
    question: "What happens when process() is invoked in Node.js?",
    answers: [
      "The error is caught automatically by Node.js global boundary",
      "console.log runs, but an UnhandledPromiseRejection warning/crash occurs",
      "fetchData halts execution before console.log can run",
      "Node.js converts the thrown Error into null"
    ],
    correctAnswer: 1,
    explanation: "Invoking an async function without await, .catch(), or try/catch creates an unhandled promise rejection. In modern Node.js, unhandled rejections log errors and can terminate the process."
  },
  {
    id: "css-specificity-008",
    title: "CSS Selector Specificity Conflict",
    category: "CSS",
    difficulty: "EASY",
    code: `<div id="card" class="box container">Text</div>

<style>
  div.container { color: blue; }
  #card { color: red; }
  .box { color: green !important; }
</style>`,
    question: "Which color will the text inside the div element be rendered?",
    answers: [
      "Blue",
      "Red",
      "Green",
      "Black"
    ],
    correctAnswer: 2,
    explanation: "Although ID selectors (#card) have higher normal specificity than classes, the !important flag overrides normal specificity rules, making color: green winning."
  },
  {
    id: "sec-xss-009",
    title: "Dangerous HTML Injection",
    category: "SECURITY",
    difficulty: "MEDIUM",
    code: `function UserComment({ rawHtml }: { rawHtml: string }) {
  return <div dangerouslySetInnerHTML={{ __html: rawHtml }} />;
}`,
    question: "What severe security vulnerability does this component introduce if rawHtml comes from user input?",
    answers: [
      "Cross-Site Request Forgery (CSRF)",
      "Reflected Cross-Site Scripting (XSS)",
      "SQL Injection (SQLi)",
      "Server-Side Request Forgery (SSRF)"
    ],
    correctAnswer: 1,
    explanation: "dangerouslySetInnerHTML renders raw string input directly into the DOM without sanitization. An attacker can inject malicious <script> tags or onerror image handlers to execute arbitrary JavaScript in the victim's session."
  },
  {
    id: "ts-optional-chain-010",
    title: "Nullish Coalescing vs Logical OR",
    category: "TYPESCRIPT",
    difficulty: "EASY",
    code: `const userConfig = {
  maxRetries: 0
};

const retries = userConfig.maxRetries || 3;
console.log(retries);`,
    question: "What value will retries evaluate to?",
    answers: [
      "0",
      "3",
      "undefined",
      "NaN"
    ],
    correctAnswer: 1,
    explanation: "The logical OR (||) treats 0 as falsy, so it falls back to 3. To preserve legitimate falsy values like 0 or empty string '', the nullish coalescing operator (??) should be used instead."
  },
  {
    id: "react-key-prop-011",
    title: "Index as React Key Anti-Pattern",
    category: "REACT",
    difficulty: "MEDIUM",
    code: `{items.map((item, index) => (
  <TodoItem key={index} text={item.text} />
))}`,
    question: "Why is using array index as a key problematic when reordering or deleting items?",
    answers: [
      "It causes a TypeScript compilation error",
      "React re-uses item component instances incorrectly, causing UI bugs in input state or animations",
      "Index keys consume double memory in React VDOM",
      "React throws a duplicate key exception"
    ],
    correctAnswer: 1,
    explanation: "React relies on keys to identify items across renders. Using array index causes key values to change position whenever items are added, deleted, or reordered, corrupting internal state of child components."
  },
  {
    id: "js-equality-012",
    title: "Loose Equality Trap",
    category: "JAVASCRIPT",
    difficulty: "EASY",
    code: `console.log([] == ![]);`,
    question: "What does this expression evaluate to in JavaScript?",
    answers: [
      "true",
      "false",
      "TypeError",
      "undefined"
    ],
    correctAnswer: 0,
    explanation: "![ ] evaluates to false. So [] == false. In double-equals coercion, false converts to 0, and [ ] converts to empty string '' which converts to 0. Thus 0 == 0 evaluates to true!"
  },
  {
    id: "react-effect-dep-013",
    title: "Infinite Render Loop in useEffect",
    category: "REACT",
    difficulty: "HARD",
    code: `const [data, setData] = useState({ count: 0 });

useEffect(() => {
  setData({ count: data.count + 1 });
}, [data]);`,
    question: "What happens when this component mounts?",
    answers: [
      "The count updates once to 1 and stops",
      "It causes an infinite re-render loop that crashes the browser tab",
      "React ignores the useEffect hook completely",
      "It throws an InvalidDependencyArray warning"
    ],
    correctAnswer: 1,
    explanation: "Inside useEffect, setData creates a new object reference { count: ... }. Because object references are unequal on every render, the dependency array [data] triggers useEffect again indefinitely."
  },
  {
    id: "ts-readonly-014",
    title: "TypeScript Deep Readonly Guard",
    category: "TYPESCRIPT",
    difficulty: "HARD",
    code: `interface Config {
  readonly server: {
    port: number;
  };
}

const config: Config = { server: { port: 8080 } };
config.server.port = 9090;`,
    question: "Does TypeScript prevent modifying config.server.port in the code above?",
    answers: [
      "Yes, TypeScript throws a readonly modification error",
      "No, readonly on server is shallow; modifying nested properties like server.port is permitted unless defined Readonly<{ port: number }>",
      "Yes, but only in strictNullChecks mode",
      "No, interfaces in TypeScript are always mutable"
    ],
    correctAnswer: 1,
    explanation: "The readonly modifier in TypeScript interface property definitions is shallow. Marking server as readonly prevents reassigning config.server = ..., but nested properties remain mutable unless explicitly typed."
  },
  {
    id: "sec-auth-015",
    title: "Insecure JWT Storage",
    category: "SECURITY",
    difficulty: "HARD",
    code: `// Storing auth token after login
localStorage.setItem("authToken", response.token);`,
    question: "What primary risk occurs when storing sensitive authentication JWTs in localStorage?",
    answers: [
      "Tokens expire after 1 hour automatically",
      "Any XSS vulnerability in the app enables attackers to read localStorage and steal session tokens",
      "localStorage cannot store strings longer than 128 characters",
      "Browsers delete localStorage on tab close"
    ],
    correctAnswer: 1,
    explanation: "localStorage is accessible via JavaScript in the same origin. If an XSS vulnerability exists, malicious script can read localStorage.setItem keys and exfiltrate authentication tokens. HTTP-only cookies are safer."
  }
]
