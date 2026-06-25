export const theme = {
  colors: {
    primary: '#FF6B35',
    primaryLight: '#FFE0D4',
    secondary: '#4ECDC4',
    secondaryLight: '#E0F7F6',
    correct: '#4CAF50',
    correctLight: '#E8F5E9',
    wrong: '#FFB74D',
    wrongLight: '#FFF3E0',
    background: '#FFF9F0',
    surface: '#FFFFFF',
    border: '#E8E0D8',
    textPrimary: '#2D2D2D',
    textSecondary: '#6B6B6B',
    textLight: '#9E9E9E',
    star: '#FFD700',
  },
  fontSize: {
    xs: '14px',
    sm: '18px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    xxl: '64px',
  },
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    xxl: '64px',
  },
  radius: {
    sm: '12px',
    md: '20px',
    lg: '28px',
    full: '9999px',
  },
  touch: {
    min: '64px',
    md: '80px',
    lg: '96px',
  },
  fonts: {
    body: "'Nunito', 'Rounded Mplus 1c', system-ui, sans-serif",
  },
} as const

export type Theme = typeof theme
