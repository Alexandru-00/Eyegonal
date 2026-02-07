import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout } from '@/components/layout'
import { AuthProvider } from '@/context/AuthContext'
import { Home, About, Collezione, Contatti, AdminLogin, AdminDashboard } from '@/pages'

function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/collezione" element={<Collezione />} />
            <Route path="/contatti" element={<Contatti />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </AuthProvider>
  )
}

export default App
