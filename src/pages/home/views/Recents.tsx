import type { Project } from 'constants/types'
import { useCallback, useEffect, useState, type FC, type JSX } from 'react'

import FileIcon from 'assets/svg/file.svg?react'
import ReloadIcon from 'assets/svg/refresh.svg?react'

const projectsAPI = window.electronAPI.projects

export const RecentsView: FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  console.log('projects', projects)

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
    console.log('projects updated')
    setProjects(data)
  }, [])

  useEffect(() => {
    loadProjects()
    const unsubscribe = projectsAPI.subscribe(onProjectsUpdated)

    return unsubscribe
  }, [loadProjects, onProjectsUpdated])

  const renderProjectItem = useCallback(
    (project: Project): JSX.Element => {
      return (
        <div key={project.path} className="section-list-item group">
          <FileIcon />

          <span className="text-font-grey flex-1 truncate">{project.name}</span>

          <button
            className="hidden group-hover:block text-sm bg-white rounded-sm text-grey-selected px-1"
            onClick={() => openProject(project.path)}
          >
            Open in DAW
          </button>
        </div>
      )
    },
    [openProject]
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <p className="section-title">Recents</p>

        <button onClick={rescanProjects}>
          <ReloadIcon />
        </button>
      </div>

      <div className="section-list inner-shadow h-100">{projects.map(renderProjectItem)}</div>
    </div>
  )
}
