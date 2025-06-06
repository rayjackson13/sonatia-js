import { useCallback, useEffect, useState, type FC, type JSX } from 'react'
import type { ProjectFolder } from 'src/types'

import AddIcon from 'assets/svg/plus.svg?react'
import FolderIcon from 'assets/svg/folder.svg?react'
import RemoveIcon from 'assets/svg/remove.svg?react'

const folderAPI = window.electronAPI.folders

export const FoldersSection: FC = () => {
  const [folders, setFolders] = useState<ProjectFolder[]>([])

  const loadProjectFolders = useCallback(async () => {
    const folders = await folderAPI.get()
    if (folders) {
      setFolders(folders)
    }
  }, [])

  const removeFolder = useCallback(
    async (id: number) => {
      await folderAPI.remove(id)
      loadProjectFolders()
    },
    [loadProjectFolders],
  )

  const addFolder = useCallback(async () => {
    await folderAPI.add()
    loadProjectFolders()
  }, [loadProjectFolders])

  useEffect(() => {
    loadProjectFolders()
  }, [loadProjectFolders])

  const renderFolderItem = useCallback(
    (folder: ProjectFolder): JSX.Element => {
      return (
        <div key={folder.id} className="section-list-item group">
          <FolderIcon />

          <span className="text-font-grey flex-1 truncate">{folder.path}</span>

          <button
            className="hidden group-hover:block w-4 flex justify-end"
            onClick={() => removeFolder(folder.id)}
          >
            <RemoveIcon />
          </button>
        </div>
      )
    },
    [removeFolder],
  )

  return (
    <div className="flex flex-col gap-2">
      <p className="section-title">Project Folders</p>

      <div className="section-list inner-shadow">
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
