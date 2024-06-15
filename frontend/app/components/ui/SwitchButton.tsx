import React, { useState } from 'react'

function SwitchButton() {
  const [checked, setChecked] = useState(true)
  const handleChecked = () => {
    setChecked(!checked)
  }
  return (
    <div className={`rounded-full w-12 h-6 p-0.5 ${checked ? 'bg-seagreen-900' : 'bg-storm-950'}`} onClick={handleChecked}>
      <div className={`w-5 h-full bg-white rounded-full transition duration-500 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </div>
  )
}

export default SwitchButton