import { h, render } from 'preact'
import { useViewModel, ChangeType } from 'rxmvvm/preact'
import { InputField } from 'rxmvvm/preact/forms'

class AppVm {
  input = new InputField('Hello')
}

function App() {
  const vm = useViewModel(AppVm, {
    input: ChangeType.Inherit
  })

  return <div>
    <input {...vm.input.props()} />
    <h4>{vm.input.value}</h4>
    <div>touched: {vm.input.touched.toString()}</div>
    <div>pristine: {vm.input.pristine.toString()}</div>
    <div>valid: {vm.input.valid.toString()}</div>
    <div>validating: {vm.input.validating.toString()}</div>
  </div>
}

const div = document.createElement('div')
document.body.appendChild(div)
render(<App />, div)