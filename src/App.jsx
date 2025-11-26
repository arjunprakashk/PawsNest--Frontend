import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages & Components
import AdminHome from "./Pages/admin/AdminHome";
import HomePage from "./components/home";
import OwnerHome from "./Pages/owner/ownerhome";
import AboutPage from "./Pages/about";
import ContactPage from "./Pages/contact";
import NavbarFull from "./components/NavbarFull";
import ShelterBookingPage from "./Pages/shelterbooking";
import PetVaccinationPage from "./Pages/vaccinationpage";
import PetGroomingBookingPage from "./Pages/Grooming";
import PetPage from "./Pages/PetPage";
import PetServicesPage from "./Pages/Services";
import SignupPage from "./Pages/signup";
import LoginPage from "./Pages/Login";
import IndexPage from "./components";
import BookingsPage from "./Pages/Bookings";
import PetDetailPage from "./Pages/PetDetailsAdopter";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Requests from "./Pages/Requests";
import ProfilePage from "./Pages/Profile";
import PetAddPage from "./Pages/owner/AddPet";
import FeedbackList from "./Pages/owner/Feedbacks";
import OwnerBookingsPage from "./Pages/owner/OwnerBookingsPage";
import SessionChecker from "./components/SessionChecker";
import ChatPage from "./Pages/ChatPage";
import AdopterPetListPage from "./Pages/AdopterPetList";
import OwnerPetListPage from "./Pages/owner/OwnerPetListPage";
import EditPetPage from "./Pages/owner/EditPetPage";
import PetDetailAdopter from "./Pages/PetDetailsAdopter";
import PetDetailOwner from "./Pages/owner/PetDetailOwner";
import OwnerChatPage from "./Pages/owner/OwnerChatPage";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ChatBotPage from "./Pages/ChatBotPage";

// 👇 ADD THIS IMPORT
import FloatingChatBot from "./components/FloatingChatBot"; 

const AppWrapper = () => {
  const location = useLocation();
  const noNavbarRoutes = ["/", "/signup", "/login", "/index"];

  return (
    <>
      <ToastContainer position="top-right" />
      
      <SessionChecker>
        {/* Navbar appears only on specific pages */}
        {!noNavbarRoutes.includes(location.pathname) && <NavbarFull />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/index" element={<IndexPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <RoleProtectedRoute allowedRoles={["adopter"]}>
                <HomePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/ownerhome"
            element={
              <RoleProtectedRoute allowedRoles={["owner"]}>
                <OwnerHome />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/AdminHome"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <AdminHome />
              </RoleProtectedRoute>
            }
          />

          {/* Other Routes */}
          <Route path="/addpet" element={<PetAddPage />} />
          <Route path="/ownerbookings" element={<OwnerBookingsPage />} />
          <Route path="/feedbacks" element={<FeedbackList />} />
          <Route path="/shelterbooking" element={<ShelterBookingPage />} />
          <Route path="/vaccination" element={<PetVaccinationPage />} />
          <Route path="/grooming" element={<PetGroomingBookingPage />} />
          <Route path="/petpage" element={<PetPage />} />
          <Route path="/services" element={<PetServicesPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/pets/:id" element={<PetDetailPage />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/adopterpetlist" element={<AdopterPetListPage />} />
          <Route path="/ownerpetlist" element={<OwnerPetListPage />} />
          <Route path="/pets/:id/edit" element={<EditPetPage />} />
          <Route path="/pet/:id" element={<PetDetailAdopter />} />
          <Route path="/owner/pet/:id" element={<PetDetailOwner />} />
          <Route path="/chat/:petId" element={<ChatPage />} />
          <Route path="/owner/chat" element={<OwnerChatPage />} />
          <Route path="/owner/chat/:roomId" element={<OwnerChatPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
          <Route path="/chatbot" element={<ChatBotPage />} />
        </Routes>

        {/* 👇 Add the floating chatbot here so it appears globally */}
        {!["/login", "/signup", "/", "/index"].includes(location.pathname) && (
          <FloatingChatBot />
        )}
      </SessionChecker>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
