import { PAGES } from 'constants/pages'
import type { FC } from 'react'
import { useNavigate } from 'react-router'

import NewFileIcon from 'assets/svg/plus.svg?react'
import OpenFileIcon from 'assets/svg/folder-open.svg?react'
import SettingsIcon from 'assets/svg/gear.svg?react'
import { RecentsView } from './views/Recents'

const { settings } = PAGES

export const HomePage: FC = () => {
  const navigate = useNavigate()

  const openNewSession = (): void => {
    window.electronAPI.newSession()
  }

  const openProject = (): void => {
    window.electronAPI.addExistingProject()
  }

  const openSettings = (): void => {
    navigate(settings.path)
  }

  return (
    <div className="container py-24 flex flex-col gap-12">
      <RecentsView />

      <div className="gap-4 flex flex-col">
        <button className="w-full gap-3 h-6" onClick={openNewSession}>
          <NewFileIcon />
          New session
        </button>

        <button className="w-full gap-3 h-6" onClick={openProject}>
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
