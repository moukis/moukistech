import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import Landing from "@/pages/Landing";
import Blog from "@/pages/Blog";
import BlogArticle from "@/pages/BlogArticle";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import FloatingActions from "@/components/FloatingActions";

function App() {
  return (
    <div className="App">
      <div className="noise-overlay" aria-hidden="true" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          <FloatingActions />
        </BrowserRouter>
        <Toaster position="bottom-center" theme="dark" richColors />
      </AuthProvider>
    </div>
  );
}

export default App;
