# NimbusCodex — Complete Frontend Report
> **Project path**: `e:\NimbusCodex\NimbusCodex--Frontend`
> **Date**: March 14, 2026
> **Total source files**: 26 (20 components + CSS modules, 2 pages, 1 data file, 2 core files, 1 global CSS)

---

## 1. Tech Stack & Toolchain

| Item | Value |
|---|---|
| **Framework** | React 19.2.4 |
| **Language** | TypeScript 5.9.3 |
| **Build tool** | Vite 8.0.0 |
| **Routing** | React Router DOM 7.13.1 |
| **Styling** | CSS Modules (scoped per-component) |
| **Code editor** | `@monaco-editor/react` 4.7.0 |
| **Terminal** | `@xterm/xterm` 6.0.0 + `@xterm/addon-fit` 0.11.0 |
| **Charts** | Recharts 3.8.0 |
| **Icons** | Lucide React 0.577.0 |
| **Linting** | ESLint 9 + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` |

### [tsconfig.json](file:///e:/NimbusCodex/NimbusCodex--Frontend/tsconfig.json) highlights
- Target: `ES2020`, module: `ESNext`, bundler module resolution
- Strict mode on; `noEmit` true (Vite handles emit)
- JSX factory: `react-jsx` (no manual React import needed)

### [vite.config.ts](file:///e:/NimbusCodex/NimbusCodex--Frontend/vite.config.ts)
- `@vitejs/plugin-react` enabled
- `optimizeDeps.include: ['@monaco-editor/react']` — pre-bundles Monaco to avoid runtime loading issues

---

## 2. Project Structure

```
src/
├── main.tsx                    # App entry point (StrictMode + createRoot)
├── App.tsx                     # Route definitions (BrowserRouter)
├── index.css                   # Global design tokens, reset, typography
├── vite-env.d.ts               # Vite type augmentation
│
├── data/
│   └── environments.ts         # Environment definitions & Interface
│
├── pages/
│   ├── Home.tsx                # Landing page
│   └── Lab.tsx                 # Workspace page
│
└── components/
    ├── Navbar/                 # Top navigation bar
    ├── Hero/                   # Landing hero section
    ├── EnvironmentGrid/        # Grid of environment cards
    ├── EnvironmentCard/        # Single environment card
    ├── EnvironmentDrawer/      # Bottom sheet detail drawer
    ├── Auth/                   # Login & Sign-Up panel 
    ├── CodeEditor/             # Monaco editor wrapper
    ├── Terminal/               # Xterm.js terminal
    ├── MetricsPanel/           # Live CPU/memory chart
    └── RunButton/              # Run/loading button
    └── Workspace/              # Full IDE layout orchestrator

├── context/
│   └── AuthContext.tsx         # Global JWT state and local storage manager
```

---

## 3. Entry Points

### [index.html](file:///e:/NimbusCodex/NimbusCodex--Frontend/index.html)
- `<title>`: **"CloudLab — Instant Cloud Coding Environments"**
- `<meta name="description">`: _"Launch Python, Node, Java, C++, Go or Rust coding environments instantly in your browser."_
- `<link rel="icon">`: SVG favicon from `/favicon.svg`
- React root: `<div id="root">` + module script pointing to [/src/main.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/main.tsx)

### [main.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/main.tsx)
- Bootstraps with `createRoot` in `StrictMode`
- Imports global [index.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/index.css) before [App](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/App.tsx#5-15)

### [App.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/App.tsx)
- Wraps app in `<AuthProvider>` and `<BrowserRouter>`
- **Three routes:**
  - `/` → `<Home />`
  - `/login` → `<Auth />`
  - `/lab` → `<AuthGuard>` → `<Lab />` (Protected route)

---

## 4. Global Design System ([index.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/index.css))

### Typography
```
@import 'Inter' (weights 400–800, optical size 14–32)
@import 'JetBrains Mono' (weights 400–600)
```

### CSS Custom Properties (Design Tokens)
| Token | Value | Purpose |
|---|---|---|
| `--bg-primary` | `#f0f2f7` | Page background |
| `--bg-secondary` | `#ffffff` | Card/panel surface |
| `--bg-tertiary` | `#f8fafc` | Muted surface |
| `--border` | `#e2e8f0` | Default border |
| `--border-muted` | `#f1f5f9` | Subtle border |
| `--text-primary` | `#0f172a` | Headings & body |
| `--text-secondary` | `#475569` | Supporting text |
| `--text-muted` | `#94a3b8` | Placeholders/hints |
| `--accent` | `#4f46e5` | Indigo primary CTA |
| `--accent-light` | `#eef2ff` | Accent tint background |
| `--accent-hover` | `#4338ca` | Darker accent on hover |
| `--success` | `#16a34a` | Success/run green |
| `--warning` | `#ca8a04` | Warning amber |
| `--error` | `#dc2626` | Error red |
| `--cyan` | `#0891b2` | Metric/info cyan |
| `--shadow-sm/md/lg` | layered rgba | Elevation shadows |
| `--font-sans` | Inter + system | Body font stack |
| `--font-mono` | JetBrains Mono | Code font stack |
| `--radius-sm/md/lg/xl` | 8/12/16/24px | Rounded corners |

### Global Resets & Utilities
- Universal `box-sizing: border-box`, margin/padding 0 reset
- [html](file:///e:/NimbusCodex/NimbusCodex--Frontend/index.html): 16px base, `scroll-behavior: smooth`
- `body`: light bg, Inter font, antialiased, min-height 100vh
- **Custom scrollbar** (6px, transparent track, border-colored thumb)
- **Selection color**: indigo tint (`rgba(79,70,229,0.15)`)
- **Focus ring**: 2px `--accent` outline with 2px offset
- `a, button`: `transition: all 0.2s ease`
- `code, pre`: Mono font family

---

## 5. Data Layer ([src/data/environments.ts](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/data/environments.ts))

### [Environment](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/data/environments.ts#1-11) Interface
```ts
interface Environment {
  id: string;       // URL slug (e.g. 'python-basic')
  name: string;     // Display name
  icon: string;     // Emoji icon
  description: string;
  libraries: string[];
  color: string;    // Brand hex (per-env accent)
  language: string; // Monaco language ID
  template: string; // Starter code
}
```

### 9 Pre-configured Environments

| ID | Name | Icon | Language | Color | Libraries |
|---|---|---|---|---|---|
| `python-basic` | Python Basic | 🐍 | python | `#3b82f6` | os, sys, json, pathlib, datetime |
| `python-ds` | Python — Data Science | 📊 | python | `#4f46e5` | numpy, pandas, scikit-learn, langchain, matplotlib |
| `python-ml` | Python ML/AI | 🤖 | python | `#7c3aed` | tensorflow, torch, transformers, scikit-learn, openai |
| `node-ts` | Node.js + TypeScript | 🟨 | typescript | `#f59e0b` | typescript, ts-node, express, zod, dotenv |
| `node-fullstack` | Node.js Full Stack | 🌐 | typescript | `#10b981` | express, prisma, socket.io, jsonwebtoken, cors |
| `cpp` | C / C++ | ⚙️ | cpp | `#ef4444` | iostream, vector, algorithm, memory, boost |
| `java` | Java | ☕ | java | `#f97316` | Spring Boot, Hibernate, Maven, Lombok, JUnit 5 |
| `go` | Go | 🐹 | go | `#06b6d4` | gin, gorm, cobra, zap, testify |
| `rust` | Rust | 🦀 | rust | `#b45309` | tokio, serde, actix-web, clap, rayon |

Each environment includes a **full boilerplate code template** (Fibonacci, ML pipeline, Express server, etc.).

---

## 6. Pages

### [Home.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/pages/Home.tsx) (`/`)
- State: `selectedEnv: Environment | null`
- Renders: `<Navbar>` → `<main>` → `<Hero>` + `<EnvironmentGrid>` → `<EnvironmentDrawer>`
- `EnvironmentGrid.onSelectEnv` → sets `selectedEnv` → opens drawer
- `EnvironmentDrawer.onClose` → resets to `null`

### [Lab.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/pages/Lab.tsx) (`/lab?env=<id>`)
- Reads `env` query param via `useSearchParams`
- Looks up matching environment from the data array; defaults to first if ID missing
- If no environment found: `<Navigate to="/" replace />`
- Renders: `<Workspace environment={environment} />`

---

## 7. Components (Complete Details)

---

### 7.1 [Navbar](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Navbar/Navbar.tsx#5-41)

**File**: [Navbar.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Navbar/Navbar.tsx) + [Navbar.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Navbar/Navbar.module.css)

**What it renders:**
- Fixed top bar (z-index 100), backdrop-blur 20px, 85% white glass background
- Logo: indigo→violet gradient icon box (36×36px, 10px radius, ≤4px shadow) + "Nimbus**Codex**" with accent color on "Codex"
- Nav links: "Docs" (BookOpen icon), "GitHub"
- **Dynamic Auth Menu**: 
  - If Unauthenticated: shows "Log In" link
  - If Authenticated: replaces link with current `user.email` and a "Log Out" button
- "Launch" CTA button (accent color)

**CSS highlights:**
- Container: `max-width: 1280px`, `height: 64px`
- `launchBtn`: accent bg, hover → `translateY(-1px)`, shadow bump
- `navLink`: hover bg `--bg-tertiary`, color `--text-primary`

---

### 7.2 [Hero](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Hero/Hero.tsx#6-143)

**File**: [Hero.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Hero/Hero.tsx) + [Hero.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Hero/Hero.module.css)

**What it renders:**
- Full-viewport section (`min-height: 100vh`) with animated canvas + CSS orbs
- **Animated particle canvas** (80 particles): dots float with velocity, connected by faint lines when `dist < 100px`, drawn in indigo rgba
- **Gradient orbs**: Two absolutely positioned radial-gradient circles floating via `floatOrb` keyframe (10s/12s, reversed)
- **Beta badge**: pulsing dot + "Now in Beta — Free during early access"
- **H1 title**: "Instant Cloud **Coding** Environments" (responsive `clamp(2.6rem, 6vw, 4.4rem)`)
  - "Coding" word uses `linear-gradient(90deg, indigo → violet → cyan)` clip text
- **Subtitle**: two-liner description
- **CTA buttons**: "Start Coding" (accent primary) + "Explore Environments" (white/bordered secondary) — both anchor to `#environments`
- **Stats row**: "9+ Environments | <10s Launch Time | 100% Browser-based"
- **Scroll hint**: animated bouncing `ChevronDown` icon

**Key animations:**
| Animation | Keyframes | Effect |
|---|---|---|
| `floatOrb` | 0%→50%→100% translate | Gradient orbs float |
| `fadeInUp` | translateY(28px)→0 | Content entrance (0.7s) |
| `pulse` | scale(1)↔scale(0.8) | Beta badge dot pulse |
| `bounce` | translateY(0)↔(8px) | Scroll hint chevron |
| Canvas RAF | requestAnimationFrame | 80-particle network |

**Resize handling**: `window.addEventListener('resize', handleResize)` resets canvas dimensions; cleanup cancels animation frame.

---

### 7.3 [EnvironmentGrid](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentGrid/EnvironmentGrid.tsx#10-34)

**File**: [EnvironmentGrid.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentGrid/EnvironmentGrid.tsx) + [EnvironmentGrid.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentGrid/EnvironmentGrid.module.css)

**What it renders:**
- Section anchored at `id="environments"`, max-width 1280px
- Section header: "ENVIRONMENTS" pill label → "Pick Your Stack" heading → subtitle
- 3-column responsive grid of [EnvironmentCard](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentCard/EnvironmentCard.tsx#9-45) components
- Each card wrapper has staggered `animationDelay: i * 55ms`

**CSS highlights:**
- Grid: `repeat(3,1fr)` → `repeat(2,1fr)` at 960px → `1fr` at 580px
- `cardWrapper`: `opacity:0` → `cardIn` animation (fade up 18px, 0.5s ease forwards)
- Section heading: `clamp(2rem, 4.5vw, 3rem)`

---

### 7.4 [EnvironmentCard](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentCard/EnvironmentCard.tsx#9-45)

**File**: [EnvironmentCard.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentCard/EnvironmentCard.tsx) + [EnvironmentCard.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentCard/EnvironmentCard.module.css)

**What it renders:**
- Clickable card (`role="button"`, `tabIndex=0`, keyboard Enter support, `aria-label`)
- Header: 52×52 icon wrapper (emoji, accent-light bg) + language badge pill (uppercase)
- Env name (h3) + description paragraph
- Divider line
- Footer: up to 3 library tags (mono font) + "+N more" count + `→` arrow

**CSS highlights:**
- `card::before`: 3px top accent stripe, invisible by default, `opacity: 1` on hover
- Hover: `translateY(-5px)`, indigo border, elevated shadow
- Arrow: `translateX(4px)` + color change on hover
- Icon wrapper: bg darkens on hover
- Transition: `cubic-bezier(0.34, 1.4, 0.64, 1)` springy bounce

---

### 7.5 [EnvironmentDrawer](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentDrawer/EnvironmentDrawer.tsx#12-99)

**File**: [EnvironmentDrawer.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentDrawer/EnvironmentDrawer.tsx) + [EnvironmentDrawer.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentDrawer/EnvironmentDrawer.module.css)

**What it renders:**
- **Overlay**: blurred backdrop (`blur(4px)`, rgba 35% dark), click-to-close
- **Bottom drawer**: slides up from bottom (`translateY(100%)` → `translateY(0)`, cubic-bezier spring, 0.4s)
  - Width: [min(580px, 100vw)](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Terminal/Terminal.tsx#7-12), max-height 88vh, rounded top corners (24px)
  - Drag handle bar (36×4px)
  - Close button (X, circular, top-right)
  - Header: large icon (60×60px) + env name + description
  - "Libraries Included" section: 2-column grid of items with ✓ check icons (green)
  - "Language" section: pill badge
  - Full-width "Launch Environment" button (Rocket icon) → `navigate('/lab?env=<id>')`
- **Per-env accent color**: `--accent` CSS var overridden inline via `style={{ '--accent': env.color }}`
- **Keyboard**: `Escape` key closes drawer (event listener attached/cleaned)
- `role="dialog"`, `aria-modal="true"`, `aria-label` for accessibility

---

### 7.6 [Auth](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/pages/Auth/Auth.tsx) (Phase 2)
**File**: `Auth.tsx` + `Auth.module.css`

**What it renders:**
- Centralized card with a toggleable form state (Login vs Registration)
- Uses matching Light Premium CSS `--bg-primary` radial gradients.
- Integrates directly with the `http://localhost:4001/register` Express backend to issue and receive JWTs.
- `AuthContext.tsx`: Saves the resulting token to `localStorage` and redirects user to `/lab` upon success.
- `AuthGuard.tsx`: Intercepts unauthenticated hits to `/lab` and forces them here.

---

### 7.7 [CodeEditor](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/CodeEditor/CodeEditor.tsx#134-190)

**File**: [CodeEditor.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/CodeEditor/CodeEditor.tsx) + [CodeEditor.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/CodeEditor/CodeEditor.module.css)

**Props**: `language: string`, `value: string`, `onChange: (value: string) => void`

**What it renders:**
- Header bar with active file tab (`main.<ext>`, file icon) + language badge
- Monaco Editor filling remaining height

**Language mapping** (`LANGUAGE_MAP`):
`python | typescript | javascript | cpp | java | go | rust` → Monaco language IDs

**Extension mapping** (`EXT_MAP`):
`python→py | typescript→ts | javascript→js | cpp→cpp | java→java | go→go | rust→rs`

**Custom Monaco Theme: `cloudlab-light`**
Built on top of `vs` (light base), fully customized:

| Token category | Color |
|---|---|
| Comments | `#94a3b8` (slate muted, italic) |
| Keywords | `#4f46e5` (indigo, bold) |
| Strings | `#15803d` (green) |
| String escapes | `#0891b2` (cyan) |
| Numbers | `#b45309` (amber) |
| Functions | `#0771c5` (blue) |
| Types/Classes | `#0891b2` (cyan) |
| Variables | `#0f172a` |
| Operators | `#4f46e5` (indigo) |
| Delimiters | `#64748b` |
| Decorators/Meta | `#a855f7` (purple) |

Editor colors overridden: background, foreground, line number (active = indigo), cursor (indigo), selection (`#c7d2fe`), current line highlight, bracket match, find highlight, scrollbar, minimap, indent guides, all widget backgrounds/borders.

**Monaco options:**
- Font: JetBrains Mono 14px, ligatures enabled
- Line height: 22, padding top/bottom 16px
- Minimap enabled (scale 0.8)
- Smooth scrolling, phase blink cursor, smooth caret animation
- Bracket pair colorization on
- Auto layout, tab size 4
- `renderLineHighlight: 'line'`, `scrollBeyondLastLine: false`

---

### 7.7 [Terminal](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Terminal/Terminal.tsx#7-12)

**File**: [Terminal.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Terminal/Terminal.tsx) + [Terminal.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Terminal/Terminal.module.css)

**Exported interface**: `TerminalHandle { writeln, write, clear }`
Uses `forwardRef` + `useImperativeHandle` to expose the xterm API to parent.

**XTerm theme (dark):**
| Token | Color |
|---|---|
| Background | `#0d1117` (GitHub dark) |
| Foreground | `#e6edf3` |
| Cursor | `#4f46e5` (indigo) |
| Selection | `rgba(79,70,229,0.3)` |
| Green | `#22c55e` |
| Cyan | `#06b6d4` |
| Blue | `#4f46e5` |
| Yellow / Red / Magenta | standard ANSI |
- Font: JetBrains Mono 13px, lineHeight 1.5, underline cursor, cursorBlink on, scrollback 1000

**On mount:** Renders a styled welcome banner using ANSI escape codes:
```
╭───────────────────────────────────────╮
│  CloudLab Terminal — <language>
╰───────────────────────────────────────╯
$ 
```

**FitAddon**: auto-resizes terminal to fill container; `window.resize` listener fires `fitAddon.fit()`.

**CSS**: dark `#1a1b26` wrapper, `#16171f` header bar, macOS traffic-light dots (red/yellow/green), thin dark scrollbar on xterm-viewport.

---

### 7.8 [RunButton](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/RunButton/RunButton.tsx#9-40)

**File**: [RunButton.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/RunButton/RunButton.tsx) + [RunButton.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/RunButton/RunButton.module.css)

**Props**: `onRun: () => void`, `isRunning: boolean`

**What it renders:**
- Container bar (white, top border, subtle shadow)
- Green gradient button (`#16a34a → #15803d`), Play icon + "Run Code"
  - While running: changes to indigo gradient (`#4f46e5 → #7c3aed`), Loader2 spinning icon + "Running…"
  - Disabled while running, with opacity 0.65
  - Ripple pseudo-element on `:active`
- Shortcut hint: `Ctrl` + `Enter` keyboard badges (styled `<kbd>` elements)

**Animations:**
- `spin` keyframe (0.8s linear infinite) powers Loader2 spinner
- Button: `translateY(-1px)` on hover, ripple flash on click

---

### 7.9 [MetricsPanel](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/MetricsPanel/MetricsPanel.tsx#33-156)

**File**: [MetricsPanel.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/MetricsPanel/MetricsPanel.tsx) + [MetricsPanel.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/MetricsPanel/MetricsPanel.module.css)

**State**: `data: DataPoint[]` — rolling 12-point window of `{ time, cpu, mem }`

**Behavior:**
- Generates **12 initial data points** with randomized CPU (10–75%) and Memory (25–80%) values
- `setInterval` every **2 seconds**: appends a new data point, drops oldest (keeps 12 points)
- Shows current CPU % and Memory % as live stat cards

**What it renders:**
- Header: "Resource Monitor" title + pulsing green "LIVE" dot badge
- Two stat cards (Cpu icon → CPU %, MemoryStick icon → Memory %) — values colored indigo/cyan
- **Recharts `AreaChart`** (180px height, `ResponsiveContainer`):
  - Two areas: CPU (indigo `#4f46e5`) and Memory (cyan `#06b6d4`)
  - Each with `linearGradient` fill (40% → 0% opacity)
  - `CartesianGrid` dashed, dark theme axes (no tick lines/axis lines)
  - Custom dark tooltip (`#161b22` bg, 8px radius)
  - Legend with circle icons
  - `isAnimationActive: false` (no Recharts re-render animation for smooth live updates)

---

### 7.10 [Workspace](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Workspace/Workspace.tsx#60-170)

**File**: [Workspace.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Workspace/Workspace.tsx) + [Workspace.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Workspace/Workspace.module.css)

**Props**: `environment: Environment`

**State:**
- `code: string` — initialized from `environment.template`
- `isRunning: boolean` — true while simulating code execution
- `isLaunching: boolean` — true for first 2 seconds (container startup simulation)
- `terminalRef: TerminalHandle` — ref to control xterm instance

**CSS Grid Layout** (`grid-template-columns: 1fr 300px`, `grid-template-rows: 1fr 220px 56px`):
| Area | Grid Position |
|---|---|
| CodeEditor | col 1, row 1 |
| MetricsPanel | col 2, rows 1–3 (full height sidebar) |
| Terminal | col 1, row 2 |
| RunButton | col 1, row 3 |

**Responsive** (≤900px): stacks to single column, MetricsPanel moves to row 3.

**Launching overlay** (first 2s):
- Blurred backdrop (`backdrop-filter: blur(16px)`)
- Centered card with pulsing environment icon, name, and animated **progress bar** (fills over 2s)
- After 2s: overlay hides, terminal outputs `✓ Environment ready.`

**Top bar:**
- Back to Home button (`ArrowLeft` icon)
- Center: env icon + name + status badge (⟳ Launching… yellow / ● Running green)
- Right: package count with `Layers` icon

**Code execution simulation (`handleRun`):**
1. Prints colored execution command (e.g. `$ python3 main.py`)
2. Prints status lines: "Connecting…", "Container ready", "Running code…"
3. 1-second delay
4. Extracts `print(...)` / `console.log(...)` / `fmt.Println(...)` / `println!(...)` / `System.out.println(...)` / `std::cout` calls from editor content using regex
5. Prints matched outputs as green text; falls back to "Process finished with exit code 0"
6. Prints `✓ Done in 0.Xs` with random timing

**Language → run command mapping:**
| Language | Command |
|---|---|
| python | `python3 main.py` |
| typescript | `ts-node main.ts` |
| javascript | `node main.js` |
| cpp | `g++ -o main main.cpp && ./main` |
| java | `javac Main.java && java Main` |
| go | `go run main.go` |
| rust | `rustc main.rs && ./main` |

**Keyboard shortcut**: `Ctrl+Enter` (or `Cmd+Enter`) triggers `handleRun` via global `keydown` listener.

---

## 8. User Flows

### Flow 1: Browse & Launch Environment
1. User lands on `/` → sees [Navbar](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Navbar/Navbar.tsx#5-41) + [Hero](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Hero/Hero.tsx#6-143) (particle canvas, stats, CTAs)
2. Scrolls to "Pick Your Stack" grid
3. Clicks any [EnvironmentCard](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentCard/EnvironmentCard.tsx#9-45) → [EnvironmentDrawer](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentDrawer/EnvironmentDrawer.tsx#12-99) slides up from bottom
4. Reviews libraries, language, description
5. Clicks "Launch Environment" → navigates to `/lab?env=<id>`

### Flow 2: Code & Run in Lab
1. `/lab?env=<id>` loads → 2s launching overlay with progress bar
2. Overlay fades, terminal shows "✓ Environment ready."
3. Editor shows language-specific template code
4. User edits code in Monaco editor (full syntax highlight, autocomplete)
5. Clicks "Run Code" (or `Ctrl+Enter`)
6. Terminal animates: command → status lines → output
7. MetricsPanel shows live CPU/memory chart throughout
8. User can click "Back → Home" to return

---

## 9. Accessibility & UX Details

| Feature | Implementation |
|---|---|
| Keyboard navigation | [EnvironmentCard](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentCard/EnvironmentCard.tsx#9-45): `tabIndex=0` + Enter keydown; [EnvironmentDrawer](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentDrawer/EnvironmentDrawer.tsx#12-99): Escape closes |
| ARIA roles | Drawer: `role="dialog"`, `aria-modal="true"`, `aria-label`; Card: `role="button"`, `aria-label` |
| Focus ring | Global `:focus-visible` with 2px indigo outline |
| Smooth scroll | `html { scroll-behavior: smooth }` + in-page `#environments` anchor |
| Responsive grid | EnvironmentGrid: 3→2→1 col; Workspace: dual→single column at 900px |
| Resize handling | Canvas redraws on resize; Terminal FitAddon adjusts on resize |
| Loading feedback | 2s launch overlay + terminal welcome + RunButton disabled state |

---

## 10. Animation Inventory

| Location | Animation | Duration | Trigger |
|---|---|---|---|
| Hero canvas | Particle float + connections | Continuous RAF | On mount |
| Hero orbs | `floatOrb` translate | 10s / 12s | Always |
| Hero content | `fadeInUp` 28px slide | 0.7s | On mount |
| Hero badge dot | `pulse` scale | 2s | Always |
| Hero scroll hint | `bounce` Y | 2s | Always |
| Environment cards | `cardIn` fade+slide with stagger | 0.5s + 55ms/card | On mount |
| Card hover | spring `translateY(-5px)` + accent stripe | 0.25s cubic-bezier spring | Hover |
| Card arrow | `translateX(4px)` | 0.2s | Hover |
| Drawer | `translateY(100%)→0` slide-up | 0.4s cubic-bezier spring | Env selected |
| Overlay | fade in/out | 0.3s | Env selected |
| Navbar Launch btn | `translateY(-1px)` | 0.15s | Hover |
| Hero primary btn | `translateY(-2px)` shadow boost | 0.2s | Hover |
| Workspace launch icon | `pulse` scale | 1.5s | During launch |
| Workspace progress | width 0→100% | 2s | During launch |
| MetricsPanel live dot | `pulse` | 2s | Always |
| RunButton spinner | `spin` 360° | 0.8s linear | While running |
| RunButton hover | `translateY(-1px)` | 0.2s | Hover |
| RunButton ripple | opacity flash | 0.25s | On click |

---

## 11. File Size Summary

| File | Lines | Bytes |
|---|---|---|
| [environments.ts](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/data/environments.ts) | 245 | 6,050 |
| [CodeEditor.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/CodeEditor/CodeEditor.tsx) | 190 | 6,232 |
| [Workspace.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Workspace/Workspace.tsx) | 170 | 5,795 |
| [Hero.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Hero/Hero.module.css) | 203 | 4,189 |
| [Hero.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Hero/Hero.tsx) | 143 | 4,149 |
| [MetricsPanel.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/MetricsPanel/MetricsPanel.tsx) | 156 | 4,562 |
| [EnvironmentDrawer.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentDrawer/EnvironmentDrawer.module.css) | 201 | 3,778 |
| [EnvironmentDrawer.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentDrawer/EnvironmentDrawer.tsx) | 99 | 3,061 |
| [Terminal.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Terminal/Terminal.tsx) | 98 | 3,144 |
| [Workspace.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Workspace/Workspace.module.css) | 213 | 3,759 |
| [Navbar.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Navbar/Navbar.module.css) | 98 | 1,855 |
| [EnvironmentCard.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentCard/EnvironmentCard.module.css) | 141 | 2,586 |
| [index.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/index.css) | 86 | 2,298 |
| [RunButton.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/RunButton/RunButton.module.css) | 93 | 1,868 |
| [MetricsPanel.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/MetricsPanel/MetricsPanel.module.css) | 104 | 1,839 |
| [EnvironmentGrid.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentGrid/EnvironmentGrid.module.css) | 67 | 1,201 |
| [Navbar.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Navbar/Navbar.tsx) | 41 | 1,141 |
| [EnvironmentGrid.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentGrid/EnvironmentGrid.tsx) | 34 | 1,075 |
| [Terminal.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/Terminal/Terminal.module.css) | 59 | 885 |
| [EnvironmentCard.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/EnvironmentCard/EnvironmentCard.tsx) | 45 | 1,330 |
| [CodeEditor.module.css](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/CodeEditor/CodeEditor.module.css) | 66 | 1,032 |
| [RunButton.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/components/RunButton/RunButton.tsx) | 40 | 943 |
| [Home.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/pages/Home.tsx) | 28 | 782 |
| [App.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/App.tsx) | 15 | 346 |
| [Lab.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/pages/Lab.tsx) | 14 | 473 |
| [main.tsx](file:///e:/NimbusCodex/NimbusCodex--Frontend/src/main.tsx) | 11 | 226 |

**Total (approx)**: ~2,800 lines of source code across 26 files.
