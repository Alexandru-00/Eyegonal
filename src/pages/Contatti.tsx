import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Instagram, MapPin, Send, Check, ExternalLink } from 'lucide-react'
import { PageTransition } from '@/components/layout'
import { Button, Hexagon, HexagonGrid, Logo } from '@/components/ui'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@eyegonal.com',
    href: 'mailto:info@eyegonal.com',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@eyegonal',
    href: 'https://www.instagram.com/eyegonal',
  },
  {
    icon: ExternalLink,
    label: 'Shop',
    value: 'Vinted',
    href: 'https://www.vinted.it/member/250232039-eyegonal',
  },
]

export function Contatti() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    setIsSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <HexagonGrid count={4} />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm uppercase tracking-wider text-eyegonal-gray-500 dark:text-eyegonal-gray-400 mb-4 block">
              Contattaci
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Parliamo
            </h1>
            <p className="text-xl text-eyegonal-gray-500 dark:text-eyegonal-gray-400">
              Hai domande, suggerimenti o vuoi collaborare? 
              Siamo qui per ascoltarti.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl font-bold mb-8">
                Restiamo in Contatto
              </h2>
              
              <p className="text-eyegonal-gray-500 dark:text-eyegonal-gray-400 mb-12">
                Che tu voglia saperne di più sui nostri prodotti, proporre una collaborazione 
                o semplicemente salutarci, siamo sempre felici di sentirti.
              </p>

              <div className="space-y-6 mb-12">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-4 border border-eyegonal-gray-200 dark:border-eyegonal-gray-800 hover:border-eyegonal-black dark:hover:border-white transition-all group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <Hexagon size="md" variant="outline" className="w-12 h-14 group-hover:bg-eyegonal-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-eyegonal-black transition-colors">
                      <item.icon className="w-5 h-5" />
                    </Hexagon>
                    <div>
                      <span className="text-sm text-eyegonal-gray-500 dark:text-eyegonal-gray-400 block">
                        {item.label}
                      </span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Logo */}
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Logo size="lg" />
                <div>
                  <span className="font-display font-bold text-xl block">EYEGONAL</span>
                  <span className="text-sm text-eyegonal-gray-500">The Big EYE</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-eyegonal-gray-100 dark:bg-eyegonal-gray-900 p-8 md:p-12">
                <h3 className="font-display text-2xl font-bold mb-8">
                  Inviaci un Messaggio
                </h3>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nome *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-eyegonal-black border border-eyegonal-gray-300 dark:border-eyegonal-gray-700 focus:border-eyegonal-black dark:focus:border-white outline-none transition-colors"
                          placeholder="Il tuo nome"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-eyegonal-black border border-eyegonal-gray-300 dark:border-eyegonal-gray-700 focus:border-eyegonal-black dark:focus:border-white outline-none transition-colors"
                          placeholder="La tua email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Oggetto *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-eyegonal-black border border-eyegonal-gray-300 dark:border-eyegonal-gray-700 focus:border-eyegonal-black dark:focus:border-white outline-none transition-colors"
                      >
                        <option value="">Seleziona un argomento</option>
                        <option value="info">Informazioni Prodotti</option>
                        <option value="collab">Collaborazioni</option>
                        <option value="press">Press & Media</option>
                        <option value="other">Altro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Messaggio *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-white dark:bg-eyegonal-black border border-eyegonal-gray-300 dark:border-eyegonal-gray-700 focus:border-eyegonal-black dark:focus:border-white outline-none transition-colors resize-none"
                        placeholder="Il tuo messaggio..."
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      <Send className="w-4 h-4" />
                      Invia Messaggio
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-500/10 text-green-600 dark:text-green-400">
                      <Check className="w-8 h-8" />
                    </div>
                    <h4 className="font-display text-xl font-bold mb-2">
                      Messaggio Inviato!
                    </h4>
                    <p className="text-eyegonal-gray-500 dark:text-eyegonal-gray-400">
                      Ti risponderemo il prima possibile.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-eyegonal-gray-100 dark:bg-eyegonal-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Domande Frequenti
            </h2>
            <p className="text-eyegonal-gray-500 dark:text-eyegonal-gray-400">
              Risposte alle domande più comuni
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Come posso acquistare?',
                a: 'Tutti i nostri prodotti sono disponibili su Vinted. Clicca sul pulsante "Shop" nel menu per visitare il nostro negozio.',
              },
              {
                q: 'Quali sono i tempi di spedizione?',
                a: 'Le spedizioni vengono effettuate entro 2-3 giorni lavorativi. I tempi di consegna dipendono dalla tua zona.',
              },
              {
                q: 'Accettate collaborazioni?',
                a: 'Siamo sempre aperti a collaborazioni interessanti. Contattaci tramite il form sopra selezionando "Collaborazioni".',
              },
              {
                q: 'I prodotti sono in edizione limitata?',
                a: 'Sì, molti dei nostri pezzi sono prodotti in quantità limitate per mantenere l\'esclusività del brand.',
              },
            ].map((faq, index) => (
              <motion.details
                key={index}
                className="group border border-eyegonal-gray-200 dark:border-eyegonal-gray-800 bg-white dark:bg-eyegonal-black"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer font-medium">
                  {faq.q}
                  <span className="ml-4 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-6 text-eyegonal-gray-500 dark:text-eyegonal-gray-400">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
