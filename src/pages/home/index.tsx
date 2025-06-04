import { PAGES } from 'constants/pages'
import type { FC } from 'react'
import { useNavigate } from 'react-router'

import NewFileIcon from 'assets/svg/plus.svg?react'
import OpenFileIcon from 'assets/svg/folder-open.svg?react'
import SettingsIcon from 'assets/svg/gear.svg?react'

const { settings } = PAGES

export const HomePage: FC = () => {
  const navigate = useNavigate()

  const openSettings = (): void => {
    navigate(settings.path)
  }

  return (
    <div className="container py-24 flex flex-col">
      <div className="gap-4 flex flex-col">
        <button className="w-full gap-3 h-6" onClick={openSettings}>
          <NewFileIcon />
          New session
        </button>
        <button className="w-full gap-3 h-6" onClick={openSettings}>
          <OpenFileIcon />
          Open project...
        </button>
        <button className="w-full gap-3 h-6" onClick={openSettings}>
          <SettingsIcon />
          Settings
        </button>
      </div>
    </div>
  )
}
