import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AdminPanel from './components/AdminPanel'
import UserDashboard from './components/UserDashboard'

function App() {
  const [page, setPage] = useState('home')

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar onNavigate={setPage} current={page} />

      {page === 'home' && (
        <>
          <Hero />
          <section className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[ 
                { title: 'Admin automation', desc: 'Create one task and auto assign to your entire team.'},
                { title: 'User-centric', desc: 'A clean inbox of assignments for every user.'},
                { title: 'API-first', desc: 'Backed by a FastAPI service ready to scale.'}
              ].map(card => (
                <div key={card.title} className="rounded-xl border p-6 bg-white hover:shadow-sm transition">
                  <h3 className="font-semibold">{card.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {page === 'admin' && <AdminPanel />}
      {page === 'user' && <UserDashboard />}

      <footer className="mt-16 py-10 border-t">
        <div className="max-w-6xl mx-auto px-6 text-sm text-gray-500">Built with React, Tailwind, and FastAPI.</div>
      </footer>
    </div>
  )
}

export default App
