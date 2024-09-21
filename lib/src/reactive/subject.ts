export class Subject<T> {
  #listeners = new Set<(value: T) => any | Promise<any>>()

  next = (value: T) => {
    for (const listener of this.#listeners) setTimeout(listener, 0, value)
  }

  subscribe = (callback: (value: T) => any | Promise<any>): () => void => {
    this.#listeners.add(callback)
    return () => this.#listeners.delete(callback)
  }
}
