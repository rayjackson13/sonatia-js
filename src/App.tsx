import { type FC } from 'react'
import { TitleBar } from 'components/TitleBar'
import { Footer } from 'components/Footer'

export const App: FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col bg-bg">
      {/* Custom Title Bar */}
      <TitleBar />

      {/* App Content */}
      <div className="flex flex-grow justify-center items-center text-white">
        <h1 className="text-2xl">Hello, Electron with a Custom Title Bar!</h1>
      </div>

      <Footer />
    </div>
  )
}

