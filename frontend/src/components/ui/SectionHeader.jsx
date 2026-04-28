import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function SectionHeader({ label, title, subtitle, center = false }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ textAlign: center ? 'center' : 'left', marginBottom: '3rem' }}
    >
      {label && (
        <span className="section-label" style={{ justifyContent: center ? 'center' : 'flex-start' }}>
          {label}
        </span>
      )}
      <h2 style={{ marginBottom: '1rem' }}>
        {typeof title === 'string'
          ? title.split('|').map((part, i) =>
              i % 2 === 1
                ? <span key={i} className="gold-gradient">{part}</span>
                : <span key={i}>{part}</span>
            )
          : title
        }
      </h2>
      {subtitle && (
        <p style={{ fontSize: '1.05rem', maxWidth: center ? '600px' : '100%', margin: center ? '0 auto' : '0' }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
