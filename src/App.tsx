import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import RequestList from './pages/requests/RequestList';
import RequestDetails from './pages/requests/RequestDetails';
import ExpertRequests from './pages/requests/ExpertRequests';
import UserList from './pages/users/UserList';
import ExpertManagement from './pages/users/ExpertManagement';
import Analytics from './pages/analytics';
import UserGrowth from './pages/analytics/UserGrowth';
import Revenue from './pages/analytics/Revenue';
import Engagement from './pages/analytics/Engagement';
import Community from './pages/community';
import Quizzes from './pages/community/Quizzes';
import Polls from './pages/community/Polls';
import Topics from './pages/community/Topics';
import Queue from './pages/moderation/Queue';
import ResponseList from './pages/requests/ResponseList';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Analytics Routes */}
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/analytics/user-growth" element={
            <ProtectedRoute>
              <UserGrowth />
            </ProtectedRoute>
          } />
          <Route path="/analytics/revenue" element={
            <ProtectedRoute>
              <Revenue />
            </ProtectedRoute>
          } />
          <Route path="/analytics/engagement" element={
            <ProtectedRoute>
              <Engagement />
            </ProtectedRoute>
          } />

          {/* Community Routes */}
          <Route path="/community" element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } />
          <Route path="/community/quizzes" element={
            <ProtectedRoute>
              <Quizzes />
            </ProtectedRoute>
          } />
          <Route path="/community/polls" element={
            <ProtectedRoute>
              <Polls />
            </ProtectedRoute>
          } />
          <Route path="/community/topics" element={
            <ProtectedRoute>
              <Topics />
            </ProtectedRoute>
          } />

          {/* User Management Routes */}
          <Route path="/users" element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          } />
          <Route path="/users/experts" element={
            <ProtectedRoute>
              <ExpertManagement />
            </ProtectedRoute>
          } />

          {/* Content Moderation Routes */}
          <Route path="/requests/queue" element={
            <ProtectedRoute>
              <Queue />
            </ProtectedRoute>
          } />

          {/* Request Management Routes */}
          <Route path="/requests" element={
            <ProtectedRoute>
              <RequestList />
            </ProtectedRoute>
          } />
          <Route path="/requests/:id" element={
            <ProtectedRoute>
              <RequestDetails />
            </ProtectedRoute>
          } />
          <Route path="/requests/responses" element={
            <ProtectedRoute>
              <ResponseList />
            </ProtectedRoute>
          } />
          <Route path="/expert-requests" element={
            <ProtectedRoute>
              <ExpertRequests />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;