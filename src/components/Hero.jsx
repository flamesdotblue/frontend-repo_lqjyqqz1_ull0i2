import Spline from '@splinetool/react-spline'
import { CheckCircle } from 'lucide-react'

export default function Hero({ onAdmin, onUser }) {
  return (
    <section className="relative h-[520px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/Vb8w6qK8zYdD1fG7/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          Automate task delivery like Outlier
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl">
          Create tasks once and automatically distribute them to your workforce. Admins orchestrate, users execute, and everything stays in sync.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={onAdmin} className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm hover:bg-gray-900 transition">
            Go to Admin
          </button>
          <button onClick={onUser} className="inline-flex items-center justify-center rounded-md bg-white text-gray-900 border px-4 py-2 text-sm hover:bg-gray-50 transition">
            Go to User
          </button>
        </div>
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
          {["Auto-assign to all users", "Track completion", "Modern, fast UI"].map((item) => (
            <li key={item} className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-md px-3 py-2 border">
              <CheckCircle size={18} className="text-emerald-600" />
              <span className="text-sm text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
