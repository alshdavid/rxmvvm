import { Observe } from "./types.js";

export function notifyChange(target: any, ...keys: string[]) {
  target[Observe].dispatchEvent(new CustomEvent('change', { detail: keys }))
}
