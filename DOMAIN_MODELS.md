# Domain Models

**Date**: 2025-12-07

Core data entities that represent the app's business logic.

---

## Quiz Session

A single playthrough of 10 questions.

```typescript
interface QuizSessionState {
  sessionId: string;              // Unique identifier
  questions: Question[];          // 10 questions
  currentQuestionIndex: number;   // 0-9
  sessionResults: QuestionResult[]; // Answers so far
  sessionPhase: SessionPhase;     // Current state
  startTime: Date;                // When started
}
```

**Lifecycle:** active → transition → active → ... → summary

---

## Question

A single problem to solve. Type varies by quiz mode.

### Addition Quiz
```typescript
interface MathProblem {
  num1: number;           // First number (10-50)
  num2: number;           // Second number (10-50)
  operation: '+';         // Always addition
  expectedAnswer: number; // Correct sum
}
```

### 10-Frame Quiz
```typescript
interface TenFrameQuestion {
  number: number;         // Dots shown (1-10 for recognition, 1-9 for make10)
  correctAnswer: number;  // Expected answer
}
```

---

## Question Result

User's performance on one question.

```typescript
interface QuestionResult {
  questionIndex: number;    // 0-9
  problem: Question;        // The question asked
  correct: boolean;         // Got it right?
  interactions: number;     // Number of attempts
  timeSpent: number;        // Milliseconds
}
```

---

## Quiz Type

Category of quiz.

```typescript
type QuizType = 'addition' | 'recognition' | 'make10';
```

- **addition**: Decompose and add two numbers
- **recognition**: Identify number shown in 10-frame
- **make10**: Find how many more to make 10

---

## Session Phase

Current state of quiz session.

```typescript
type SessionPhase = 'active' | 'transition' | 'summary';
```

- **active**: User answering question
- **transition**: "Good! 🎉" screen (1.5s)
- **summary**: Final score and star rating

---

## Star Rating

Performance score (1-5 stars).

**Calculation:**
- 10/10 correct → 5 stars
- 8-9 correct → 4 stars
- 6-7 correct → 3 stars
- 4-5 correct → 2 stars
- 0-3 correct → 1 star

---

## Relationships

```
QuizSession
  ├── contains 10 Questions (MathProblem or TenFrameQuestion)
  ├── has QuizType (addition, recognition, make10)
  ├── tracks SessionPhase (active, transition, summary)
  └── collects QuestionResults (one per answered question)

QuestionResult
  ├── references one Question
  └── belongs to one QuizSession
```

---

## File Locations

```
features/addition-quiz/types/
  ├── MathProblem.ts      // MathProblem interface
  └── Quiz.ts             // QuizSessionState, QuestionResult

features/ten-frame/types/
  └── TenFrame.ts         // TenFrameQuestion, TenFrameQuizState
```
