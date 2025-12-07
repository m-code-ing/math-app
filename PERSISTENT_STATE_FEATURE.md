# Persistent State Feature - Design Document

**Date**: 2025-12-07  
**Status**: Design Phase  
**Prerequisite**: [SERVICE_LAYER_ARCHITECTURE.md](SERVICE_LAYER_ARCHITECTURE.md) must be implemented first

## Overview
Add persistent state management to save user progress across sessions, enabling children to track their learning journey over time.

**Note:** This feature builds on top of the service layer. Components will interact with `QuizService`, which delegates to `StorageService` for persistence.

---

## Problem Statement

**Current Behavior:**
- All progress lost on page refresh or browser close
- No way to track improvement over time
- Can't resume incomplete quizzes
- No historical performance data

**User Impact:**
- Frustrating for children who accidentally close browser
- Parents can't see learning progress
- No sense of achievement or growth
- Must restart quiz from beginning

---

## Goals

### Primary Goals
1. **Save quiz progress** - Resume incomplete quizzes
2. **Track performance history** - View past quiz results
3. **Show improvement trends** - Visualize learning progress
4. **Maintain user preferences** - Remember settings

### Non-Goals (Future Enhancements)
- Multi-user profiles (single user for now)
- Cloud sync across devices
- Social features or leaderboards
- Export data to external systems

---

## Design Considerations

### Storage Options

#### Option 1: localStorage (Recommended)
**Pros:**
- Simple to implement
- No backend required
- Works offline
- 5-10MB storage limit (sufficient)
- Persists across sessions

**Cons:**
- Single device only
- Can be cleared by user
- No cross-browser sync
- Limited to same domain

#### Option 2: Backend + Database
**Pros:**
- Multi-device sync
- Secure and reliable
- Unlimited storage
- Analytics capabilities

**Cons:**
- Requires server infrastructure
- More complex implementation
- Costs for hosting
- Requires authentication

#### Option 3: IndexedDB
**Pros:**
- Larger storage (50MB+)
- Better performance for large data
- Structured queries

**Cons:**
- More complex API
- Overkill for current needs
- Harder to debug

**Decision:** Start with **localStorage** for simplicity. Can migrate to backend later if needed.

---

## Data to Persist

### 1. Quiz Session History
```typescript
interface QuizSessionRecord {
  sessionId: string;
  quizType: 'addition' | 'recognition' | 'make10';
  startTime: Date;
  endTime: Date;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage
  starRating: number; // 1-5
  questions: QuestionRecord[];
}

interface QuestionRecord {
  questionIndex: number;
  question: MathProblem | TenFrameQuestion;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  attempts: number; // number of tries before correct
  timeSpent: number; // milliseconds
}
```

### 2. In-Progress Quiz State
```typescript
interface InProgressQuiz {
  sessionId: string;
  quizType: 'addition' | 'recognition' | 'make10';
  currentQuestionIndex: number;
  questions: (MathProblem | TenFrameQuestion)[];
  results: QuestionRecord[];
  startTime: Date;
  lastUpdated: Date;
}
```

### 3. User Statistics
```typescript
interface UserStats {
  totalQuizzesCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number; // percentage
  averageStarRating: number;
  streakDays: number; // consecutive days with activity
  lastActivityDate: Date;
  quizTypeStats: {
    addition: QuizTypeStats;
    recognition: QuizTypeStats;
    make10: QuizTypeStats;
  };
}

interface QuizTypeStats {
  quizzesCompleted: number;
  averageScore: number;
  averageStarRating: number;
  bestScore: number;
  totalTimeSpent: number; // milliseconds
}
```

### 4. User Preferences
```typescript
interface UserPreferences {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  theme: 'light' | 'dark';
  difficulty: 'easy' | 'medium' | 'hard'; // future
}
```

---

## Storage Structure

**Note:** These keys are managed by `StorageService`. Components never access localStorage directly.

### localStorage Keys (managed by StorageService)
```
math-app:session-history     // Array<QuizSessionRecord>
math-app:in-progress         // InProgressQuiz | null
math-app:user-stats          // UserStats
math-app:preferences         // UserPreferences
math-app:version             // string (for migration)
```

### Access Pattern
```typescript
// ❌ NEVER do this in components:
localStorage.setItem('math-app:session-history', JSON.stringify(data));

// ✅ ALWAYS use service layer:
quizService.saveCompletedSession(session);
```

### Size Estimates
- Session history (last 50 sessions): ~50KB
- In-progress quiz: ~5KB
- User stats: ~2KB
- Preferences: ~1KB
- **Total: ~60KB** (well under 5MB limit)

---

## Features to Implement

### Phase 1: Basic Persistence (MVP)
- [x] Save completed quiz sessions to history
- [x] Calculate and display user statistics
- [x] Resume in-progress quiz on page reload
- [x] Clear old sessions (keep last 50)

### Phase 2: Progress Dashboard
- [ ] Create dashboard page showing:
  - Total quizzes completed
  - Overall accuracy
  - Star rating distribution
  - Recent quiz history (last 10)
  - Performance by quiz type
- [ ] Add "View Progress" button to home page

### Phase 3: Detailed Analytics
- [ ] Performance trends over time (line chart)
- [ ] Accuracy by question difficulty
- [ ] Time spent per quiz type
- [ ] Streak tracking (consecutive days)
- [ ] Achievement badges

### Phase 4: Enhanced Features
- [ ] Export data as JSON/CSV
- [ ] Reset/clear all data option
- [ ] Data migration for version updates
- [ ] Offline indicator

---

## User Experience

### Resume Quiz Flow
```
1. User starts quiz
2. Answers 3 questions
3. Accidentally closes browser
4. Returns to app
5. See banner: "You have an incomplete quiz. Resume?"
   [Resume] [Start New]
6. Click Resume → Continue from question 4
```

### Progress Dashboard Flow
```
Home Page
  ↓
[View Progress] button
  ↓
Progress Dashboard
  - Summary stats
  - Recent quizzes
  - Performance charts
  ↓
[Back to Home]
```

---

## Implementation Plan

**Prerequisites:**
1. ✅ Service layer must be implemented first (see SERVICE_LAYER_ARCHITECTURE.md)
2. ✅ StorageService handles localStorage operations
3. ✅ QuizService handles business logic

### Step 1: Extend QuizService (Already exists from service layer)
```typescript
// shared/services/QuizService.ts
class QuizService {
  // Session management (already implemented)
  startQuiz(type: QuizType): string
  saveProgress(session: QuizSession): void
  getCurrentSession(): QuizSession | null
  clearProgress(): void
  
  // Add these methods for persistent state:
  saveCompletedSession(session: QuizSessionRecord): void
  getSessionHistory(limit?: number): QuizSessionRecord[]
  getUserStats(): UserStats
  updateStats(session: QuizSessionRecord): void
  savePreferences(prefs: UserPreferences): void
  getPreferences(): UserPreferences
  clearAllData(): void
}
```

### Step 2: Update Quiz Components
- QuizSession: Call `quizService.saveProgress()` after each question
- TenFrameQuiz: Call `quizService.saveProgress()` after each question
- SummaryScreen: Call `quizService.saveCompletedSession()` on completion
- App.tsx: Call `quizService.getCurrentSession()` on mount to check for resume

### Step 3: Create Progress Dashboard
- New route: `/progress`
- ProgressDashboard component
- StatsSummary component
- RecentQuizzes component
- PerformanceChart component (optional)

### Step 4: Add Resume Quiz Feature
- InProgressBanner component
- Show on home page if quiz exists
- Handle resume vs. start new

---

## Data Privacy & Security

### Considerations
- All data stored locally on user's device
- No personal information collected
- No data sent to external servers
- User can clear data anytime

### COPPA Compliance (Children's Privacy)
- No account creation required
- No personal information collected
- No tracking or analytics sent externally
- Parent can clear data via browser settings

---

## Edge Cases

### 1. localStorage Full
**Scenario:** User's localStorage quota exceeded  
**Solution:** 
- Catch quota exceeded error
- Delete oldest sessions
- Retry save
- Show warning if still fails

### 2. Corrupted Data
**Scenario:** Invalid JSON in localStorage  
**Solution:**
- Wrap all reads in try-catch
- Return default values on error
- Log error to console
- Clear corrupted key

### 3. Version Migration
**Scenario:** App updated with new data structure  
**Solution:**
- Store version number in localStorage
- Run migration function on version mismatch
- Transform old data to new format
- Update version number

### 4. Multiple Tabs
**Scenario:** User opens app in multiple tabs  
**Solution:**
- Use storage event listener
- Sync state across tabs
- Show warning if quiz in progress in another tab

### 5. Browser Clears Data
**Scenario:** User clears browser data  
**Solution:**
- Accept data loss (expected behavior)
- Show "Start Fresh" message
- No error state needed

---

## Testing Strategy

### Unit Tests
- StorageService methods
- Data serialization/deserialization
- Stats calculation logic
- Migration functions

### Integration Tests
- Save and resume quiz flow
- Complete quiz and update stats
- Clear data functionality
- Cross-tab synchronization

### Manual Testing
- Test in different browsers
- Test with localStorage disabled
- Test with quota exceeded
- Test data persistence across sessions

---

## Performance Considerations

### Read Performance
- Parse JSON on read: ~1ms for typical data
- Cache parsed data in memory during session
- Only read from localStorage on mount

### Write Performance
- Stringify JSON on write: ~1ms
- Debounce frequent writes (e.g., every 5 seconds)
- Write critical data immediately (quiz completion)

### Storage Optimization
- Limit session history to 50 most recent
- Remove unnecessary fields from stored data
- Compress large strings if needed (future)

---

## Future Enhancements

### Multi-User Profiles
- Add user selection screen
- Store data per user ID
- Switch between profiles

### Cloud Sync
- Add backend API
- Sync localStorage to cloud
- Conflict resolution strategy

### Advanced Analytics
- Machine learning for difficulty adjustment
- Personalized recommendations
- Learning pattern detection

### Gamification
- Achievement system
- Daily challenges
- Reward animations

---

## Open Questions

1. **How long to keep session history?**
   - Option A: Last 50 sessions
   - Option B: Last 30 days
   - Option C: Unlimited (until quota)
   - **Recommendation:** Last 50 sessions (manageable size)

2. **Should we auto-resume incomplete quiz?**
   - Option A: Auto-resume immediately
   - Option B: Show banner with choice
   - Option C: Ask on home page
   - **Recommendation:** Option B (user choice)

3. **What to do with very old data?**
   - Option A: Keep forever
   - Option B: Archive after 90 days
   - Option C: Delete after 90 days
   - **Recommendation:** Option A for now (simple)

4. **Should stats be real-time or cached?**
   - Option A: Calculate on every read
   - Option B: Update incrementally on write
   - Option C: Hybrid (cache with refresh)
   - **Recommendation:** Option B (better performance)

---

## Success Metrics

### Technical Metrics
- localStorage usage < 100KB
- Read/write operations < 5ms
- Zero data corruption errors
- 100% test coverage for storage service

### User Metrics
- % of users who resume incomplete quizzes
- % of users who view progress dashboard
- Average session history length
- User retention (return visits)

---

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| localStorage cleared by user | High | Medium | Accept as expected behavior |
| Data corruption | Medium | Low | Validation + error handling |
| Storage quota exceeded | Medium | Low | Auto-cleanup old data |
| Performance degradation | Low | Low | Optimize read/write operations |
| Privacy concerns | High | Low | Clear privacy policy, no PII |

---

## Timeline Estimate

- **Phase 1 (MVP):** 4-6 hours
  - Storage service: 2 hours
  - Quiz integration: 2 hours
  - Testing: 1-2 hours

- **Phase 2 (Dashboard):** 6-8 hours
  - Dashboard UI: 3-4 hours
  - Charts/visualizations: 2-3 hours
  - Testing: 1 hour

- **Phase 3 (Analytics):** 8-10 hours
- **Phase 4 (Enhanced):** 6-8 hours

**Total MVP:** 4-6 hours

---

## References

- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [COPPA Compliance](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- [Web Storage Best Practices](https://web.dev/storage-for-the-web/)

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-07  
**Status:** Ready for Review
