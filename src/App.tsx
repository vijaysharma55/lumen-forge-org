import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import PublicLayout from "@/components/layout/PublicLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import NgoWebsite from "./pages/NgoWebsite";
import Csr from "./pages/Csr";
import Hygiene from "./pages/Hygiene";
import Coordinator from "./pages/Coordinator";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound.tsx";

import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import NoticesPage from "./pages/dashboard/Notices";
import PaymentsPage from "./pages/dashboard/Payments";
import SupportPage from "./pages/dashboard/Support";
import DocumentsPage from "./pages/dashboard/Documents";
import MyNgo from "./pages/dashboard/MyNgo";
import MyCoordinator from "./pages/dashboard/MyCoordinator";
import MyReferrals from "./pages/dashboard/MyReferrals";
import AdminInquiries from "./pages/dashboard/admin/AdminInquiries";
import AdminClients from "./pages/dashboard/admin/AdminClients";
import AdminCoordinators from "./pages/dashboard/admin/AdminCoordinators";
import AdminNotices from "./pages/dashboard/admin/AdminNotices";
import AdminRoles from "./pages/dashboard/admin/AdminRoles";
import AdminTasks from "./pages/dashboard/admin/AdminTasks";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/ngo-website" element={<NgoWebsite />} />
            <Route path="/csr" element={<Csr />} />
            <Route path="/hygiene" element={<Hygiene />} />
            <Route path="/coordinator" element={<Coordinator />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/auth" element={<Auth />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="notices" element={<NoticesPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="ngo" element={<MyNgo />} />
            <Route path="coordinator" element={<MyCoordinator />} />
            <Route path="referrals" element={<MyReferrals />} />
            <Route path="admin/inquiries" element={<AdminInquiries />} />
            <Route path="admin/clients" element={<AdminClients />} />
            <Route path="admin/coordinators" element={<AdminCoordinators />} />
            <Route path="admin/payments" element={<PaymentsPage />} />
            <Route path="admin/notices" element={<AdminNotices />} />
            <Route path="admin/tasks" element={<AdminTasks />} />
            <Route path="admin/roles" element={<AdminRoles />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
