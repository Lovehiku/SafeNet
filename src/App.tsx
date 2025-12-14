import React, { ReactNode, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DashboardPage } from './pages/Dashboard';
import { AlertCenterPage } from './pages/AlertCenter';
import { ScreenshotAnalyzerPage } from './pages/ScreenshotAnalyzer';
import { FakeProfileDetectorPage } from './pages/FakeProfileDetector';
import { SettingsPage } from './pages/Settings';
import { AwarenessHelpPage } from './pages/AwarenessHelp';
import { ExtensionInfoPage } from './pages/ExtensionInfo';
import { LoginPage } from './pages/Auth/Login';
import { RegisterPage } from './pages/Auth/Register';
import { PrivacyPage } from './pages/Privacy';
import { TermsPage } from './pages/Terms';
import { SafetyPolicyPage } from './pages/SafetyPolicy';
import { useAppStore } from './store/useAppStore';
import { AboutPage } from './pages/About';
import { Loader } from './components/Loader';

function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, initialized } = useAppStore();

  if (!initialized) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader label="Initializing session" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { init } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="min-h-screen bg-surface text-white">
      <Navbar />
      <main className="pb-12">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alert-center"
              element={
                <ProtectedRoute>
                  <AlertCenterPage />
                </ProtectedRoute>
              }
            />
            <Route path="/alerts" element={<Navigate to="/alert-center" replace />} />
            <Route
              path="/analyzer"
              element={
                <ProtectedRoute>
                  <ScreenshotAnalyzerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fake-profile"
              element={
                <ProtectedRoute>
                  <FakeProfileDetectorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/awareness"
              element={
                <ProtectedRoute>
                  <AwarenessHelpPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/extension"
              element={
                <ProtectedRoute>
                  <ExtensionInfoPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/safety-policy" element={<SafetyPolicyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
