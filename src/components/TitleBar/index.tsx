import type { FC } from 'react'

export const TitleBar: FC = () => (
  <div id="title-bar" className="flex justify-between items-center text-white select-none h-10">
    <div className="inner-shadow flex h-full items-center justify-center pl-12 pr-15 rounded-br-[40px] bg-bg-deeper w-50">
      <span className="text-lg uppercase text-gradient font-bold">Sonatia</span>
    </div>
  </div>
)
