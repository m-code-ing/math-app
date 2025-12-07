# Navigation Feature

**Date**: 2025-12-06  
**Status**: Design Phase

## Overview
Add navigation bar with back button to allow users to return to quiz mode selector from any quiz.

## Current State
- URL-based routing with React Router
- Routes: `/` (selector), `/addition`, `/recognition`, `/make10`
- No back navigation UI (users must use browser back button)

## Requirements

### Navigation Bar
- Fixed at top of all pages
- Contains:
  - App title/logo (left)
  - Back button (right) - only visible on quiz pages, not on selector page
- Minimal height to preserve screen space for quiz content

### Back Button Behavior
- Visible on: `/addition`, `/recognition`, `/make10`
- Hidden on: `/` (selector page)
- Action: Navigate to `/` (home/selector)
- Icon: Left arrow or Home icon
- Label: "Back" or "Home"

## Component Design

### NavBar Component
```typescript
interface NavBarProps {
  showBackButton?: boolean;
}
```

**Layout**:
- AppBar with minimal height (48px)
- Title on left: "Math Practice"
- Back button on right (conditional)

**Styling**:
- Primary color background
- White text
- Elevation: 1 (subtle shadow)

## Implementation
- Create `NavBar.tsx` component
- Add to App.tsx above Routes
- Use `useLocation()` hook to determine if back button should show
- Use `useNavigate()` for back navigation

## File Changes
- **NEW**: `app/src/components/NavBar.tsx`
- **MODIFY**: `app/src/App.tsx` - Add NavBar above Routes
