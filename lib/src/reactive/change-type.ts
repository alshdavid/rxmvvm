export type ChangeType = typeof ChangeType[keyof typeof ChangeType];
export const ChangeType = Object.freeze({
  /**
   * @description This will recurse through an object/array and emit an event if a property is mutated
   */
  Proxy: Symbol('proxy'),
  /**
   * @description This will emit an event if the property is replaced
   */
  Push: Symbol('push'),
  /**
   * @description This will emit an event when the emitter on the property emits an event
   */
  Inherit: Symbol('inherit'),
})
