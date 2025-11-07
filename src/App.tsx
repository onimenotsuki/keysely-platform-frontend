import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { LanguageWrapper } from './components/LanguageRouter';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Auth from './pages/Auth';
import Bookings from './pages/Bookings';
import Explore from './pages/Explore';
import Favorites from './pages/Favorites';
import HostProfile from './pages/HostProfile';
import Index from './pages/Index';
import ListSpace from './pages/ListSpace';
import ListSpaceNew from './pages/ListSpaceNew';
import Messages from './pages/Messages';
import MyReviews from './pages/MyReviews';
import NotFound from './pages/NotFound';
import OwnerDashboard from './pages/OwnerDashboard';
import PaymentCancelled from './pages/PaymentCancelled';
import PaymentSuccess from './pages/PaymentSuccess';
import Profile from './pages/Profile';
import SpaceDetail from './pages/SpaceDetail';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Redirect root to default language */}
              <Route path="/" element={<Navigate to="/es" replace />} />

              {/* Language-prefixed routes */}
              <Route
                path="/:lang"
                element={
                  <LanguageWrapper>
                    <Index />
                  </LanguageWrapper>
                }
              />
              <Route
                path="/:lang/explore"
                element={
                  <LanguageWrapper>
                    <Explore />
                  </LanguageWrapper>
                }
              />
              <Route
                path="/:lang/space/:id"
                element={
                  <LanguageWrapper>
                    <SpaceDetail />
                  </LanguageWrapper>
                }
              />
              <Route
                path="/:lang/host/:id"
                element={
                  <LanguageWrapper>
                    <HostProfile />
                  </LanguageWrapper>
                }
              />
              <Route
                path="/:lang/auth"
                element={
                  <LanguageWrapper>
                    <Auth />
                  </LanguageWrapper>
                }
              />
              <Route
                path="/:lang/host"
                element={
                  <LanguageWrapper>
                    <ListSpaceNew />
                  </LanguageWrapper>
                }
              />
              <Route
                path="/:lang/payment-success"
                element={
                  <LanguageWrapper>
                    <PaymentSuccess />
                  </LanguageWrapper>
                }
              />
              <Route
                path="/:lang/payment-cancelled"
                element={
                  <LanguageWrapper>
                    <PaymentCancelled />
                  </LanguageWrapper>
                }
              />

              {/* Protected routes with language prefix */}
              <Route
                path="/:lang/profile"
                element={
                  <LanguageWrapper>
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  </LanguageWrapper>
                }
              />
              <Route
                path="/:lang/bookings"
                element={
                  <LanguageWrapper>
                    <ProtectedRoute>
                      <Bookings />
                    </ProtectedRoute>
                  </LanguageWrapper>
                }
              />
              <Route
                path="/:lang/list-space"
                element={
                  <LanguageWrapper>
                    <ProtectedRoute>
                      <ListSpace />
                    </ProtectedRoute>
                  </LanguageWrapper>
                }
              />
              <Route
                path="/:lang/owner-dashboard"
                element={
                  <LanguageWrapper>
                    <ProtectedRoute>
                      <OwnerDashboard />
                    </ProtectedRoute>
                  </LanguageWrapper>
                }
              />
              <Route
                path="/:lang/messages"
                element={
                  <LanguageWrapper>
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  </LanguageWrapper>
                }
              />
              <Route
                path="/:lang/my-reviews"
                element={
                  <LanguageWrapper>
                    <ProtectedRoute>
                      <MyReviews />
                    </ProtectedRoute>
                  </LanguageWrapper>
                }
              />
              <Route
                path="/:lang/favorites"
                element={
                  <LanguageWrapper>
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  </LanguageWrapper>
                }
              />

              {/* Catch-all for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
