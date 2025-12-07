# Project Restructure - Feature-Based Architecture

**Date**: 2025-12-06  
**Status**: Implementation Phase

## Overview
Restructure the flat component directory into a feature-based architecture for better scalability and maintainability.

## Current Structure (Flat)
```
app/src/
├── components/
│   ├── ClickableNumber.tsx
│   ├── InteractiveMathProblem.tsx
│   ├── MultipleChoiceAnswer.tsx
│   ├── NavBar.tsx
│   ├── NumberDecomposition.tsx
│   ├── QuizHeader.tsx
│   ├── QuizModeSelector.tsx
│   ├── QuizSession.tsx
│   ├── SummaryScreen.tsx
│   ├── TenFrame.tsx
│   ├── TenFrameQuestion.tsx
│   ├── TenFrameQuiz.tsx
│   ├── TransitionScreen.tsx
│   └── __tests__/
├── types/
│   ├── MathProblem.ts
│   ├── Quiz.ts
│   └── TenFrame.ts
├── utils/
│   ├── problemGenerator.ts
│   ├── tenFrameGenerator.ts
│   └── test-utils.tsx
├── App.tsx
└── App.css
```

## New Structure (Feature-Based)
```
app/src/
├── features/
│   ├── addition-quiz/
│   │   ├── components/
│   │   │   ├── QuizSession.tsx
│   │   │   ├── InteractiveMathProblem.tsx
│   │   │   ├── ClickableNumber.tsx
│   │   │   ├── NumberDecomposition.tsx
│   │   │   ├── MultipleChoiceAnswer.tsx
│   │   │   └── __tests__/
│   │   │       ├── ClickableNumber.test.tsx
│   │   │       ├── NumberDecomposition.test.tsx
│   │   │       ├── MultipleChoiceAnswer.test.tsx
│   │   │       ├── InteractiveMathProblem.integration.test.tsx
│   │   │       └── QuizSession.integration.test.tsx
│   │   ├── types/
│   │   │   ├── MathProblem.ts
│   │   │   └── Quiz.ts
│   │   └── utils/
│   │       └── problemGenerator.ts
│   │
│   ├── ten-frame/
│   │   ├── components/
│   │   │   ├── TenFrameQuiz.tsx
│   │   │   ├── TenFrameQuestion.tsx
│   │   │   ├── TenFrame.tsx
│   │   │   └── __tests__/
│   │   │       └── TenFrame.test.tsx
│   │   ├── types/
│   │   │   └── TenFrame.ts
│   │   └── utils/
│   │       └── tenFrameGenerator.ts
│   │
│   └── quiz-selector/
│       └── components/
│           └── QuizModeSelector.tsx
│
├── shared/
│   ├── components/
│   │   ├── NavBar.tsx
│   │   ├── QuizHeader.tsx
│   │   ├── TransitionScreen.tsx
│   │   ├── SummaryScreen.tsx
│   │   └── __tests__/
│   │       ├── QuizHeader.test.tsx
│   │       └── SummaryScreen.test.tsx
│   └── utils/
│       └── test-utils.tsx
│
├── App.tsx
└── App.css
```

## Migration Plan

### Phase 1: Create Directory Structure
- Create `features/` directory
- Create `features/addition-quiz/` with subdirs
- Create `features/ten-frame/` with subdirs
- Create `features/quiz-selector/` with subdirs
- Create `shared/` directory with subdirs

### Phase 2: Move Addition Quiz Files
- Move QuizSession.tsx → features/addition-quiz/components/
- Move InteractiveMathProblem.tsx → features/addition-quiz/components/
- Move ClickableNumber.tsx → features/addition-quiz/components/
- Move NumberDecomposition.tsx → features/addition-quiz/components/
- Move MultipleChoiceAnswer.tsx → features/addition-quiz/components/
- Move MathProblem.ts → features/addition-quiz/types/
- Move Quiz.ts → features/addition-quiz/types/
- Move problemGenerator.ts → features/addition-quiz/utils/
- Move related tests → features/addition-quiz/components/__tests__/

### Phase 3: Move Ten-Frame Files
- Move TenFrameQuiz.tsx → features/ten-frame/components/
- Move TenFrameQuestion.tsx → features/ten-frame/components/
- Move TenFrame.tsx → features/ten-frame/components/
- Move TenFrame.ts → features/ten-frame/types/
- Move tenFrameGenerator.ts → features/ten-frame/utils/
- Move TenFrame.test.tsx → features/ten-frame/components/__tests__/

### Phase 4: Move Shared Files
- Move NavBar.tsx → shared/components/
- Move QuizHeader.tsx → shared/components/
- Move TransitionScreen.tsx → shared/components/
- Move SummaryScreen.tsx → shared/components/
- Move QuizModeSelector.tsx → features/quiz-selector/components/
- Move test-utils.tsx → shared/utils/
- Move related tests → shared/components/__tests__/

### Phase 5: Update Imports
- Update all import paths in moved files
- Update App.tsx imports
- Update test imports

### Phase 6: Verify & Test
- Run TypeScript compilation check
- Run all tests
- Verify app runs correctly

### Phase 7: Cleanup
- Delete old empty directories
- Commit changes

## Import Path Changes

### Before:
```typescript
import { QuizSession } from './components/QuizSession';
import { TenFrameQuiz } from './components/TenFrameQuiz';
import { QuizModeSelector } from './components/QuizModeSelector';
```

### After:
```typescript
import { QuizSession } from './features/addition-quiz/components/QuizSession';
import { TenFrameQuiz } from './features/ten-frame/components/TenFrameQuiz';
import { QuizModeSelector } from './features/quiz-selector/components/QuizModeSelector';
```

## Benefits

1. **Clear Feature Boundaries**: Each quiz type is self-contained
2. **Easier Navigation**: Related files are grouped together
3. **Scalability**: Easy to add new quiz types without cluttering
4. **Shared Code Clarity**: Obvious which components are reusable
5. **Better Testing**: Tests live next to the code they test
6. **Team Collaboration**: Multiple developers can work on different features

## Risks & Mitigation

**Risk**: Breaking imports during migration  
**Mitigation**: Move files in phases, test after each phase

**Risk**: Merge conflicts if working on branches  
**Mitigation**: Complete restructure in single session, merge immediately

**Risk**: Forgetting to update some imports  
**Mitigation**: Use TypeScript compiler to catch all import errors

## Success Criteria

- ✅ All files moved to new structure
- ✅ No TypeScript compilation errors
- ✅ All 21+ tests passing
- ✅ App runs without errors
- ✅ All features work as before
- ✅ Old directories removed

---

**Ready to implement**: Yes  
**Estimated time**: 15-20 minutes  
**Breaking changes**: None (internal only)
