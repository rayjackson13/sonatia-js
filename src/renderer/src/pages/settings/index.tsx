import type { FC } from 'react'
import { ProgramLocationSection } from './views/ProgramSection'
import { FoldersSection } from './views/FoldersSection'

export const SettingsPage: FC = () => (
  <div className="container py-24 flex flex-col gap-6">
    <FoldersSection />

    <ProgramLocationSection />
  </div>
)
