# Home Gasifier Website - React Full Build

## Project Overview
Complete React/TypeScript website for Home Gasifier educational platform.

## Technology Stack
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI components)
- **Routing**: React Router v8
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Animations**: Motion (Framer Motion alternative)
- **Forms**: React Hook Form + Zod validation
- **Content**: JSON-based content files

## Project Structure

```
home-gasifier/
├── src/
│   ├── pages/              # 14 page components
│   │   ├── index.tsx       # Home page
│   │   ├── simulator.tsx
│   │   ├── how-it-works.tsx
│   │   ├── build-guides.tsx
│   │   ├── maintenance.tsx
│   │   ├── safety.tsx
│   │   ├── fuel-types.tsx
│   │   ├── real-builds.tsx
│   │   ├── troubleshooting.tsx
│   │   ├── glossary.tsx
│   │   ├── about.tsx
│   │   ├── resources.tsx
│   │   ├── legal.tsx
│   │   └── _404.tsx
│   ├── components/         # UI components & utilities
│   │   ├── ui/            # Radix UI wrapped components (50+)
│   │   ├── CookieBanner.tsx
│   │   ├── DemoContent.tsx
│   │   └── ...
│   ├── content/           # Content management
│   │   └── pages/        # 13 JSON content files
│   ├── lib/              # Utilities & helpers
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   ├── router.ts         # Route configuration
│   └── routes.tsx        # Route components
├── public/               # Static assets
├── export-plugins/       # Vite plugin system
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── index.html
```

## Pages Built

1. **Home Page** - Landing page with hero, features, newsletter signup
2. **Simulator** - Interactive gasifier physics simulator
3. **How It Works** - Educational content on gasification science
4. **Build Guides** - Step-by-step DIY construction guides
5. **Maintenance** - System upkeep and operation
6. **Safety** - Safety guidelines and precautions
7. **Fuel Types** - Different fuel options and characteristics
8. **Real Builds** - Case studies from actual installations
9. **Troubleshooting** - Common problems and solutions
10. **Glossary** - Technical terminology
11. **About** - Project information
12. **Resources** - External links and documentation
13. **Legal** - Terms of service and privacy policy
14. **404** - Page not found

## Components Included

- **50+ UI Components**: Accordion, Alert, Avatar, Badge, Button, Calendar, Card, Carousel, Checkbox, Command, Dialog, Drawer, Dropdown Menu, Form, Input, Label, Menubar, Navigation Menu, Pagination, Popover, Progress, Select, Separator, Sheet, Tabs, Toggle, Tooltip, etc.
- **Layout Components**: Navigation, Footer, Sidebar
- **Custom Components**: CookieBanner, DemoContent, FormattedBoundText, Spinner

## Features

✅ Responsive design (mobile, tablet, desktop)
✅ SEO optimized with schema.org JSON-LD
✅ Dark/light mode support
✅ Smooth animations and transitions
✅ Form validation with Zod
✅ Cookie banner consent
✅ Error boundaries
✅ Accessibility features (ARIA labels, keyboard navigation)
✅ Content management via JSON
✅ Server-side rendering ready

## Setup Instructions

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```
Open http://localhost:5173 in your browser

### Build Production
```bash
npm run build
```

### Run Built Version
```bash
npm run preview
```

## Environment Variables
See `env.example` for configuration options

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundles (CSR + SSR)
- `npm run preview` - Preview production build
- `npm run test` - Run Vitest
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - Check TypeScript types
- `npm run format` - Format code with Prettier

## Content Management

All page content is stored in `src/content/pages/` as JSON files. 
To update content, edit the corresponding JSON file:
- `home.json` - Home page
- `simulator.json` - Simulator page
- `how_it_works.json` - How It Works page
- etc.

Content is loaded using Vite's virtual module system:
```typescript
import { home } from 'virtual:content';
```

## Key Files

- **vite.config.ts** - Vite configuration with plugins
- **tailwind.config.js** - Tailwind CSS customization
- **tsconfig.json** - TypeScript configuration
- **package.json** - Dependencies and scripts

## Notes

- Requires Node.js 22.22.0 or higher
- Uses pnpm-compatible npm lockfile
- ESLint + Prettier configured for code quality
- Vitest for unit testing
- Error boundary for graceful error handling

---
**Status**: Ready for development and deployment
**Created**: 2026-08-21
