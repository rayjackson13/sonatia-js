import { useCallback, useEffect, useState, type FC, type JSX } from 'react'
import type { ProjectFolder } from 'constants/types'

import AddIcon from 'assets/svg/plus.svg?react'
import FileIcon from 'assets/svg/file.svg?react'
import RemoveIcon from 'assets/svg/remove.svg?react'

export const FoldersSection: FC = () => {
  const [folders, setFolders] = useState<ProjectFolder[]>([])

  const loadProjectFolders = useCallback(async () => {
    const folders = await window.electronAPI.getProjectFolders()
    if (folders) {
      setFolders(folders)
    }
  }, [])

  const removeFolder = useCallback(
    async (id: number) => {
      await window.electronAPI.removeProjectFolder(id)
      loadProjectFolders()
    },
    [loadProjectFolders]
  )

  const addFolder = useCallback(async () => {
    await window.electronAPI.addProjectFolder()
    loadProjectFolders()
  }, [loadProjectFolders])

  useEffect(() => {
    loadProjectFolders()
  }, [loadProjectFolders])

  const renderFolderItem = useCallback(
    (folder: ProjectFolder): JSX.Element => {
      return (
        <div
          key={folder.id}
          className="flex gap-3 items-center h-8 hover:bg-grey-hover px-2 rounded-sm group transition-all"
        >
          <FileIcon />

          <span className="text-font-grey flex-1 truncate">{folder.path}</span>

          <button className="hidden group-hover:block w-4 flex justify-end" onClick={() => removeFolder(folder.id)}>
            <RemoveIcon />
          </button>
        </div>
      )
    },
    [removeFolder]
  )

  return (
    <div className="flex flex-col gap-2">
      <p className="section-title">Project Folders</p>

      <div className="flex flex-col inner-shadow bg-bg-deeper p-2 rounded-md gap-1">
        <button
          className="flex gap-3 items-center h-8 hover:bg-grey-hover active:bg-grey-selected px-2 rounded-sm opacity-100"
          onClick={addFolder}
        >
          <AddIcon /> Add folder...
        </button>

        {folders.map(renderFolderItem)}
      </div>
    </div>
  )
}
