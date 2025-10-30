import { useEffect, useMemo, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)

  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'annotator' })
  const [newTask, setNewTask] = useState({ title: '', description: '', instructions: '', priority: 'normal' })
  const [assignTaskId, setAssignTaskId] = useState('')

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${apiBase}/users`)
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    }
  }

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${apiBase}/tasks`)
      const data = await res.json()
      setTasks(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchTasks()
  }, [])

  const createUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/users`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser)
      })
      if (!res.ok) throw new Error('Failed to create user')
      setNewUser({ name: '', email: '', role: 'annotator' })
      await fetchUsers()
      alert('User created')
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/admin/tasks`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTask)
      })
      if (!res.ok) throw new Error('Failed to create task')
      setNewTask({ title: '', description: '', instructions: '', priority: 'normal' })
      await fetchTasks()
      alert('Task created')
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const autoAssign = async () => {
    if (!assignTaskId) return alert('Select a task to assign')
    setLoading(true)
    try {
      const res = await fetch(`${apiBase}/admin/assignments/auto`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ task_id: assignTaskId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || 'Failed to auto-assign')
      alert(`Assigned to ${data.assigned} user(s)`)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const activeUsers = useMemo(() => users.filter(u => u.is_active), [users])

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold">Create User</h3>
          <form onSubmit={createUser} className="mt-4 grid grid-cols-1 gap-3">
            <input className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" placeholder="Name" value={newUser.name} onChange={e=>setNewUser(v=>({...v,name:e.target.value}))} />
            <input className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" placeholder="Email" value={newUser.email} onChange={e=>setNewUser(v=>({...v,email:e.target.value}))} />
            <select className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" value={newUser.role} onChange={e=>setNewUser(v=>({...v,role:e.target.value}))}>
              <option value="annotator">Annotator</option>
              <option value="admin">Admin</option>
            </select>
            <button disabled={loading} className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm hover:bg-gray-900 disabled:opacity-60 transition">{loading? 'Saving...' : 'Add user'}</button>
          </form>
          <div className="mt-6">
            <h4 className="font-medium mb-2">Active Users</h4>
            <div className="flex flex-wrap gap-2">
              {activeUsers.map(u => (
                <span key={u._id} className="px-2 py-1 rounded bg-gray-100 text-sm">{u.name}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold">Create Task</h3>
          <form onSubmit={createTask} className="mt-4 grid grid-cols-1 gap-3">
            <input className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" placeholder="Title" value={newTask.title} onChange={e=>setNewTask(v=>({...v,title:e.target.value}))} />
            <textarea className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 min-h-[88px]" placeholder="Description" value={newTask.description} onChange={e=>setNewTask(v=>({...v,description:e.target.value}))} />
            <textarea className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 min-h-[88px]" placeholder="Instructions" value={newTask.instructions} onChange={e=>setNewTask(v=>({...v,instructions:e.target.value}))} />
            <select className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" value={newTask.priority} onChange={e=>setNewTask(v=>({...v,priority:e.target.value}))}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
            <button disabled={loading} className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm hover:bg-gray-900 disabled:opacity-60 transition">{loading? 'Saving...' : 'Create task'}</button>
          </form>
          <div className="mt-6">
            <h4 className="font-medium mb-2">All Tasks</h4>
            <ul className="space-y-2 max-h-48 overflow-auto pr-1">
              {tasks.map(t => (
                <li key={t._id} className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="font-medium text-sm">{t.title} <span className="text-xs text-gray-500">• {t.priority}</span></p>
                    {t.description && (<p className="text-xs text-gray-500 line-clamp-1">{t.description}</p>)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white border rounded-xl p-6">
        <h3 className="text-lg font-semibold">Auto-assign Task to Users</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <select className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10" value={assignTaskId} onChange={e=>setAssignTaskId(e.target.value)}>
            <option value="">Select a task</option>
            {tasks.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
          </select>
          <button onClick={autoAssign} disabled={loading || !assignTaskId} className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm hover:bg-gray-900 disabled:opacity-60 transition">{loading? 'Assigning...' : 'Assign to all active users'}</button>
        </div>
      </div>
    </section>
  )
}
