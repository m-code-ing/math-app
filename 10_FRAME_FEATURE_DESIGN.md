# 10-Frame Feature - Design Document

## Overview
Add 10-frame visual learning feature to help children (ages 5-7) recognize numbers and understand "making 10" through interactive quizzes.

**Date**: 2025-12-06  
**Status**: Design Phase

---

## What is a 10-Frame?

A **10-frame** is a 2x5 rectangular grid (10 boxes total) used in early math education to:
- Help children visualize numbers 1-10
- Develop subitizing skills (recognize quantities without counting)
- Understand number bonds and relationships
- Build foundation for place value understanding

**Standard Layout**:
```
┌───┬───┬───┬───┬───┐
│ ● │ ● │ ● │ ● │ ● │  ← Top row (5 boxes)
├───┼───┼───┼───┼───┤
│ ● │ ● │   │   │   │  ← Bottom row (5 boxes)
└───┴───┴───┴───┴───┘
Example: Number 7 (5 in top row + 2 in bottom row)
```

**Filling Convention**:
- Fill left to right
- Fill top row first (all 5), then bottom row
- 5 is a key benchmark (full top row)
- 10 is a full frame

---

## Feature Requirements

### Two Quiz Modes

#### Mode 1: Number Recognition
**Goal**: Identify the number shown in a 10-frame

**Display**:
- 10-frame with dots filling some boxes
- Question: "What number is this?"
- 3 multiple choice answers (1 correct, 2 incorrect)

**Example**:
```
Frame shows: 7 dots (5 in top row, 2 in bottom row)
Question: "What number is this?"
Choices: 5, 7, 9
Correct: 7
```

**Learning Objective**: 
- Visual number recognition
- Subitizing (recognizing quantities without counting)
- Understanding 5 as a benchmark

---

#### Mode 2: Make 10
**Goal**: Determine how many more needed to make 10

**Display**:
- 10-frame with dots filling some boxes (empty boxes visible)
- Question: "How many more to make 10?"
- 3 multiple choice answers (1 correct, 2 incorrect)

**Example**:
```
Frame shows: 7 dots (3 empty boxes)
Question: "How many more to make 10?"
Choices: 2, 3, 4
Correct: 3
```

**Learning Objective**:
- Number bonds to 10
- Part-whole relationships
- Foundation for mental math strategies

---

## User Flow

### Landing Page (New)
```
┌─────────────────────────────────────┐
│   Choose Your Math Practice         │
│                                     │
│  ┌─────────────────┐               │
│  │  Addition Quiz  │               │
│  │       +         │               │
│  │  10 Questions   │               │
│  └─────────────────┘               │
│                                     │
│  ┌─────────────────┐               │
│  │  10-Frame:      │               │
│  │  Number         │               │
│  │  Recognition    │               │
│  │  10 Questions   │               │
│  └─────────────────┘               │
│                                     │
│  ┌─────────────────┐               │
│  │  10-Frame:      │               │
│  │  Make 10        │               │
│  │  10 Questions   │               │
│  └─────────────────┘               │
└─────────────────────────────────────┘
```

### 10-Frame Quiz Flow
```
1. User selects mode (Recognition or Make 10)
2. Quiz starts with Question 1 of 10
3. Show QuizHeader (progress bar, stars)
4. Show 10-frame with filled dots
5. Show question text
6. Show 3 answer choices
7. User clicks answer:
   - Wrong: Red with X, can retry
   - Correct: Green with checkmark, advance
8. Transition screen: "Good! 🎉"
9. Repeat for 10 questions
10. Summary screen with score and star rating
```

---

## Component Architecture

### New Components

#### 1. QuizModeSelector
**Purpose**: Landing page for selecting quiz type

**Props**: None

**State**:
```typescript
// Navigation only, no state needed
```

**UI**:
- Title: "Choose Your Math Practice"
- 3 large cards/buttons:
  1. Addition Quiz
  2. 10-Frame: Number Recognition
  3. 10-Frame: Make 10
- Each card shows icon, title, description

**Navigation**:
- Click card → Navigate to respective quiz

---

#### 2. TenFrame
**Purpose**: Visual 10-frame component with dots

**Props**:
```typescript
interface TenFrameProps {
  filledCount: number;  // 0-10
  dotColor?: string;    // Default: primary color
  size?: 'small' | 'medium' | 'large';
}
```

**Visual Design**:
- 2 rows × 5 columns grid
- Border around each box
- Filled boxes show colored dot (circle)
- Empty boxes show light gray background
- Responsive sizing

**Styling**:
- Box size: 60px × 60px (medium)
- Border: 2px solid gray
- Dot: 40px diameter circle
- Gap: 4px between boxes
- Dot color: Primary blue or custom

---

#### 3. TenFrameQuiz
**Purpose**: Orchestrate 10-question quiz for 10-frame modes

**Props**:
```typescript
interface TenFrameQuizProps {
  mode: 'recognition' | 'make10';
}
```

**State**:
```typescript
interface TenFrameQuizState {
  sessionId: string;
  questions: TenFrameQuestion[];
  currentQuestionIndex: number;
  sessionResults: QuestionResult[];
  sessionPhase: 'active' | 'transition' | 'summary';
  startTime: Date;
}

interface TenFrameQuestion {
  number: number;           // 1-10 for recognition, 1-9 for make10
  correctAnswer: number;    // Same as number for recognition, 10-number for make10
}
```

**Behavior**:
- Generate 10 questions on mount
- Track progress and results
- Handle transitions between questions
- Show summary at end
- Reuse QuizHeader, TransitionScreen, SummaryScreen

---

#### 4. TenFrameQuestion
**Purpose**: Display single 10-frame question with choices

**Props**:
```typescript
interface TenFrameQuestionProps {
  question: TenFrameQuestion;
  mode: 'recognition' | 'make10';
  onComplete: (correct: boolean, interactions: number) => void;
}
```

**Layout**:
```
┌─────────────────────────────────────┐
│  [10-Frame Visual]                  │
│                                     │
│  Question: "What number is this?"   │
│  or "How many more to make 10?"     │
│                                     │
│  [Choice 1] [Choice 2] [Choice 3]   │
└─────────────────────────────────────┘
```

**Behavior**:
- Show TenFrame component with filled dots
- Display question text based on mode
- Show 3 answer choices (shuffled)
- Handle answer selection (same as MultipleChoiceAnswer)
- Wrong: Red with X, allow retry
- Correct: Green with checkmark, call onComplete

---

### Modified Components

#### App.tsx
**Change**: Add routing/state for quiz mode selection

**New State**:
```typescript
const [quizMode, setQuizMode] = useState<'selector' | 'addition' | 'recognition' | 'make10'>('selector');
```

**Render Logic**:
```typescript
{quizMode === 'selector' && <QuizModeSelector onSelect={setQuizMode} />}
{quizMode === 'addition' && <QuizSession />}
{quizMode === 'recognition' && <TenFrameQuiz mode="recognition" />}
{quizMode === 'make10' && <TenFrameQuiz mode="make10" />}
```

---

## Problem Generation

### Recognition Mode
```typescript
function generateRecognitionQuestions(count: number = 10): TenFrameQuestion[] {
  const questions: TenFrameQuestion[] = [];
  const used = new Set<number>();
  
  while (questions.length < count) {
    const number = Math.floor(Math.random() * 10) + 1; // 1-10
    if (!used.has(number)) {
      used.add(number);
      questions.push({ number, correctAnswer: number });
    }
  }
  
  return questions;
}
```

**Answer Choices Generation**:
- Correct: The number shown
- Incorrect 1: number ± 1-3 (random offset)
- Incorrect 2: number ± 1-3 (different offset)
- Ensure all choices are 1-10 and unique

---

### Make 10 Mode
```typescript
function generateMake10Questions(count: number = 10): TenFrameQuestion[] {
  const questions: TenFrameQuestion[] = [];
  const used = new Set<number>();
  
  while (questions.length < count) {
    const number = Math.floor(Math.random() * 9) + 1; // 1-9 (not 10)
    if (!used.has(number)) {
      used.add(number);
      questions.push({ 
        number, 
        correctAnswer: 10 - number 
      });
    }
  }
  
  return questions;
}
```

**Answer Choices Generation**:
- Correct: 10 - number
- Incorrect 1: correctAnswer ± 1-2
- Incorrect 2: correctAnswer ± 1-2 (different offset)
- Ensure all choices are 1-9 and unique

---

## Visual Design

### TenFrame Component
```
┌────┬────┬────┬────┬────┐
│ ●  │ ●  │ ●  │ ●  │ ●  │  ← Filled boxes (blue dots)
├────┼────┼────┼────┼────┤
│ ●  │ ●  │    │    │    │  ← Empty boxes (light gray)
└────┴────┴────┴────┴────┘
```

**Styling**:
- Box: 60px × 60px, border: 2px solid #ccc
- Dot: 40px diameter, color: primary blue (#1976d2)
- Empty: background: #f5f5f5
- Grid gap: 4px
- Total size: ~320px × 130px

---

### QuizModeSelector Cards
```
┌─────────────────────────┐
│         Icon            │
│                         │
│    Addition Quiz        │
│                         │
│  Break down and add     │
│      numbers            │
│                         │
│    10 Questions         │
└─────────────────────────┘
```

**Card Styling**:
- Size: 250px × 200px
- Elevation: 3
- Hover: Elevation 6
- Icon: 60px, centered
- Title: h5, bold
- Description: body2, gray
- Badge: "10 Questions" chip at bottom

---

## Testing Strategy

### Unit Tests

#### TenFrame Component
- Renders correct number of filled dots
- Renders correct number of empty boxes
- Applies correct styling
- Handles edge cases (0, 10)

#### TenFrameQuestion Component
- Displays 10-frame with correct number
- Shows correct question text for each mode
- Generates 3 unique answer choices
- Handles correct answer selection
- Handles incorrect answer selection with retry

#### QuizModeSelector Component
- Renders 3 mode cards
- Calls onSelect with correct mode
- Displays correct icons and descriptions

---

### Integration Tests

#### TenFrameQuiz Flow
- Generates 10 unique questions
- Advances through all questions
- Tracks score correctly
- Shows transition screen between questions
- Shows summary at end
- "Try Again" resets quiz

#### Recognition Mode
- Questions show numbers 1-10
- Correct answer matches displayed number
- Wrong answers are different numbers

#### Make 10 Mode
- Questions show numbers 1-9
- Correct answer is 10 - displayed number
- Wrong answers are different numbers

---

## File Structure
```
app/src/
├── components/
│   ├── QuizModeSelector.tsx          (NEW)
│   ├── TenFrame.tsx                  (NEW)
│   ├── TenFrameQuiz.tsx              (NEW)
│   ├── TenFrameQuestion.tsx          (NEW)
│   ├── QuizSession.tsx               (existing)
│   ├── QuizHeader.tsx                (reuse)
│   ├── TransitionScreen.tsx          (reuse)
│   ├── SummaryScreen.tsx             (reuse)
│   └── __tests__/
│       ├── TenFrame.test.tsx         (NEW)
│       ├── TenFrameQuestion.test.tsx (NEW)
│       ├── TenFrameQuiz.test.tsx     (NEW)
│       └── QuizModeSelector.test.tsx (NEW)
├── types/
│   └── TenFrame.ts                   (NEW)
├── utils/
│   └── tenFrameGenerator.ts          (NEW)
└── App.tsx                           (MODIFY)
```

---

## Implementation Phases

### Phase 1: Core Components
- [ ] Create TenFrame visual component
- [ ] Create TenFrameQuestion component
- [ ] Create problem generator utilities
- [ ] Add unit tests for TenFrame

### Phase 2: Quiz Flow
- [ ] Create TenFrameQuiz orchestrator
- [ ] Implement Recognition mode
- [ ] Implement Make 10 mode
- [ ] Add integration tests

### Phase 3: Navigation
- [ ] Create QuizModeSelector landing page
- [ ] Update App.tsx with routing logic
- [ ] Add navigation tests

### Phase 4: Polish
- [ ] Visual refinements
- [ ] Animations for transitions
- [ ] Accessibility improvements
- [ ] Documentation updates

---

## Open Questions

### 1. Dot Animation
**Question**: Should dots appear with animation when question loads?

**Options**:
- A) No animation, instant display
- B) Fade in animation
- C) Pop-in animation (scale from 0 to 1)

**Recommendation**: Option A for simplicity, Option C for engagement

---

### 2. Empty Box Styling
**Question**: How should empty boxes look?

**Options**:
- A) Light gray background, no border
- B) White background, gray border
- C) Dashed border to show "empty"

**Recommendation**: Option B - consistent with filled boxes

---

### 3. Question Difficulty
**Question**: Should questions progress in difficulty?

**Options**:
- A) Random order (1-10 mixed)
- B) Progressive (start with 1-3, end with 8-10)
- C) Focus on harder numbers (6-9 more frequent)

**Recommendation**: Option A for Recognition, Option C for Make 10 (6-9 are harder)

---

### 4. Visual Feedback
**Question**: Should 10-frame change when answer is selected?

**Options**:
- A) No change, only answer button changes color
- B) Highlight correct dots in green
- C) Show empty boxes filling up for Make 10 mode

**Recommendation**: Option A for simplicity

---

### 5. Navigation
**Question**: How to return to mode selector?

**Options**:
- A) Back button in header
- B) Only from summary screen
- C) Both

**Recommendation**: Option C - back button + summary screen button

---

## Success Metrics

### Learning Outcomes
- Child can recognize numbers 1-10 in 10-frame format
- Child understands number bonds to 10
- Improved subitizing skills

### Engagement
- Completion rate >80% for 10-frame quizzes
- Children choose 10-frame mode voluntarily
- Average score 7/10 or higher

### Technical
- All tests passing
- No performance issues with animations
- Responsive on all screen sizes

---

## Future Enhancements

### Additional Modes
- **Double Frames**: Show two 10-frames for addition (e.g., 7 + 5)
- **Subtraction**: Start with full frame, remove dots
- **Comparison**: Which frame has more?
- **Missing Number**: Some dots hidden, guess total

### Customization
- Choose dot color
- Choose frame style (rounded vs square)
- Adjust difficulty range
- Timed mode for advanced learners

### Analytics
- Track which numbers are hardest
- Identify patterns in errors
- Adaptive difficulty based on performance

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-06  
**Status**: Ready for Implementation
