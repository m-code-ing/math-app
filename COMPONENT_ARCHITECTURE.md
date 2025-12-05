# Component Architecture - Math Learning App

## Overview
This document outlines the UI/UX component structure for implementing an interactive, modal-based place value decomposition method for addition problems.

## Teaching Method: Interactive Place Value Decomposition
Students learn addition by clicking on numbers, breaking them into tens and units through modals, collecting pieces in boxes, then selecting the final answer.

### Example: 12 + 24 = 36
1. **Click first number (12)** → Modal opens showing tens/units breakdown
2. **Click on tens and units** → Pieces animate to collection boxes
3. **Click second number (24)** → Modal opens for second breakdown  
4. **Click on tens and units** → Pieces accumulate in collection boxes
5. **Multiple choice** → Select correct answer from 3 options
6. **Validation** → Immediate feedback on choice

## Component Architecture

### 1. Main Container Component
**`InteractiveMathProblem`**
- Manages overall problem state and interaction flow
- Controls modal visibility and number selection states
- Handles piece collection and final answer validation
- Stores complete interaction state

```typescript
interface InteractiveState {
  currentPhase: 'number1' | 'number2' | 'finalAnswer';
  number1: { value: number, isDecomposed: boolean, isSelected: boolean };
  number2: { value: number, isDecomposed: boolean, isSelected: boolean };
  collectedTens: number;
  collectedUnits: number;
  modalOpen: boolean;
  currentModalNumber: number | null;
  showFinalChoices: boolean;
  isComplete: boolean;
}
```

### 2. Interactive Components

#### **`ClickableNumber`**
- **Purpose**: Clickable number that opens decomposition modal
- **Props**: `number`, `isSelectable`, `isSelected`, `onClick()`
- **UI**: Large, colorful number button with hover effects
- **States**: Normal → Hover → Selected → Greyed out

#### **`DecompositionModal`**
- **Purpose**: Modal popup showing tens and units breakdown
- **Props**: `number`, `isOpen`, `onPieceClick(type, amount)`, `onClose()`
- **UI**: Modal with visual blocks for tens and units
- **Interaction**: Click on tens/units to send to collection boxes

#### **`CollectionBoxes`**
- **Purpose**: Display areas where tens and units accumulate
- **Props**: `tensCount`, `unitsCount`
- **UI**: Two distinct boxes with visual piece representations
- **Animation**: Smooth transitions when new pieces arrive

#### **`MultipleChoiceAnswer`**
- **Purpose**: Present 3 answer choices (1 correct, 2 incorrect)
- **Props**: `correctAnswer`, `onSelect(answer)`, `choices`
- **UI**: Large buttons with answer options
- **Logic**: Generate plausible incorrect answers

#### **`AnimatedPiece`**
- **Purpose**: Visual representation of tens/units moving to boxes
- **Props**: `type`, `startPosition`, `endPosition`, `onComplete()`
- **UI**: Animated block that moves from modal to collection box
- **Animation**: Smooth CSS transitions or React Spring

### 3. Reusable Shared Components

#### **`VisualBlocks`**
- **Purpose**: Visual representation of tens and units using blocks
- **Props**: `tens`, `units`, `isClickable`, `onBlockClick()`
- **UI**: Groups of 10 blocks for tens, individual blocks for units
- **Interactive**: Clickable blocks in modal, static in collection boxes

#### **`Modal`**
- **Purpose**: Reusable modal/popup container
- **Props**: `isOpen`, `onClose()`, `title`, `children`
- **UI**: Overlay with centered content, close button
- **Animation**: Smooth fade in/out transitions

#### **`PhaseIndicator`**
- **Purpose**: Show current phase of the problem
- **Props**: `currentPhase`, `completedPhases`
- **UI**: Visual indicator of progress through interaction phases

## User Experience Flow

### Interactive Sequence:
1. **Problem Display** → Show "12 + 24 = ?" with clickable numbers
2. **First Number Click** → User clicks "12", modal opens showing breakdown
3. **First Decomposition** → User clicks on tens/units, pieces animate to collection boxes
4. **Second Number Click** → User clicks "24", modal opens for second breakdown
5. **Second Decomposition** → User clicks on tens/units, pieces accumulate in boxes
6. **Multiple Choice** → Present 3 answer options based on collected pieces
7. **Final Validation** → Immediate feedback and celebration

### Interaction States:
- **Phase 1**: Both numbers clickable, collection boxes empty
- **Phase 2**: First number greyed out, second number clickable, boxes partially filled
- **Phase 3**: Both numbers greyed out, boxes full, multiple choice displayed

### Child-Friendly Design Principles:
- **Large touch targets** for easy iPad interaction
- **Bright, engaging colors** without overwhelming
- **Smooth animations** for moving pieces between modal and boxes
- **Clear visual feedback** for interactions and selections
- **Immediate validation** with celebratory animations
- **Visual representations** using block/object metaphors
- **Minimal text** appropriate for ages 5-7

## Implementation Priority:
1. Create new `InteractiveMathProblem` container component
2. Implement `ClickableNumber` with selection states
3. Build `Modal` and `DecompositionModal` components
4. Add `CollectionBoxes` with animation support
5. Create `MultipleChoiceAnswer` with incorrect option generation
6. Integrate smooth animations for piece movement
7. Add IndexedDB progress tracking

## Animation Requirements:
- **Piece movement**: From modal to collection boxes
- **Modal transitions**: Smooth open/close with backdrop
- **Number state changes**: Hover effects and greying out
- **Collection box updates**: Smooth addition of new pieces
- **Choice feedback**: Immediate visual response to selections

## Technical Considerations:
- Use CSS transitions or React Spring for animations
- Implement proper modal accessibility (focus management)
- Optimize for touch interactions on iPad
- Ensure responsive design for different screen sizes
- Handle state persistence during interactions