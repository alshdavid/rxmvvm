import { h, render } from 'preact'
import { ChangeType, makeObservable } from 'rxmvvm'
import { useViewModel } from 'rxmvvm/preact'

class AppVm {
  input: string

  constructor() {
    this.input = 'Hello World'

    makeObservable(this, {
      input: ChangeType.Push
    })
  }
}

function App() {
  const vm = useViewModel(() => new AppVm())
  
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