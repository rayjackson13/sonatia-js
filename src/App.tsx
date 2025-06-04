import { type FC } from 'react'
import { TitleBar } from 'components/TitleBar'

export const App: FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Custom Title Bar */}
      <TitleBar />

      {/* App Content */}
      <div className="flex flex-grow justify-center items-center bg-bg text-white">
        <h1 className="text-2xl">Hello, Electron with a Custom Title Bar!</h1>
      </div>
    </div>
  )
}

