import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MemberProvider } from "@/contexts/MemberContext";
import { AppSettingsProvider } from "@/contexts/AppSettingsContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Members from "./pages/Members";
import NewMember from "./pages/NewMember";
import MemberDetail from "./pages/MemberDetail";
import Contributions from "./pages/Contributions";
import MemberContributions from "./pages/MemberContributions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppSettingsProvider>
        <MemberProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/membres" element={<ProtectedRoute><Members /></ProtectedRoute>} />
                <Route path="/membres/nouveau" element={<ProtectedRoute><NewMember /></ProtectedRoute>} />
                <Route path="/membres/:id" element={<ProtectedRoute><MemberDetail /></ProtectedRoute>} />
                <Route path="/cotisations" element={<ProtectedRoute><Contributions /></ProtectedRoute>} />
                <Route path="/cotisations/:id" element={<ProtectedRoute><MemberContributions /></ProtectedRoute>} />
                <Route path="/rapports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/parametres" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </MemberProvider>
      </AppSettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
