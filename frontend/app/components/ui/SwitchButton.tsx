import { PUT_SETTING } from '@/app/lib/graphql/settings'
import { NameSettings } from '@/app/lib/types/types'
import { PutSetting, PutSettingVariable } from '@/app/lib/types/typesGraphql'
import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { toastCustom } from './toasts'
import { useSession } from 'next-auth/react'

interface SettingProps {
  idSetting: string
  name: NameSettings,
  value: boolean
}

function SwitchButton({ idSetting, name, value = true }: SettingProps) {
  const [putSetting, {data, error, loading, reset}] = useMutation<PutSetting, PutSettingVariable>(PUT_SETTING)
	const { update } = useSession()
  const [checked, setChecked] = useState(value)
  const handleChecked = () => {
    setChecked(!checked)
    putSetting({
      variables: {
        data: {
          idSetting,
          [name]: !checked
        }
      }
    })
  }

  if (data?.putSettings) {
    // update({
    //   Setting: data.putSettings
		// })
  }
  if (error?.message) {
    toastCustom({ text: 'Hubo un error intente de nuevo', variant:'error', duration: 3000})
    reset()
  }

  return (
    <div className={`rounded-full w-12 h-6 p-0.5 ${checked ? 'bg-seagreen-900' : 'bg-storm-950'}`} onClick={handleChecked}>
      <div className={`w-5 h-full bg-white rounded-full transition duration-500 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </div>
  )
}

export default SwitchButton