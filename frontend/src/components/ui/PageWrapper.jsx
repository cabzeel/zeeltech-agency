import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 16 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export default function PageWrapper({ children, style }) {
  return (
    <motion.main
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      style={{ paddingTop: '80px', minHeight: '100vh', ...style }}
    >
      {children}
    </motion.main>
  )
}
