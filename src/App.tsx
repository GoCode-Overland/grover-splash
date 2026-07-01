import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ForBuilders from "./pages/ForBuilders";
import ForOems from "./pages/ForOems";
import Download from "./pages/Download";
import JoinCircle from "./pages/JoinCircle";
import CopyKit from "./pages/CopyKit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/for-builders" element={<ForBuilders />} />
          <Route path="/for-oems" element={<ForOems />} />
          <Route path="/download" element={<Download />} />
          <Route path="/join/:slug" element={<JoinCircle />} />
          <Route path="/partners/copy-kit" element={<CopyKit />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
