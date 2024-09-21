import React from 'react'
import { createRoot } from 'react-dom/client'

const div = document.createElement('div')
document.body.appendChild(div)

const root = createRoot(div)
root.render(<div>Hello World</div>)
