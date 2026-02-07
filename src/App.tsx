import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout } from '@/components/layout'
import { Home, About, Collezione, Contatti } from '@/pages'

function App() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/collezione" element={<Collezione />} />
          <Route path="/contatti" element={<Contatti />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App
