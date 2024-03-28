// ChooseRole.js
import React , {useEffect} from 'react';
import {  useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ChooseRole() {
  const navigate = useNavigate();
  const { token , setIsAdmin , connected  } = useAuth();


  useEffect(() => {
    const fetchData = async (token,setIsAdmin) => {
      
  
      try {
        const response = await fetch('http://127.0.0.1:8000/users/TypeUser/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data);
          if (data ==false){
            navigate('/user/mes-demandes')
        }
        } else {
          setIsAdmin(false);
          console.error('Erreur de requête');
        }
      } catch (error) {
        setIsAdmin(false);
        console.error(error);
      }
    };
  
    fetchData(token, setIsAdmin);
  }, [token]);
  

  const handleRoleSelection = (role) => {
    if (role === 'admin') {
      navigate('/admin/ConsulterDemandesUser'); // Redirige vers la page d'administration
    } else {
      navigate('/user/mes-demandes'); // Redirige vers la page utilisateur
    }
  };

  return (<div >
  { connected && (
<div className="flex justify-center items-center h-screen bg-gray-900 bg-opacity-10 ">
  <div className="text-center p-10 shadow rounded-lg bg-teal-100 bg-opacity-35">
    <div className="flex flex-col items-center ">
      <h2 className="mb-4 text-teal-700 text-2xl font-semibold">Choisissez votre rôle :</h2>
      <div className="mb-2">
        <button
          onClick={() => handleRoleSelection('admin')}
          className="bg-teal-500 text-white px-4 mt-4 py-2 rounded-md hover:bg-teal-600 focus:outline-none focus:ring focus:ring-teal-200"
        >
          <div className="flex  items-center"> 
            Administrateur
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 ml-4 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
        </button>
      </div>
      <div>
        <button
          onClick={() => handleRoleSelection('user')}
          className="bg-teal-500 text-white px-8 mt-4 py-2 rounded-md hover:bg-teal-600 focus:outline-none focus:ring focus:ring-teal-200"
        >
          <div className="flex items-center">
            Utilisateur
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6  ml-4 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  </div>
</div>
)}
</div>



  );
}

export default ChooseRole;
