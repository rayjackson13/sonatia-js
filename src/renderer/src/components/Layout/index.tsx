import { Footer } from 'components/Footer'
import { TitleBar } from 'components/TitleBar'
import type { FC } from 'react'
import { Outlet } from 'react-router'
import { motion } from 'motion/react'

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const transition = {
  duration: 0.2,
}

export const Layout: FC = () => {
  return (
    <>
      <TitleBar />

      <motion.div
        className="flex flex-grow justify-center"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      >
        <Outlet />
      </motion.div>

      <Footer />
    </>
  )
}
