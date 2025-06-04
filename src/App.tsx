import type { FC } from 'react'
import { RouterProvider } from 'react-router'
import { Router } from './pages/router'

export const App: FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col bg-bg">
      <RouterProvider router={Router} />
    </div>
  )
}

