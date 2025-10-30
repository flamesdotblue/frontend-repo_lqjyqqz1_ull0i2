import { Rocket, Settings, User } from 'lucide-react'

export default function Navbar({ onNavigate, current }) {
  const link = (key, label) => (
    <button
      key={key}
      onClick={() => onNavigate(key)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        current === key ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  )

  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 grid place-items-center rounded-lg bg-black text-white">
            <Rocket size={18} />
          </div>
          <span className="font-semibold">TaskFlow AI</span>
        </div>
        <nav className="flex items-center gap-2">
          {link('home', 'Home')}
          {link('admin', <span className="inline-flex items-center gap-1" key="admin"><Settings size={16}/> Admin</span>)}
          {link('user', <span className="inline-flex items-center gap-1" key="user"><User size={16}/> User</span>)}
        </nav>
      </div>
    </header>
  )
}
