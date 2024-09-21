import { h, render } from 'preact'
import { ChangeType } from 'rxmvvm'
import { useViewModel } from 'rxmvvm/preact'

class AppVm {
  input = 'Hello World'
}

function App() {
  const vm = useViewModel(AppVm, {
    input: ChangeType.Push
  })
  
  return <div>
    <input 
      value={vm.input}
      onInput={(e: any) => vm.input = e.target.value} />
    <h4>{vm.input}</h4>
  </div>
}


const div = document.createElement('div')
document.body.appendChild(div)
render(<App />, div)