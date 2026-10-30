import { useReducer, useState } from 'react'

const initialState = {
  users: [
    { id: 1, name: 'Ivan Petrov', status: 'Active' },
    { id: 2, name: 'Maria Ivanova', status: 'Inactive' },
    { id: 3, name: 'Alex Smirnov', status: 'Active' },
    { id: 4, name: 'Olga Kuznetsova', status: 'Active' },
    { id: 5, name: 'Dmitry Volkov', status: 'Inactive' },
    { id: 6, name: 'Elena Sokolova', status: 'Active' },
  ],
  search: '',
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload],
      }

    case 'EDIT_USER':
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
      }

    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      }

    case 'TOGGLE_STATUS':
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload
            ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
            : user
        ),
      }

    case 'SEARCH_USER':
      return {
        ...state,
        search: action.payload,
      }

    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ name: '' })
  const [errors, setErrors] = useState({ name: '' })

  const filteredUsers = state.users.filter((user) =>
    user.name.toLowerCase().includes(state.search.toLowerCase())
  )

  function openAddModal() {
    setEditingUser(null)
    setFormData({ name: '' })
    setErrors({ name: '' })
    setIsModalOpen(true)
  }

  function openEditModal(user) {
    setEditingUser(user)
    setFormData({ name: user.name })
    setErrors({ name: '' })
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingUser(null)
    setFormData({ name: '' })
    setErrors({ name: '' })
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  function validate() {
    const newErrors = { name: '' }
    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    if (editingUser) {
      dispatch({
        type: 'EDIT_USER',
        payload: {
          ...editingUser,
          name: formData.name.trim(),
        },
      })
    } else {
      dispatch({
        type: 'ADD_USER',
        payload: {
          id: Date.now(),
          name: formData.name.trim(),
          status: 'Active',
        },
      })
    }

    closeModal()
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch({ type: 'DELETE_USER', payload: id })
    }
  }

  function handleToggleStatus(id) {
    dispatch({ type: 'TOGGLE_STATUS', payload: id })
  }

  function handleSearch(e) {
    dispatch({ type: 'SEARCH_USER', payload: e.target.value })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Users</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your team members</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={state.search}
              onChange={handleSearch}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-slate-700">
                {state.search ? 'No users found' : 'No users yet'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {state.search ? 'Try changing your search query' : 'Get started by adding your first user'}
              </p>
              {!state.search && (
                <button
                  onClick={openAddModal}
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg"
                >
                  Add User
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {user.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40" onClick={closeModal} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                    errors.name ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {errors.name && <p className="mt-1.5 text-xs text-rose-500">{errors.name}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  {editingUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App