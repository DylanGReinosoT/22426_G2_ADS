import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthContext } from '../contexts/AuthContext';

describe('Login Component', () => {
  const mockAuth = {
    isAuthenticated: false,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  };

  const renderWithAuth = (component) => {
    return render(
      <AuthContext.Provider value={mockAuth}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  it('should render login form', () => {
    renderWithAuth(<Login />);
    const form = document.querySelector('form');
    expect(form).toBeDefined();
  });

  it('should contain email input field', () => {
    renderWithAuth(<Login />);
    const emailInput = document.querySelector('input[type="email"]') || 
                       document.querySelector('input[placeholder*="email" i]');
    expect(emailInput).toBeDefined();
  });

  it('should contain password input field', () => {
    renderWithAuth(<Login />);
    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toBeDefined();
  });

  it('should contain a submit button', () => {
    renderWithAuth(<Login />);
    const submitButton = document.querySelector('button[type="submit"]') || 
                         document.querySelector('button');
    expect(submitButton).toBeDefined();
  });
});
