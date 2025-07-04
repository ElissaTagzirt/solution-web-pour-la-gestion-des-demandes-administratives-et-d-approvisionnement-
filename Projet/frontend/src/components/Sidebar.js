import React, { useState , useEffect } from 'react';
import logo from '../images/logo.png'
import { Link } from 'react-router-dom';
import "../index.css"
import { useAuth } from '../context/AuthContext'; // Importez le hook   

const Sidebar = () => {
  const [nbNotification,setnbNotification]=useState('');
  const [notif,setNotif]=useState(false)

  useEffect(() => {
    // Assurez-vous d'avoir le token avant de faire la requête
    setNotif(false)
    if (token) {
      fetch('http://127.0.0.1:8000/notifications/NbNotification/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setnbNotification(data)
          if (data != 0){setNotif(true)}
          
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des notifications:', error);
        });
    }
  }, []);
  function informBackendOnPageChange() {
    // Envoyez la requête PUT ici
    setNotif(false)
    fetch('http://127.0.0.1:8000/notifications/SetNotificationlu', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',},
      
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (!response.ok) {
          console.error('Erreur lors de la requête vers le backend');
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la requête vers le backend :', error);
      });
  }
  

  const handleLogout = () => {
    logout();
  };
  const { token, logout } = useAuth();
  return (
    <div className="h-screen flex flex-col text-gray-800">

     <div className="w-50 sm:w-60 flex flex-col top-0 left-0 bg-white min-h-screen border-r ">


        <div className="flex items-center ml-6 h-14 border-b">
           <div className="flex m-3">
            <img src={logo} alt="Logo" className="w-7 h-7" />
            <h5 style={{ color: '#52B8B5' }} className="ml-3 text-lg font-semibold">AgriConnect</h5>
            </div>
        </div>
        <div className=" flex-grow">
          <ul className="flex flex-col py-2 space-y-1">
            <li className="px-5">
              <div className="flex flex-row items-center h-8">
              <div className="text-sm font-light tracking-wide text-gray-500 w-48">Menu</div>

              </div>
            </li>
            <li>
              <Link onClick={informBackendOnPageChange} to="/user/mes-demandes" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[#52B8B5] pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Mes Demandes</span>
              </Link>
            </li>
            <li>
              <Link onClick={informBackendOnPageChange} to="/user/demandes-recues" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[#52B8B5] pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Demandes Reçues</span>
              {/*  <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-[#52B8B5] bg-indigo-50 rounded-full">New</span> */}
              </Link>
            </li>
            <li>
                  <Link to="/user/Utilisateurs" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[#52B8B5] pr-6">
                    <span className="inline-flex justify-center items-center ml-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">Utilisateurs</span>
                    
                  </Link>
            </li>
            <li>
              <Link  to="/user/Notifications" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[#52B8B5] pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">Notifications</span>
                {notif && <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">{nbNotification}</span>}
              </Link>
            </li>
            <li className="px-5">
              <div className="flex flex-row items-center h-8">

                    <div className="text-sm font-light tracking-wide text-gray-500">Taches</div>
                  </div>
                </li>
                <li>
                  <Link to="/user/cree-demande" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[#52B8B5] pr-6">
                    <span className="inline-flex justify-center items-center ml-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">Créer Demande</span>
                  </Link>
                </li>
                <li className="px-5">
              <div className="flex flex-row items-center h-8">

                    <div className="text-sm font-light tracking-wide text-gray-500">Autre</div>
                  </div>
                </li>
                
                <li>
                <Link to="/user/profile" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[#52B8B5] pr-6">
                   <span className="inline-flex justify-center items-center ml-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">Profil</span>
                </Link>
                </li>
              
                <li>
                  <button className='w-full'  onClick={handleLogout}>
                  <Link to="/user/Deconnexion" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-[#52B8B5] pr-6">
                   <span className="inline-flex justify-center items-center ml-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </span>
                    <span className="ml-2 text-sm tracking-wide truncate">Deconnexion</span>
                  </Link></button>
                </li>
              </ul>
            </div>
          </div>
     </div>
    );
};

export default Sidebar;