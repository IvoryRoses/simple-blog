# Simple Blog - AI Coding Instructions

## Project Overview

**simple-blog** is a React + TypeScript + Vite application with user authentication and blog management. It uses Supabase for backend auth, Redux for state management, and Tailwind CSS for styling.

## Architecture

### Tech Stack

- **Frontend Framework**: React 19 with TypeScript 5.9
- **Build Tool**: Vite 7 with HMR support
- **State Management**: Redux Toolkit (centralized auth state)
- **Backend/Auth**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS 4 via `@tailwindcss/vite`
- **Routing**: React Router 7 with route protection

### Data Flow

1. **Authentication Flow**: `AuthForm` → Supabase → Redux `authSlice` → Protected routes
2. **State Structure**: Redux store contains `auth` reducer with `User` object (id, email)
3. **Protected Routes**: `ProtectedRoute` component wraps `/blogs` path, checks Redux auth state
4. **Components**:
   - `AuthForm` (pages/): Login/signup with Supabase, dispatches `setUser` to Redux
   - `Blogs` (pages/): Displays user info, logout functionality
   - `ProtectedRoute` (components/): Navigation guard via Redux state

## Key Files & Patterns

### Environment & Config

- **Supabase config** ([src/supabase.ts](src/supabase.ts)): Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `import.meta.env`
- **Redux setup** ([src/store/store.ts](src/store/store.ts)): Basic `configureStore` with auth reducer
- **Routing** ([src/router.tsx](src/router.tsx)): BrowserRouter with two routes: `/` (AuthForm) and `/blogs` (protected)

### Styling Conventions

- Uses Tailwind CSS with `@tailwindcss/vite` plugin
- **Responsive classes**: `p-4`, `min-h-screen`, `max-w-md`
- **Hover states**: `hover:shadow-3xl`, `hover:bg-red-600`
- **Focus states**: `focus:border-purple-500`, `focus:ring`, `focus:ring-purple-200`
- Form inputs use consistent styling: `border-gray-300`, `focus:border-purple-500`

### Redux State Management

- **Slice location**: [src/slices/authSlice.ts](src/slices/authSlice.ts)
- **Actions**: `setUser(User)`, `clearUser()`
- **Type exports**: `RootState`, `AppDispatch` from store
- Pattern: Import reducer in store, export actions/default reducer from slice

### Supabase Integration

- Single client instance in [src/supabase.ts](src/supabase.ts)
- Used directly: `supabase.auth.signInWithPassword()`, `supabase.auth.signUp()`, `supabase.auth.signOut()`
- Errors returned in response object, not thrown

## Development Workflow

### Build & Run

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Compile TS then build with Vite
npm run lint       # Run ESLint on all files
npm run preview    # Preview production build
```

### TypeScript Configuration

- **Main config** ([tsconfig.json](tsconfig.json)): Base configuration
- **App config** ([tsconfig.app.json](tsconfig.app.json)): Target `ES2020` for React 19
- **Node config** ([tsconfig.node.json](tsconfig.node.json)): Vite config compilation

### ESLint & Code Style

- Uses `@eslint/js` with flat config
- Prettier integration with `prettier-plugin-tailwindcss` for auto class sorting
- React hooks linting via `eslint-plugin-react-hooks`

## Common Tasks

### Adding a New Page

1. Create file in [src/pages/](src/pages/)
2. Add Route in [src/router.tsx](src/router.tsx)
3. Wrap with `<ProtectedRoute>` if auth required
4. Use `useSelector` to access Redux auth state if needed

### Modifying Auth State

1. Edit [src/slices/authSlice.ts](src/slices/authSlice.ts) - add/modify reducers and actions
2. Import actions in components where needed
3. Use `dispatch()` to trigger state changes

### Styling Components

- Start with Tailwind classes directly in JSX
- Group related classes: layout (`p-4 min-h-screen`), colors (`bg-red-500 text-white`), interactions (`hover:bg-red-600 transition`)
- Reference existing patterns from [AuthForm](src/pages/AuthForm.tsx) for form styling

## Integration Points

- **Supabase Auth**: Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
- **Redux to Route Protection**: Auth state check in `ProtectedRoute` redirects to `/` if no user
- **Logout Flow**: `clearUser()` action + `supabase.auth.signOut()` + navigate to `/`

## Common Gotchas

- Supabase errors are in response object, not thrown - always check `error` property
- Protected routes use Redux state, not Supabase session directly - keep both in sync
- Vite env vars must be prefixed with `VITE_` and accessed via `import.meta.env`
- TypeScript types exported from store for proper `useSelector` typing
