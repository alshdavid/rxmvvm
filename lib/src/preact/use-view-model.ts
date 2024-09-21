import { useEffect, useMemo, useReducer } from "preact/hooks";
import { subscribe } from "../reactive/index.js";

export interface ViewModelLifecycle {
  onInit?(): any | Promise<any>
  onDestroy?(): any | Promise<any>
}

export function useViewModel<T>(ctor: () => T): T
export function useViewModel<T extends ViewModelLifecycle>(ctor: () => T): T
export function useViewModel<T extends ViewModelLifecycle>(ctor: () => T): T {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void

  const vm = useMemo(ctor, [])

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
