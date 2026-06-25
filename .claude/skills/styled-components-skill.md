# Skill: styled-components-skill

## Khi nào trigger
- Tạo Styled Component mới trong project MathKids
- Review styling component xem có nhất quán không
- Setup theme provider hoặc global styles

---

## Theme — Nguồn thật duy nhất cho màu sắc và spacing

```typescript
// lib/theme/theme.ts
export const theme = {
  colors: {
    // Primary palette — tươi sáng, phù hợp trẻ em
    primary: '#FF6B35',      // orange — CTA buttons, active state
    primaryLight: '#FFE0D4',
    secondary: '#4ECDC4',    // teal — secondary actions, accents
    secondaryLight: '#E0F7F6',

    // Feedback
    correct: '#4CAF50',      // green — correct answer
    correctLight: '#E8F5E9',
    wrong: '#FFB74D',        // amber — wrong answer (NOT red)
    wrongLight: '#FFF3E0',

    // Neutral
    background: '#FFF9F0',   // warm white — easy on eyes
    surface: '#FFFFFF',
    border: '#E8E0D8',
    textPrimary: '#2D2D2D',
    textSecondary: '#6B6B6B',
    textLight: '#9E9E9E',

    // Star/reward
    star: '#FFD700',
  },

  // Font sizes — larger than typical web app
  fontSize: {
    xs: '14px',
    sm: '18px',
    md: '24px',     // minimum for question text
    lg: '32px',     // numbers, answer choices
    xl: '48px',     // main question number/prompt
    xxl: '64px',    // celebration number
  },

  // Spacing
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    xxl: '64px',
  },

  // Border radius — rounded, friendly
  radius: {
    sm: '12px',
    md: '20px',
    lg: '28px',
    full: '9999px',
  },

  // Touch targets (min sizes)
  touch: {
    min: '64px',    // minimum for any interactive element
    md: '80px',
    lg: '96px',
  },

  // Font family
  fonts: {
    body: "'Nunito', 'Rounded Mplus 1c', system-ui, sans-serif",
  },
} as const

export type Theme = typeof theme
```

---

## Setup Next.js App Router + Styled Components

```tsx
// app/registry.tsx — Required for SSR with Styled Components v6
'use client'
import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}

// app/layout.tsx
import { ThemeProvider } from 'styled-components'
import { StyledComponentsRegistry } from './registry'
import { theme } from '@/lib/theme/theme'
import { GlobalStyles } from '@/lib/theme/GlobalStyles'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            {children}
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

---

## GlobalStyles

```typescript
// lib/theme/GlobalStyles.ts
import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  html { font-size: 16px; }
  
  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textPrimary};
    -webkit-tap-highlight-color: transparent; /* remove tap flash on mobile */
    user-select: none; /* children don't accidentally select text */
  }

  button { cursor: pointer; font-family: inherit; }
`
```

---

## Naming convention (bắt buộc)

```typescript
// Wrapper divs — suffix 'Wrapper'
const CardWrapper = styled.div`...`
const ScreenWrapper = styled.div`...`
const GridWrapper = styled.div`...`

// Text elements — suffix mô tả role
const TitleText = styled.h1`...`
const PromptText = styled.p`...`    // câu hỏi
const HintText = styled.span`...`   // hint nhỏ

// Interactive — suffix 'Button' hoặc tên element
const ChoiceButton = styled.button`...`
const AvatarButton = styled.button`...`
const KidButton = styled.button`...`  // generic

// Animated wrappers (Framer Motion) — prefix 'Animated'
const AnimatedOverlay = styled(motion.div)`...`
const AnimatedCard = styled(motion.div)`...`
```

---

## Pattern: Button cho trẻ em

```typescript
// components/ui/KidButton.tsx
import styled from 'styled-components'
import { motion } from 'framer-motion'

interface KidButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'lg'
}

const ButtonBase = styled(motion.button)<KidButtonProps>`
  /* Touch target minimum */
  min-height: ${({ theme, size }) => size === 'lg' ? theme.touch.lg : theme.touch.min};
  min-width: ${({ theme, size }) => size === 'lg' ? theme.touch.lg : theme.touch.min};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};

  font-size: ${({ theme, size }) => size === 'lg' ? theme.fontSize.lg : theme.fontSize.md};
  font-weight: 700;
  font-family: inherit;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: none;

  background: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.colors.secondary :
    variant === 'ghost' ? 'transparent' :
    theme.colors.primary
  };
  color: ${({ theme, variant }) => variant === 'ghost' ? theme.colors.primary : 'white'};

  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};

  /* No focus ring on touch devices — kids use touch */
  &:focus-visible { outline: 3px solid ${({ theme }) => theme.colors.primary}; }
`

export function KidButton({ children, ...props }: React.ComponentProps<typeof ButtonBase>) {
  return (
    <ButtonBase whileTap={{ scale: 0.92 }} transition={{ type: 'spring', stiffness: 500, damping: 25 }} {...props}>
      {children}
    </ButtonBase>
  )
}
```

---

## Pattern: Choice button (đáp án)

```typescript
const ChoiceButton = styled(motion.button)<{ $state: 'idle' | 'correct' | 'wrong' | 'revealed' }>`
  min-height: ${({ theme }) => theme.touch.lg};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: 800;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 3px solid ${({ theme, $state }) =>
    $state === 'correct' ? theme.colors.correct :
    $state === 'wrong' ? theme.colors.wrong :
    $state === 'revealed' ? theme.colors.correct :
    theme.colors.border
  };
  background: ${({ theme, $state }) =>
    $state === 'correct' ? theme.colors.correctLight :
    $state === 'wrong' ? theme.colors.wrongLight :
    $state === 'revealed' ? theme.colors.correctLight :
    theme.colors.surface
  };
`
// Note: use $state (dollar prefix) for transient props — not passed to DOM
```

---

## Quy tắc

1. **Dùng theme thay magic number** — không viết `font-size: 32px` trong styled component, dùng `${({ theme }) => theme.fontSize.lg}`
2. **Transient props** — prop chỉ dùng cho styling, prefix `$` để không leak vào DOM: `$state`, `$active`, `$size`
3. **'use client'** — Styled Components chạy trên client, đặt `'use client'` ở file có Styled Component đầu tiên trong cây component
4. **Không inline style** cho biến theme — chỉ dùng qua styled-components hoặc CSS variables
5. **Touch target ≥ 64px** cho mọi interactive element — kiểm tra `min-height` và `min-width`
