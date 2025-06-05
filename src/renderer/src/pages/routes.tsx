import { Route, Routes as BaseRoutes, useLocation } from 'react-router'
import { Layout } from 'components/Layout'
import { PAGES } from '../constants/pages'

import { HomePage } from './home'
import { SettingsPage } from './settings'
import { AnimatePresence } from 'motion/react'

const { home, settings } = PAGES

// export const Router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     children: [
//       {
//         path: home.path,
//         Component: HomePage,
//       },
//       {
//         path: settings.path,
//         Component: SettingsPage,
//       },
//     ],
//   },
// ])

export const Routes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <BaseRoutes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route path={home.path} element={<HomePage />} />
          <Route path={settings.path} element={<SettingsPage />} />
        </Route>
      </BaseRoutes>
    </AnimatePresence>
  )
}
