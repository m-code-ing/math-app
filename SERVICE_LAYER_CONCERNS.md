# Service Layer Implementation - Concerns

**Date**: 2025-12-07

## Test Fix - Mutation Bug

**Root Cause:** Default objects (`DEFAULT_USER_STATS`, `DEFAULT_USER_PREFERENCES`) were being returned by reference, allowing tests to mutate shared constants.

**Fix:** Return deep copies via `JSON.parse(JSON.stringify())` to prevent mutation.

**Status:** ✅ All 32 tests passing

---

## Concerns

### 1. Deep Copy Performance
**Issue:** Using `JSON.parse(JSON.stringify())` for deep copy is inefficient.

**Impact:** Low - only called when no data exists in localStorage (first load).

**Better approach:** Use structured clone or spread operator for shallow objects.

### 2. Test Cleanup Redundancy
**Issue:** Manual `removeItem()` in both `beforeEach` AND `afterEach`.

**Impact:** Minimal - just redundant code.

**Better approach:** Only in `beforeEach` is sufficient.

### 3. Missing beforeAll
**Issue:** Removed `beforeAll()` hook during debugging.

**Impact:** None - `beforeEach` handles cleanup.

**Question:** Was it intentionally removed or accidentally?

---

## Recommendations

1. **Keep current fix** - It works, tests pass
2. **Refactor later** - Replace JSON deep copy with better method if performance matters
3. **Document mutation risk** - Add comment warning about returning references to constants

---

**Priority:** Low - Current implementation works correctly
