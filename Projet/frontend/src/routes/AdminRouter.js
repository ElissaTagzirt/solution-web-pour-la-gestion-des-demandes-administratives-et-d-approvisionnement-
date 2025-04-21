import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importez BrowserRouter comme Router
import { useAuth } from '../context/AuthContext'; 
import ConsulterDemande from '../components/ConsulterDemande';
import Hierchie from '../Pages/Admin/Hierchie';
import NouvelUtilisateur from '../Pages/Admin/AjouterUser';
import UsersAdmin from '../Pages/Admin/UsersAdmin';
import ConsulterUtilisateur from '../components/ConsulterUtilisateur';
import SidebarAdmin from '../components/SidebarAdmin';
import ConsulterDemandesUser from '../Pages/Admin/ConsulterDemandesAdmin';
import OutilsDemande from '../Pages/Admin/OutilsDemande';
import ConsulterDemandesArchivie from '../Pages/Admin/ConulterDemandearchivie';
import DemandesAdmissionUsers from '../Pages/Admin/DemandesAdmissionUsers';
function AdminRoutes() {
  const { token } = useAuth();

  return (
    <div className="flex h-screen">
      {token && <SidebarAdmin />}
      {/* Sidebar (Affichée après l'authentification) */}
      <div className={`flex-grow overflow-y-auto ${token ? 'mb-1' : ''}`}>
        <Routes>
          {token && (
            <>
              <Route path="/ConsulterDemande/:id" element={<ConsulterDemande/>} />
              <Route path="/ConsulterDemandesUser" element={<ConsulterDemandesUser/>} />
              <Route path="/Outils" element={<OutilsDemande/>} />
              <Route path="/structure-organisationnelle" element={<Hierchie/>} />
              <Route path='/NouvelUtilisateur' element={<NouvelUtilisateur />} />
              <Route path='/ConsulterUsers' element={<UsersAdmin />} />
              <Route path='/ConsulterUser/:id' element={<ConsulterUtilisateur />} />
              <Route path='/ConsulterDemandesArchivie' element={<ConsulterDemandesArchivie/>}/>
              <Route path='/AdmissionUtilisateurs' element={<DemandesAdmissionUsers/>}/>
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default AdminRoutes;
