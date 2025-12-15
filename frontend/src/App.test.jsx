
import { render, screen } from '@testing-library/react';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';

describe('App', () => {
  it('renderiza o nome do sistema', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(
      screen.getByText(/sistema|painel|dashboard|login/i)
    ).toBeInTheDocument();
  });
});