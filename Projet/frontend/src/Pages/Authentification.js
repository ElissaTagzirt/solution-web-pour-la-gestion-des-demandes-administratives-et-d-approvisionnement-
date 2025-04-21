import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importez useHistory
import pic1 from "../images/image1.jpg"
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Authentification = () => {
     // Initialisez useHistory

  const { login ,isAdmin  } = useAuth();

  // Définissez des états pour les champs de saisie
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Vous devrez définir ceci en fonction de l'authentification réussie


    
  // Gérez les modifications des champs de saisie
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Gérez la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche la soumission par défaut du formulaire
    
    // Créez un objet avec les données du formulaire
    const formData = {
      username: username,
      password: password,
    };
    

    // Envoyez les données au backend (vous devez implémenter cette partie)
    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(
          `grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`
          
        ),
      });

      if (response.ok) {
        // Traitez la réponse du backend si nécessaire
        const data = await response.json();
        const accessToken = data.access_token;
        login(accessToken);
        console.log(accessToken)
        setIsAuthenticated(true);
        console.log(isAdmin)

        navigate('/choose-role'); 
             
      } else {
        // Gérez les erreurs
        console.error('Erreur lors de la requête vers le backend');
      }
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
    }
  };

    return (
  
    <div className="bg-white dark:bg-teal-950">
      <div className="flex justify-center h-screen">
        <div className="hidden bg-cover lg:block lg:w-2/3" style={{ backgroundImage:  `url(${pic1})`  }}>
          <div className="flex items-center h-full px-20 bg-teal-900 bg-opacity-40">
            <div>
              <h2 className="text-6xl font-bold ml-9 mb-12 text-white">AgriConnect</h2>
              <p className="max-w-lg mt-3 ml-9 mr-4 text-white leading-relaxed">
              Simplifiez la communication entre les différents services de la CRMA grâce à notre application conviviale.
               Gérez efficacement les demandes des différents bureaux et coordonnez en toute simplicité. 
               AgriConnect, l'outil essentiel pour une gestion fluide de votre exploitation.
               Rejoignez-nous dès aujourd'hui et transformez votre façon de travailler dans le monde de l'agriculture
                </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-3/6">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">AgriConnect</h2>
              <p className="mt-3 text-gray-500 dark:text-gray-300">Connectez-vous pour accéder à votre compte</p>
            </div>

            <div className="mt-8">
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Adresse email</label>
                  <input    type="text"
                            name="email"
                            id="email"
                            placeholder="example@example.com"
                            value={username}
                            onChange={handleUsernameChange}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-teal-400 dark:focus:border-teal-400 focus:ring-teal-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-200">Mot de passe</label>
                  </div>

                  <input    type="password"
                            name="password"
                            id="password"
                            placeholder="Your Password"
                            value={password}
                            onChange={handlePasswordChange}
                   className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-teal-400 dark:focus:border-teal-400 focus:ring-teal-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                </div>

                <div className="mt-6">
                 <button  type="submit"
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-teal-500 rounded-md hover:bg-teal-400 focus:outline-none focus:bg-teal-400 focus:ring focus:ring-teal-300 focus:ring-opacity-50"
                  >
                    Connexion
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm text-center text-gray-400">Vous n'avez pas encore de compte? <Link to="/DemandeAdmissionUser" className="text-teal-500 focus:outline-none focus:underline hover:underline"> Inscrivez-vous</Link>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentification;
