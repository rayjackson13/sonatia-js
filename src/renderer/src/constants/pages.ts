type PagePath = {
  path: string
  title: string
}

export const PAGES: { [x: string]: PagePath } = {
  home: {
    path: '/',
    title: '',
  },
  settings: {
    path: '/settings',
    title: 'Settings',
  },
} as const
