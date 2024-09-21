export function createEmitter(): [EventTarget, (...keys: string[][]) => void] {
  const emitter = new EventTarget()
  let emitting = false
  let queue: string[][] = []

  // Send the first event then batch all
  // subsequent events in 10ms intervals
  function emit(...keys: string[][]) {
    if (emitting === true) {
      queue.push(...keys)
      return
    }
    emitting = true
    
    emitter.dispatchEvent(new CustomEvent('change', { detail: keys }))

    setTimeout(() => {
      emitting = false
      if (queue.length) {
        const q = queue
        queue = []
        emit(...q)
      }
    }, 10)
  }

  return [emitter, emit]
}
