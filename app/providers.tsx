'use client'

import { useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from '@/lib/theme/GlobalStyles'
import { theme } from '@/lib/theme/theme'
import { soundManager } from '@/lib/sound/soundManager'

function SoundInitializer() {
  useEffect(() => {
    soundManager.loadMutePreference()
  }, [])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <SoundInitializer />
      {children}
    </ThemeProvider>
  )
}
