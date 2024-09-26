import React, { useContext } from 'react';
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import UserNavbar from './components/UserNavbar';
import AuthPage from './pages/AuthPage';
import QuizPage from './pages/QuizPage';
import DashboardPage from './pages/DashboardPage';
import QuizHistoryPage from './pages/QuizHistoryPage';
import { BannerProvider } from './contexts/BannerContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext)
  return user ? children : <Navigate to="/" replace />
}

const router = createHashRouter([
  {
    path: "/",
    element: <AuthPage />
  },
  {
    path: "quiz",
    element: (<PrivateRoute><UserNavbar><QuizPage /></UserNavbar></PrivateRoute>)
  },
  {
    path: "dashboard",
    element: (<PrivateRoute><UserNavbar><DashboardPage /></UserNavbar></PrivateRoute>)
  },
  {
    path: "history",
    element: (<PrivateRoute><UserNavbar><QuizHistoryPage /></UserNavbar></PrivateRoute>)
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);


const App = () => {

  return (
    <AuthProvider>
      <BannerProvider>
        <RouterProvider router={router} />
      </BannerProvider>
    </AuthProvider>
  );
};

export default App;