import { ChangeType } from "../../reactive/change-type.js"
import { Emitter } from "../../reactive/emitter.js"
import { FormField, ValidatorFunc } from "./form-field.js"

export type InputFieldOptions = {
  type?: "text" | "email" | "password" | 'search'
  placeholder?: string
  disabled?: boolean
  validators?: Array<ValidatorFunc<string>>
}

export class InputField extends FormField<string> {
  type: "text" | "email" | "password" | 'search' | undefined
  disabled: boolean | undefined
  placeholder: string | undefined

  constructor(
    initialValue = '',
    options: InputFieldOptions = {},
  ) {
    super(initialValue, options.validators || [])
    this.type = options.type
    this.disabled = options.disabled
    this.placeholder = options.placeholder

    Emitter.obtain(this).observeMany({
      type: ChangeType.Push,
      disabled: ChangeType.Push,
      placeholder: ChangeType.Push,
    })
  }

  props = () => ({
    ...this.dataProps(),
    value: this.value,
    type: this.type,
    disabled: this.disabled,
    placeholder: this.placeholder,
    onInput: (e: any) => {
      this.pristine = false
      this.touched = true
      this.value = e.target.value
    },
    onClick: () => {
      this.pristine = false
      this.touched = true
    }, 
    onMouseDown: () => {
      this.pristine = false
      this.touched = true
    },  
    onTouchStart: () => {
      this.pristine = false
      this.touched = true
    }, 
    onBlur: () => {
      this.pristine = false
      this.validate()
    }, 
    onFocus: () => {
      this.pristine = false
    }
  })
}
