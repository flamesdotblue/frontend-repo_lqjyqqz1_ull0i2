import { useEffect, useMemo, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function UserDashboard() {
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState('')
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    const r = await fetch(`${apiBase}/users?active=true`)
    setUsers(await r.json())
  }
  const fetchAssignments = async (email) => {
    const r = await fetch(`${apiBase}/assignments?user_email=${encodeURIComponent(email)}`)
    setAssignments(await r.json())
  }

  useEffect(() => { fetchUsers() }, [])
  useEffect(() => { if (selected) fetchAssignments(selected) }, [selected])

  const selectedUser = useMemo(() => users.find(u=>u.email===selected), [users, selected])

  const markComplete = async (id) => {
    setLoading(true)
    try {
      const r = await fetch(`${apiBase}/assignments/${id}/complete`, { method: 'POST' })
      if (!r.ok) throw new Error('Failed to complete')
      await fetchAssignments(selected)
    } catch(e){
      alert(e.message)
    } finally{ setLoading(false) }
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="bg-white border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm text-gray-600">Select User</label>
            <select className="input mt-1" value={selected} onChange={e=>setSelected(e.target.value)}>
              <option value="">Choose an active user</option>
              {users.map(u => <option key={u._id} value={u.email}>{u.name} • {u.email}</option>)}
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
                  <li key={a._id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium text-sm">Task ID: {a.task_id}</p>
                      <p className="text-xs text-gray-500">Status: {a.status}</p>
                    </div>
                    <button disabled={loading || a.status==='completed'} onClick={()=>markComplete(a._id)} className="btn-primary">
                      {a.status==='completed' ? 'Completed' : 'Mark complete'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <style>{`
        .input{ @apply w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10 } 
        .btn-primary{ @apply inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm hover:bg-gray-900 disabled:opacity-60 transition; }
      `}</style>
    </section>
  )
}
