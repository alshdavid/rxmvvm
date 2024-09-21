import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

export class Provider extends Map<any, any> {}

export const AppContext = createContext<Provider>(null as any)

export function useAppContext(): Map<any, unknown> {
  return useContext(AppContext)
}

