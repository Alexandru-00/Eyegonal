import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Instagram, Mail, ExternalLink } from 'lucide-react'
import { Logo, LogoText, Hexagon } from '@/components/ui'

const footerLinks = {
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Collezione', href: '/collezione' },
    { label: 'About', href: '/about' },
    { label: 'Contatti', href: '/contatti' },
  ],
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/eyegonal', icon: Instagram },
    { label: 'Vinted', href: 'https://www.vinted.it/member/250232039-eyegonal', icon: ExternalLink },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-eyegonal-gray-200 dark:border-eyegonal-gray-800">
      {/* Hexagon Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <motion.div
          className="absolute -right-20 -bottom-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <Hexagon size="2xl" variant="outline" />
        </motion.div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <Logo size="lg" />
              <LogoText className="text-2xl" />
            </Link>
            <p className="text-eyegonal-gray-500 dark:text-eyegonal-gray-400 max-w-md mb-6">
              An Eye For Your Back, A Look At Loners.
              <br />
              <strong className="text-eyegonal-black dark:text-white">More Than A Brand.</strong>
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border border-eyegonal-gray-200 dark:border-eyegonal-gray-800 hover:bg-eyegonal-black hover:text-white dark:hover:bg-white dark:hover:text-eyegonal-black transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-6">
              Navigazione
            </h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-eyegonal-gray-500 dark:text-eyegonal-gray-400 hover:text-eyegonal-black dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-6">
              Contatti
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:info@eyegonal.com"
                className="flex items-center gap-3 text-eyegonal-gray-500 dark:text-eyegonal-gray-400 hover:text-eyegonal-black dark:hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@eyegonal.com
              </a>
              <a
                href="https://www.instagram.com/eyegonal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-eyegonal-gray-500 dark:text-eyegonal-gray-400 hover:text-eyegonal-black dark:hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
                @eyegonal
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-eyegonal-gray-200 dark:border-eyegonal-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-eyegonal-gray-500 dark:text-eyegonal-gray-400">
              © {new Date().getFullYear()} Eyegonal. Tutti i diritti riservati.
            </p>
            <div className="flex items-center gap-6 text-sm text-eyegonal-gray-500 dark:text-eyegonal-gray-400">
              <Link to="/privacy" className="hover:text-eyegonal-black dark:hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/termini" className="hover:text-eyegonal-black dark:hover:text-white transition-colors">
                Termini e Condizioni
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
