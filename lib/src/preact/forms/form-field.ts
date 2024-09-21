import { ChangeType } from "../../reactive/change-type.js"
import { Emitter } from "../../reactive/emitter.js"

export type ValidatorFunc<T> = (value: T) => (boolean | Promise<boolean>)

export class FormField<T> {
  #value: T
  #emitter: Emitter<FormField<T>>
  #validators: Array<ValidatorFunc<T>>

  valid: boolean
  touched: boolean
  pristine: boolean
  validating: boolean

  get value() {
    return this.#value
  }

  set value(value) {
    this.#value = value
    this.validate()
    this.#emitter.emit()
  }

  constructor(initialValue: T, validators: Array<ValidatorFunc<T>>) {
    this.#value = initialValue
    this.valid = true
    this.validating = false
    this.touched = false
    this.pristine = true
    this.#validators = validators
    this.#emitter = new Emitter(this)
    this.#emitter.observeMany({
      touched: ChangeType.Push,
      pristine: ChangeType.Push,
      validating: ChangeType.Push,
    })
  }

  validate = () => {
    setTimeout(async () => {
      this.validating = true
      const promises = []
      
      for (const validator of this.#validators) {
        promises.push(Promise.resolve(validator(this.#value)))
      }
  
      const ok = await Promise.all(promises)

      this.validating = false
      this.valid = !ok.includes(false)
    }, 0)
  }

  dataProps = () => ({
    ['data-pristine']: this.pristine,
    ['data-touched']: this.touched,
    ['data-valid']: this.valid,
    ['data-validating']: this.validating,
  })

  toString = () => this.value
  toJSON = () => this.value
}