import 'styled-components'
import type { Theme } from '@/lib/theme/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
