import { useCallback, useEffect, useState, type FC } from 'react'
import OpenFileIcon from 'assets/svg/folder-open.svg?react'

export const ProgramLocationSection: FC = () => {
  const [programPath, setProgramPath] = useState('')

  const getProgramLocation = useCallback(async () => {
    const location = await window.electronAPI.getProgramLocation()
    if (location) {
      setProgramPath(location)
    }
  }, [])

  const changeProgramLocation = useCallback(async () => {
    const location = await window.electronAPI.selectProgram()
    if (location) {
      setProgramPath(location)
    }
  }, [])

  useEffect(() => {
    getProgramLocation()
  }, [getProgramLocation])

  return (
    <div className="flex flex-col gap-2">
      <p className="section-title">Ableton Location</p>

      <div className="flex justify-between inner-shadow bg-bg-deeper py-1 px-4 rounded-md">
        <span className="block text-font-grey">{programPath}</span>

        <button className="block" onClick={changeProgramLocation}>
          <OpenFileIcon />
        </button>
      </div>
    </div>
  )
}