import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { PublicLayout } from "@/layouts/public-layout";
import AuthenticationLayout from "@/layouts/auth-layout";
import ProtectRoutes from "@/layouts/protected-routes";
import { MainLayout } from "@/layouts/main-layout";

import { SignInPage } from "./routes/sign-in";
import { SignUpPage } from "./routes/sign-up";
import { Generate } from "./components/generate";
import { Dashboard } from "./routes/dashboard";
import { CreateEditPage } from "./routes/create-edit-page";
import { MockLoadPage } from "./routes/mock-load-page";
import { MockInterviewPage } from "./routes/mock-interview-page";
import { Feedback } from "./routes/feedback";
import { ErrorBoundary } from "./components/error-boundary";
import Homepage from "./components/homepage";
import AboutPage from "./routes/about";
import ServicesPage from "./routes/services";
import ContactPage from "./routes/contact";

// Loading wrapper component
const LoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse mx-auto"></div>
          <h2 className="text-2xl font-bold text-white">Loading AI Interview Platform...</h2>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Page transition wrapper
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={`min-h-screen bg-background transition-all duration-500 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="animate-fade-in-up">
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <LoadingWrapper>
          <PageTransition>
            <Routes>
              {/* public routes */}
              <Route element={<PublicLayout />}>
                <Route index element={<Homepage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* authentication layout */}
              <Route element={<AuthenticationLayout />}>
                <Route path="/signin/*" element={<SignInPage />} />
                <Route path="/signup/*" element={<SignUpPage />} />
              </Route>

              {/* protected routes */}
              <Route
                element={
                  <ProtectRoutes>
                    <MainLayout />
                  </ProtectRoutes>
                }
              >
                {/* add all the protect routes */}
                <Route element={<Generate />} path="/generate">
                  <Route index element={<Dashboard />} />
                  <Route path=":interviewId" element={<CreateEditPage />} />
                  <Route path="interview/:interviewId" element={<MockLoadPage />} />
                  <Route
                    path="interview/:interviewId/start"
                    element={<MockInterviewPage />}
                  />
                  <Route path="feedback/:interviewId" element={<Feedback />} />
                </Route>
              </Route>
            </Routes>
          </PageTransition>
        </LoadingWrapper>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
