import { createHashRouter } from 'react-router'
import { HomePage } from './home'
import { SettingsPage } from './settings'
import { Layout } from 'components/Layout'
import { PAGES } from '../constants/pages'

const { home, settings } = PAGES

export const Router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: home.path,
        Component: HomePage,
      },
      {
        path: settings.path,
        Component: SettingsPage,
      },
    ],
  },
])
