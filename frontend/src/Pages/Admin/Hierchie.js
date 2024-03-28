import React, { useState , useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';


const Hierchie = () => {
  



 //Pour recuperes les donnees des sieges poste et services de backend
 const { token } = useAuth();

// ------------------ Variable utilise pour siege --------------------------------------------
 const [DescriptionSiege,setDescriptionSiege] = useState('');
 const [NomSiege, setNomSiege]=useState('');
 const [valeur , setvaleur]=useState(0)
 const [siegesList, setSiegesList] = useState([]);
 const [ErreurChampsSiege,setErreurSiege]=useState('');
 const [responseChampsSiege , setResponseChampsSiege]=useState('')
 const [changeSiege,setChangeSiege]=useState(false);
 const [composantVisiblesiege , setcomposantVisiblesiege]=useState(false);
 const [siege, setSiege] = useState({
    NomSiege: '',
    Description: '',
  });
 
 const handleInputChangeSiege = (e) => {
    const { name, value } = e.target;
    setSiege({
      ...siege,
      [name]: value,
    });
  };

  


 
  const [composantVisibleservice , setcomposantVisibleservice]=useState(false);
  const [ErreurChampsRequisService,setErreurChampsRequisService]=useState(false);
  const [DescriptionServic,setDescriptionServic] = useState('');
  const [NomService, setNomService]=useState('');
  const [valeurservice , setvaleurservice]=useState(0);
  const [ErreurChampsService,setErreurService]=useState('');
  const [responseChampsService , setResponseChampsService]=useState('');
  const [changeService,setChangeService]=useState(false);
  const [ServicesList, setServicesList] = useState([]);
 
  const [Service, setService] = useState({
     NomService: '',
     Description: '',
   });
  
  const handleInputChangeService = (e) => {
     const { name, value } = e.target;
     setService({
       ...Service,
       [name]: value,
     });
   };
 
 //-------------------------------------------------------------------------------------------------------------------------------------
 const [PostesList, setPostesList] = useState([]);
 const [ErreurChampsRequisPoste,setErreurChampsRequisPoste]=useState(false);
 const [composantVisibleposte , setcomposantVisibleposte]=useState(false);
 const [DescriptionPoste,setDescriptionPoste] = useState('');
 const [NomPoste, setNomPoste]=useState('');
 const [valeurposte , setvaleurposte]=useState(0);
 const [ErreurChampsPoste,setErreurPoste]=useState('');
 const [responseChampsPoste , setResponseChampsPoste]=useState('');
 const [changePoste,setChangePoste]=useState(false);
  
 const [Poste, setPoste] = useState({
    NomPoste: '',
    Description: '',
  });
 
 const handleInputChangePoste = (e) => {
    const { name, value } = e.target;
    setPoste({
      ...Poste,
      [name]: value,
    });
  };





//------- les fonction fetch ----------------------------------------------------------------------------------------------
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
            setSiegesList(newData); // Mettre à jour l'état avec les nouvelles données
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
            
            setPostesList(newData); // Mettre à jour l'état avec les nouvelles données
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
            setServicesList(newData); // Mettre à jour l'état avec les nouvelles données
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des données :', error);
          });
      };
// --------------------------------- les fonction delete  ---------------------------------------------

  const handleDeleteClick = (IDSiege) => {
    const apiUrl = `http://127.0.0.1:8000/siege/Delete/${IDSiege}`;
    
    fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('La requête a échoué');
      }
      fetchSieges()
    })
    .catch(error => {
      console.error('Erreur lors de la suppression:', error);
    });
  };


  const handleDeleteServiceClick = (IDService) => {
    const apiUrl = `http://127.0.0.1:8000/service/delete/${IDService}`;
    
    fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('La requête a échoué');
      }
      return response.json()
      
    }).then(data => {
      fetchServices()})
    
    .catch(error => {
      console.error('Erreur lors de la suppression:', error);
    });
  };

  const handleDeletePosteClick = (IDService) => {
    const apiUrl = `http://127.0.0.1:8000/postedelete/${IDService}`;
    
    fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('La requête a échoué');
      }
      return response.json()
      
    }).then(data => {
      fetchPostes()
    })
    
    .catch(error => {
      console.error('Erreur lors de la suppression:', error);
    });
  };
//------------------ fonctions create -----------------------------------------------

  const handleCreateClick = () => {
    setErreurSiege('')
    setResponseChampsSiege('')
    if (Service.NomSiege==='') {
      setErreurSiege('Le nom du siège est obligatoire.');
    } else {
    const apiUrl = 'http://127.0.0.1:8000/siege/create/';
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      
      body: JSON.stringify({
        NomSiege : siege.NomSiege ,
        Description : siege.Description
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('La requête a échoué');
      }
      return response.json(); // Si vous attendez une réponse JSON
    })
    .then(data => {
      if (data.detail==="Vous n'êtes pas autorisé  à effectuer cette action.")
      {
        setErreurSiege("Vous n'êtes pas autorisé  à effectuer cette action.")
      }else if (data.detail==="Le nom de siège que vous avez saisi existe déjà"){
        setErreurSiege("Le nom de siège que vous avez saisi existe déjà")
      }
       else { 
        
        fetchSieges()
        setResponseChampsSiege("La création a réussi")
        setSiege({
          NomSiege: '',
          Description: '',
        });
    }
     
    })
    .catch(error => {

      console.error('Erreur lors de la création :', error.detail);
    });
  }
  };



  const handleAddService = () => {
  
    setErreurService('')
    setResponseChampsService('')
    if (Service.NomService==='') {
      setErreurService('Le nom du service est obligatoire.');
    } else {
      
      fetch('http://127.0.0.1:8000/service/create/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NomService: Service.NomService,
          Description: Service.Description,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('La requête a échoué');
          }
          return response.json();
        })
        .then((data) => {
          if (data.detail==="Vous n'êtes pas autorisé  à effectuer cette action.")
          {
            setErreurService("Vous n'êtes pas autorisé  à effectuer cette action.")
          }else if (data.detail==="Le nom de service que vous avez saisi existe déjà"){
            setErreurService("Le nom de service que vous avez saisi existe déjà")
          }
           else { 
            fetchServices()
            setResponseChampsService("La création a réussi")
            setService({
            NomService: '',
            Description: '',
          });
        } 
        })
        .catch((error) => {
          console.error('Erreur lors de la création du service :', error);
        });
    }
  };



  const handleAddPoste = () => {
  
    setErreurPoste('')
    setResponseChampsPoste('')
    if (Poste.NomPoste==='') {
      setErreurPoste('Le nom du poste est obligatoire.');
    } else {
      
      fetch('http://127.0.0.1:8000/poste/Add-poste/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NomPoste: Poste.NomPoste,
          Description: Poste.Description,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('La requête a échoué');
          }
          return response.json();
        })
        .then((data) => {
          if (data.detail==="Vous n'êtes pas autorisé  à effectuer cette action.")
          {
            setErreurService("Vous n'êtes pas autorisé  à effectuer cette action.")
          }else if (data.detail==="Le nom de poste que vous avez saisi existe déjà"){
            setErreurService("Le nom de poste que vous avez saisi existe déjà")
          }
           else { 
            fetchPostes()
            setResponseChampsPoste("La création a réussi")
            setPoste({
            NomPoste: '',
            Description: '',
          });
        } 
        })
        .catch((error) => {
          console.error('Erreur lors de la création du service :', error);
        });
    }
  };

  //--------------------------- fonction update ------------------------------------------------
  const updateSiege = (IDSiege) => {
    const apiUrl = `http://127.0.0.1:8000/siege/update/${IDSiege}`;
    
    const data = {
      Description: DescriptionSiege,
      NomSiege : NomSiege
    };
    
  
    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('La requête a échoué');
      }
      return response.json(); // Si vous attendez une réponse JSON
    })
    .then(data => {
      fetchSieges();
      setvaleur(0);
      setChangeSiege(false)
      setDescriptionSiege('')
      setNomSiege('')
    })
    .catch(error => {
      console.error('Erreur lors de la mise à jour :', error);
    });
  };
  

  const updateService = (IDService) => {
    const apiUrl = `http://127.0.0.1:8000/service/Update/${IDService}`;
    
    const data = {
      Description: DescriptionServic,
      NomService : NomService
    };
  console.log("atta",data)
    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('La requête a échoué');
      }
      return response.json(); // Si vous attendez une réponse JSON
    })
    .then(data => {
      fetchServices();
      setvaleurservice(0);
      setChangeService(false)
      setDescriptionServic('');
      setNomService('');
    })
    .catch(error => {
      console.error('Erreur lors de la mise à jour :', error);
    });
  };
  
  const updatePoste = (IDPoste) => {
    const apiUrl = `http://127.0.0.1:8000/poste/update/${IDPoste}`;
    
    const data = {
      Description: DescriptionPoste,
      NomPoste : NomPoste
    };
  
    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('La requête a échoué');
      }
      return response.json(); // Si vous attendez une réponse JSON
    })
    .then(data => {
      fetchPostes();
      setvaleurposte(0);
      setChangePoste(false)
      setDescriptionPoste('')
      setNomPoste('')
    })
    .catch(error => {
      console.error('Erreur lors de la mise à jour :', error);
    });
  };
//********************************************************************** */

  return (

    <div>
        <div className=" items-center m-8 pl-4">
        <p className="text-2xl font-medium py-6 my-5 leading-none text-teal-500 ">
        Configuration de la hiérarchie organisationnelle</p>
        <hr className="border-t  border-gray-300" />
           <p className="text-lg font-medium m-3 mt-8 leading-none text-gray-500 ">
           Ajouter un nouveau siège</p>
        
        <div className="flex mt-8 py-2" >
            <div className="w-1/5 m-2 items-center border-b border-teal-500 ">
                    <input
                    type="text"
                    placeholder="Nom de siége"
                    className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                    aria-label="Nom siege"
                    value={siege.NomSiege}
                    name='NomSiege'
                    onChange={handleInputChangeSiege}
                    /> 
                </div>
                <div className="w-3/5 m-2 items-center border-b border-teal-500 ">
                    <textarea
                    placeholder="Description de siége"
                    className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                    aria-label="Description siege"
                    name = 'Description'
                    value={siege.Description}
                    onChange={handleInputChangeSiege}
                    />
                </div>
                    <div className="w-1/5 m-2 items-center ">
                        <button
                        onClick={(e)=>{
                            e.preventDefault()
                            handleCreateClick()
                        }}
                    type="submit"
                    className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded">
                    Ajouter</button>
                    </div>
                    
        </div>
       <div className='flex flex-col'>
              
                    <p className=" ml-auto text-sm mr-6  text-red-500">{ErreurChampsSiege}</p>
                    <p className=" ml-auto text-sm mr-6  text-green-500">{responseChampsSiege} </p>
                    </div>
        <div className="flex m-12 justify-end">
                    <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"   onClick={(e) => {
                                                                                                                        e.preventDefault()
                                                                                                                        setcomposantVisiblesiege(!composantVisiblesiege);
                                                                                                                        fetchSieges() // Appel après la mise à jour de l'état
                                                                                                                        }} >
                        <div className="flex items-center">
                            <span>Tous les sièges</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                            </svg>
                        </div>
                    </button>
        </div>
        {composantVisiblesiege &&  <div>
                    <p className="text-base font-semibold m-8 leading-none text-gray-500">
                       Historique complet des sièges :
                    </p> 
                    <div className="flex flex-col rounded shadow bg-gray-50 bg-opacity-5 p-4 m-2 ">
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
                                        Nom de siège 
                                    </th>
                                    <th
                                        scope="col"
                                        className="border-r px-6 py-4 dark:border-neutral-500">
                                        Description
                                    </th>
                                    <th
                                        scope="col"
                                        className="border-r px-6 py-4 dark:border-neutral-500">
                                        Réglage
                                    </th>
                                    </tr>
                                </thead>
                                <tbody>
                               
                                {siegesList.map((allsiege,index) => (   
                                       <tr className="border-b dark:border-neutral-500" key={index}>
                                    <td
                                        className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                         <p> {allsiege.IDSiege}</p>
                                    </td>
                                    <td
                                        className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                                        {(changeSiege && valeur === allsiege.IDSiege) ? (
                                          <input
                                          className='m-2 p-2 border rounded-lg'
                                          aria-label="Nom siege"
                                            name = 'NomSiege'
                                            value={NomSiege}
                                            onChange={(e) => { setNomSiege(e.target.value) }} 
                                        />
                                          ) :(<p> {allsiege.NomSiege}</p>)}
                                    </td>
                                    <td className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                                      <div>
                                      {(changeSiege && valeur === allsiege.IDSiege) ? (
                                          <textarea
                                          className='m-2 p-2 border rounded-lg'
                                          aria-label="Description siege"
                                            name = 'Description'
                                            value={DescriptionSiege}
                                            onChange={(e) => { setDescriptionSiege(e.target.value) }} 
                                          rows="3" // Ajustez le nombre de lignes selon vos besoins
                                          cols="30" // Ajustez la largeur en colonnes selon vos besoins
                                        />
                                          ) :(<p> {allsiege.Description}</p>)}
                                      </div>
                                    </td>
                                    <td className='flex items-center justify-center'>
                                  { !changeSiege ?   (  <div>  
                                      
                                    <button 
                                    onClick={(e) => {
                                        setvaleur(allsiege.IDSiege);
                                        setChangeSiege(true);
                                        e.preventDefault();
                                    }}
                                   className='mr-2 p-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                         <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                                        </svg>
                                        </button>
                                        </div>) : (
                                        <div>
                                        <button className='mr-2 p-2'
                                        onClick={(e) => {
                                            updateSiege(allsiege.IDSiege)
                                            setChangeSiege(false) ; 
                                            setvaleur(0);
                                            e.preventDefault();
                                            
                                        }}
                                        >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        </button>
                                        <button className='mr-2 p-2'
                                        onClick={(e) => {
                                            setChangeSiege(false) ; 
                                            setvaleur(0);
                                            e.preventDefault();}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                        </svg>

                                        </button>
                                        </div>) }
                                    </td>
                                    </tr> ))}
                                    
                                   
                                </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>}
        </div>
        <div className=" items-center  m-8 pl-4">
           <p className="text-lg font-medium m-3 leading-none text-gray-500 ">
           Ajouter un nouveau service</p>
       
            <div className="flex mt-8 py-2" >
                <div className="w-1/5 m-2 items-center border-b border-teal-500 ">
                <input
                    type="text"
                    placeholder="Nom de service"
                    className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                    aria-label="Nom service"
                    value={Service.NomService}
                    name='NomService'
                    onChange={handleInputChangeService}
                    /> 
                    </div>
                    <div className="w-3/5 m-2 items-center border-b border-teal-500 ">
                        <textarea
                        placeholder="Description de service"
                        className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                        aria-label="Description service"
                        name = 'Description'
                        value={Service.Description}
                        onChange={handleInputChangeService}
                        />
                    </div>
                        <div className="w-1/5 m-2 items-center ">
                            <button
                            onClick={(e) => {
                              e.preventDefault()
                              handleAddService()}}
                        type="submit"
                        className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded">
                        Ajouter</button>
                        </div>
            </div>
            <div className='flex flex-col'>
              
              <p className=" ml-auto text-sm mr-8  text-red-500">{ErreurChampsService}</p>
              <p className=" ml-auto text-sm mr-8  text-green-500">{responseChampsService} </p>
              </div>
        
        <div className="flex m-12 justify-end">
                    <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"   onClick={(e) => {
                                                                                                                        e.preventDefault()
                                                                                                                        setcomposantVisibleservice(!composantVisibleservice);
                                                                                                                        fetchServices()
                                                                                                                        }} >
                        <div className="flex items-center">
                            <span>Tous les services</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                            </svg>
                        </div>
                    </button>
        </div>
        {composantVisibleservice && 
        
        <div>
  <p className="text-base font-semibold m-8 leading-none text-gray-500">
    Historique complet des services :
  </p>
  <div className="flex flex-col rounded shadow bg-gray-50 bg-opacity-5 p-4 m-2">
    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
        <div className="overflow-hidden">
          <table className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
            <thead className="border-b font-medium dark:border-neutral-500">
              <tr>
                <th
                  scope="col"
                  className="border-r px-6 py-4 dark:border-neutral-500"
                >
                  Numéro
                </th>
                <th
                  scope="col"
                  className="border-r px-6 py-4 dark:border-neutral-500"
                >
                  Nom de service
                </th>
                <th
                  scope="col"
                  className="border-r px-6 py-4 dark:border-neutral-500"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="border-r px-6 py-4 dark:border-neutral-500"
                >
                  Réglage
                </th>
              </tr>
            </thead>
            <tbody>
              {ServicesList.map((service, index) => (
                <tr className="border-b dark:border-neutral-500" key={service.IDService}>
                  <td
                    className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500"
                  >
                   <p> {service.IDService}</p>
                  </td>
                  <td
                    className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500"
                  >
                     {changeService && valeurservice === service.IDService ? (
                        <input
                          className="m-2 p-2 border rounded-lg"
                          aria-label="Nom service"
                          name="NomService"
                          value={NomService}
                          onChange={(e) => {
                            setNomService(e.target.value);
                          }}
                        />
                      ) : ( <p> {service.NomService}</p>)}
                  </td>
                  <td className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                    <div>
                      {changeService && valeurservice === service.IDService ? (
                        <textarea
                          className="m-2 p-2 border rounded-lg"
                          aria-label="Description du service"
                          name="Description"
                          value={DescriptionServic}
                          onChange={(e) => {
                            setDescriptionServic(e.target.value);
                          }}
                          rows="3"
                          cols="30"
                        />
                      ) : (
                        <p> {service.Description}</p>
                      )}
                    </div>
                  </td>
                  <td className="flex items-center justify-center">
                    {!changeService ? (
                      <div>
                        
                        <button
                          onClick={(e) => {
                            setvaleurservice(service.IDService);
                            setChangeService(true);
                            e.preventDefault();
                          }}
                          className="mr-2 p-2"
                        >
                          {/* Icône de modification */}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                         <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                                        </svg>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          className="mr-2 p-2"
                          onClick={(e) => {
                            updateService(service.IDService);
                            setChangeService(false);
                            setvaleurservice(0);
                            e.preventDefault();
                          }}
                        >
                          {/* Icône de sauvegarde */}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                        </button>
                        <button
                          className="mr-2 p-2"
                          onClick={(e) => {
                            setChangeService(false);
                            setvaleurservice(0);
                            e.preventDefault();
                          }}
                        >
                          {/* Icône d'annulation */}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

        }
        </div>
         <div className="items-center m-8 pl-4">
           <p className="text-lg m-3 font-medium  leading-none text-gray-500 ">
           Ajouter un nouveau poste</p>
        
        <div className="flex py-2" >
            <div className="w-1/5 m-2 items-center border-b border-teal-500 ">
                    <input
                    type="text"
                    placeholder="Nom de poste"
                    className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                    aria-label="Nom poste"
                    value={Poste.NomPoste}
                    name='NomPoste'
                    onChange={handleInputChangePoste}
                    /> 
                </div>
                <div className="w-3/5 m-2 items-center border-b border-teal-500 ">
                    <textarea
                    placeholder="Description de poste"
                    className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                    aria-label="Description poste"
                    name = 'Description'
                    value={Poste.Description}
                    onChange={handleInputChangePoste}
                    />
                </div>
                    <div className="w-1/5 m-2 items-center ">
                        <button
                         onClick={(e)=>{
                          e.preventDefault()
                          handleAddPoste()
                      }}
                    type="submit"
                    className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded">
                    Ajouter</button>
                    </div>
        </div>
        <div className='flex flex-col'>
              
                    <p className=" ml-auto text-sm mr-6  text-red-500">{ErreurChampsPoste}</p>
                    <p className=" ml-auto text-sm mr-6  text-green-500">{responseChampsPoste} </p>
                    </div>
        
        <div className="flex m-12 justify-end">
                    <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"   onClick={(e) => {
                                                                                                                        e.preventDefault()             
                                                                                                                        setcomposantVisibleposte(!composantVisibleposte);
                                                                                                                        fetchPostes() }} >
                        <div className="flex items-center">
                            <span>Tous les postes</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                            </svg>
                        </div>
                    </button>
        </div>
        {composantVisibleposte && (
  <div>
    <p className="text-base font-semibold m-8 leading-none text-gray-500">
      Historique complet des postes :
    </p>
    <div className="flex flex-col rounded shadow bg-gray-50 bg-opacity-5 p-4 m-2">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th
                    scope="col"
                    className="border-r px-6 py-4 dark:border-neutral-500"
                  >
                    Numéro
                  </th>
                  <th
                    scope="col"
                    className="border-r px-6 py-4 dark:border-neutral-500"
                  >
                    Nom de poste
                  </th>
                  <th
                    scope="col"
                    className="border-r px-6 py-4 dark:border-neutral-500"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="border-r px-6 py-4 dark:border-neutral-500"
                  >
                    Réglage
                  </th>
                </tr>
              </thead>
              <tbody>
                {PostesList.map((poste, index) => (
                  <tr
                    className="border-b dark:border-neutral-500"
                    key={poste.IDPoste}
                  >
                    <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                      <p> {poste.IDPoste}</p>
                    </td>
                    <td className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                    {changePoste && valeurposte === poste.IDPoste ? (
                          <input
                            className="m-2 p-2 border rounded-lg"
                            aria-label="Nom poste"
                            name="NomPoste"
                            value={NomPoste}
                            onChange={(e) => {
                              setNomPoste(e.target.value);
                            }}
                          />
                        ) : (  <p> {poste.NomPoste}</p>)}
                    </td>
                    <td className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                      <div>
                        {changePoste && valeurposte === poste.IDPoste ? (
                          <textarea
                            className="m-2 p-2 border rounded-lg"
                            aria-label="Description du poste"
                            name="Description"
                            value={DescriptionPoste}
                            onChange={(e) => {
                              setDescriptionPoste(e.target.value);
                            }}
                            rows="3"
                            cols="30"
                          />
                        ) : (
                          <p> {poste.Description}</p>
                        )}
                      </div>
                    </td>
                    <td className="flex items-center justify-center">
                      {!changePoste ? (
                        <div>
                          
                          <button
                            onClick={(e) => {
                              setvaleurposte(poste.IDPoste);
                              setChangePoste(true);
                              e.preventDefault();
                            }}
                            className="mr-2 p-2"
                          ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                         <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            className="mr-2 p-2"
                            onClick={(e) => {
                              updatePoste(poste.IDPoste);
                              setChangePoste(false);
                              setvaleurposte(0);
                              e.preventDefault();
                            }}
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                          </button>
                          <button
                            className="mr-2 p-2"
                            onClick={(e) => {
                              setChangePoste(false);
                              setvaleurposte(0);
                              e.preventDefault();
                            }}
                          >
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

        </div>
    </div>    
  );
};

export default Hierchie;
