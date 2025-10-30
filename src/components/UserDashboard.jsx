import { useEffect, useMemo, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function UserDashboard() {
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState('')
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const safeJson = async (res) => { try { return await res.json() } catch { return null } }

  const fetchUsers = async () => {
    try {
      setError('')
      const r = await fetch(`${apiBase}/users?active=true`)
      const data = await safeJson(r)
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e); setError('Could not load users')
    }
  }
  const fetchAssignments = async (email) => {
    try {
      setError('')
      const r = await fetch(`${apiBase}/assignments?user_email=${encodeURIComponent(email)}`)
      const data = await safeJson(r)
      setAssignments(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e); setError('Could not load assignments')
    }
  }

  useEffect(() => { fetchUsers() }, [])
  useEffect(() => { if (selected) fetchAssignments(selected) }, [selected])

  const selectedUser = useMemo(() => users.find(u=>u.email===selected), [users, selected])

  const markComplete = async (id) => {
    setLoading(true)
    setError('')
    try {
      const r = await fetch(`${apiBase}/assignments/${id}/complete`, { method: 'POST' })
      if (!r.ok) throw new Error('Failed to complete')
      await fetchAssignments(selected)
    } catch(e){
      setError(e.message)
    } finally{ setLoading(false) }
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
      )}
      <div className="bg-white border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm text-gray-600">Select User</label>
            <select className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 mt-1" value={selected} onChange={e=>setSelected(e.target.value)}>
              <option value="">Choose an active user</option>
              {users.map(u => <option key={u._id || u.email} value={u.email}>{u.name} • {u.email}</option>)}
            </select>
          </div>
          {selectedUser && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-700">Viewing assignments for <span className="font-medium">{selectedUser.name}</span></p>
            </div>
          )}
        </div>

        {selected && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Assigned Tasks</h3>
            {assignments.length === 0 ? (
              <p className="text-sm text-gray-500">No assignments yet.</p>
            ) : (
              <ul className="space-y-2">
                {assignments.map(a => (
                  <li key={a._id || a.task_id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium text-sm">Task ID: {a.task_id}</p>
                      <p className="text-xs text-gray-500">Status: {a.status}</p>
                    </div>
                    <button disabled={loading || a.status==='completed'} onClick={()=>markComplete(a._id)} className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm hover:bg-gray-900 disabled:opacity-60 transition">
                      {a.status==='completed' ? 'Completed' : 'Mark complete'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
