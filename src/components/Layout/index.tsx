import { Footer } from 'components/Footer'
import { TitleBar } from 'components/TitleBar'
import type { FC } from 'react'
import { Outlet } from 'react-router'

export const Layout: FC = () => {
  return (
    <>
      <TitleBar />

      <div className="flex flex-grow justify-center">
        <Outlet />
      </div>

      <Footer />
    </>
  )
}
