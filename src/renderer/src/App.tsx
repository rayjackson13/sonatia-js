import type { FC } from 'react'
import { HashRouter } from 'react-router'
import { Routes } from './pages/routes'

export const App: FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col bg-bg">
      <HashRouter>
        <Routes />
      </HashRouter>
    </div>
  )
}
