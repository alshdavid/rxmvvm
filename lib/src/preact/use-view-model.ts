import { useEffect, useMemo, useReducer } from "preact/hooks";
import { ChangeType, makeObservable, subscribe } from "../reactive/index.js";

export interface OnInit {
  onInit(): any | Promise<any>
}

export interface onDestroy {
  onDestroy(): any | Promise<any>
}


export function useViewModel<T, K extends keyof T>(Ctor: new () => T, changeDetectionStrategy: { [U in K]: ChangeType }): T
export function useViewModel<T, K extends keyof T, A extends Array<any>>(Ctor: new (...args: A) => T, args: A, changeDetectionStrategy: { [U in K]: ChangeType }): T
export function useViewModel<T>(
  Ctor: any,
  properties: any,
  changeDetectionStrategy?: any
): T {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void

  const vm = useMemo(() => {
    const vm = changeDetectionStrategy ? new Ctor(properties) : new Ctor()
    makeObservable(vm, changeDetectionStrategy || properties)
    return vm
  }, [])

  useEffect(() => {
    const dispose = subscribe(vm, forceUpdate)
    vm.onInit && vm.onInit()

    return () => {
      vm.onDestroy && vm.onDestroy()
      dispose()
    }
  }, [vm])

  return vm
}

