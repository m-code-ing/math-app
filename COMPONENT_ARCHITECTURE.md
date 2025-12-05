# Component Architecture - Math Learning App

## Overview
This document outlines the UI/UX component structure for implementing step-by-step place value decomposition method for addition problems.

## Teaching Method: Place Value Decomposition
Students learn addition by breaking numbers into tens and units, then combining them systematically.

### Example: 12 + 24 = 36
1. **Decompose 12** → 1 ten + 2 units
2. **Decompose 24** → 2 tens + 4 units  
3. **Add tens** → 1 + 2 = 3 tens
4. **Add units** → 2 + 4 = 6 units
5. **Regroup if needed** → (6 < 10, so no regrouping)
6. **Final answer** → 3 tens + 6 units = 36

## Component Architecture

### 1. Main Container Component
**`MathProblemStepper`**
- Manages overall problem state and step progression
- Controls which step component is currently visible
- Handles data flow and validation between steps
- Stores complete problem state

```typescript
interface ProblemState {
  currentStep: number;
  number1: { value: number, tens: number, units: number };
  number2: { value: number, tens: number, units: number };
  tensResult: number;
  unitsResult: number;
  finalAnswer: number;
  needsRegrouping: boolean;
}
```

### 2. Step-Specific Components

#### **`NumberDecomposition`**
- **Purpose**: Break a number into tens and units
- **Props**: `number`, `onComplete(tens, units)`
- **UI**: Interactive selectors + visual block representation
- **Example**: "12 = __ tens + __ units"

#### **`TensAddition`**
- **Purpose**: Add the tens portions together
- **Props**: `tens1`, `tens2`, `onComplete(result)`
- **UI**: Simple addition interface with visual blocks
- **Example**: "1 ten + 2 tens = __ tens"

#### **`UnitsAddition`**
- **Purpose**: Add the units portions together
- **Props**: `units1`, `units2`, `onComplete(result, needsRegrouping)`
- **UI**: Addition interface that detects regrouping needs
- **Example**: "2 units + 4 units = __ units"

#### **`RegroupingStep`** (Conditional)
- **Purpose**: Handle cases where units sum ≥ 10
- **Props**: `units`, `onComplete(tens, units)`
- **UI**: Decompose units into additional tens + remaining units
- **Example**: "16 units = __ tens + __ units"

#### **`FinalAnswer`**
- **Purpose**: Combine final tens and units for complete answer
- **Props**: `tens`, `units`, `onComplete(answer)`
- **UI**: Final combination step
- **Example**: "3 tens + 6 units = __"

### 3. Reusable Shared Components

#### **`VisualBlocks`**
- **Purpose**: Visual representation of numbers using blocks
- **Props**: `tens`, `units`
- **UI**: Groups of 10 blocks for tens, individual blocks for units
- **Responsive**: Adapts to different screen sizes

#### **`StepProgress`**
- **Purpose**: Show progress through the step sequence
- **Props**: `currentStep`, `totalSteps`
- **UI**: Progress bar or step indicator

#### **`NumberSelector`**
- **Purpose**: Reusable input component for number selection
- **Props**: `max`, `onChange`, `label`
- **UI**: Child-friendly number picker (large buttons, clear labels)

## User Experience Flow

### Step Sequence:
1. **Problem Introduction** → Show "12 + 24"
2. **First Decomposition** → Break down first number
3. **Second Decomposition** → Break down second number
4. **Tens Addition** → Add tens together
5. **Units Addition** → Add units together
6. **Regrouping** → (if needed) Handle units ≥ 10
7. **Final Answer** → Combine for complete result

### Child-Friendly Design Principles:
- **Large touch targets** for easy interaction
- **Bright, engaging colors** without overwhelming
- **Clear visual feedback** for correct/incorrect answers
- **Immediate validation** at each step
- **Visual representations** using block/object metaphors
- **Simple, minimal text** appropriate for ages 5-7

## Implementation Priority:
1. Start with `MathProblemStepper` container
2. Implement `NumberDecomposition` component
3. Add `VisualBlocks` for visual learning
4. Build remaining step components incrementally
5. Integrate with IndexedDB progress tracking

## Next Steps:
- Begin implementation with main container component
- Create basic step-by-step state management
- Design child-friendly visual block system
- Integrate with existing math problem generation logic