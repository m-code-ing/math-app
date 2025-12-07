# QuizService Test Failures - Fix Guide

## Problem

5 tests fail in `QuizService.test.ts` due to **data contamination across tests**:
- Expected 0 quizzes, got 4
- Expected 1 quiz, got 5
- Expected clean state after `clearAllData()`, got 8 records

**Root Cause:** Previous tests save sessions to localStorage, triggering `updateStats()`. Even though `afterEach` clears localStorage, subsequent tests still see stale data counts.

---

## Why It Happens

1. Session history tests save 60+ sessions, which calls `updateStats()` and persists user stats
2. Nested `beforeEach` at line 117-121 is redundant and doesn't prevent cross-contamination
3. Tests execute in an order that accumulates data from earlier test suites

---

## Solution Attempted (2025-12-07)

### Attempt 1: Remove nested beforeEach blocks ❌ FAILED
**Action:** Removed nested beforeEach blocks from:
- `describe('session history')`
- `describe('user statistics')`  
- `describe('clearAllData')`

**Result:** Tests still fail with same error counts
- Expected: 0, Received: 4
- Expected: 1, Received: 5

**Why it didn't work:** Unknown - the guide suggested this would fix it, but data still leaks between tests.

### Attempt 2: Add beforeAll/afterAll hooks ❌ FAILED
**Action:** Added `beforeAll()` and `afterAll()` to clear localStorage at suite level

**Result:** No change - tests still fail

### Attempt 3: Add nested beforeEach with clearAllData() ❌ FAILED
**Action:** Added nested beforeEach blocks that call `service.clearAllData()` instead of `localStorage.clear()`

**Result:** No change - tests still fail

---

## Current Status

**Tests pass individually:**
```bash
npm test -- QuizService.test.ts -t "returns default stats when none exist"
# ✅ PASS
```

**Tests fail when run together:**
```bash
npm test -- QuizService.test.ts
# ❌ FAIL (5 tests)
```

**Error pattern:**
- "session history" tests run first (save 60+ sessions)
- "user statistics" tests run second (expect clean state)
- Data from first suite contaminates second suite

---

## Findings

1. **localStorage.clear() may not work in Jest**
   - Even though `beforeEach` calls `localStorage.clear()`
   - Data persists between tests

2. **Test execution order matters**
   - Tests pass individually
   - Tests fail when run in sequence
   - Suggests shared state between tests

3. **Service instances are recreated**
   - `beforeEach` creates new `StorageService` and `QuizService`
   - But they still read old data from localStorage

---

## Possible Root Causes

### Theory 1: Jest's localStorage mock is broken
- `localStorage.clear()` doesn't actually clear
- Need to manually remove keys

### Theory 2: Async timing issue
- Data written in one test isn't cleared before next test
- Need to use `await` or flush promises

### Theory 3: Module-level state
- Something is cached at module level
- Need to reset modules between tests

---

## Next Steps to Try

### Option A: Manual key removal
```typescript
beforeEach(() => {
  // Instead of localStorage.clear()
  localStorage.removeItem('math-app:session-history');
  localStorage.removeItem('math-app:user-stats');
  localStorage.removeItem('math-app:preferences');
  storage = new StorageService();
  service = new QuizService(storage);
});
```

### Option B: Reset modules
```typescript
beforeEach(() => {
  jest.resetModules();
  localStorage.clear();
  storage = new StorageService();
  service = new QuizService(storage);
});
```

### Option C: Use jest-localstorage-mock
```bash
npm install --save-dev jest-localstorage-mock
```

### Option D: Isolate test suites
Run each describe block in separate test file:
- `QuizService.sessionHistory.test.ts`
- `QuizService.userStats.test.ts`
- `QuizService.preferences.test.ts`

---

## Original Solution (From Guide)

Remove the redundant nested `beforeEach` block in the "user statistics" describe block.

**Status:** ❌ Did not fix the issue

**File:** `app/src/shared/services/__tests__/QuizService.test.ts`

**Remove lines 117-121:**
```typescript
// DELETE THIS BLOCK:
beforeEach(() => {
  localStorage.clear();
  storage = new StorageService();
  service = new QuizService(storage);
});
```

This block duplicates the main `beforeEach` (lines 9-13) and provides no additional isolation.

### Why This Works (According to Guide)

The main `beforeEach` already:
- Clears localStorage completely
- Creates fresh StorageService and QuizService instances
- Runs **before each test**, not just before each describe block

Jest's test execution order ensures each individual test gets a clean state.

**Reality:** This did not work. Tests still fail.

---

## Verification

After removing the nested beforeEach, run tests:
```bash
npm test -- StorageService.test.ts QuizService.test.ts --no-coverage
```

Expected result:
- ✅ StorageService: PASS (14 tests)
- ❌ QuizService: FAIL (5 of 19 tests fail)

---

## Timeline

**Time spent:** 2+ hours
**Status:** UNRESOLVED
**Impact:** 5 tests failing, blocks service layer completion

