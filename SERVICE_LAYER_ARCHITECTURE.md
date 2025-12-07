# Service Layer Architecture

**Date**: 2025-12-07  
**Status**: Design Phase

## Overview
Introduce a service layer between UI components and data storage for better separation of concerns, testability, and flexibility.

---

## Current Architecture (Problem)

```
React Components
       ↓
  localStorage (direct access)
```

**Issues:**
- Business logic scattered in components
- Hard to test
- Tight coupling to localStorage
- Can't easily switch to backend
- Duplicate logic across features

---

## Proposed Architecture (Solution)

```
React Components
       ↓
  QuizService (business logic)
       ↓
  StorageService (data access)
       ↓
  localStorage
```

**Benefits:**
- Single source of truth for business logic
- Easy to test (mock services)
- Flexible storage (swap localStorage → backend)
- Reusable across components
- Type-safe operations

---

## Service Layer Components

### 1. QuizService
**Purpose:** Business logic and quiz operations

**Responsibilities:**
- Start new quiz session
- Submit answers and validate
- Calculate scores and star ratings
- Manage quiz state transitions
- Coordinate with StorageService

**Does NOT:**
- Know about localStorage implementation
- Render UI
- Handle React state

### 2. StorageService
**Purpose:** Pure data persistence operations

**Responsibilities:**
- Save/load data to/from localStorage
- Handle serialization (JSON)
- Manage storage keys
- Handle errors (quota, corruption)

**Does NOT:**
- Contain business logic
- Know about quiz rules
- Calculate scores

---

## Implementation Steps

### Step 1: Create StorageService
**File:** `shared/services/StorageService.ts`

```typescript
class StorageService {
  private prefix = 'math-app:';
  
  save<T>(key: string, data: T): void
  load<T>(key: string): T | null
  remove(key: string): void
  clear(): void
  getAllKeys(): string[]
}
```

**Features:**
- Generic type support
- Error handling
- Key prefixing
- JSON serialization

### Step 2: Create Shared Types
**File:** `shared/services/types.ts`

```typescript
// Common types used by services
export type SessionPhase = 'active' | 'transition' | 'summary';

export interface QuizSessionRecord {
  sessionId: string;
  quizType: 'addition' | 'recognition' | 'make10';
  startTime: Date;
  endTime: Date;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  starRating: number;
}

export interface UserStats {
  totalQuizzesCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number;
  averageStarRating: number;
}
```

### Step 3: Create QuizService
**File:** `shared/services/QuizService.ts`

```typescript
class QuizService {
  constructor(private storage: StorageService) {}
  
  // Session management
  startQuiz(type: QuizType): string  // returns sessionId
  getCurrentSession(): QuizSession | null
  saveProgress(session: QuizSession): void
  clearProgress(): void
  
  // History & Stats
  saveCompletedSession(session: QuizSessionRecord): void
  getSessionHistory(limit?: number): QuizSessionRecord[]
  getUserStats(): UserStats
  
  // Scoring
  calculateStarRating(correct: number, total: number): number
  calculateScore(correct: number, total: number): number
}
```

### Step 4: Create Service Instance
**File:** `shared/services/index.ts`

```typescript
import { StorageService } from './StorageService';
import { QuizService } from './QuizService';

// Singleton instances
export const storageService = new StorageService();
export const quizService = new QuizService(storageService);
```

### Step 5: Update Components
**Example:** QuizSession component

**Before:**
```typescript
const [quizState, setQuizState] = useState(initialState);
// Direct state management
```

**After:**
```typescript
import { quizService } from '../../shared/services';

useEffect(() => {
  const sessionId = quizService.startQuiz('addition');
  // Load from service
}, []);

const handleComplete = () => {
  quizService.saveProgress(quizState);
};
```

### Step 6: Add Tests
**Files:**
- `shared/services/__tests__/StorageService.test.ts`
- `shared/services/__tests__/QuizService.test.ts`

**Test coverage:**
- Save/load operations
- Error handling
- Score calculations
- Session management

---

## Migration Strategy

### Phase 1: Infrastructure (No Breaking Changes)
- Create StorageService
- Create QuizService
- Create shared types
- Add tests
- **Components unchanged**

### Phase 2: Gradual Migration
- Update QuizSession to use services
- Update TenFrameQuiz to use services
- Update SummaryScreen to use services
- Test each migration

### Phase 3: Cleanup
- Remove duplicate logic from components
- Remove old state management code
- Update tests

---

## API Design

### StorageService API
```typescript
// Save data
storageService.save('session', sessionData);

// Load data
const session = storageService.load<QuizSession>('session');

// Remove data
storageService.remove('session');

// Clear all
storageService.clear();
```

### QuizService API
```typescript
// Start quiz
const sessionId = quizService.startQuiz('addition');

// Save progress
quizService.saveProgress(session);

// Get current session
const current = quizService.getCurrentSession();

// Complete quiz
quizService.saveCompletedSession(record);

// Get history
const history = quizService.getSessionHistory(10);

// Get stats
const stats = quizService.getUserStats();

// Calculate rating
const stars = quizService.calculateStarRating(8, 10); // 4 stars
```

---

## Error Handling

### StorageService
```typescript
try {
  storageService.save('key', data);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    // Handle storage full
  } else {
    // Handle other errors
  }
}
```

### QuizService
```typescript
const session = quizService.getCurrentSession();
if (!session) {
  // No session found, start new
}
```

---

## Testing Strategy

### Unit Tests
```typescript
describe('StorageService', () => {
  it('saves and loads data');
  it('handles quota exceeded');
  it('handles corrupted data');
});

describe('QuizService', () => {
  it('starts new quiz session');
  it('calculates star rating correctly');
  it('updates user stats');
});
```

### Integration Tests
```typescript
describe('Quiz Flow', () => {
  it('completes full quiz with service layer');
  it('resumes interrupted quiz');
  it('tracks stats across multiple sessions');
});
```

---

## Future Enhancements

### Backend Migration
```typescript
// Swap implementation
class BackendStorageService implements IStorageService {
  async save(key: string, data: any) {
    await fetch('/api/save', { ... });
  }
}

// Components unchanged!
const quizService = new QuizService(new BackendStorageService());
```

### Feature Services (if needed)
```typescript
class AdditionQuizService extends QuizService {
  // Addition-specific logic
}

class TenFrameQuizService extends QuizService {
  // 10-frame-specific logic
}
```

---

## File Structure

```
shared/
├── services/
│   ├── StorageService.ts
│   ├── QuizService.ts
│   ├── types.ts
│   ├── index.ts
│   └── __tests__/
│       ├── StorageService.test.ts
│       └── QuizService.test.ts
└── utils/
    └── scoring.ts (helper functions)
```

---

## Implementation Checklist

### Step 1: StorageService
- [ ] Create StorageService class
- [ ] Implement save/load/remove/clear
- [ ] Add error handling
- [ ] Write unit tests

### Step 2: Shared Types
- [ ] Create types.ts
- [ ] Define QuizSessionRecord
- [ ] Define UserStats
- [ ] Export common types

### Step 3: QuizService
- [ ] Create QuizService class
- [ ] Implement session management
- [ ] Implement scoring logic
- [ ] Implement stats calculation
- [ ] Write unit tests

### Step 4: Integration
- [ ] Create service instances
- [ ] Export from index.ts
- [ ] Add integration tests

### Step 5: Component Migration
- [ ] Update QuizSession
- [ ] Update TenFrameQuiz
- [ ] Update SummaryScreen
- [ ] Test each component

### Step 6: Cleanup
- [ ] Remove duplicate code
- [ ] Update documentation
- [ ] Final testing

---

## Timeline Estimate

- **Step 1-2:** 2 hours (StorageService + types)
- **Step 3:** 3 hours (QuizService + logic)
- **Step 4:** 1 hour (Integration + tests)
- **Step 5:** 3 hours (Component migration)
- **Step 6:** 1 hour (Cleanup)

**Total:** 10 hours

---

## Success Criteria

- ✅ All tests passing
- ✅ No direct localStorage calls in components
- ✅ Business logic centralized in services
- ✅ Easy to mock for testing
- ✅ Ready for backend migration

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-07  
**Status:** Ready for Implementation
