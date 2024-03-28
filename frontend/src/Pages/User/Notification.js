// Notifications.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const Notifications = () => {
const [Newnotifications, setNewNotifications] = useState([]);
const [Lastnotifications, setLastNotifications] = useState([]);
const [NotifactionUpdated, setNotifactionUpdated]=useState(false);

  
const { token } = useAuth();


useEffect(() => {
  // Assurez-vous d'avoir le token avant de faire la requête
  setNotifactionUpdated(false)
  if (token) {
    fetch('http://127.0.0.1:8000/notifications/GetNotifications', {
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
        // Triez les notifications par date de création de la plus récente à la plus ancienne
        const sortedNotifications = data.NewNotifs.sort((a, b) => {
          return new Date(b.DateEnvoi) - new Date(a.DateEnvoi);
        });
        const sortLastedNotifications = data.LastNotifs.sort((a, b) => {
            return new Date(b.DateEnvoi) - new Date(a.DateEnvoi);
          });
         console.log(data.NewNotifs)
         console.log(data.LastNotifs)
        // Mettez à jour l'état avec les données triées
        setNewNotifications(sortedNotifications);
        setLastNotifications(sortLastedNotifications)
        
        
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des notifications:', error);
      });
  }
}, [NotifactionUpdated]);





  



  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function ArchiveNotification(IDNotification) {
   
    const url = `http://127.0.0.1:8000/notifications/notifications/update_status/${IDNotification}/2`;
    const requestOptions = {
      
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };
  
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('La requête n\'a pas abouti');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Mise à jour réussie', data.message);
        setNotifactionUpdated(true)
        if (data.detail){ console.error('Erreur lors de la mise à jour :', data.detail); }
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour :', error);
      });
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center py-4 border-b mb-5 pl-8">
                <p className="text-3xl font-medium mt-5 leading-none text-teal-500">
                Notifications
                </p>
            </div>
    {Newnotifications.map((notification) => (  
    <ul className='bg-teal-100 rounded-lg p-3 m-2' key={notification.IDNotification}>
     <li className="border border-gray-300 p-2 rounded-lg  flex items-center">
        <div>
            <p className="text-lg ml-2 font-medium text-gray-500">{notification.ContenuNotif}</p>
            <p className="text-gray-600 ml-2 ">{formatDate(notification.DateEnvoi)}</p>
        </div>
        <div className="ml-auto">
            <button 
             onClick={(e) => {
               e.preventDefault();
               ArchiveNotification(notification.IDNotification) 
              }}
            className="bg-teal-500 text-white p-1 mr-3 rounded-full hover:bg-teal-800">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-7 h-7"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
            </svg>
            </button>
        </div>
        </li>


      </ul> ))}
      {Lastnotifications.map((notification) => (  
    <ul className='bg-gray-50 rounded-lg p-3 m-2' key={notification.IDNotification}>
     <li className="border border-gray-300 p-2 rounded-lg  flex items-center">
        <div>
            <p className="text-lg ml-2 font-medium text-gray-500">{notification.ContenuNotif}</p>
            <p className="text-gray-600 ml-2 ">{formatDate(notification.DateEnvoi)}</p>
        </div>
        <div className="ml-auto">
            <button 
             onClick={(e) => {
               e.preventDefault();
               ArchiveNotification(notification.IDNotification) 
              }}
            className="bg-teal-500 text-white p-1 mr-3 rounded-full hover:bg-teal-800">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-7 h-7"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
            </svg>
            </button>
        </div>
        </li>


      </ul> ))}
    </div>
  );
};

export default Notifications;
