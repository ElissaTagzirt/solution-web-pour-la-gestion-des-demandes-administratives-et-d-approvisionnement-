import React, { useState , useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function NewOutil(props) {

 
  const { IDDemande } = props;
  const { token } = useAuth();
  const navigate = useNavigate();
 // recupere les outils qui existe dans la base de donne 
  const [Outils,setOutils]=useState([])

  useEffect(()=>{
    const fetchOutils = () => {
      fetch('http://127.0.0.1:8000/outil/allOutils', {
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
        setOutils(newData); // Mettre à jour l'état avec les nouvelles données
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données :', error);
        });
    };
    fetchOutils();
  },[])
 
 // recupere un seule outil
  const [outil, setOutil] = useState({
    NomOutil: '',
    Description: '',
    Quantite: 0,
  });


  const [outilsList, setOutilsList] = useState([]); // Liste pour stocker les outils
  const [listevide , setListevide]=useState(false)




  const [erreurChampsRequis, setErreurChampsRequis] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOutil({
      ...outil,
      [name]: value,
    });
  };

  const handleAddOutil = (e) => {
    // Ajoutez l'outil actuel à la liste des outils
    e.preventDefault();
    setListevide(false)
    if (!outil.NomOutil || isNaN(parseInt(outil.Quantite)) || parseInt(outil.Quantite) < 0 || outil.Quantite==0) {
      setErreurChampsRequis(true);
    } else {
    setOutilsList([...outilsList, outil]);
    setErreurChampsRequis(false);

    // Réinitialisez l'objet outil pour le prochain ajout
   setOutil({
      NomOutil: '',
      Description: '',
      Quantite: 0,
    });
  }
  };

  //-----------------------------------------------------------------------
  const [erreurChampsRequisNonListe , seterreurChampsRequisNonListe]=useState(false)
  const [NonListeoutil, setNonListOutil] = useState({
    NomOutil: '',
    Description: '',
    Quantite: 0
  });


  const handleInputChangeNonList = (e) => {
    const { name, value } = e.target;
    setNonListOutil({
      ...NonListeoutil,
      [name]: value,
    });
  };

  const handleAddOutilNonList = (e) => {
    
    // Ajoutez l'outil actuel à la liste des outils
    e.preventDefault();
    setListevide(false)
    if (!NonListeoutil.NomOutil || isNaN(parseInt(NonListeoutil.Quantite)) || parseInt(NonListeoutil.Quantite) < 0 || NonListeoutil.Quantite==0) {
      seterreurChampsRequisNonListe(true);
    }else{
    setOutilsList([...outilsList, NonListeoutil]);
    seterreurChampsRequisNonListe(false);
    // Réinitialisez l'objet outil pour le prochain ajout
   setNonListOutil({
      NomOutil: '',
      Description: '',
      Quantite: 0,
    });}
  };

  // requets pour faire le subbmit vers le backend 
 
  const handleSubmit = () => { 
    console.log(props.IDDemande)
    if (outilsList.length === 0) {
      setListevide(true)
    } else {
      
  fetch(`http://127.0.0.1:8000/Demandes/demandes/${IDDemande}/SelectOutils`, {
    method: 'POST', // Méthode HTTP pour envoyer des données au backend (POST dans ce cas)
    headers: {
      'Content-Type': 'application/json', // Type de contenu JSON
      'Authorization': `Bearer ${token}`
      // Vous pouvez également inclure des en-têtes d'authentification ou d'autres en-têtes requis ici
    },
    body: JSON.stringify({ outils: outilsList }), // Convertir l'objet JavaScript en chaîne JSON
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur HTTP : ' + response.status);
      }
      return response.json(); // Parse la réponse JSON du backend
    })
    .then(data => {
      console.log('Réponse du backend :', data);
      navigate(`/user/ConsulterDemande/${IDDemande}`);
      // Faites quelque chose avec la réponse du backend ici
    })
    .catch(error => {
      console.error('Erreur lors de la requête fetch :', error);
      // Gérez l'erreur ici
    });
  }
  }


  //----------------- Pour retire un outil ------------------------------
  const supprimeOutils = (index) => {
  // Créez une copie de la liste des outils
   const nouvelleListeOutils = [...outilsList];
  
   // Utilisez la méthode splice pour supprimer l'outil à l'index donné
   nouvelleListeOutils.splice(index, 1);
 
   // Mettez à jour la liste des outils
   setOutilsList(nouvelleListeOutils);
 };
//----------------------------------------------------------------------
 const handeleVide = ()=>{ setOutilsList([])}


//-------------- Annuler la demande ------------------------------------
const annulerDemande = (e) => {
  e.preventDefault()
  const url = `http://127.0.0.1:8000/Demandes/AnnulerDemande/${IDDemande}`;

  fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json' ,
      'Authorization': `Bearer ${token}`
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur lors de la requête : ${response.status} ${response.statusText}`);
    }
    return response.json(); // Convertir la réponse en JSON
  })
  .then(data => {
    console.log('Réponse du backend :', data);
    navigate('/user/mes-demandes');
  })
  .catch(error => {
    console.error('Erreur lors de la requête :', error);
    // Gérez les erreurs ici
  });
} 


  return (

    
<div className="m-4 w-full rounded shadow-lg">
       
        <div className="flex items-center my-8 pl-8">
           <p className="text-3xl font-medium mt-5 leading-none text-teal-500 mr-2">Ajouter des outils à votre demande</p>
        </div>

        <div className="mx-4">
            <form>
                <div className="flex items-center my-8 pl-4">
                    <p className="text-lg font-medium mt-5 leading-none text-gray-500">Sélectionnez vos outils ici :</p>
                </div>

                <div className="flex py-2">
                      <div className='w-1/5 m-2 items-center border-b border-teal-500'>
                          <div className="relative flex-grow">
                              <select
                              className="appearance-none bg-transparent border-none w-full text-gray-500 py-1 px-2 leading-tight focus:outline-none"
                              aria-label="Nom outil"
                              name="NomOutil"
                              value={outil.NomOutil}
                              onChange={handleInputChange}>
                              <option value="">Sélectionnez un outil</option>
                              {Outils.map((ps) => (  <option key={ps.IDOutil} value={ps.NomOutil}>{ps.NomOutil}</option>))}
                            
                              {/* Ajoutez d'autres options ici */}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                              </div>
                          </div>
                    </div>

                
                        <div className='w-1/5 m-2 items-center border-b border-teal-500'>
                            <input
                            type="number"
                            placeholder="Quantité"
                            name='Quantite'
                            value={outil.Quantite}
                            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                            onChange={handleInputChange}
                            />
                        </div>
                    
                    <div className="w-2/5 m-2 items-center border-b border-teal-500 ">
                      <textarea
                      placeholder="Description de l'outil"
                      className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                      aria-label="Description outil"
                      value={outil.Description}
                      name = 'Description'
                      onChange={handleInputChange}
                      />
                  </div>

                    <div className="w-1/4 pl-4">
                    <button  onClick={handleAddOutil}
                     className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                        Add
                    </button>
                    </div>
                </div>
                {erreurChampsRequis && (
      <p className=" float-right text-sm mr-3 text-red-500">Veuillez remplir tous les champs requis : nom et quantité de l'outil</p>
    )}
            </form>
        </div>

        <div className="mx-4 ">
            <form>
            <div className="flex items-center my-8 pl-4">
           <p className="text-lg font-medium mt-5 leading-none text-gray-500 ">
           Si votre outil ne figure pas dans la liste, saisissez les détails ici :</p>
        </div>
            
        <div className="flex py-2">
        <div className="w-1/5 m-2 items-center border-b border-teal-500 ">
            <input
            type="text"
            placeholder="Nom de l'outil"
            className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
            aria-label="Nom outil"
            value={NonListeoutil.NomOutil}
            name='NomOutil'
            onChange={handleInputChangeNonList}
            /> 
        </div>

        <div className="w-1/5 m-2 items-center border-b border-teal-500 ">
            <input
            type="number"
            placeholder="Quantité"
            className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
            value={NonListeoutil.Quantite}
            name='Quantite'
            onChange={handleInputChangeNonList}
            />
        </div>

        <div className="w-2/5 m-2 items-center border-b border-teal-500 ">
            <textarea
            placeholder="Description de l'outil"
            className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
            aria-label="Description outil"
            name = 'Description'
            value={NonListeoutil.Description}
            onChange={handleInputChangeNonList}
            />
        </div>
            <div className="w-1/5 m-2 items-center ">
                <button
                onClick={handleAddOutilNonList}
            type="submit"
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded">
            Add</button>
            </div>    
        </div>
       
            </form> {erreurChampsRequisNonListe && (
      <p className=" float-right text-sm mr-3 text-red-500">Veuillez remplir tous les champs requis : nom et quantité de l'outil</p>
    )}
        </div>

     
<div className="flex w-full flex-col">
  <div className="flex items-center my-8 pl-8">
    <p className="text-lg font-medium mt-5 leading-none text-gray-500">
      La liste des outils de votre demande :
    </p>
  </div>

  <div className="overflow-x-auto">
    <div className="inline-block min-w-full py-2 px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden">
        <table className="w-full text-center text-sm font-light">
          <thead className="border-b bg-teal-500 font-medium text-white">
            <tr>
              <th scope="col" className="px-6 py-4">#</th>
              <th scope="col" className="px-6 py-4">Nom Outil</th>
              <th scope="col" className="px-6 py-4">Quantité</th>
              <th scope="col" className="px-6 py-4">Déscription</th>
              <th scope="col" className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            
          {outilsList.map((outil, index) => ( <tr key={index} className="border-b dark:border-neutral-500 focus:outline-none border border-gray-100  rounded">
              <td className="whitespace-nowrap px-6 py-4 ">{index}</td>
              <td className="whitespace-nowrap px-6 py-4">{outil.NomOutil}</td>
              <td className="whitespace-nowrap px-6 py-4">{outil.Quantite}</td>
              <td className="whitespace-nowrap px-6 py-4">{outil.Description}</td>
              <td> 
                <button><svg onClick={() => supprimeOutils(index)}
                className="h-5 w-5 text-grey-100"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"> 
                 <polyline points="3 6 5 6 21 6" />  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
              </td>
            </tr> ))}
          </tbody>
        </table>
      </div>
    </div>
  </div> 
  <div className="flex justify-end mr-4">
  {listevide && (
      <p className="float-right text-sm mr-3 text-red-500">Vous devez au moins ajouter un outil à votre liste pour continuer
      </p>
    )}
    </div> 

<div className="flex justify-end p-4 ">
  

  <button onClick={handeleVide}
   className="m-4 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
    Vider ma liste
  </button>
  <button 
  onClick={annulerDemande}
  className="m-4 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
    Annuler ma demande
  </button>
  <button onClick={handleSubmit}
   className="m-4 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
    Valider ma demande
  </button>

 
</div>


       </div>
      
</div>

  );
}

export default NewOutil;
