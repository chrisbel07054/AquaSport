import { Outlet, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "./Navbar"
import Footer from "./Footer"

const Layout = () => {
  const location = useLocation()

  const pageVariants = { // Variantes para animaciones de página
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -20,
    },
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="flex-grow"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default Layout