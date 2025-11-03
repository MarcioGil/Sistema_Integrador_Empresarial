import React from 'react'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-red-600 text-5xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">Ops! Algo deu errado</h3>
      <p className="text-red-600 mb-4">{message || 'Erro ao carregar dados'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  )
}
