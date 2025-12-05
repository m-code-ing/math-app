# Component Architecture - Math Learning App

## Overview
This document outlines the interactive place value decomposition method for teaching basic addition to children ages 5-7 using a 4-layer screen design.

## Teaching Method: 4-Layer Screen Design
We use a layered screen approach where children break down numbers into tens and units in a structured, sequential manner. All layers remain visible throughout the process to provide context and avoid distracting interface changes.

### Example: 12 + 24 = 36
1. **Layer 1 - Question**: Show "12 + 24 = ?" with 12 clickable
2. **Layer 2 - Number Split**: Click on 12 → Shows "10 + 2" pieces (auto-advance when clicked)
3. **Layer 3 - Collection**: Shows collected pieces: "10 + 2"
4. **Layer 2 - Number Split**: Click on 24 → Shows "20 + 4" pieces (auto-advance when clicked) 
5. **Layer 3 - Collection**: Shows all collected pieces: "10 + 2 + 20 + 4"
6. **Layer 4 - Final Answer**: Multiple choice selection

## Component Structure

### 1. InteractiveMathProblem (Main Container)
- **Purpose**: Orchestrates the entire problem-solving flow using a 4-layer design
- **State Management**: Tracks current phase, selected numbers, collected pieces array
- **Key State**:
  ```typescript
  interface InteractiveState {
    currentPhase: 'number1' | 'number2' | 'finalAnswer' | 'complete';
    currentNumber: number | null;
    collectedPieces: number[]; // Individual pieces, not totals
    splitClickedPieces: { tensClicked: boolean; unitsClicked: boolean; };
    showFinalChoices: boolean;
  }
  ```
- **Props**: 
  - `problem: MathProblem` - The math problem to solve
  - `onComplete: (correct: boolean, interactions: number) => void` - Callback when problem is completed

### 2. ClickableNumber
- **Purpose**: Displays numbers that can be selected for decomposition
- **Features**: 
  - Visual feedback when clickable
  - Shows decomposed state after processing
  - Animated transitions
- **Props**:
  - `number: number` - The number to display
  - `isSelectable: boolean` - Whether the number can be clicked
  - `isDecomposed: boolean` - Whether the number has been broken down
  - `onClick: () => void` - Click handler

### 3. MultipleChoiceAnswer
- **Purpose**: Final answer selection interface
- **Features**:
  - Multiple choice buttons with answer options
  - Immediate visual feedback on selection
  - Correct/incorrect styling
  - Prevents multiple selections
- **Props**:
  - `choices: number[]` - Array of answer choices
  - `correctAnswer: number` - The correct answer
  - `onSelect: (answer: number) => void` - Selection handler

## 4-Layer Screen Design

### Layer 1: Question Display
- **Purpose**: Shows the math problem clearly
- **Content**: "12 + 24 = ?" with clickable numbers
- **Interaction**: Numbers are clickable when selectable
- **Behavior**: Always visible, remains throughout the process
- **CSS Class**: `.question-layer`

### Layer 2: Number Split 
- **Purpose**: Shows decomposition of selected number
- **Content**: 
  - Empty when no number selected
  - "10 + 2" when 12 is selected
  - "20 + 4" when 24 is selected
- **Interaction**: Click tens/units pieces to collect them
- **Behavior**: 
  - Always visible with consistent height (min-height: 80px)
  - Populates when number is clicked
  - Auto-advances when all relevant pieces are clicked (no continue button)
  - Pieces have visual feedback (checkmarks when clicked)
- **CSS Class**: `.split-layer`

### Layer 3: Collection
- **Purpose**: Shows accumulated pieces from decomposition
- **Content**: Individual pieces with plus signs between them
  - After clicking 12 pieces: "10 + 2"
  - After clicking 24 pieces: "10 + 2 + 20 + 4"
- **Interaction**: Read-only display
- **Behavior**: 
  - Always visible with consistent height (min-height: 80px)
  - Empty initially
  - Adds individual piece values as they're clicked in Layer 2
  - Shows actual clicked values, not accumulated totals
- **CSS Class**: `.collection-layer`

### Layer 4: Final Answer
- **Purpose**: Multiple choice answer selection
- **Content**: Answer choices in clickable buttons
- **Interaction**: Select the final answer
- **Behavior**: Only appears after all numbers are decomposed
- **CSS Class**: `.final-layer`

## User Flow

### Phase 1: Number 1 Selection & Decomposition
1. **Layer 1**: Display "12 + 24 = ?" with 12 clickable, 24 not clickable
2. **Layer 2**: User clicks 12 → Shows "10 + 2" pieces
3. **Layer 2**: User clicks "10" piece → Automatically collected
4. **Layer 3**: Shows "10"
5. **Layer 2**: User clicks "2" piece → Automatically collected, auto-advance to next phase
6. **Layer 3**: Shows "10 + 2"

### Phase 2: Number 2 Selection & Decomposition  
1. **Layer 1**: 24 becomes clickable, 12 shows as decomposed (grayed out)
2. **Layer 2**: User clicks 24 → Shows "20 + 4" pieces (clears previous content)
3. **Layer 2**: User clicks "20" piece → Automatically collected
4. **Layer 3**: Shows "10 + 2 + 20"
5. **Layer 2**: User clicks "4" piece → Automatically collected, auto-advance to final answer
6. **Layer 3**: Shows "10 + 2 + 20 + 4"

### Phase 3: Final Answer
1. **Layer 4**: Appears with multiple choice options
2. **Layer 4**: User selects answer
3. **System**: Provides immediate feedback and completion

## Key Design Principles

### 1. Persistent Layer Structure
- All 4 layers remain visible throughout the process
- No distracting appearance/disappearance of interface elements
- Layers 2 and 3 maintain consistent height even when empty
- Provides visual context and reduces cognitive load

### 2. Auto-Advancement
- No manual "Continue" buttons
- Automatic progression when interaction requirements are met
- Reduces clicks and maintains flow
- System advances when:
  - Single piece needs to be clicked (tens=0 or units=0): advance after clicking the available piece
  - Both pieces need to be clicked: advance after clicking both tens AND units

### 3. Visual Clarity
- Simple number display instead of complex visual blocks
- Individual piece tracking in collection (not accumulated totals)
- Clear visual separation between layers
- Green styling for collected pieces, orange for operators

### 4. Individual Piece Collection
- Layer 3 shows exactly what pieces were clicked
- Each click adds the actual piece value to `collectedPieces` array
- Display shows individual pieces with plus signs: "10 + 2 + 20 + 4"
- No mathematical operations performed, just component collection

### 5. Error Prevention
- Disable pieces after they're clicked (visual feedback with checkmarks)
- Only allow clicking relevant pieces (tens=0 disables tens button)
- Guide users through correct sequence with selective clickability

## Technical Implementation Notes

### State Management
- `collectedPieces: number[]` - Array of individual piece values (e.g., [10, 2, 20, 4])
- `currentNumber: number | null` - Tracks which number is being decomposed
- `splitClickedPieces` - Tracks which pieces of current number have been clicked
- Phase-based transitions with automatic advancement logic

### Layer Behavior
- **Layer 1**: Always rendered, updates clickability based on phase
- **Layer 2**: Always rendered with min-height, conditionally populated based on currentNumber
- **Layer 3**: Always rendered with min-height, grows as pieces are collected
- **Layer 4**: Conditionally rendered only when `showFinalChoices: true`

### Auto-Advancement Logic
```typescript
const shouldAutoContinue = 
  (numberData.tens === 0 && newClickedPieces.unitsClicked) ||
  (numberData.units === 0 && newClickedPieces.tensClicked) ||
  (newClickedPieces.tensClicked && newClickedPieces.unitsClicked);
```

### Piece Collection Logic
```typescript
const pieceValue = type === 'tens' ? amount * 10 : amount;
const newCollectedPieces = [...prev.collectedPieces, pieceValue];
```

### Accessibility
- Keyboard navigation support
- Screen reader friendly labels
- High contrast color schemes
- Large touch targets for mobile devices
- Reduced motion support for animations