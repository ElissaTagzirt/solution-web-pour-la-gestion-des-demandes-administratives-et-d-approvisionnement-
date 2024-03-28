import React , {useState , useEffect , useRef} from 'react';
import { useAuth } from '../../context/AuthContext';

import { Carousel } from 'flowbite-react';


const UserProfile = () => {
        const { token } = useAuth();

        const [Sieges , setSieges]=useState([]);
        const [Services , setServices]=useState([]);
        const [Postes , setPostes]=useState([]);
    

        const [data, setData] = useState(null);
        const[jobs,setJobs]=useState([]);
        const[Alljobs,setAlljobs]=useState([]);
        

        const [isEditing, setIsEditing] = useState('');
        // pour changer les info user
        const [username , setUsername]=useState('');
        const [Telephone, setTelephone] = useState('');
        const [adresse, setAdresse] = useState('');
        const [MessageInfo,setMessageInfo]=useState(''); 
        const [infochange , setinfochange]=useState(false);
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
    


        //  Changer de mot de passe 
        const [ancienmotpasse,setAncienmotpasse] = useState('');
        const [erreurmotpasse,seterreurnmotpasse] = useState('');
        const [nouveaumotpasse, SetNouveaumotpasse] = useState('');
        const [erreurDeChangementps, seterreurDeChangementps] = useState(null);
        const [succeesDeChangementps,setsucceesDeChangementps] = useState(null);
        

        // pour signale fin de travail 
        const [hiddenJobs, setHiddenJobs] = useState(new Set());
        const [Datedepart, setDatedepart] = useState("");
        const [champsdatedepart, setchampsdatedepart]= useState(false);
        const [idrelation , setIdRelation]=useState(0);   
        const [dateObligatoire , setdateObligatoire]=useState(false)
        const [messageErrore , setMessageErrore]=useState('')

        const toggleJobVisibility = (IDRelation) => {
          setHiddenJobs((prevHiddenJobs) => {
            const newHiddenJobs = new Set(prevHiddenJobs);
            if (newHiddenJobs.has(IDRelation)) {
              newHiddenJobs.delete(IDRelation);
            } else {
              newHiddenJobs.add(IDRelation);
            }
            return newHiddenJobs;
          });
          setDatedepart("")
          setIdRelation(0)
          setdateObligatoire(false);
          setMessageErrore('')
        };


        function updateTravail() {
          setMessageErrore('')
          const url = "http://127.0.0.1:8000/travail/update/";
          const requestOptions = {
            
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({IDRelation: idrelation  , datedepart : Datedepart}),
          };
        
          fetch(url, requestOptions)
            .then((response) => {
              if (!response.ok) {
               // throw new Error('La requête n\'a pas abouti');
              }
              return response.json();
            })
            .then((data) => {
              console.log('Mise à jour réussie', data);
              if (data.detail){ console.error('Erreur lors de la mise à jour :', data.detail);
              setMessageErrore(data.detail) 
            }
              setchampsdatedepart(true)
            })
            .catch((error) => {
              console.error('Erreur lors de la mise à jour :', error.detail);
              setMessageErrore(error.detail)
            });
            setDatedepart("")
            setdateObligatoire(false)
        }
        
        
        
        

        
       //-----------------------------------------------------------------------
       // pour cree les composante qui font scrolle vers la droite 
        const containerRef = useRef(null);
       //-----------------------------------------------------------------------
       // pour gere la visibilite de ctableau qui affiche l'historique des poste
        const [composantVisible, setComposantVisible] = useState(false);
       //------------------------------------------------------------------------
       const style = {
        buttonWithTooltip: {
          position: 'relative',
        },
        tooltip: {
          content: "attr(title)",
          backgroundColor: "#333",
          color: "#fff",
          padding: "4px 8px",
          borderRadius: "4px",
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0,
          transition: "opacity 0.3s ease",
          zIndex: 1,
        },
        buttonHover: {
          ":hover": {
            ":after": {
              opacity: 1,
            },
          },
        },
      };

      //------------------------------------------------------------------------
// a < b : -1 notre cas c'est le contraire 
// a> b   : 1 
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
      
      //------------------------------------------------------------------------  

        useEffect(() => {
            const fetchData = () => {
              fetch('http://127.0.0.1:8000/users/me/', {
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
                  console.log('Nouvelles données reçues :', newData);
                  setData(newData); // Mettre à jour l'état avec les nouvelles données
                  setinfochange(false);
                })
                .catch(error => {
                  console.error('Erreur lors de la récupération des données :', error);
                });
            };
          
            fetchData();
          }, [infochange]); 

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



          useEffect(()=>{  
            const fetchJobs = () => {
                fetch('http://127.0.0.1:8000/travail/JobsUser/', {
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
                    console.log('Nouvelles données reçues :', newData);
                    setJobs(newData); 
                    setchampsdatedepart(false)
                  })
                  .catch(error => {
                    console.error('Erreur lors de la récupération des données :', error);
                  });
              };
              fetchJobs();
              setpostchange(false);
      },[postchange,champsdatedepart]
          )
          const handleButtonClickHistorique = (e) => {
            e.preventDefault();
            // Effectuer une requête HTTP à l'API
            fetch(`http://127.0.0.1:8000/travail/Alljobs/${data.IDUser}`, {
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
          
       ///change-password/
       //------------------------Pour change le mot de passe ------------------------
       const handleClickMotDePasse = (e) => {
        seterreurDeChangementps('');
        setsucceesDeChangementps('');
        seterreurnmotpasse('');

                e.preventDefault();
        if (nouveaumotpasse.length >= 8){
        // Envoi de la requête au backend
        fetch('http://127.0.0.1:8000/users/change-password/', {
          method: 'POST', // Vous pouvez utiliser la méthode appropriée
          headers: {
            'Content-Type': 'application/json',
             Authorization: `Bearer ${token}` // Assurez-vous d'ajouter le token d'authentification
          },
          body: JSON.stringify({
            current_password: ancienmotpasse,
            new_password: nouveaumotpasse
          })
        })
          .then(response => {
            if (!response.ok) {
                
              //throw new Error('La requête n\'a pas abouti');
              seterreurDeChangementps('La requête n\'a pas abouti');
            }
            return response.json();
          })
          .then(responseData => {
            // Gérer la réponse du backend ici (par exemple, afficher un message de succès)
            console.log('Mot de passe changé avec succès :', responseData);
           if (responseData.detail === 'votre mot de passe actuel est incorrect'){seterreurDeChangementps(responseData.detail);} 
           if (responseData.detail === 'Utilisateur non trouvé'){seterreurDeChangementps(responseData.detail);} 
           if (responseData.message === 'Mot de passe mis à jour avec succès'){setsucceesDeChangementps(responseData.message);} 
          
          })
         /* .catch(error => {
            console.error('Erreur lors du changement de mot de passe :', error.detail);
            seterreurDeChangementps(error.detail);
            // Gérer les erreurs ici (par exemple, afficher un message d'erreur)
          });*/
        }else{
          seterreurnmotpasse('Le mot de passe doit contenir au moins 8 caractères.')
        }
      };

      const handleAnnuleMotdepasse = (e) => {
        e.preventDefault();
        seterreurDeChangementps('');
        setsucceesDeChangementps('');
        setAncienmotpasse('');
        SetNouveaumotpasse('');
        seterreurnmotpasse('');
            
      }
      //------------------------Pour change les information de user  ------------------------
      const handleAnnuleInfoUser = (e) => {
        e.preventDefault();
        setTelephone('');
        setAdresse('');
        setMessageInfo('');
        setinfochange('');
        setUsername('');    
      }
    
    
      const handleClickInfoUser = (e) => {
         e.preventDefault();
        
        // Envoi de la requête au backend
        fetch(`http://127.0.0.1:8000/users/update-info/${data.IDUser}`, {
          method: 'PUT', // Vous pouvez utiliser la méthode appropriée
          headers: {
            'Content-Type': 'application/json',
             Authorization: `Bearer ${token}` // Assurez-vous d'ajouter le token d'authentification
          },
          body: JSON.stringify({
            numeroDeTelephone : Telephone ,
            adresse           : adresse,
            username          : username
            
          })
        })
          .then(response => {
            if (!response.ok) {
                
              setMessageInfo('La requête n\'a pas abouti');
            }
            return response.json();
          })
          .then(responseData => {
            // Gérer la réponse du backend ici (par exemple, afficher un message de succès)
            console.log('Mot de passe changé avec succès :', responseData);
           if (responseData.message === 'Informations utilisateur mises à jour avec succès'){
            setinfochange(true);
           } 
           setMessageInfo(responseData)
          })
         /* .catch(error => {
            console.error('Erreur lors du changement de mot de passe :', error.detail);
            seterreurDeChangementps(error.detail);
            // Gérer les erreurs ici (par exemple, afficher un message d'erreur)
          });*/
      };

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
   body: JSON.stringify({ IDUser: data.IDUser,
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
     setpostchange(true);
     setMessagepsot('Entite ajoute avec succees')
   })
   .catch(error => {
     console.error(error.detail);
     
     // Gérer les erreurs ici (par exemple, afficher un message d'erreur)
   });
  }
};
   //------------------------------------------------------------------------------------------------------------      
        const toggleEditing = () => {setIsEditing(!isEditing);}

        const sortedJobs = sortJobsByDate(Alljobs);
          
        
  return (
 
  data &&(  <div className=' w-full items-center '>       
    <div className="px-16 sm :px-45">
        <div className="p-2 bg-white shadow mt-2 sm:mt-4">  
        <div className="grid grid-cols-1 md:grid-cols-1">    
            <div className="relative">      
               <div className="w-28 h-28 bg-indigo-100 mx-auto rounded-full shadow-2xl  inset-x-0 top-0 right-auto left-auto flex items-center justify-center text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">  
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg> 
               </div>  
            </div>   
        </div>  
        <div className="mt-4 text-center ">    {/*border-b pb-12 */}
            <h1 className="text-4xl font-medium text-gray-700">{data.name}</h1>   
            <h2 className='text-xl'>
                 <p className=" font-light text-gray-600 mt-3">Identifiant utilisateur</p>   
                 <span className="font-light text-gray-500">{data.IDUser}</span>
            </h2>  
        </div> 
        <button
                onClick={toggleEditing}
                className="bg-teal-500 hover:bg-teal-700 ml-5 mb-5 text-white font-bold p-1 rounded">
                 <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5">
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
            </button>
        </div>
    </div>
    
       
        {isEditing ? (
        <div>
            <div className=" my-8 pl-8">
                            <p className="text-base font-medium mt-5 leading-none text-gray-500">
                            Mettre à jour vos informations :
                            </p>
           </div>  
            <div className=' shadow rounded   m-8'>
                <form className='p-4'>
                    <div className='flex flex-col'>
                    <div>
                    <table className="w-full  text-sm font-light">
                    
                        <tbody>
                          <tr>
                                <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">Nom utilisateur</td>
                                <td className="whitespace-pre-wrap px-6 py-2 md:py-4">
                                <input
                                        type="text"
                                        className="mt-1 p-2  shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">Numéro de téléphone</td>
                                <td className="whitespace-pre-wrap px-6 py-2 md:py-4">
                                <input
                                        type="text"
                                        className="mt-1 p-2  shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={Telephone}
                                        onChange={(e) => setTelephone(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">Adresse</td>
                                <td className="whitespace-pre-wrap px-6 py-2 md:py-4">
                                <input
                                        type="text"
                                        className="mt-1 p-2  shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={adresse}
                                        onChange={(e) => setAdresse(e.target.value)}
                                    />
                                </td>
                            </tr>
                        </tbody>
                
                    
                                
                                    
                                
                        </table>
                        {MessageInfo.detail && (
                                <p  className='text-sm text-right' style={{ color: 'red' }}>{MessageInfo.detail}</p>
                                )}
                        {MessageInfo.message && (
                                <p   className='text-sm text-right' style={{ color: 'green' }}>{MessageInfo.message}</p>
                                )}        
                        </div>
                            <div className='flex justify-end mt-2'>
                            <button 
                                        onClick={handleAnnuleInfoUser}
                                        className="bg-teal-500 mr-3 justify-end hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                                        Annuler 
                                </button>
                                <button
                                        onClick={handleClickInfoUser}
                                        className="bg-teal-500 justify-end hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                                        Valider 
                                </button>
                            </div>
                        </div>
                        </form> 
                    
            </div>
            <div className=" my-8 pl-8">
                                <p className="text-base font-medium mt-5 leading-none text-gray-500">
                                Créez une nouvelle affectation de travail :
                                </p>
            </div>
            
            <div className=' shadow rounded   m-8'>
                <form className='p-4'>
                    <div className='flex flex-col'>
                    <div>
                    <table className="w-full  text-sm font-light">
                        
                    <tbody>
                    <tr>
                        <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">
                            Siège
                        </td>
                        <td className="whitespace-pre-wrap px-6 py-2 text-gray-500 md:py-4">
                            <select
                            className="mt-1 p-2 shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={siege}
                            onChange={(e) => setSiege(e.target.value)}
                            required
                            >
                            {Sieges.map((sg) => (
                                <option key={sg.IDSiege} value={sg.IDSiege}>
                                {sg.NomSiege} , {sg.IDSiege}
                                </option>
                            ))}
                            </select>
                            {siegeError && <p className="text-red-500">Champ obligatoire</p>}
                        </td>
                    </tr>

                        <tr>
                            <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">
                            Service
                            </td>
                            <td className="whitespace-pre-wrap px-6 py-2 text-gray-500 md:py-4">
                            <select
                                className="mt-1 p-2 shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                required // Champ requis
                            >
                                {Services.map((sv) => (
                                <option key={sv.IDService} value={sv.IDService}>
                                    {sv.NomService}
                                </option>
                                ))}
                            </select>
                            {serviceError && <p className="text-red-500">Champ obligatoire</p>}
                            </td>
                            
                        </tr>
                        <tr>
                            <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">
                            Poste
                            </td>
                            <td className="whitespace-pre-wrap px-6 py-2 text-gray-500 md:py-4">
                            <select
                                className="mt-1 p-2 shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={poste}
                                onChange={(e) => setPoste(e.target.value)}
                                required // Champ requis
                            >
                                {Postes.map((ps) => (
                                <option key={ps.IDPoste} value={ps.IDPoste}>
                                    {ps.NomPoste}
                                </option>
                                ))}
                            </select>   
                              {posteError && <p className="text-red-500">Champ obligatoire</p>}
                       
                            </td>
                        </tr>
                        <tr>
                            <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">
                            Date début de travail
                            </td>
                            <td className="whitespace-pre-wrap px-6 py-2 md:py-4">
                            <input
                                type="date" //le type "date" pour un calendrier
                                className="mt-1 p-2 shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={dateDebutTravail}
                                onChange={(e) => setDateDebutTravail(e.target.value)}
                                required // Champ requis
                            /> {dateDebutTravailError && <p className="text-red-500">Champ obligatoire</p>}
                            </td>
                           
                        </tr>
                   </tbody>

                
                    
                                
                                    
                                
                        </table>
                        {Messagepost.detail && (
                                <p  className='text-sm text-right mr-4' style={{ color: 'red' }}>{Messagepost.detail}</p>
                                )}
                        {Messagepost && (
                                <p   className='text-sm text-right mr-4' style={{ color: 'green' }}>{Messagepost}</p>
                                )} 
                        </div>
                        <div className='flex justify-end mb-2 mt-2'>
                            <button 
                                        onClick={handleAnnulePoste}
                                        className="bg-teal-500 mr-3 justify-end hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                                        Annuler 
                                </button>
                                <button
                                    
                                        onClick={handleClickAddPoste}
                                        className="bg-teal-500 justify-end hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                                        Valider 
                                </button>
                            </div>
                        </div>
                        </form> 
                    
            </div>
            <div className=' shadow rounded   m-8'>
                <form className='p-4'>
                    <div className='flex flex-col'>
                    <div>
                    <table className="w-full  text-sm font-light">
                        
                    <tbody>
                        <tr>
                            <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">
                            <p>Ancien mot de passe</p>
                            </td>
                            <td className="whitespace-pre-wrap px-6 py-2 md:py-4">
                            <div>
                                <input
                                type="password"
                                className="mt-1 p-2  shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={ancienmotpasse}
                                onChange={(e) => setAncienmotpasse(e.target.value)}
                                />
                                {erreurDeChangementps && (
                                <p style={{ color: 'red' }}>{erreurDeChangementps}</p>
                                )}
                            </div>
                            </td>
                        </tr>

                        <tr>
                            <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">
                            <p>Nouveau mot de passe</p>
                            </td>
                            <td className="whitespace-pre-wrap px-6 py-2 md:py-4">
                            <input
                                type="password"
                                className="mt-1 p-2  shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={nouveaumotpasse}
                                onChange={(e) => SetNouveaumotpasse(e.target.value)}
                            />
                            {succeesDeChangementps && (
                                <p style={{ color: 'green' }}>{succeesDeChangementps}</p>
                            )}
                            {erreurmotpasse && (
                                <p style={{ color: 'red' }}>{erreurmotpasse}</p>
                            )}
                            </td>
                        </tr>
                    </tbody> 
    
                        </table>
                        </div>
                            <div className='flex justify-end mt-2'>
                            <button  onClick = {handleAnnuleMotdepasse}
                                        //onClick={toggleEditing}
                                        className="bg-teal-500 mr-3 justify-end hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                                        Annuler 
                                </button>
                                <button
                                        onClick={handleClickMotDePasse}
                                        className="bg-teal-500 justify-end hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                                        Valider 
                                </button>
                            </div>
                        </div>
                        </form> 
                    
            </div>
            
        
        </div>
        ) : (
        <div >
                <div className=" my-8 pl-8">
                                <p className="text-base font-medium mt-5 leading-none text-gray-500">
                                À propos de vous :
                                </p>
               </div>
                <div className=' shadow rounded p-8 m-8'>
                <table className="w-full  text-sm font-light">
                                
                  <tbody>
                        <tr>
                            <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">Adresse email</td>
                            <td className="whitespace-pre-wrap px-6 py-2 text-gray-500 md:py-4">{data.email}</td>
                        </tr>
                        <tr>
                            <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">Nom utilisateur</td>
                            <td className="whitespace-pre-wrap px-6 py-2 text-gray-500 md:py-4">{data.name}</td>
                        </tr>
                        <tr>
                            <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">Date de Naissance</td>
                            <td className="whitespace-pre-wrap px-6 py-2 text-gray-500 md:py-4">{data.dateNaissance}</td>
                        </tr>
                        <tr>
                            <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">Numéro de téléphone</td>
                            <td className="whitespace-pre-wrap px-6 py-2 text-gray-500 md:py-4">{data.numeroDeTelephone}</td>
                        </tr>
                         <tr>
                            <td className="whitespace-nowrap px-6 py-2 md:py-4 text-gray-500 font-medium">Adresse</td>
                            <td className="whitespace-pre-wrap px-6 py-2 text-gray-500 md:py-4">{data.adresse}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
                <div className=" my-8 pl-8">
                                <p className="text-base font-semibold  mt-5 leading-none text-gray-500">
                                 Historique de mes postes :
                                </p>
               </div>
               
             <div className=' m-8 p-8 rounded shadow'>
                    <p className="text-base font-semibold ml-4 leading-none text-gray-400">
                            Mes postes actuels
                    </p>       
                    <div    ref={containerRef}
                        className="flex"
                        style={{
                        maxWidth: '100%', // La largeur maximale que vous souhaitez
                        overflowX: 'auto', // Activer le défilement horizontal si nécessaire
                        whiteSpace: 'nowrap', // Empêcher le retour à la ligne des éléments
                        }}>
                        
                        {jobs.map((job) => (   
                          !hiddenJobs.has(job.IDRelation) ? (
                      <div style={{
                                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                minWidth: '300px', // Largeur minimale de chaque élément
                                display: 'inline-block',
                                marginRight: '10px', // Marge entre les éléments
                            }} key={job.IDRelation}
                            className='rounded bg-teal-100 bg-opacity-5 p-8 m-8'
                            > <div>
                                <p className="text-base font-semibold  mb-4 leading-none text-gray-500">
                                   {job.NomPoste}

                                </p>
                               <table className="w-fit  text-sm font-light">
                                                
                                <tbody>
                                <tr>
                                    <td className="whitespace-nowrap px-2 py-2  text-gray-500 font-medium">Service</td>
                                    <td className="whitespace-pre-wrap px-2 py-2 text-gray-500 ">{job.NomService}</td>
                                    </tr>
                                    <tr>
                                    <td className="whitespace-nowrap px-2 py-2  text-gray-500 font-medium">Siège</td>
                                    <td className="whitespace-pre-wrap px-2 py-2 text-gray-500 ">{job.NomSiege}</td>
                                    </tr>
                                    <tr>
                                    <td className="whitespace-nowrap px-2 py-2  text-gray-500 font-medium">Début de l'emploi</td>
                                    <td className="whitespace-pre-wrap px-2 py-2 text-gray-500 ">{job.AnneeDebutTravail}</td>
                                    </tr>

                                    </tbody>
                                    </table> 
                   
                   
                    <div className="flex justify-end"> {/* Utilisez flex et justify-end pour aligner le bouton à droite */}
                        <button  
                           onClick={() =>{ toggleJobVisibility(job.IDRelation)
                                           //setIdRelation(job.IDRelation)
                                           
                          }}
                            style={style.buttonWithTooltip}
                            title="Signalez votre départ de poste"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" style={{ marginRight: '4px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <span style={style.tooltip}></span>
                        </button>
                    </div>
                    </div>
                </div> ) : (<div style={{
                                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                minWidth: '300px', // Largeur minimale de chaque élément
                                display: 'inline-block',
                                marginRight: '10px', // Marge entre les éléments
                            }} key={job.IDRelation}
                            className='rounded bg-teal-100 bg-opacity-5 p-8 m-8'
                            > <div>
                                <p className="text-base font-semibold  my-4 leading-none text-gray-500">
                                   {job.NomPoste}

                                </p>
                                <p className="text-base font-medium mr-4 my-4 leading-none text-gray-500">
                                   Date de départ

                                </p>
                                <div className="whitespace-pre-wrap w-full mb-2 md:mb-4 text-gray-500 py-1 md:py-2">
                                    <input
                                        type="date"
                                        className="mt-1 p-2 shadow block w-full rounded-md border-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={Datedepart}
                                        onChange={(e) => setDatedepart(e.target.value)}
                                        required
                                    />
                                    {dateObligatoire && <p className="text-red-500 text-sm ml-2">Champ obligatoire</p>}
                                    <p className="text-red-500 text-sm ml-2">{messageErrore}</p>
                                </div>

                                

                            


                   
                   
                    <div className="flex justify-end"> {/* Utilisez flex et justify-end pour aligner le bouton à droite */}

                        <button className="bg-teal-500 hover:bg-teal-700 text-white mr-2 font-lg px-2 py-2 rounded"     
                       // onClick={handelClickAnnonceDatedepart}
                       onClick={() => {
                        setIdRelation(job.IDRelation);
                        if (Datedepart !== '') {
                          console.log(Datedepart)  
                          updateTravail();
                          console.log(idrelation);
                        } else {
                            setdateObligatoire(true);
                        }
                      }}
                       
                        //setIdRelation(0)
                                
                            style={style.buttonWithTooltip}
                            title="Signalez votre départ de poste" >
                            <div className="flex items-center">
                                <span>Valider</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                              </svg>
                            </div>
                       </button>
                        <button className="bg-teal-500 hover:bg-teal-700 text-white font-lg px-2 py-2 rounded"   onClick={() =>{ toggleJobVisibility(job.IDRelation);   setIdRelation(0)}} >
                            <div className="flex items-center">
                                <span>Annuler</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                            </div>
                       </button>
                        
                    </div>
                    </div>
                </div>)
                 ))}
                </div>
                <div className="flex m-5 justify-end">
                    <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"   onClick={(e) => {
                                                                                                                        setComposantVisible(!composantVisible);
                                                                                                                        handleButtonClickHistorique(e); // Appel après la mise à jour de l'état
                                                                                                                        }} >
                        <div className="flex items-center">
                            <span>Historique complet</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                            </svg>
                        </div>
                    </button>
                </div>
                {composantVisible && <div>
                    <p className="text-base font-semibold m-4 leading-none text-gray-400">
                       Mon historique complet de postes :
                    </p> 
                    <div className="flex flex-col rounded shadow bg-teal-100 bg-opacity-5 p-4 m-2 ">
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
                </div> }
             </div> 
             
        </div>        
            )}
    
    </div>
  )
  );
};

export default UserProfile;
