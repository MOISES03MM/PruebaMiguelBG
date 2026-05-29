import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import type { LoginRequest } from '../types/auth.types';

export function useAuth() {
  const context = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      context.login(response.token, response.user);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...context,
    handleLogin,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
