import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Importez Routes et Route, pas BrowserRouter
import { useAuth } from '../context/AuthContext'; 
import NouvelleDemande from '../Pages/User/CreeDemande';
import DemandesRecues from '../Pages/User/DemandesRecues';
import ConsulterMesdemandes from '../Pages/User/ConsulterMesdemandes';
import UserProfile from '../Pages/User/Profile' ; 
import Sidebar from '../components/Sidebar';
import NewOutil from '../components/NewOutil';
import ConsulterMaDemande from '../components/ConsulterMaDemande';
import ModifieMaDemande from '../components/ModifieMaDemande';
import ConsulterDemande from '../components/ConsulterDemande';
import Utilisateur from '../Pages/User/Utilisateurs';
import Notifications from '../Pages/User/Notification';


function UserRoutes() {
  const { token } = useAuth();

  return (
    <div className="flex h-screen">
      {token && <Sidebar />}
      {/* Sidebar (Affichée après l'authentification) */}
      <div className={`flex-grow overflow-y-auto ${token ? 'mb-1' : ''}`}>
        <Routes>
          {token && (
            <>
              <Route path="/cree-demande" element={<NouvelleDemande />} />
              <Route path="/demandes-recues" element={<DemandesRecues />} />
              <Route path="/mes-demandes" element={<ConsulterMesdemandes />} />

              <Route path="/profile" element={<UserProfile />} />
              <Route path="/user/Ajouter_outils" element={<NewOutil />} />
              <Route path="/ConsulterMaDemande/:id" element={<ConsulterMaDemande />} />
              <Route path="/ModifieMaDemande/:demandeId" element={<ModifieMaDemande/>} />
              <Route path="/ConsulterDemande/:id" element={<ConsulterDemande />} />
              <Route path='/Utilisateurs' element={<Utilisateur />} />
              <Route path='/Notifications' element={<Notifications />} />
              
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default UserRoutes;
