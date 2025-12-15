import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access')
  // Substituído por PrivateRoute.jsx
  // Este arquivo pode ser removido
}
