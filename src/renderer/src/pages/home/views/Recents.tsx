import type { Project } from 'src/types'
import { useCallback, useEffect, useState, type FC, type JSX } from 'react'

import FileIcon from 'assets/svg/file.svg?react'
import ReloadIcon from 'assets/svg/refresh.svg?react'
import { formatTime } from '../helpers/formatTime'

const projectsAPI = window.electronAPI.projects

export const RecentsView: FC = () => {
  const [projects, setProjects] = useState<Project[]>([])

  const rescanProjects = useCallback(async () => {
    const data = await projectsAPI.rescan()
    setProjects(data)
  }, [])

  const loadProjects = useCallback(async () => {
    const data = await projectsAPI.get()
    setProjects(data)
  }, [])

  const openProject = useCallback(async (path: string) => {
    projectsAPI.open(path)
  }, [])

  const onProjectsUpdated = useCallback((data: Project[]) => {
    setProjects(data)
  }, [])

  useEffect(() => {
    loadProjects()
    const unsubscribe = projectsAPI.subscribe(onProjectsUpdated)

    return unsubscribe
  }, [loadProjects, onProjectsUpdated])

  const renderProjectItem = useCallback(
    (project: Project): JSX.Element => {
      const date = formatTime(project.lastModified)

      return (
        <div key={project.path} className="section-list-item group">
          <FileIcon />

          <span className="text-font-grey flex-1 truncate">{project.name}</span>

          <div className="flex gap-3 items-center">
            <button
              className="hidden group-hover:block text-sm bg-white text-black rounded-sm px-1"
              onClick={() => openProject(project.path)}
            >
              Open in DAW
            </button>

            <span className="group-hover:hidden text-font-disabled text-xs">{date}</span>
          </div>
        </div>
      )
    },
    [openProject],
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <p className="section-title">
          Recents{' '}
          <span className="text-font-disabled text-lg font-normal leading-none">
            ({projects.length})
          </span>
        </p>

        <button onClick={rescanProjects}>
          <ReloadIcon />
        </button>
      </div>

      <div className="section-list inner-shadow h-100">
        {(projects ?? []).map(renderProjectItem)}
      </div>
    </div>
  )
}
