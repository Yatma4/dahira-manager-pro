import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MemberProvider } from "@/contexts/MemberContext";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MemberProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/membres" element={<Members />} />
            <Route path="/membres/nouveau" element={<NewMember />} />
            <Route path="/membres/:id" element={<MemberDetail />} />
            <Route path="/cotisations" element={<Contributions />} />
            <Route path="/cotisations/:id" element={<MemberContributions />} />
            <Route path="/rapports" element={<Reports />} />
            <Route path="/parametres" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MemberProvider>
  </QueryClientProvider>
);

export default App;
