import type { FC } from 'react'

export const TitleBar: FC = () => {
  // const maximizeSymbol =

  return (
    <div id="title-bar" className="flex justify-between items-center bg-bg text-white select-none h-12">
      <div className="inner-shadow flex h-full items-center content-center pl-12 pr-15 rounded-br-[40px] bg-bg-deeper">
        <span className="text-xl uppercase text-gradient font-bold">Sonatia</span>
      </div>
    </div>
  )
}
