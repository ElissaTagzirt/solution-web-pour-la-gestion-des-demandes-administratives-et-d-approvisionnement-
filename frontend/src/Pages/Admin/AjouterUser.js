import React, { useState , useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
const NouvelUtilisateur = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [numeroDeTelephone, setNumeroDeTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [user,setUser]=useState('');  
  const [DateNaissance,setDateNaissance]=useState('');
  const [erreur, setErreur] = useState('');
  const [deuxiemePartie,setDeuxiemePartie]=useState(false)
  const { token } = useAuth();
  
  //-------------- pour la deuxiem partie -----------------------
        const [Sieges , setSieges]=useState([]);
        const [Services , setServices]=useState([]);
        const [Postes , setPostes]=useState([]);

         // Ajouter un nouvelle poste 
         const [siege, setSiege] = useState(0);
         const [service, setService] = useState(0);
         const [poste, setPoste] = useState(0);
         const [dateDebutTravail,setDateDebutTravail]=useState("");
         const [Messagepost,setMessagepsot]=useState(""); 
         const [postchange , setpostchange]=useState(false);
         const[Alljobs,setAlljobs]=useState([]);
      
          // Pour signale des erreurs 
          const [siegeError, setSiegeError] = useState('');
          const [serviceError, setServiceError] = useState('');
          const [posteError, setPosteError] = useState('');
          const [dateDebutTravailError, setDateDebutTravailError] = useState('');
          
          const [listdata , setlistedate]=useState('')
 //------------------------Pour ajouter un nouveau poste a user  ------------------------
 const handleAnnulePoste = (e) => {
    e.preventDefault();
    setSiege(0);
    setService(0);
    setPoste(0);
    setDateDebutTravail('');
    setMessagepsot('');    
  }
const handleClickAddPoste = (e) => {
e.preventDefault();
 // Vérification des champs requis
        if (!siege) {
            setSiegeError('Champ obligatoire');
        } else {
            setSiegeError('');
        }

        if (!service) {
            setServiceError('Champ obligatoire');
        } else {
            setServiceError('');
        }

        if (!poste) {
            setPosteError('Champ obligatoire');
        } else {
            setPosteError('');
        }

        if (!dateDebutTravail) {
            setDateDebutTravailError('Champ obligatoire');
        } else {
            setDateDebutTravailError('');
        }
if (siege && service && poste && dateDebutTravail) {
            // Envoyer la requête
          
// Envoi de la requête au backend
fetch('http://127.0.0.1:8000/travail/create/', {
 method: 'POST', // Vous pouvez utiliser la méthode appropriée
 headers: {
   'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Assurez-vous d'ajouter le token d'authentification
 },
 body: JSON.stringify({ IDUser: user.IDUser,
    IDService: service,
    IDSiege: siege,
    IDPoste: poste,
    AnneeDebutTravail: dateDebutTravail})
})
 .then(response => {
   if (!response.ok) { 
     setMessagepsot('La requête n\'a pas abouti');
   }
   return response.json();
 })
 .then(responseData => {
   // Gérer la réponse du backend ici (par exemple, afficher un message de succès)
   
   setlistedate(responseData)
   setpostchange(true);
   setMessagepsot('Entite ajoute avec succees');
   setSiege(0);
    setService(0);
    setPoste(0);
    setDateDebutTravail('');
    setMessagepsot('');
    console.log(listdata) ;
    handleButtonClickHistorique(e) ;
 })
 .catch(error => {
   console.error(error.detail);
   
   // Gérer les erreurs ici (par exemple, afficher un message d'erreur)
 });
}
};





         useEffect(() => {
            const fetchSieges = () => {
              fetch('http://127.0.0.1:8000/siege/All-Sieges/', {
                headers: {
                    Authorization: `Bearer ${token}` // Ajoutez le token aux en-têtes de la requête
                }
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('La requête n\'a pas abouti');
                  }
                  return response.json();
                })
                .then(newData => {
                  //console.log('Nouvelles données reçues :', newData);
                  setSieges(newData); // Mettre à jour l'état avec les nouvelles données
                })
                .catch(error => {
                  console.error('Erreur lors de la récupération des données :', error);
                });
            };
            const fetchPostes = () => {
              fetch('http://127.0.0.1:8000/poste/All-poste/', {
                headers: {
                  Authorization: `Bearer ${token}` // Ajoutez le token aux en-têtes de la requête
                }
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('La requête n\'a pas abouti');
                  }
                  return response.json();
                })
                .then(newData => {
                 // console.log('Nouvelles données reçues :', newData);
                  setPostes(newData); // Mettre à jour l'état avec les nouvelles données
                })
                .catch(error => {
                  console.error('Erreur lors de la récupération des données :', error);
                });
            };
            const fetchServices = () => {
              fetch('http://127.0.0.1:8000/service/', {
                headers: {
                  Authorization: `Bearer ${token}` // Ajoutez le token aux en-têtes de la requête
                }
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('La requête n\'a pas abouti');
                  }
                  return response.json();
                })
                .then(newData => {
                 // console.log('Nouvelles données reçues :', newData);
                  setServices(newData); // Mettre à jour l'état avec les nouvelles données
                })
                .catch(error => {
                  console.error('Erreur lors de la récupération des données :', error);
                });
            };
          
            fetchSieges();
            fetchPostes();
            fetchServices();
          }, []); 
     const soumettreFormulaire = (e) => {
            e.preventDefault();     
    // Construire l'objet de données à envoyer
    const formData = {
      name: nom,
      email: email,
      numeroDeTelephone: numeroDeTelephone,
      adresse: adresse,
      hashed_password: motDePasse,
      dateNaissance : DateNaissance,
    };

    // Effectuer la requête POST vers le backend
    fetch('http://127.0.0.1:8000/Admin/createUser', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la requête');
        }
        return response.json();
      })
      .then((data) => {
        // Traitez la réponse du serveur ici si nécessaire
        console.log('Réponse du serveur :', data);
        if (data.detail){
            setErreur(data.detail)
            
        }else{
        setUser(data);
        setDeuxiemePartie(true);
        // Réinitialisez les champs du formulaire
        setNom('');
        setEmail('');
        setNumeroDeTelephone('');
        setAdresse('');
        setMotDePasse('');}
        // Affichez un message de succès ou redirigez l'utilisateur
      })
      .catch((error) => {
        console.error('Erreur :', error);
        setErreur('Une erreur s\'est produite lors de la création de l\'utilisateur.');
      });
  };
  function sortJobsByDate(Alljobs) {
    return Alljobs.sort((a, b) => {
      if (a.AnneeFinTravail == null && b.AnneeFinTravail == null) {
        return Date(b.AnneeDebutTravail)  - new Date(a.AnneeDebutTravail)
      }
      if (a.AnneeFinTravail == null && b.AnneeFinTravail != null) {
        return -1
      }
      if (a.AnneeFinTravail != null && b.AnneeFinTravail == null) {
        return 1
      }
      if (a.AnneeFinTravail != null && b.AnneeFinTravail != null) {
        return Date(b.AnneeFinTravail)  - new Date(a.AnneeFinTravail)
      }
    });
  }
  
  //-------------------------------------------------------------------------------------
  const handleButtonClickHistorique = (e) => {
    e.preventDefault()

    // Effectuer une requête HTTP à l'API
    fetch(`http://127.0.0.1:8000/travail/Alljobs/${user.IDUser}`, {
      method: 'GET', // Vous pouvez spécifier la méthode HTTP que vous souhaitez (GET, POST, etc.)
      headers: {
        // Ajoutez des en-têtes si nécessaire, par exemple, pour l'authentification
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('La requête n\'a pas abouti');
        }
        return response.json();
      })
      .then(newData => {
        // Mettre à jour l'état avec les nouvelles données
        setAlljobs(newData)
        console.log(Alljobs);
      })
      .catch(error => {
        // Gérer les erreurs en cas de problème lors de la requête
        console.error('Erreur lors de la récupération des données :', error);
      });
  };
  const sortedJobs = sortJobsByDate(Alljobs);

  return (
    <div>
       { !deuxiemePartie ? (
    <div className="min-h-screen flex m-6 items-center justify-center">
      <div className="mb:w-2/3 w-full p-6 bg-[#F5F5F5] rounded-lg shadow-md">
        <h1 style={{ color: '#52B8B5' }} className="text-2xl font-bold mb-4">Ajouter un nouvel utilisateur</h1>
        <form className="">
          <div className='grid my-4 grid-cols-1 md:grid-cols-1 gap-3'>
            <div className="">
              <label className="block text-sm font-medium text-gray-500">Nom</label>
              <input
                type="text"
                className="mt-2 p-2 block shadow w-full text-gray-500 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-500">Date Naissance</label>
              <input
                type="date"
                className="mt-2 p-2 block shadow w-full text-gray-500 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={DateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                required
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <input
                type="email"
                className="mt-2 p-2 block shadow w-full text-gray-500 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-500">Numéro de téléphone</label>
              <input
                type="text"
                className="mt-2 p-2 block shadow w-full text-gray-500 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={numeroDeTelephone}
                onChange={(e) => setNumeroDeTelephone(e.target.value)}
                required
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-500">Adresse</label>
              <input
                type="text"
                className="mt-2 p-2 block shadow w-full text-gray-500 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                required
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-500">Mot de passe</label>
              <input
                type="password"
                className="mt-2 p-2 block shadow w-full text-gray-500 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />
            </div>
          </div>
          {erreur && (
            <p className="text-sm text-red-500 mb-4 ml-auto">{erreur}</p>
            )}
          <div className='md:col-span-2 m-3 '>
        
            <button
              type="submit"
              onClick={soumettreFormulaire}
              className="inline-block px-4 mx-4 shadow py-2 bg-[#52B8B5] text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right"
            >
              Ajouter Utilisateur
            </button>

            <button
              type="submit"
              onClick={(e)=>{
                e.preventDefault();
                setNom('');
                setEmail('');
                setNumeroDeTelephone('');
                setAdresse('');
                setMotDePasse('');
                setErreur('')
            }}
              className="inline-block px-4 shadow py-2 bg-[#52B8B5] text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right"
            >
              Annuler
            </button>
            
          </div>
        </form>
      </div>
    </div>):<div>
    <div className="my-8 pl-8 ">
  <h1 className="text-2xl font-bold text-teal-500">Créez une nouvelle affectation de travail :</h1>
  <div className="shadow bg-[#F5F5F5] rounded-lg shadow-md rounded m-8">
    <form className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-500 font-medium">Siège</label>
          <select
            className="mt-1 p-2 shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={siege}
            onChange={(e) => setSiege(e.target.value)}
            required
          > <option value="">Siège</option>
            {Sieges.map((sg) => (
              <option key={sg.IDSiege} value={sg.IDSiege}>
                {sg.NomSiege}
              </option>
            ))}
          </select>
          {siegeError && <p className="text-red-500">Champ obligatoire</p>}
        </div>

        <div>
          <label className="block text-gray-500 font-medium">Service</label>
          <select
            className="mt-1 p-2 shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          >
            <option value="">Service</option>
            {Services.map((sv) => (
              <option key={sv.IDService} value={sv.IDService}>
                {sv.NomService}
              </option>
            ))}
          </select>
          {serviceError && <p className="text-red-500">Champ obligatoire</p>}
        </div>

        <div>
          <label className="block text-gray-500 font-medium">Poste</label>
          <select
            className="mt-1 p-2 shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={poste}
            onChange={(e) => setPoste(e.target.value)}
            required
          >
            <option value="">Poste</option>
            {Postes.map((ps) => (
              
              <option key={ps.IDPoste} value={ps.IDPoste}>
                {ps.NomPoste}
              </option>
            ))}
          </select>
          {posteError && <p className="text-red-500">Champ obligatoire</p>}
        </div>

        <div>
          <label className="block text-gray-500 font-medium">Date début de travail</label>
          <input
            type="date"
            className="mt-1 p-2 shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={dateDebutTravail}
            onChange={(e) => setDateDebutTravail(e.target.value)}
            required
          />
          {dateDebutTravailError && <p className="text-red-500">Champ obligatoire</p>}
        </div>
      </div>

      {Messagepost.detail && (
        <p className="text-sm text-right mr-4" style={{ color: 'red' }}>
          {Messagepost.detail}
        </p>
      )}
      {Messagepost && (
        <p className="text-sm text-right mr-4" style={{ color: 'green' }}>
          {Messagepost}
        </p>
      )}

      <div className="flex justify-end mb-2 mt-6 ml-4">
        <button
          onClick={handleAnnulePoste}
          className="bg-teal-500 mr-3 justify-end hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Annuler
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            handleClickAddPoste(e);
            
  
          }}
          
          className="bg-teal-500 justify-end  hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Valider
        </button>
      </div>
    </form>
  </div>
   </div>
   <div>
                    <p className="text-base font-semibold m-4 leading-none text-gray-400">
                    les attributions de travail établies:
                    </p> 
                    <div className="flex flex-col rounded shadow  bg-opacity-5 p-4 m-2 ">
                        <div className="overflow-x-auto  sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                                <table
                                className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
                                <thead className="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                    <th
                                        scope="col"
                                        className="border-r px-6 py-4 dark:border-neutral-500">
                                        #
                                    </th>
                                    <th
                                        scope="col"
                                        className="border-r px-6 py-4 dark:border-neutral-500">
                                        titre de poste
                                    </th>
                                    <th
                                        scope="col"
                                        className="border-r px-6 py-4 dark:border-neutral-500">
                                        Service
                                    </th>
                                    <th
                                        scope="col"
                                        className="border-r px-6 py-4 dark:border-neutral-500">
                                        Siége
                                    </th>
                                    <th
                                        scope="col"
                                        className="border-r px-6 py-4 dark:border-neutral-500">
                                         Début d'emploi
                                    </th>
                                    <th
                                        scope="col"
                                        className="border-r px-6 py-4 dark:border-neutral-500">
                                        Fin d'emploi
                                    </th>
                                    </tr>
                                </thead>
                                <tbody>
                               
                                {sortedJobs.map((alljob) => (   
                                       <tr className="border-b dark:border-neutral-500" key={alljob.IDRelation}>
                                    <td
                                        className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                        {alljob.IDRelation}
                                    </td>
                                    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-6 py-4">{alljob.NomPoste}</td>
                                    <td
                                        className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                                        {alljob.NomService}
                                    </td>
                                    <td
                                        className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                                       {alljob.NomSiege}
                                    </td>
                                    <td className="whitespace-nowrap border-r  dark:border-neutral-500 px-6 py-4">{alljob.AnneeDebutTravail}</td>
                                    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-6 py-4">{alljob.AnneeFinTravail}</td>
                                   
                                    </tr> ))}
                                    
                                   
                                </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
 

                <div className="flex mr-10 mt-4 justify-end">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDeuxiemePartie(false);
                    }}
                    className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Valider
                  </button>
                </div>

        </div>
        
        }</div>
  );
};

export default NouvelUtilisateur;
