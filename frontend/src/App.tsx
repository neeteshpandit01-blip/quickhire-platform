import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { setUser, setLoading } from './store/slices/authSlice';
import { getUserProfile } from './services/api';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Common Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Premium from './pages/Premium';

// Client Pages
import ClientDashboard from './pages/client/Dashboard';
import PostGig from './pages/client/PostGig';
import MyGigs from './pages/client/MyGigs';
import GigDetails from './pages/client/GigDetails';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import BrowseGigs from './pages/student/BrowseGigs';
import MyApplications from './pages/student/MyApplications';
import ActiveGigs from './pages/student/ActiveGigs';

// Shared Pages
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          dispatch(setUser(userProfile));
        } catch (error) {
          console.error('Error fetching user profile:', error);
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected Common Routes */}
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
        <Route path="chat/:chatId?" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

        {/* Client Routes */}
        <Route path="client">
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={['client']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="post-gig" element={<ProtectedRoute allowedRoles={['client']}><PostGig /></ProtectedRoute>} />
          <Route path="my-gigs" element={<ProtectedRoute allowedRoles={['client']}><MyGigs /></ProtectedRoute>} />
          <Route path="gigs/:gigId" element={<ProtectedRoute allowedRoles={['client']}><GigDetails /></ProtectedRoute>} />
        </Route>

        {/* Student Routes */}
        <Route path="student">
          <Route path="dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="browse" element={<ProtectedRoute allowedRoles={['student']}><BrowseGigs /></ProtectedRoute>} />
          <Route path="applications" element={<ProtectedRoute allowedRoles={['student']}><MyApplications /></ProtectedRoute>} />
          <Route path="active-gigs" element={<ProtectedRoute allowedRoles={['student']}><ActiveGigs /></ProtectedRoute>} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
