import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validators';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import type { LoginFormData } from '../../utils/validators';

export function LoginPage() {
  const navigate = useNavigate();
  const { handleLogin, isLoading, error, clearError, isAuthenticated } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await handleLogin(data);
    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Inventory System</h1>
          <p className="text-gray-500 mt-2">Ingresa tus credenciales</p>
        </div>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            id="username"
            label="Usuario"
            placeholder="admin"
            error={errors.username?.message}
            {...register('username')}
          />

          <Input
            id="password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" isLoading={isLoading} className="w-full">
            Iniciar Sesión
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>admin / admin123 — viewer / viewer123</p>
        </div>
      </div>
    </div>
  );
}
