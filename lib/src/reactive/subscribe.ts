import { Observe } from "./types.js"

export function subscribe(target: any, callback: (key: string) => any | Promise<any>): () => void {
  if (!(Observe in target)) {
    return () => {}
  }
  const fn = ({ detail }: CustomEvent) => callback(detail)
  target[Observe].addEventListener('change', fn)
  return () => target[Observe].removeEventListener('change', fn)
}