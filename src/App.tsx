import { useCallback, useEffect, type FC } from 'react'
import { RouterProvider } from 'react-router'
import { Router } from './pages/router'

export const App: FC = () => {
  const getProjects = useCallback(async () => {
    const projects = await window.electronAPI.getProjects(['D:\\Music'])
    console.log('projects', projects)
  }, [])

  useEffect(() => {
    getProjects()
  }, [getProjects])

  return (
    <div className="w-screen h-screen flex flex-col bg-bg">
      <RouterProvider router={Router} />
    </div>
  )
}

