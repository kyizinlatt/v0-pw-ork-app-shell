# UI Guide — PWORK Application

## Table of Contents

1. [Design System](#design-system)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Navigation & Pages](#navigation--pages)
7. [Forms & Interactions](#forms--interactions)
8. [Best Practices](#best-practices)

---

## Design System

PWORK uses a **semantic design token system** built on Tailwind CSS v4 with dark mode support. The design prioritizes clarity, accessibility, and consistent visual hierarchy across the entire application.

### Key Principles

- **Semantic tokens** instead of direct colors (use `bg-background`, not `bg-white`)
- **Mobile-first responsive design** with Tailwind breakpoints
- **Consistent spacing scale** for visual rhythm
- **Dark mode support** with automatic token switching
- **Accessibility-first** with proper contrast ratios and ARIA labels

---

## Color Palette

### Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `background` | White (`oklch(1 0 0)`) | Main page backgrounds |
| `foreground` | Near-black (`oklch(0.145 0 0)`) | Primary text |
| `card` | White | Card backgrounds |
| `border` | Light gray (`oklch(0.922 0 0)`) | Borders and dividers |
| `muted` | Soft gray (`oklch(0.97 0 0)`) | Secondary backgrounds |
| `muted-foreground` | Medium gray (`oklch(0.556 0 0)`) | Secondary text |
| `primary` | Dark (`oklch(0.205 0 0)`) | Primary actions (sidebar) |
| `destructive` | Red (`oklch(0.577 0.245 27.325)`) | Error states, delete actions |

### Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| `background` | Near-black (`oklch(0.145 0 0)`) | Main backgrounds |
| `foreground` | White (`oklch(0.985 0 0)`) | Primary text |
| `card` | Dark (`oklch(0.145 0 0)`) | Card backgrounds |
| `border` | Dark gray (`oklch(0.269 0 0)`) | Borders |
| `muted` | Dark gray (`oklch(0.269 0 0)`) | Secondary backgrounds |
| `muted-foreground` | Light gray (`oklch(0.708 0 0)`) | Secondary text |

### Semantic Colors

- **Indigo (`bg-indigo-600`)** — Primary action color, buttons, highlights
- **Rose/Red (`bg-rose-500`)** — Error states, SLA due dates, destructive actions
- **Amber (`bg-amber-500`)** — Warnings, deadlines
- **Green (`bg-green-500`)** — Success states, completed items
- **Blue (`bg-blue-500`)** — Information, active states

---

## Typography

### Font Family

- **Headings & Body:** Geist (sans-serif)
- **Code & Monospace:** Geist Mono

Apply using Tailwind classes:
- `font-sans` for body text
- `font-mono` for code and fixed-width text

### Font Sizes & Weights

| Usage | Class | Specs |
|-------|-------|-------|
| Page Title | `text-2xl font-bold` | 28px, 700 weight |
| Section Title | `text-lg font-semibold` | 18px, 600 weight |
| Body Text | `text-sm` | 14px, 400 weight |
| Small Text | `text-xs` | 12px, 400 weight |
| Label | `text-sm font-medium` | 14px, 500 weight |
| Code | `font-mono text-xs` | 12px monospace |

### Line Height

- Body text: `leading-relaxed` (1.625)
- Tight text: `leading-tight` (1.25)
- Normal: `leading-normal` (1.5)

---

## Spacing & Layout

### Spacing Scale

Tailwind spacing is used consistently:
- **xs**: `gap-1`, `p-1` (4px)
- **sm**: `gap-2`, `p-2` (8px)
- **md**: `gap-3`, `p-3` (12px)
- **lg**: `gap-4`, `p-4` (16px)
- **xl**: `gap-6`, `p-6` (24px)
- **2xl**: `gap-8`, `p-8` (32px)

### Layout Method Priority

1. **Flexbox** (default for most layouts)
   ```tsx
   <div className="flex items-center justify-between gap-4">
   ```

2. **CSS Grid** (complex 2D layouts)
   ```tsx
   <div className="grid grid-cols-3 gap-4">
   ```

3. Avoid floats and absolute positioning

### Responsive Breakpoints

- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

**Mobile-first approach:** Design for mobile first, then enhance with `md:`, `lg:` prefixes.

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Single column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

---

## Components

### Core UI Components (shadcn/ui)

All components are located in `/components/ui/`. Here are the most commonly used:

#### Button

```tsx
import { Button } from "@/components/ui/button"

<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button disabled>Disabled</Button>
<Button size="sm">Small</Button>
<Button className="bg-indigo-600 hover:bg-indigo-700">Custom</Button>
```

**Variants:** `default`, `outline`, `ghost`, `secondary`, `destructive`  
**Sizes:** `default`, `sm`, `lg`

#### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

#### Input & Textarea

```tsx
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

<Input placeholder="Enter text..." />
<Textarea placeholder="Multiple lines..." />
```

#### Badge

```tsx
import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge className="bg-rose-100 text-rose-700">Custom</Badge>
```

#### Dialog

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

#### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

#### Alert & Toast

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

// Alert
<Alert>
  <AlertTitle>Title</AlertTitle>
  <AlertDescription>Description</AlertDescription>
</Alert>

// Toast
const { toast } = useToast()
toast({ title: "Success", description: "Action completed" })
```

### Custom Components

#### Sidebar

Located in `/components/sidebar.tsx`

The main navigation sidebar with:
- Logo/branding area
- Navigation groups (Main, Admin, Finance, etc.)
- User profile section
- Mobile responsive

Usage:
```tsx
<Sidebar activeItem="Cases" onMobileClose={() => {}} mobileOpen={false} />
```

#### Header

Located in `/components/header.tsx`

Top navigation bar with:
- Search functionality
- Notifications badge
- User menu
- Mobile menu toggle

Usage:
```tsx
<Header onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />
```

#### Case Drawer

Located in `/components/case-drawer.tsx`

Detailed case information panel with:
- Collapsible sections (Customer, Timeline, Messages, Documents, etc.)
- Resizable drawer
- Real-time message updates
- Status transitions

#### StatusBadge

Located in `/components/status-badge.tsx`

Shows case status with color coding:
```tsx
<StatusBadge status="RECEIVE" size="default" />
```

Status colors:
- `RECEIVE` → Gray
- `CHECKING` → Blue
- `SUBMITTED` → Indigo
- `WORKING` → Purple
- `DONE` → Green
- `PUBLISH` → Yellow
- `AWAITING_PICKUP` → Orange
- `DELIVERY` → Blue
- `CLOSED` → Dark gray

---

## Navigation & Pages

### Main Application Pages

#### Dashboard (`/dashboard`)

Overview dashboard showing:
- Quick stats (cases this month, pending, overdue)
- Case performance charts
- Recent cases list

#### Cases (`/`)

Main case management page with:
- Filterable case list by service type
- Case drawer on selection
- Status badges and quick actions

#### Inbox (`/inbox`)

Messaging center with:
- Conversation list (left sidebar)
- Chat view (right panel)
- Emoji picker & image upload
- Real-time message status

#### Notifications (`/notifications`)

Notification management with:
- Filter tabs (All/Unread)
- Notification types (message, case, alert, reminder)
- Mark as read/delete actions
- Notification preferences

#### Calendar (`/calendar`)

Event calendar showing:
- Monthly view with event indicators
- SLA deadlines, meetings, and task deadlines
- Event details sidebar
- Color-coded event types

#### Admin Pages

##### Service Types (`/admin/service-types`)

Manage service types (KS, WP, 90D, etc.):
- Create/edit/delete services
- Required documents configuration (image/PDF)
- SLA settings and pricing
- Partner requirements

##### Users (`/admin/users`)

User management:
- Create/edit/delete users
- Role assignment (Admin, Staff, Partner)
- Permission management
- User status

##### Settings (`/admin/settings`)

System settings and configuration

### Public Pages

#### Track (`/track/[token]`)

Public case tracking for customers:
- Status pipeline visualization
- Public documents download
- Request documents feature
- Bilingual labels (English/Myanmar)

#### Login (`/login`)

Authentication page with:
- Email/password input
- Show/hide password toggle
- Demo credentials (admin@pwork.com / admin123)
- Error messages
- Loading state

---

## Forms & Interactions

### Form Layout

Use semantic HTML with proper labels:

```tsx
<div className="space-y-4">
  <div className="space-y-1.5">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="Enter email..." />
  </div>
  <div className="space-y-1.5">
    <Label htmlFor="message">Message</Label>
    <Textarea id="message" placeholder="Enter message..." />
  </div>
</div>
```

### Form Patterns

#### Input with Error

```tsx
<div className="space-y-1.5">
  <Label>Field Name</Label>
  <Input className="border-red-500" placeholder="..." />
  <p className="text-xs text-red-500">Error message</p>
</div>
```

#### Segmented Control

Toggle between options:

```tsx
<div className="flex gap-2 border border-border rounded-md overflow-hidden">
  {["Option 1", "Option 2", "Option 3"].map((opt) => (
    <button
      key={opt}
      className={cn(
        "flex-1 py-2 text-sm font-medium transition-all",
        selected === opt
          ? "bg-indigo-600 text-white"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {opt}
    </button>
  ))}
</div>
```

#### Modal Dialog

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Form content */}
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Status Indicators

#### Badge with Color

```tsx
<Badge className="bg-green-100 text-green-700">Active</Badge>
<Badge className="bg-rose-100 text-rose-700">Inactive</Badge>
<Badge className="bg-amber-100 text-amber-700">Pending</Badge>
```

#### Timeline

```tsx
<div className="relative space-y-0">
  {events.map((event, i) => (
    <div key={event.id} className="relative flex gap-3 pb-4">
      {i < events.length - 1 && (
        <div className="absolute left-[9px] top-5 bottom-0 w-px bg-border" />
      )}
      <div className="relative z-10 mt-0.5 shrink-0 size-[18px] rounded-full flex items-center justify-center bg-indigo-100">
        <div className="size-2 rounded-full bg-indigo-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-foreground">{event.action}</p>
        <p className="text-xs text-muted-foreground">{event.time}</p>
      </div>
    </div>
  ))}
</div>
```

### Loading States

#### Spinner Button

```tsx
<Button disabled className="gap-2">
  <Spinner className="size-4" />
  Loading...
</Button>
```

#### Skeleton

```tsx
import { Skeleton } from "@/components/ui/skeleton"

<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
</div>
```

---

## Best Practices

### General Guidelines

1. **Always use semantic tokens** — Never hardcode colors like `text-white` or `bg-black`
2. **Use `cn()` utility** for conditional classes:
   ```tsx
   import { cn } from "@/lib/utils"
   className={cn("base-class", condition && "active-class")}
   ```

3. **Use `text-balance` or `text-pretty`** for headlines and important copy to optimize line breaks

4. **Mobile-first responsive design:**
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
   ```

5. **Consistent spacing** — Use Tailwind scale (gap-2, gap-4, etc.) not arbitrary values

### Accessibility

- **Always use labels** for form inputs with proper `htmlFor` attributes
- **Add ARIA labels** for icon-only buttons
- **Maintain color contrast** — Use semantic tokens which ensure proper contrast
- **Keyboard navigation** — All interactive elements must be keyboard accessible
- **Screen reader text** — Use `sr-only` class for screen readers:
  ```tsx
  <span className="sr-only">Loading...</span>
  ```

### Performance

- **Lazy load images** with Next.js `Image` component
- **Code split pages** — Each route automatically code-splits
- **Minimize re-renders** — Use `useCallback` and `useMemo` appropriately
- **Remove debug code** — No `console.log("[v0] ...")` in production builds

### Security

- **Never hardcode secrets** — Use environment variables
- **Sanitize user input** — Use parameterized queries for SQL
- **Validate on both sides** — Frontend UX + backend security
- **Use HTTP-only cookies** for session tokens
- **Add CSRF protection** for state-changing operations

### Code Organization

```
/app
  /admin
    /service-types
    /users
    /settings
  /finance
    /invoices
  /[service-type]
  /calendar
  /inbox
  /notifications
  /track/[token]
  page.tsx (dashboard)
  layout.tsx

/components
  /ui          (shadcn components)
  case-drawer.tsx
  sidebar.tsx
  header.tsx
  status-badge.tsx
  ...
  
/lib
  utils.ts
  constants.ts
  
/public
  images/
  fonts/
```

### Imports

Always import from the correct path:

```tsx
// UI Components
import { Button } from "@/components/ui/button"

// Custom Components
import { Sidebar } from "@/components/sidebar"

// Utilities
import { cn } from "@/lib/utils"
import { STATUS_LABELS } from "@/lib/constants"

// Icons (lucide-react)
import { Plus, Download, Clock } from "lucide-react"
```

---

## File Size & Bundle Considerations

- **UI components** are tree-shakeable — only import what you use
- **Icons from lucide-react** are imported individually (not the whole library)
- **Avoid default exports** from component files
- **Use dynamic imports** for heavy components:
  ```tsx
  const CaseDrawer = dynamic(() => import("@/components/case-drawer"), {
    loading: () => <Skeleton className="h-96" />
  })
  ```

---

## Dark Mode

The app automatically supports dark mode. Token values flip in `.dark` class:

```tsx
// Automatic in dark mode
<div className="bg-background text-foreground">
  {/* Adapts to light/dark mode */}
</div>

// Force specific mode if needed
<div className="dark">
  {/* Always dark */}
</div>
```

---

## Questions & Support

For component questions, check:
1. shadcn/ui docs: https://ui.shadcn.com
2. Tailwind docs: https://tailwindcss.com
3. Existing components in `/components/ui/`
4. Constants and labels in `/lib/constants.ts`
