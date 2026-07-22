import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Landing from "@/pages/Landing";
import Blog from "@/pages/Blog";
import BlogArticle from "@/pages/BlogArticle";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import FloatingActions from "@/components/FloatingActions";

function App() {
  const basename = window.location.hostname.includes("github.io") ? "/moukistech" : "/";

  return (
    <div className="App">
      <div className="noise-overlay" aria-hidden="true" />
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter basename={basename}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Landing />} />
            </Routes>
            <FloatingActions />
          </BrowserRouter>
          <Toaster position="bottom-center" theme="dark" richColors />
        </AuthProvider>
      </LanguageProvider>
    </div>
  );
}

export default App;
