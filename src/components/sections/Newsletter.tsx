import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Check } from 'lucide-react'
import { Button, Hexagon } from '@/components/ui'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      // Here you would typically send the email to your backend
    }
  }

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-eyegonal-gray-300 dark:via-eyegonal-gray-700 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-eyegonal-gray-300 dark:via-eyegonal-gray-700 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Hexagon size="lg" variant="filled" className="flex items-center justify-center">
              <Send className="w-8 h-8" />
            </Hexagon>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="font-display text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Resta Connesso
          </motion.h2>

          <motion.p
            className="text-eyegonal-gray-500 dark:text-eyegonal-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Iscriviti per ricevere aggiornamenti su nuove release, 
            drop esclusivi e contenuti speciali.
          </motion.p>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {!isSubmitted ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="La tua email"
                  required
                  className="
                    flex-1 px-4 py-3
                    bg-transparent
                    border border-eyegonal-gray-300 dark:border-eyegonal-gray-700
                    focus:border-eyegonal-black dark:focus:border-white
                    outline-none transition-colors
                    placeholder:text-eyegonal-gray-400
                  "
                />
                <Button type="submit">
                  Iscriviti
                </Button>
              </>
            ) : (
              <motion.div
                className="flex items-center justify-center gap-3 w-full py-3 bg-green-500/10 text-green-600 dark:text-green-400"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Check className="w-5 h-5" />
                <span>Iscrizione completata!</span>
              </motion.div>
            )}
          </motion.form>

          {/* Privacy Note */}
          <motion.p
            className="mt-4 text-xs text-eyegonal-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Rispettiamo la tua privacy. Niente spam, solo contenuti esclusivi.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
