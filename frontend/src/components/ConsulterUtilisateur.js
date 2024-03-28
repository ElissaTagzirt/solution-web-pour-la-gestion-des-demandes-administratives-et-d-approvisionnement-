import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const ConsulterUtilisateur = () => {

  const navigate = useNavigate();
  const { token } = useAuth();
  const { id: IDUser } = useParams();

  const [userData, setUserData] = useState(null);
  const [datauserchange , setDatauserchange]=useState(false);
  const [erreur ,setErreur]=useState('');
  const [reponseUpdate , setReponseUpdate]=useState('')
  const [pagedeux,setpagedeux]=useState(false);
  const [Alljobs,setAlljobs]=useState([]);
  const [fintravail,setfintrvail]=useState(false);
  const [datefinTravail,setDatefinTravail]=useState(""); 
  const [casechange,setcasechnage]=useState(0);


// ----------------- changer le statue de l'utilisateur Administrateur / utilisateur ----------------------
  const [StatueUser , setStatueUser]=useState(0);
  //-------------- pour la deuxiem partie // pour cree une nouvelle afiliation pour l'utilisateur ---------------------------------------------------------------------------
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

  // Pour signale des erreurs 
  const [siegeError, setSiegeError] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [posteError, setPosteError] = useState('');
  const [dateDebutTravailError, setDateDebutTravailError] = useState('');

  
  //------ c'est pour importe les sieges services et postes-----------------------
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



  //-------------------------------------------------------------------------------
const sortedJobs = sortJobsByDate(Alljobs);

 // ------------------- pour recupere l'historique des poste de trvaille et les donnee de user 
  useEffect(() => {
    const fetchData = () => {
      // Remplacez l'URL par celle de votre backend pour récupérer les données de l'utilisateur.
      fetch(`http://127.0.0.1:8000/Admin/Get_user/${IDUser}`,{ headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error("La requête n'a pas abouti.");
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data);
          setDatauserchange(false)
        })
        .catch((error) => {
          console.error(error);
        });
    };
    fetchData();
    
  }, [datauserchange]);
  useEffect (()=>{
   handleButtonClickHistorique();
   setpostchange(false)  
  },[postchange])

  const handleButtonClickHistorique = () => {
    // Effectuer une requête HTTP à l'API
    fetch(`http://127.0.0.1:8000/travail/Alljobs/${IDUser}`, {
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
      })
      .catch(error => {
        // Gérer les erreurs en cas de problème lors de la requête
        console.error('Erreur lors de la récupération des données :', error);
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
  
//---------------------- pour mettre ajour les information de l'utilisateur --------------------------  

  const [updatedData, setUpdatedData] = useState(
        {
        IDUser :IDUser,    
        name: '',
        email: '',
        numeroDeTelephone :'',
        dateNaissance:'',
        adresse:'',}
        );
    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUpdatedData({
        ...updatedData,
        [name]: value,
      });
    };
    
    const updateUser = () => {
        const apiUrl = `http://127.0.0.1:8000/Admin/update-info/${IDUser}`;
        
        
        const requestOptions = {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          
          body: JSON.stringify({
            numeroDeTelephone: updatedData.numeroDeTelephone,
            adresse: updatedData.adresse,
            name: updatedData.name,
            email: updatedData.email,
            dateNaissance : updatedData.dateNaissance,
          })
        };
      
        fetch(apiUrl, requestOptions)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            
            if (data.message){
            console.log('Données mises à jour avec succès :', data.message);
            setReponseUpdate("Modifications mises à jour avec succès");   
            setDatauserchange(true)
        }else if (data.detail){
                setErreur("L'email introduit appartient déjà à une personne")
            }
            // Vous pouvez ajouter ici un code pour gérer la réponse de la mise à jour si nécessaire.
          })
          .catch(error => {
            console.error('Erreur lors de la mise à jour des données :', error);
            // Vous pouvez ajouter ici un code pour gérer les erreurs si nécessaire.
          });
      };

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
         body: JSON.stringify({ IDUser: IDUser,
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
           
          // setlistedate(responseData)
           setpostchange(true);
           setMessagepsot('Entite ajoute avec succees');
           setSiege(0);
            setService(0);
            setPoste(0);
            setDateDebutTravail('');
            setMessagepsot('');
            handleButtonClickHistorique(e) ;
         })
         .catch(error => {
           console.error(error.detail);
           
           // Gérer les erreurs ici (par exemple, afficher un message d'erreur)
         });
        }
        };
    const handleAnnulePoste = (e) => {
        e.preventDefault();
        setSiege(0);
        setService(0);
        setPoste(0);
        setDateDebutTravail('');
        setMessagepsot('');    
      }

      const handeleChangeStatuUser = (e) => {
       e.preventDefault();
        const data = {
          typeUser: false,
        };
        
        if (StatueUser == 1) {
          data.typeUser = true;
        }
      
      
        fetch(`http://127.0.0.1:8000/Admin/ChangeStatueUser/${userData.IDUser}/?IDuser=${userData.IDUser}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then(response => {
            if (response.status === 200) {
              console.log('Type modifié avec succès');
              
              setDatauserchange(true);
              // Ajoutez ici le code pour gérer la réussite de la modification
            } else if (response.status === 401) {
              console.error('Action non autorisée');
              // Ajoutez ici le code pour gérer l'action non autorisée
            } else if (response.status === 404) {
              console.error('Utilisateur non trouvé');
              // Ajoutez ici le code pour gérer l'utilisateur non trouvé
            } else {
              console.error('Erreur lors de la modification du type');
              // Ajoutez ici le code pour gérer d'autres erreurs éventuelles
            }
            console.log(response);
          })
          .catch(error => {
            console.error('Erreur lors de la requête :', error);
            // Ajoutez ici le code pour gérer les erreurs de requête
          });
      };


      
 //------------------------ Pour updtae la date de depart ----------------------------------------
 function updateTravail(idrelation) {
    const url = "http://127.0.0.1:8000/travail/update/";
    
    const requestOptions = {
      
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({IDRelation: idrelation  , datedepart : datefinTravail}),
    };
  
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
         // throw new Error('La requête n\'a pas abouti');
        }
        return response.json();
      })
      .then((data) => {
        if (data.detail){ console.error('Erreur lors de la mise à jour :', data.detail);
        setDatefinTravail("");
        setfintrvail(false);
      }
       
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour :', error.detail);
        
      });
      
  }

  //-----------------------Pour supprimer un poste -----------------------------------------
  function deleteItem(itemId) {
    const url = `http://127.0.0.1:8000/travail/delete/${itemId}`;
    
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
       }
    })
      .then(response => {
        if (response.status === 204) {
          console.log('Suppression réussie !');
        } else {
          console.error('Échec de la suppression.');
        }
        console.log(response);
        setpostchange(true);
      })
      .catch(error => {
        console.error('Erreur lors de la requête :', error);
      });
  }
  //----------------------- Supprimer l'utilisateur -----------------------------------------------------
  function handleDeleteUser(e) {
    e.preventDefault();
  
   
    fetch(`http://127.0.0.1:8000/Admin/delete_user/${userData.IDUser}`, {
      method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
         },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('La suppression de l\'utilisateur a échoué');
        }
        return response.json();
      })
      .then(data => {
        // Traitement des données de réponse ici si nécessaire
        console.log('Utilisateur supprimé avec succès', data);
        navigate('/admin/ConsulterUsers')
      })
      .catch(error => {
        // Gestion des erreurs ici
        console.error('Erreur lors de la suppression de l\'utilisateur', error);
      });
  }
  
           
      
      // Vous pouvez appeler cette fonction lorsque vous souhaitez mettre à jour les données de l'utilisateur.
      

  return (<div>
    { userData && <div>
   {  ( !pagedeux ) ?( <div>
      
        <div className="shadow rounded m-4">
          <div className="flex items-center my-4 pl-8">
            <p className="text-2xl font-medium mt-5 leading-none text-teal-500">
              Profil de l'utilisateur :
            </p>
          </div>
          <div className="w-8/9 m-2">
            <table className="w-full text-sm font-light">
              <tbody>
                <tr>
                  <td className="whitespace-nowrap text-gray-500 px-6 py-4 font-medium">
                    ID de l'utilisateur :
                  </td>
                  <td className="whitespace-pre-wrap px-6 py-4">
                    {userData.IDUser}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">
                    Nom :
                  </td>
                  <td className="whitespace-pre-wrap px-6 py-4">
                    {userData.name}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">
                    Date de naissance :
                  </td>
                  <td className="whitespace-pre-wrap px-6 py-4">
                    {userData.dateNaissance}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">
                    Email :
                  </td>
                  <td className="whitespace-pre-wrap px-6 py-4">
                    {userData.email}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">
                    Numéro de téléphone :
                  </td>
                  <td className="whitespace-pre-wrap px-6 py-4">
                    {userData.numeroDeTelephone}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">
                    Adresse :
                  </td>
                  <td className="whitespace-pre-wrap px-6 py-4">
                    {userData.adresse}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">
                    Type d'utilisateur :
                  </td>
                  <td className="whitespace-pre-wrap px-6 py-4">
                    {userData.typeUser ? "Administrateur" : "Utilisateur"}
                </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end w-full pr-6 m-4 ">
            <button
                onClick={() => {
                // Naviguer vers une autre page, par exemple la liste des utilisateurs.
                navigate("/admin/ConsulterUsers");
                }}
                className="flex-shrink-0 m-4 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="submit"
            >
                Retour
            </button>

            <button
                onClick={(e) => {
                e.preventDefault();
                setpagedeux(true);
                fetchPostes();
                fetchSieges();
                fetchServices();
                setUpdatedData({name: userData.name,
                email: userData.email,
                numeroDeTelephone :userData.numeroDeTelephone,
                dateNaissance:userData.dateNaissance,
                adresse:userData.adresse,})
                }}
                className="flex-shrink-0 m-4 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="submit"
            >
                Réglage 
            </button>
         </div>

        </div>
      

          <div>
                    
                    <div className="flex flex-col rounded shadow bg-opacity-5 p-4 mt-6 m-4 ">
                        <p className="text-2xl font-semibold m-4 leading-none text-teal-500">
                    Historique complet des affiliations de travail
                    </p> 
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                                <table
                                className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
                                <thead className="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                    <th
                                        scope="col"
                                        className="border-r px-6 py-4 dark:border-neutral-500">
                                        Numéro
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
                                    <th
                                        scope="col"
                                        className="border-r px-6 py-4 dark:border-neutral-500">
                                        Option
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
                                    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-6 py-4">
                                    {  (fintravail && casechange==alljob.IDRelation) ?( 
                                        <input
                                        type="date"
                                        className="mt-1 p-2 shadow block   text-gray-500  w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={datefinTravail}
                                        onChange={(e) => setDatefinTravail(e.target.value)}
                                        required
                                    />):( <p>{alljob.AnneeFinTravail}</p>)}
                                        
                                        </td>
                                    
                                    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-6 py-4">
                                      {  !fintravail ?( 
                                      <div>
                                      <button className="p-2"
                                      onClick ={
                                        (e)=>{
                                        e.preventDefault();
                                        deleteItem(alljob.IDRelation);
                                      }}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                         </svg>


                                        </button>
                                        <button className="p-2"
                                        onClick={(e) => { 
                                            setcasechnage(alljob.IDRelation)
                                            setfintrvail(true);
                                            e.preventDefault();
                                            }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                        </svg>


                                        </button>
                                        </div>):(
                                         <div>  

                                        <button className="p-2"
                                        onClick={
                                            (e)=>{
                                                e.preventDefault()
                                                updateTravail(alljob.IDRelation) 
                                                setpostchange(true);
                                                setfintrvail(false);
                                            }
                                        }
                                        >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                         <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>

                                        </button>
                                        <button  
                                        className="p-2"
                                        onClick={() => { setfintrvail(false);
                                                         setcasechnage(0);}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                         </svg>

                                        </button>
                                        
                                        </div> )}
                                        </td>
                                   
                                    </tr> ))}
                                    
                                   
                                </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                    </div>
            </div>
    </div>):(<div>

      



 
    <div className="shadow rounded m-4">
      <div className="flex items-center my-4 pl-8">
        <p className="text-2xl font-medium mt-5 leading-none text-teal-500">
          Profil de l'utilisateur :
        </p>
      </div>
      <div className="w-8/9 m-2">
        <table className="w-full text-sm font-light">
          <tbody>
            <tr>
              <td className="whitespace-nowrap text-gray-500 px-6 py-4 font-medium">
                ID de l'utilisateur :
              </td>
              <td className="whitespace-pre-wrap px-6 py-4">
                {userData.IDUser}
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">
                Nom :
              </td>
              <td className="whitespace-pre-wrap px-6 py-4">
                <input
                  type="text"
                  name="name"
                  className="border-teal-500 border-2 w-full rounded py-2 px-12 focus:outline-none focus:border-teal-700"
                  value={updatedData.name}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">
                Date de naissance :
              </td>
              <td className="whitespace-pre-wrap  text-gray-500 px-6 py-4">
                <input
                  type="date"
                  name="dateNaissance"
                  className="border-teal-500 border-2 w-full rounded py-2 px-12 focus:outline-none focus:border-teal-700"
                  value={updatedData.dateNaissance}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">
                Email :
              </td>
              <td className="whitespace-pre-wrap px-6 py-4">
                <input
                  type="email"
                  name="email"
                  className="border-teal-500 border-2 w-full rounded py-2 px-12 focus:outline-none focus:border-teal-700"
                  value={updatedData.email}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">
                Numéro de téléphone :
              </td>
              <td className="whitespace-pre-wrap px-6 py-4">
                <input
                  type="text"
                  name="numeroDeTelephone"
                  className="border-teal-500 border-2 rounded w-full py-2 px-12 focus:outline-none focus:border-teal-700"
                  value={updatedData.numeroDeTelephone}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">
                Adresse :
              </td>
              <td className="whitespace-pre-wrap px-6 ">
              <textarea
                  name="adresse"
                  value={updatedData.adresse}
                  onChange={handleInputChange}
                  className="border-teal-500 border-2 rounded p-2 w-full focus:outline-none focus:border-teal-700 h-12" // Ajustez les valeurs de w-48 et h-24 selon vos besoins
                />
              </td>
            </tr>
            
          </tbody>
        </table>
      </div>
      <div className="ml-4" >
        <p className=" ml-4 text-xs text-gray-500">
        Remarque : veuillez introduire uniquement les champs à modifier.
        </p>
        </div>
        <p className="text-red-500 ml-auto p-2 text-xs mr-4 text-right">{erreur}</p>
        <p className="text-green-500 ml-auto p-2 text-xs mr-4 text-right">{reponseUpdate}</p>
        <div className="flex  pl-4 m-4">
  <button
    onClick={() => {
      setErreur("");
      setReponseUpdate("");
      setUpdatedData({
        name:'',
        adresse:'',
        email:'',
        numeroDeTelephone:'',
        dateNaissance:''
      })
    }}
    className="flex-shrink-0 m-4 ml-auto bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
    type="button"
  >
    Annuler
  </button>
  <button
    onClick={(e) => {
      e.preventDefault();
      setErreur("");
      setReponseUpdate("");
      updateUser();
    }}
    className="flex-shrink-0 m-4 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded ml-2" // Utilisez ml-2 pour ajouter un peu d'espace entre les deux boutons
    type="button"
  >
    Mettre à jour
  </button>
</div>
   </div>

   <div className="shadow p-4 pb-6 px-4 rounded m-4">
  <p className="text-xl font-medium m-5 leading-none text-teal-600">
    Changer le type d'utilisateur
  </p>
  <div className="flex">
  <select
    className="mt-1 p-2 ml-4 text-lg text-gray-500 shadow block w-1/2 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    value={StatueUser}
    onChange={(e) => setStatueUser(e.target.value)}
  >
    <option value="">Sélectionner le type d'utilisateur</option>
    <option value={1}>Administrateur</option>
    <option value={0}>Utilisateur</option>
  </select>

  
  <button
          onClick={(e) => {
            e.preventDefault()
            handeleChangeStatuUser(e);}}
           className="bg-teal-500 justify-end ml-auto mr-4 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
          Valider
        </button>
  </div>
</div>


<div className="shadow p-4 pb-6 px-4 rounded m-4">
  <p className="text-xl font-medium m-5 leading-none text-teal-600">
    Supprimer cet utilisateur
  </p>
  <p className="ml-4 text-red-500">
    Remarque : toutes les demandes ainsi que les affiliations de travail de cet utilisateur seront supprimées
  </p>
  <div className="w-full flex justify-end">
    <button
      onClick={(e) => {
        e.preventDefault();
        handleDeleteUser(e);
      }}
      className="bg-teal-500 mr-4 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded ml-auto"
    >
      Supprimer
    </button>
  </div>
</div>






    

    <div className="shadow pt-4 px-4 rounded m-4">
      
  <div className="mt-8 rounded ">
   <p className="text-2xl font-medium my-5 ml-4 leading-none text-teal-600">
    Créez une nouvelle affectation de travail :
            </p> 
    <form className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-500 font-medium">Siège</label>
          <select
            className="mt-1 p-2 shadow  text-gray-500  block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={siege}
            onChange={(e) => setSiege(e.target.value)}
            required
          > <option value="">Sélectionner un siège</option>
            {Sieges.map((sg) => (
              <option key={sg.IDSiege} value={sg.IDSiege}>
                {sg.NomSiege} , {sg.IDSiege}
              </option>
            ))}
          </select>
          {siegeError && <p className="text-red-500">Champ obligatoire</p>}
        </div>

        <div>
          <label className="block text-gray-500 font-medium">Service</label>
          <select
            className="mt-1 p-2 shadow  text-gray-500  block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          >   <option value="">Sélectionner un service</option>
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
            className="mt-1 p-2 shadow  text-gray-500  block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={poste}
            onChange={(e) => setPoste(e.target.value)}
            required
          > <option value="">Sélectionner un poste</option>
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
            className="mt-1 p-2 shadow block   text-gray-500  w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

   <div className="flex  justify-end"> {/* Cette div aligne le bouton à droite */}
  <div className="bg-teal-500 mr-12 mb-4 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
    <button onClick={(e) => {
      e.preventDefault();
      setpagedeux(false);
      setUpdatedData( {
        IDUser :IDUser,    
        name: '',
        email: '',
        numeroDeTelephone :'',
        dateNaissance:'',
        adresse:'',})
    }}>
      Sortire
    </button>
  </div>
</div>


    </div>)}
    </div> }</div>
  );
};

export default ConsulterUtilisateur;
