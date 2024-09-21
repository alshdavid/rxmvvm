import { ChangeType } from "./change-type.js"
import { Subject } from "./subject.js"
import { Observe } from "./types.js"

export type TargetKey = string | number | symbol

export class Emitter<T = any> {
  #eventTarget: Subject<void>
  #teardown: Array<() => any | Promise<any>>
  #emitting: boolean
  #queue: number
  #inner: Record<TargetKey, any>
  #target: T
  #watching: Set<TargetKey>

  constructor(target: T = {} as any) {
    this.#eventTarget = new Subject()
    this.#teardown = []
    this.#emitting = false
    this.#queue = 0
    this.#watching = new Set()
    this.#inner = {}

    if (typeof target === 'function') {
      target = target()
    }

    Object.defineProperty(target, Observe, {
      enumerable: false,
      writable: false,
      value: this
    })

    this.#target = target
  }

  emit = async () => {
    if (this.#emitting === true) {
      this.#queue += 1
      return
    }

    this.#emitting = true
    this.#eventTarget.next()
    await new Promise(res => setTimeout(res, 10))
    this.#emitting = false

    if (this.#queue > 0) {
      this.#queue = 0
      this.emit()
    }
  }

  observe = (key: TargetKey, changeDetectionStrategy: ChangeType) => {
    if (this.#watching.has(key)) {
      this.unobserve(key)
    }
    this.#watching.add(key)
    switch (changeDetectionStrategy) {
      case ChangeType.Push: {
        this.#inner[key] = (this.#target as any)[key]
        Object.defineProperty(this.#target, key, {
          get: () => this.#inner[key],
          set: (value: any) => {
            if (this.#inner[key] === value) {
              return
            }
            this.#inner[key] = value
            this.emit()
          },
        })
        break
      }
      case ChangeType.Proxy: {
        this.#inner[key] = buildProxy((this.#target as any)[key], this)
        Object.defineProperty(this.#inner, key, {
          get: () => this.#inner[key],
          set: (value: any) => {
            this.#inner[key] = buildProxy(value, this)
            if (this.#inner[key] === value) {
              return
            }
            this.emit()
          },
        })   
        break
      }
      case ChangeType.Inherit: {
        this.#teardown.push(Emitter.obtain((this.#target as any)[key]).subscribe(this.emit))
        break
      }
    }
  }

  observeMany = <K extends keyof T>(properties: { [U in K]: ChangeType }) => {
    for (const prop of Object.entries(properties) as Array<[TargetKey, ChangeType]>) {
      this.observe(...prop)
    }
  }

  unobserve = (key: TargetKey) => {
    Object.defineProperty(this.#target, key, {
      value: this.#inner[key]
    })
    Reflect.deleteProperty(this.#inner, key)
    this.#watching.delete(key)
  }

  subscribe = (callback: () => any | Promise<any>): () => void => {
    const dispose = this.#eventTarget.subscribe(callback)
    return () => {
      this.#teardown.forEach(teardown => teardown())
      dispose()
    }
  }

  static obtain(target: any) {
    if (target instanceof Emitter) {
      return target
    }
    if (target[Observe]) {
      return target[Observe]
    }
    throw new Error("Target is not an Emitter")
  }
}

function buildProxy(poj: any, emitter: Emitter<any>, tree: (string|symbol)[] = []) {
  return new Proxy(poj, {
    get: (target, prop)  =>{
      const value = Reflect.get(target, prop);

      if (
        value &&
        typeof value === "object" &&
        ["Array", "Object"].includes(value.constructor.name)
      ) {
        return buildProxy(value, emitter, tree.concat(prop));
      }

      return value;
    },

    set: (target, prop, value) => {
      emitter.emit();
      return Reflect.set(target, prop, value);
    },

    deleteProperty: (target, prop) => {
      emitter.emit();
      return Reflect.deleteProperty(target, prop);
    },
  });
}
