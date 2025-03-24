import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import { AuthProvider } from "./contexts/AuthProvider";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetail";
import CreateTournament from "./pages/CreateTournament";
import Testimonials from "./pages/Testimonials";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* Rutas con Layout */}
          <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/tournaments' element={<Tournaments />} />
            <Route path='/tournaments/:id' element={<TournamentDetail />} />
            <Route path='/testimonials' element={<Testimonials />} />
            <Route path='/dashboard' element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
            {/* rutas para administradores */}
            <Route
              path='/admin'
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
             <Route
              path='/create-tournament'
              element={
                <PrivateRoute adminOnly={true}>
                  <CreateTournament />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
        <Toaster position='top-right' />
      </Router>
    </AuthProvider>
  );
}

export default App;
