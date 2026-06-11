# Color System Usage Guide

Senior developer best practices for using the portfolio color system.

## Core Principles

1. **Use semantic names**, not color names
2. **Use CSS variables**, not hardcoded hex values
3. **Keep the system light-mode only** - no dark mode overrides
4. **Use provided classes** - they handle transitions and states

## Pattern 1: React Component with Inline Styles

```jsx
// ❌ WRONG - Hardcoded colors
function Hero() {
  return (
    <section style={{ backgroundColor: '#e8e2d2', color: '#1a1815' }}>
      <h1>Welcome</h1>
    </section>
  );
}

// ✅ CORRECT - CSS variables
function Hero() {
  return (
    <section style={{ 
      backgroundColor: 'var(--color-bg-primary)',
      color: 'var(--color-text-primary)'
    }}>
      <h1>Welcome</h1>
    </section>
  );
}
```

## Pattern 2: CSS Modules (Recommended)

```css
/* styles/Hero.module.css */
.hero {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  padding: 2rem;
  border-bottom: 1px solid var(--color-border-secondary);
}

.hero:hover {
  background-color: var(--color-hover-bg);
}
```

```jsx
import styles from './Hero.module.css';

function Hero() {
  return (
    <section className={styles.hero}>
      <h1>Welcome</h1>
    </section>
  );
}
```

## Pattern 3: Tailwind Classes (Semantic)

```jsx
function Card({ title, children }) {
  return (
    <div className="bg-background border border-foreground rounded-lg p-4">
      <h2 className="text-foreground font-bold">{title}</h2>
      <p className="text-secondary">{children}</p>
    </div>
  );
}
```

## Pattern 4: Interactive Elements

```jsx
function Button({ children }) {
  return (
    <button 
      className="bg-accent text-primary interactive-hover"
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        border: '1px solid var(--color-border-primary)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      {children}
    </button>
  );
}
```

## Pattern 5: Text Hierarchy

```jsx
function Article() {
  return (
    <article>
      {/* Main heading */}
      <h1 className="text-primary" style={{ fontSize: '2rem' }}>
        Article Title
      </h1>
      
      {/* Secondary text */}
      <p className="text-secondary">
        By Author Name
      </p>
      
      {/* Muted metadata */}
      <p className="text-muted" style={{ fontSize: '0.9rem' }}>
        Published 2 days ago
      </p>
      
      {/* Main content */}
      <p className="text-primary">
        Article content goes here...
      </p>
    </article>
  );
}
```

## Pattern 6: Status Messages

```jsx
function StatusMessage({ type, message }) {
  const classes = {
    success: 'color-success bg-success',
    error: 'color-error bg-error',
    warning: 'color-warning bg-warning',
    info: 'color-info bg-info'
  };
  
  return (
    <div className={`${classes[type]} p-4 rounded`}>
      {message}
    </div>
  );
}
```

## Pattern 7: Borders & Dividers

```jsx
function Section({ title, children }) {
  return (
    <section className="border-t border-primary pt-6">
      <h2 className="text-primary mb-4">{title}</h2>
      <div className="border-l-4 border-accent pl-4">
        {children}
      </div>
    </section>
  );
}
```

## Pattern 8: Links & Accents

```jsx
function Link({ href, children }) {
  return (
    <a 
      href={href}
      className="text-accent"
      style={{
        textDecoration: 'underline',
        transition: 'color 0.2s ease'
      }}
      onMouseEnter={(e) => e.target.style.color = 'var(--color-accent-dark)'}
      onMouseLeave={(e) => e.target.style.color = 'var(--color-accent)'}
    >
      {children}
    </a>
  );
}
```

### Tailwind tokens

The Tailwind config exposes semantic tokens backed by CSS variables. Use these classes:

- `bg-background` — page/background surfaces
- `text-foreground` — primary text
- `text-secondary` — secondary/accent text
- `text-accent` / `bg-accent` — accent color for highlights
- `hover:bg-accent` / `hover:text-accent` — interactive accents

Example:

```jsx
<button className="bg-accent text-foreground hover:bg-accentDark transition-all">Click</button>
```

## Quick Reference: CSS Variables

### Always Available
```css
/* Backgrounds */
--color-bg-primary
--color-bg-secondary
--color-highlight

/* Text */
--color-text-primary
--color-text-secondary
--color-text-muted
--color-text-accent

/* Accents */
--color-accent
--color-accent-dark
--color-accent-light

/* Borders */
--color-border-primary
--color-border-secondary

/* States */
--color-hover-bg
--color-active-bg
--color-focus-ring

/* Status */
--color-success
--color-error
--color-warning
--color-info
```

## Common Mistakes to Avoid

❌ **Hardcoding colors**
```jsx
<div style={{ backgroundColor: '#e8e2d2' }}> // NO!
```

✅ **Use variables**
```jsx
<div style={{ backgroundColor: 'var(--color-bg-primary)' }}> // YES!
```

---

✅ Use variables consistently
```css
.element { background-color: var(--color-bg-primary); } // YES!
```

---

❌ **Missing transitions**
```jsx
<button className="bg-accent">Click</button> // Abrupt
```

✅ **Smooth interactions**
```jsx
<button className="bg-accent interactive-hover"> // Smooth
```

## Testing Your Implementation

1. **Light mode**: Use the component normally
2. **Hover states**: Check that hover effects work smoothly
3. **Focus states**: Tab through interactive elements, verify focus rings are visible
4. **Contrast**: Use a contrast checker to verify readability

## Need to Add New Colors?

Add them to `src/styles/colors.css` in the `:root` section:

```css
:root {
  /* New color */
  --color-new-feature: #your-hex-color;
}
```

Then document it in this file and `COLOR_REFERENCE.md`.
