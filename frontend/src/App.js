import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import OwnerDashboard from './pages/OwnerDashboard';
import CreateProperty from './pages/CreateProperty';
import EditProperty from './pages/EditProperty';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />

          {/* Owner Protected Routes */}
          <Route
            path="/dashboard/owner"
            element={
              <ProtectedRoute ownerOnly={true}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/create"
            element={
              <ProtectedRoute ownerOnly={true}>
                <CreateProperty />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/edit/:id"
            element={
              <ProtectedRoute ownerOnly={true}>
                <EditProperty />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;