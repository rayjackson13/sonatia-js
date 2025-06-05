import { useCallback, useMemo, type FC } from 'react'
import { useLocation, useNavigate } from 'react-router'

import BackArrowIcon from 'assets/svg/back-arrow.svg?react'
import { PAGES } from 'constants/pages'

export const TitleBar: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isHomePage = useMemo(() => location.pathname === PAGES.home.path, [location.pathname])

  const pageTitle: string = useMemo(
    () => Object.values(PAGES).find((page) => page.path === location.pathname)?.title ?? '',
    [location.pathname],
  )

  const goBack = useCallback((): unknown => navigate(-1), [navigate])

  return (
    <div id="title-bar" className="flex items-center text-white select-none h-12 shrink-0">
      <div className="inner-shadow flex h-full items-center justify-center pl-12 pr-15 rounded-br-[40px] bg-bg-deeper w-50">
        <span className="text-xl uppercase text-gradient font-bold">Sonatia</span>
      </div>

      <div className="flex w-full justify-center">
        <div className="container flex justify-center align-center relative mr-50">
          {!isHomePage && (
            <button
              className="static sm:absolute left-6 md:left-12 w-auto sm:w-20 no-drag px-2 h-full gap-1 text-font-grey"
              onClick={goBack}
            >
              <BackArrowIcon /> <span className="hidden sm:block">Back</span>
            </button>
          )}

          <p>{pageTitle}</p>
        </div>
      </div>
    </div>
  )
}
