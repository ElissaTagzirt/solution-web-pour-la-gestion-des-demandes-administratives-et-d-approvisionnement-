import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminRoutes from './AdminRouter';
import UserRoutes from './UserRouter';
import Authentification from '../Pages/Authentification';
import ChooseRole from '../Pages/ChooseRole';
import AjouterDemandeAdmission from '../Pages/SansAuthentification/AjouterDemandeAdmission'
function AppRouter() {
  const { token , isAdmin } = useAuth();

  return (
      <div>
        <Routes>
          <Route path="/auth" element={<Authentification />} />
          <Route path="/DemandeAdmissionUser"  element={<AjouterDemandeAdmission/>}/> 
          {!token && <Route path="/*" element={<Navigate to="/auth" />} />}
          {token && (
            <>
              <Route path="/choose-role" element={<ChooseRole />} /> 
              <Route path="/user/*" element={<UserRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </>
          )}
       </Routes>
    </div>
  
      
  );
}



export default AppRouter;
