import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r p-4">
        <h3 className="font-bold mb-4">SI - Menu</h3>
        <nav className="flex flex-col gap-2">
          <Link to="/">Dashboard</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
