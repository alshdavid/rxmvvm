import { createEmitter } from "./buffer.js"
import { ChangeType } from "./change-type.js"
import { Observe } from "./types.js"

export type KeyType = string | number | symbol

export function makeObservable<T, K extends keyof T>(target: T, properties: { [U in K]: ChangeType }) {
  const targetInner: any = target
  const inner: Record<string | number | symbol, any> = {}
  const [eventTarget, emit] = createEmitter()

  Object.defineProperty(targetInner, Observe, {
    enumerable: false,
    writable: false,
    value: eventTarget
  })

  for (const [key, k] of Object.entries(properties)) {
    inner[key] = targetInner[key]
    
    if (k === ChangeType.Push) {
      Object.defineProperty(targetInner, key, {
        get() {
          return inner[key]
        },
        set(value: any) {
          inner[key] = value
          emit([key, k as any])
        },
      })
    }
    else if (k === ChangeType.Proxy) {
      inner[key] = buildProxy(targetInner[key], (keys: any) => emit(keys))

      Object.defineProperty(targetInner, key, {
        get() {
          return inner[key]
        },
        set(value: any) {
          inner[key] = buildProxy(value, (keys: any) => emit(keys))
          emit([key])
        },
      })      
    }
  }
}

function buildProxy(poj: any, callback: any, tree: any = []) {
  return new Proxy(poj, {
    get: (target, prop)  =>{
      const value = Reflect.get(target, prop);

      if (
        value &&
        typeof value === "object" &&
        ["Array", "Object"].includes(value.constructor.name)
      )
        return buildProxy(value, callback, tree.concat(prop));

      return value;
    },

    set: (target, prop, value) => {
      callback(tree.concat(prop));
      return Reflect.set(target, prop, value);
    },

    deleteProperty: (target, prop) => {
      callback(tree.concat(prop));
      return Reflect.deleteProperty(target, prop);
    },
  });
}