import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './router/AppRouter';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
