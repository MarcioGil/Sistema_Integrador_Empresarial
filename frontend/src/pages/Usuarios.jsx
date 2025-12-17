import React, { useEffect, useState } from 'react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import Toast from '../components/Toast.jsx'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState(null)
  const [toast, setToast] = useState(null)
  const { user } = require('../contexts/AuthContext').useAuth();

  useEffect(() => {
    fetchUsuarios()
  }, [search])

  const fetchUsuarios = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = search ? { search } : {}
      const { data } = await api.get('/usuarios/', { params })
      setUsuarios(data.results || data || [])
    } catch (err) {
      console.error('Erro ao buscar usuários', err)
      setError('Erro ao carregar usuários. Verifique suas permissões.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja desativar este usuário?')) return
    try {
      await api.delete(`/api/usuarios/${id}/`)
      setToast({ message: 'Usuário desativado com sucesso!', type: 'success' })
      fetchUsuarios()
    } catch (err) {
      setToast({ message: 'Erro ao desativar usuário', type: 'error' })
    }
  }

  const handleEdit = async (usuario) => {
    // Busca detalhes completos se necessário, ou usa o que já tem
    try {
        const { data } = await api.get(`/api/usuarios/${usuario.id}/`);
        setEditingUsuario(data);
        setShowForm(true);
    } catch (err) {
        setToast({ message: 'Erro ao carregar detalhes do usuário', type: 'error' });
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingUsuario(null)
    fetchUsuarios()
  }

  return (
    <div className="p-4 sm:p-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">👨‍💼 Usuários</h2>
        
        {user?.role === 'admin' ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Novo Usuário
          </button>
        ) : null}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por nome, username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Carregando usuários..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchUsuarios} />
      ) : usuarios.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="p-3 text-left">Usuário</th>
                <th className="p-3 text-left hidden md:table-cell">Nome Completo</th>
                <th className="p-3 text-left hidden lg:table-cell">Email</th>
                <th className="p-3 text-left hidden sm:table-cell">Cargo/Depto</th>
                <th className="p-3 text-center">Tipo</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-t hover:bg-blue-50 transition">
                  <td className="p-3 font-medium">{u.username}</td>
                  <td className="p-3 hidden md:table-cell">{u.nome_completo}</td>
                  <td className="p-3 hidden lg:table-cell text-gray-600">{u.email}</td>
                  <td className="p-3 hidden sm:table-cell text-gray-600">
                    {u.cargo}
                    {u.departamento_nome && <span className="block text-xs text-gray-400">{u.departamento_nome}</span>}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">
                        {u.tipo_display || u.tipo}
                    </span>
                  </td>
                  <td className="p-3 text-center text-xl">{u.is_active ? '✅' : '❌'}</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      {user?.role === 'admin' ? (
                        <>
                          <button
                            onClick={() => handleEdit(u)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            ✏️
                          </button>
                          {u.id !== user.id && (
                             <button
                               onClick={() => handleDelete(u.id)}
                               className="text-red-600 hover:text-red-800 hover:underline font-medium"
                             >
                               🗑️
                             </button>
                          )}
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <UsuarioForm
          usuario={editingUsuario}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}

function UsuarioForm({ usuario, onClose }) {
  const [formData, setFormData] = useState({
    username: usuario?.username || '',
    email: usuario?.email || '',
    first_name: usuario?.first_name || '',
    last_name: usuario?.last_name || '',
    cpf: usuario?.cpf || '',
    telefone: usuario?.telefone || '',
    celular: usuario?.celular || '',
    departamento: usuario?.departamento || '',
    cargo: usuario?.cargo || '',
    tipo: usuario?.tipo || 'operador',
    password: '',
    password_confirm: ''
  })
  const [departamentos, setDepartamentos] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Carregar departamentos
    api.get('/departamentos/').then(res => {
        setDepartamentos(res.data.results || res.data || [])
    }).catch(err => console.error("Erro ao carregar departamentos", err));
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = {}
    if (!formData.username) newErrors.username = 'Username obrigatório'
    if (!formData.email) newErrors.email = 'Email obrigatório'
    
    // Validação de senha apenas se for novo usuário ou se preencheu senha na edição
    if (!usuario || formData.password) {
        if (!formData.password) newErrors.password = 'Senha obrigatória';
        if (formData.password !== formData.password_confirm) {
             newErrors.password_confirm = 'Senhas não conferem';
        }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      // Remove password fields if empty during edit
      const dataToSend = { ...formData }
      if (usuario && !dataToSend.password) {
          delete dataToSend.password;
          delete dataToSend.password_confirm;
      }

      if (usuario) {
        await api.put(`/api/usuarios/${usuario.id}/`, dataToSend)
      } else {
        await api.post('/api/usuarios/', dataToSend)
      }
      onClose()
    } catch (err) {
      const apiErrors = err.response?.data || {}
      setErrors(apiErrors)
      alert('Erro ao salvar usuário: ' + JSON.stringify(apiErrors))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {usuario ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className="block mb-1 font-semibold">Username *</label>
                 <input name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded" disabled={!!usuario} />
                 {errors.username && <p className="text-red-600 text-xs">{errors.username}</p>}
              </div>
              <div>
                 <label className="block mb-1 font-semibold">Email *</label>
                 <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
                 {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
              </div>
              <div>
                 <label className="block mb-1 font-semibold">Nome</label>
                 <input name="first_name" value={formData.first_name} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
               <div>
                 <label className="block mb-1 font-semibold">Sobrenome</label>
                 <input name="last_name" value={formData.last_name} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                 <label className="block mb-1 font-semibold">CPF</label>
                 <input name="cpf" value={formData.cpf} onChange={handleChange} className="w-full p-2 border rounded" placeholder="000.000.000-00" />
                 {errors.cpf && <p className="text-red-600 text-xs">{errors.cpf}</p>}
              </div>
              <div>
                 <label className="block mb-1 font-semibold">Telefone</label>
                 <input name="telefone" value={formData.telefone} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
               <div>
                 <label className="block mb-1 font-semibold">Celular</label>
                 <input name="celular" value={formData.celular} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
               <div>
                 <label className="block mb-1 font-semibold">Departamento</label>
                 <select name="departamento" value={formData.departamento} onChange={handleChange} className="w-full p-2 border rounded">
                     <option value="">Selecione...</option>
                     {departamentos.map(d => (
                         <option key={d.id} value={d.id}>{d.nome}</option>
                     ))}
                 </select>
              </div>
               <div>
                 <label className="block mb-1 font-semibold">Cargo</label>
                 <input name="cargo" value={formData.cargo} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
               <div>
                 <label className="block mb-1 font-semibold">Tipo de Acesso</label>
                  <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full p-2 border rounded">
                     <option value="admin">Administrador</option>
                     <option value="gerente">Gerente</option>
                     <option value="vendedor">Vendedor</option>
                     <option value="operador">Operador</option>
                 </select>
              </div>
          </div>
          
           <div className="bg-yellow-50 p-4 rounded text-sm mb-2 border border-yellow-200">
               <h4 className="font-bold mb-2 text-yellow-800">Segurança</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold">Senha {usuario && '(Deixe em branco para manter)'}</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" />
                    {errors.password && <p className="text-red-600 text-xs">{errors.password}</p>}
                 </div>
                 <div>
                    <label className="block mb-1 font-semibold">Confirmar Senha</label>
                    <input name="password_confirm" type="password" value={formData.password_confirm} onChange={handleChange} className="w-full p-2 border rounded" />
                    {errors.password_confirm && <p className="text-red-600 text-xs">{errors.password_confirm}</p>}
                 </div>
               </div>
           </div>


          <div className="flex gap-2 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
