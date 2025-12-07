# 10-Question Quiz Flow - Design Document

## Overview
This document outlines the design and integration strategy for adding a 10-question quiz flow to the math learning app. The feature will guide children (ages 5-7) through a sequence of 10 addition problems, tracking progress and providing engaging feedback.

---

## Current Architecture Analysis

### Existing Components
- **InteractiveMathProblem**: Core component implementing the 4-layer teaching method
  - Layer 1: Question display (e.g., "12 + 24 = ?")
  - Layer 2: Number decomposition (split into tens and units)
  - Layer 3: Collection area (organize pieces by place value)
  - Layer 4: Multiple choice final answer
- **App.tsx**: Currently shows a single hardcoded problem
- **Callback**: `onComplete(correct, interactions)` fires when problem is solved

### Current Limitation
- Only one problem is shown
- No mechanism to advance to the next question
- No progress tracking across multiple problems
- No session management or persistence

---

## Recommended Approach: Quiz Session Manager

### Architecture Overview

```
App.tsx
  └── QuizSession (new component)
      ├── QuizHeader (progress indicator)
      ├── InteractiveMathProblem (reused, unchanged)
      ├── TransitionScreen (celebration between questions)
      └── SummaryScreen (final results)
```

**Key Principle**: Minimal changes to existing InteractiveMathProblem component. Let QuizSession orchestrate the flow.

---

## Component Specifications

### 1. QuizSession Component (New)

**Purpose**: Orchestrates the entire 10-question flow, manages state, persistence, and transitions.

**State Management**:
```typescript
interface QuizSessionState {
  sessionId: string;                    // Unique identifier for IndexedDB
  questions: MathProblem[];             // Array of 10 generated problems
  currentQuestionIndex: number;         // 0-9
  sessionResults: QuestionResult[];     // Results for each completed question
  sessionPhase: 'active' | 'transition' | 'summary';
  startTime: Date;                      // For session duration tracking
}

interface QuestionResult {
  questionIndex: number;
  problem: MathProblem;
  correct: boolean;
  attempts: number;                     // Number of wrong answers before correct
  interactions: number;                 // Total clicks/interactions
  timeSpent: number;                    // Seconds spent on this question
}
```

**Key Behaviors**:
1. **Initialization**: Generate 10 problems on mount (or load saved session)
2. **Question Display**: Render InteractiveMathProblem with current question
3. **Completion Handler**: When `onComplete` fires:
   - Save result to sessionResults
   - Save progress to IndexedDB
   - Transition to celebration screen (1.5-2s)
   - Auto-advance to next question
4. **Session End**: After question 10, show SummaryScreen

**Props**:
```typescript
interface QuizSessionProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onSessionComplete?: (results: QuizSessionSummary) => void;
  resumeSessionId?: string;             // Optional: resume saved session
}
```

---

### 2. QuizHeader Component (New)

**Purpose**: Display progress and keep child engaged.

**Visual Design**:
```
┌─────────────────────────────────────┐
│  Question 3 of 10                   │
│  ⭐⭐⭐○○○○○○○                      │
│  Score: 3/3 correct                 │
└─────────────────────────────────────┘
```

**Features**:
- Current question number (large, clear text)
- Visual progress indicator (filled stars for completed, empty for remaining)
- Current score (optional, may add pressure for some kids)
- Color-coded: green stars for correct, gray circles for pending

**Props**:
```typescript
interface QuizHeaderProps {
  currentQuestion: number;      // 1-10 (display as 1-indexed)
  totalQuestions: number;        // Always 10
  correctCount: number;          // Number of correct answers so far
}
```

---

### 3. TransitionScreen Component (New)

**Purpose**: Brief celebration between questions to maintain engagement.

**Duration**: 1.5-2 seconds (auto-advance, no button)

**Visual Design**:
```
┌─────────────────────────────────────┐
│                                     │
│         ✓ Great Job!                │
│                                     │
│     (Large checkmark animation)     │
│                                     │
└─────────────────────────────────────┘
```

**Variations** (random selection):
- "Awesome!"
- "Great job!"
- "Perfect!"
- "You did it!"
- "Excellent!"

**Props**:
```typescript
interface TransitionScreenProps {
  onTransitionComplete: () => void;     // Called after 1.5-2s
  correct: boolean;                     // For future: different messages for incorrect
}
```

---

### 4. SummaryScreen Component (New)

**Purpose**: Celebrate completion and show final results.

**Visual Design**:
```
┌─────────────────────────────────────┐
│                                     │
│    🎉 Quiz Complete! 🎉             │
│                                     │
│    You got 8 out of 10 correct!     │
│                                     │
│    ⭐⭐⭐⭐                           │
│    (Star rating based on score)     │
│                                     │
│    [Try Again]  [Main Menu]         │
│                                     │
└─────────────────────────────────────┘
```

**Features**:
- Large celebration message
- Score display (X out of 10)
- Star rating:
  - 10/10: 5 stars + "Perfect!"
  - 8-9/10: 4 stars + "Great!"
  - 6-7/10: 3 stars + "Good job!"
  - 4-5/10: 2 stars + "Keep practicing!"
  - 0-3/10: 1 star + "Try again!"
- Action buttons:
  - "Try Again": Start new quiz session
  - "Main Menu": Return to app home (future)

**Props**:
```typescript
interface SummaryScreenProps {
  totalQuestions: number;
  correctCount: number;
  sessionResults: QuestionResult[];
  onTryAgain: () => void;
  onMainMenu: () => void;
}
```

---

## User Flow Diagram

```
START
  │
  ├─ [QuizSession initializes]
  │   ├─ Generate 10 problems
  │   ├─ Set currentQuestionIndex = 0
  │   └─ Load QuizHeader
  │
  ├─ [Show Question 1]
  │   ├─ QuizHeader: "Question 1 of 10"
  │   ├─ InteractiveMathProblem renders
  │   └─ Child completes 4-layer flow
  │
  ├─ [Question Complete]
  │   ├─ onComplete callback fires
  │   ├─ Save result to state
  │   ├─ Save to IndexedDB
  │   └─ Show TransitionScreen (1.5s)
  │
  ├─ [Auto-advance]
  │   ├─ Increment currentQuestionIndex
  │   └─ If index < 10: Show next question
  │       Else: Show SummaryScreen
  │
  ├─ [Repeat for Questions 2-10]
  │
  └─ [SummaryScreen]
      ├─ Display final score
      ├─ Show star rating
      ├─ Offer "Try Again" or "Main Menu"
      └─ Save final session to IndexedDB
```

---

## Question Generation Strategy

### Problem Generator Utility

```typescript
interface ProblemGeneratorConfig {
  count: number;                    // Number of problems to generate
  difficulty: 'easy' | 'medium' | 'hard';
  operation: '+' | '-';             // For future: support subtraction
  avoidDuplicates: boolean;         // Don't repeat same problem
}

function generateQuizProblems(config: ProblemGeneratorConfig): MathProblem[]
```

### Difficulty Levels

**Easy** (Ages 5-6):
- Range: 1-20 for both numbers
- Examples: 5 + 3, 12 + 7, 8 + 11
- Focus: Single-digit and teens

**Medium** (Ages 6-7):
- Range: 10-50 for both numbers
- Examples: 15 + 23, 32 + 18, 27 + 14
- Focus: Place value understanding

**Hard** (Ages 7+):
- Range: 30-99 for both numbers
- Examples: 45 + 38, 67 + 22, 54 + 39
- Focus: Advanced decomposition

### Question Distribution (Recommended)

For **Medium difficulty** (default):
- Questions 1-3: Easy warmup (10-20 range)
- Questions 4-7: Medium (20-40 range)
- Questions 8-10: Challenging (40-70 range)

This progressive difficulty maintains engagement without overwhelming.

---

## IndexedDB Schema

### Database: `MathAppDB`

### Object Store: `quizSessions`

```typescript
interface QuizSessionRecord {
  id: string;                       // UUID
  timestamp: Date;                  // Session start time
  difficulty: 'easy' | 'medium' | 'hard';
  questions: MathProblem[];         // All 10 problems
  results: QuestionResult[];        // Results (grows as questions completed)
  currentQuestionIndex: number;     // For resume functionality
  completed: boolean;               // true when all 10 done
  finalScore: number;               // correctCount / totalQuestions
  totalTimeSeconds: number;         // Total time for session
}
```

### Save Points
1. **Session Start**: Create record with empty results
2. **After Each Question**: Update results array and currentQuestionIndex
3. **Session Complete**: Mark completed, save finalScore

### Resume Logic
- On app load, check for incomplete session
- If found, offer "Resume Quiz" or "Start New"
- Load session by ID and continue from currentQuestionIndex

---

## UI/UX Considerations for Ages 5-7

### Child-Friendly Design Principles

1. **Large Touch Targets**: All buttons minimum 60px height
2. **Bright Colors**:
   - Green for correct/progress
   - Orange for operators
   - Blue for question numbers
   - Yellow stars for achievements
3. **Minimal Text**: Use icons and visuals over words
4. **Auto-Advancement**: No "Next" button needed - auto-advance after celebration
5. **No Time Pressure**: No countdown timers (can be stressful)
6. **Encouraging Language**: Always positive, never punitive
7. **Visual Feedback**: Immediate checkmarks, stars, celebrations

### Accessibility
- High contrast for readability
- Screen reader labels for all elements
- Keyboard navigation support
- Large, clear fonts (minimum 18px, prefer 24px+)

---

## Implementation Phases

### Phase 1: Core Quiz Flow (MVP)
- [ ] Create QuizSession component with basic state management
- [ ] Implement question generation utility
- [ ] Add QuizHeader with progress indicator
- [ ] Wire up question cycling (10 problems in sequence)
- [ ] Basic "Try Again" functionality

### Phase 2: Enhanced UX
- [ ] Add TransitionScreen with celebration messages
- [ ] Implement SummaryScreen with star ratings
- [ ] Add visual animations for transitions
- [ ] Polish progress indicators

### Phase 3: Persistence
- [ ] Set up IndexedDB schema
- [ ] Save progress after each question
- [ ] Implement session resume functionality
- [ ] Add session history view (optional)

### Phase 4: Advanced Features
- [ ] Adaptive difficulty (adjust based on performance)
- [ ] Multiple difficulty modes
- [ ] Streak tracking ("3 perfect scores in a row!")
- [ ] Achievements system
- [ ] Parent/teacher dashboard (optional)

---

## Alternative Approaches Considered

### Option B: App-Level State Management
**Description**: Keep all quiz logic in App.tsx without creating QuizSession component.

**Pros**:
- Simpler initial implementation
- Fewer components

**Cons**:
- App.tsx becomes bloated and complex
- Harder to test independently
- Violates single responsibility principle
- Less reusable

**Verdict**: Not recommended. QuizSession provides better separation of concerns.

---

### Option C: Continuous Carousel Mode
**Description**: Questions flow in a carousel/slider with swipe gestures.

**Pros**:
- Modern, engaging UI
- Smooth transitions

**Cons**:
- May be overwhelming for ages 5-7
- Harder to track progress mentally
- More complex state management
- Not aligned with 4-layer persistent design

**Verdict**: Could be explored for future "advanced mode" but not recommended for initial implementation.

---

## Open Questions & Decisions Needed

### 1. Auto-Advance Timing
**Question**: How long should TransitionScreen display before advancing?

**Options**:
- 1 second: Fast, maintains momentum
- 1.5 seconds: Balanced (recommended)
- 2 seconds: Ensures child sees celebration

**Recommendation**: 1.5 seconds with option to make configurable

---

### 2. Resume Behavior
**Question**: If child closes browser mid-session, should they resume or start fresh?

**Options**:
- A) Always resume automatically
- B) Ask user: "Resume Quiz" or "Start New"
- C) Never resume, always start fresh

**Recommendation**: Option B - Offer choice. Some kids may want a fresh start.

---

### 3. Score Display During Quiz
**Question**: Should QuizHeader show running score (e.g., "3/3 correct")?

**Pros**:
- Motivates high achievers
- Provides feedback

**Cons**:
- May stress struggling learners
- Could discourage if score is low

**Recommendation**: Make optional/configurable. Start without it, add as setting later.

---

### 4. Incorrect Attempt Handling
**Question**: Should multiple incorrect attempts affect final score?

**Options**:
- A) Only track correct/incorrect (current behavior works)
- B) Track attempts, show in summary ("8/10 correct, 3 questions needed hints")
- C) Penalty scoring (not recommended for ages 5-7)

**Recommendation**: Option A for simplicity. Track attempts for analytics but don't penalize.

---

### 5. Question Difficulty Mix
**Question**: Should all 10 questions be same difficulty or progress?

**Options**:
- A) All same difficulty (consistent experience)
- B) Progressive difficulty (3 easy → 4 medium → 3 hard)
- C) Adaptive (adjust based on performance)

**Recommendation**: Start with Option A (same difficulty), add Option B in Phase 2, Option C in Phase 4.

---

## Success Metrics

### Key Performance Indicators (KPIs)

1. **Completion Rate**: % of started sessions completed (all 10 questions)
   - Target: >80%

2. **Average Score**: Mean correct answers per session
   - Target: 7/10 or higher

3. **Time Per Question**: Average seconds per question
   - Baseline: 45-60 seconds (based on 4-layer interaction)

4. **Engagement**: Do children start multiple sessions?
   - Target: >50% return for second session

5. **Error Rate**: Average incorrect attempts per question
   - Target: <2 attempts per question

### Testing Requirements

- [ ] Unit tests for question generator
- [ ] Component tests for QuizSession, QuizHeader, SummaryScreen
- [ ] Integration tests for full quiz flow
- [ ] IndexedDB persistence tests
- [ ] User testing with target age group (5-7 year olds)

---

## Technical Implementation Notes

### File Structure
```
app/src/
  ├── components/
  │   ├── InteractiveMathProblem.tsx       (existing, unchanged)
  │   ├── QuizSession.tsx                  (new)
  │   ├── QuizHeader.tsx                   (new)
  │   ├── TransitionScreen.tsx             (new)
  │   └── SummaryScreen.tsx                (new)
  ├── utils/
  │   ├── problemGenerator.ts              (new)
  │   └── indexedDBManager.ts              (new)
  ├── types/
  │   └── Quiz.ts                          (new)
  └── App.tsx                              (modified to use QuizSession)
```

### CSS Considerations
- Create `QuizSession.css` for quiz-specific styling
- Maintain existing `InteractiveMathProblem.css` unchanged
- Use consistent color scheme (green for progress, bright for engagement)

### Performance
- Generate all 10 questions upfront (avoid delay between questions)
- Lazy load SummaryScreen component (not needed until end)
- Debounce IndexedDB saves (save after each question, not each interaction)

---

## Next Steps

1. **Review this document** and provide feedback/decisions on open questions
2. **Prioritize features**: Which phases to implement first?
3. **Design mockups**: Visual designs for new components (QuizHeader, TransitionScreen, SummaryScreen)
4. **Begin implementation**: Start with Phase 1 (Core Quiz Flow)

---

## Appendix: Example Quiz Session Flow (Code Sketch)

```typescript
// QuizSession.tsx (simplified structure)
const QuizSession: React.FC<QuizSessionProps> = ({ difficulty = 'medium' }) => {
  const [sessionState, setSessionState] = useState<QuizSessionState>({
    sessionId: generateUUID(),
    questions: generateQuizProblems({ count: 10, difficulty }),
    currentQuestionIndex: 0,
    sessionResults: [],
    sessionPhase: 'active',
    startTime: new Date()
  });

  const handleQuestionComplete = (correct: boolean, interactions: number) => {
    const result: QuestionResult = {
      questionIndex: sessionState.currentQuestionIndex,
      problem: sessionState.questions[sessionState.currentQuestionIndex],
      correct,
      attempts: /* track from InteractiveMathProblem */,
      interactions,
      timeSpent: /* calculate */
    };

    // Save result
    setSessionState(prev => ({
      ...prev,
      sessionResults: [...prev.sessionResults, result],
      sessionPhase: 'transition'
    }));

    // Save to IndexedDB
    saveQuizProgress(sessionState.sessionId, result);

    // Auto-advance after celebration
    setTimeout(() => {
      if (sessionState.currentQuestionIndex < 9) {
        setSessionState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          sessionPhase: 'active'
        }));
      } else {
        setSessionState(prev => ({ ...prev, sessionPhase: 'summary' }));
      }
    }, 1500);
  };

  return (
    <div className="quiz-session">
      {sessionState.sessionPhase === 'active' && (
        <>
          <QuizHeader
            currentQuestion={sessionState.currentQuestionIndex + 1}
            totalQuestions={10}
            correctCount={sessionState.sessionResults.filter(r => r.correct).length}
          />
          <InteractiveMathProblem
            problem={sessionState.questions[sessionState.currentQuestionIndex]}
            onComplete={handleQuestionComplete}
          />
        </>
      )}

      {sessionState.sessionPhase === 'transition' && (
        <TransitionScreen onTransitionComplete={() => {/* handled by timeout */}} />
      )}

      {sessionState.sessionPhase === 'summary' && (
        <SummaryScreen
          totalQuestions={10}
          correctCount={sessionState.sessionResults.filter(r => r.correct).length}
          sessionResults={sessionState.sessionResults}
          onTryAgain={() => {/* restart */}}
          onMainMenu={() => {/* future */}}
        />
      )}
    </div>
  );
};
```

---

**Document Version**: 1.0
**Last Updated**: 2025-12-06
**Status**: Draft for Review
