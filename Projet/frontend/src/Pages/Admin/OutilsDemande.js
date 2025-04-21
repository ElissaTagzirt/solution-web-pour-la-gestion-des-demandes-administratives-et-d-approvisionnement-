import React ,{useState , useEffect} from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
const OutilsDemande= () => {
    const [data, setData] = useState([]);
    const [reload , setReload]=useState(false);
    const [modifie,setModifie]=useState(false);
    const [caseModifie,setCaseModifie]=useState(0);
    const [Ajoute ,setAjouter]=useState(false);
    const [dataModifie,setDataModifie]=useState({Description:'', NomOutil:''})
    const { token } = useAuth();
    const navigate = useNavigate(); 
    
    const handleInputChangeData = (e) => {
        const { name, value } = e.target;
        setDataModifie({
          ...dataModifie,
          [name]: value,
        });
      };
    useEffect(() => {
        const fetchData = () => {
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
              
              setReload(false)
              setData(newData); // Mettre à jour l'état avec les nouvelles données
            })
            .catch(error => {
              console.error('Erreur lors de la récupération des données :', error);
            });
        };
        fetchData();
      }, [reload]);

  //'http://127.0.0.1:8000/Demandes/UsersDemandes/
  const ValideModification = (IDOutil) => {
    const url = `http://127.0.0.1:8000/outil/Update/${IDOutil}`;
  
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataModifie) // Utilisez les données de dataModifie
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erreur lors de la requête : ${response.status} ${response.statusText}`);
      }
      return response.json(); // Convertir la réponse en JSON
    })
    .then(data => {
      if (data.message === "Updated") {
        setReload(true);
        setDataModifie({
            Description :'',
            NomOutil : ''
         })
         setModifie(false);
         setCaseModifie(0);
      } else {
        console.error('Erreur lors de la requête :', data.detail);
        // Gérez les erreurs ici
      }
    })
    .catch(error => {
      console.error('Erreur lors de la requête :', error);
      // Gérez les erreurs ici
    });
  }

  //------------------- Cree un Nouveau outils -----------------------------------------------------------

  const handleCreateOutil = () => {
    const url = `http://127.0.0.1:8000/outil/create/`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataModifie),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur lors de la requête : ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "Outil ajouter") {
          setReload(true);
          setDataModifie({
            Description: "",
            NomOutil: "",
          });
          setModifie(false);
          setCaseModifie(0);
        } else {
          console.error("Erreur lors de la requête :", data.detail);
          // Gérez les erreurs ici
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la requête :", error);
        // Gérez les erreurs ici
      });
  };

  


      
  
      const DeleteDemande = (IDOutil) => {
        const url = `http://127.0.0.1:8000/outil/delete/${IDOutil}`;
        
    
        fetch(url, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
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
          if (data.message === "outil supprimer") {
            setReload(true);}
          else{
            console.error('Erreur lors de la requête :', data.detail);
          }
        })
        .catch(error => {
          console.error('Erreur lors de la requête :', error);
          // Gérez les erreurs ici
        });
        
      }
      

 

    return (
        <div className="shadow rounded m-4">
             <div className="flex items-center my-8 pl-8">
                <p className="text-3xl font-medium mt-5 leading-none text-teal-500">
                La liste des outil:
                </p>
            </div>
 


            {/* Formulaire pour ajouter un nouvel outil */}
  {  Ajoute ? ( <div className="p-4 ">
        <h2 className="text-lg font-medium text-teal-600">Ajouter un nouvel outil :</h2>
        <div className="mt-4  ml-2 flex flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Nom de l'outil"
            className=" w-3/8 px-4 py-2 mr-4 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            name="NomOutil"
            value={dataModifie.NomOutil}
            onChange={handleInputChangeData}
          />
          <input
            type="text"
            placeholder="Description"
            className="w-3/8 mt-2 sm:mt-0 px-4  mr-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
            name="Description"
            value={dataModifie.Description}
            onChange={handleInputChangeData}
          />
          <button
            onClick={handleCreateOutil}
            className="mt-2 sm:mt-0 ml-auto mr-4  flex items-center px-2 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring focus:ring-teal-200"
            >
            <span>Valider</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            </button>
            <button
            onClick={()=>{
                setDataModifie({
                    Description :'',
                    NomOutil : ''
                 })
                 setAjouter(false);
            }}
            className="mt-2 sm:mt-0 ml-auto mr-2  flex items-center px-2 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring focus:ring-teal-200"
            >
            <span>Annuler</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            </button>

        </div>
      </div> ) : (<button
            onClick={()=>{
                setAjouter(true);
            }}
            className="m-4 mr-8 sm:mt-0 ml-auto mr-2  flex items-center px-2 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring focus:ring-teal-200"
            >
            <span className="mr-2">Ajouter</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            </button>)}




            <div className="overflow-x-auto">
                <div className="inline-block min-w-full px-1 sm:px-2 lg:px-4">
                <div className="overflow-hidden">
                    <table className="w-full text-center text-xs sm:text-sm font-light">
                    <thead className="border-b bg-teal-500  font-medium text-white">
                        <tr>
                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">Numéro</th>
                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">Nom outil</th>
                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">Description</th>
                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2"></th>
                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2"></th>
                        </tr>
                    </thead> 
                    <tbody>
                      {data.map((item , index ) => (  <tr key={index} className="border-b dark:border-neutral-500 focus:outline-none border border-gray-100  rounded">
                        <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2 font-medium">{item.IDOutil}</td>
                        <td className="whitespace-pre-wrap px-1 sm:px-2 py-1 sm:py-2">
                           { (modifie && caseModifie === item.IDOutil) ? (
                             <input
                             type="text"
                             placeholder="Nom de l'outil"
                             className="appearance-none ml-2 bg-transparent border-none w-full text-gray-700 py-1 px-2 h-12 leading-tight focus:outline-none"
                             aria-label="Nom Outil"
                             value={dataModifie.NomOutil}
                             name='NomOutil'
                             onChange={handleInputChangeData}
                             /> ):(
                                <p className="text-center mt-2">{item.NomOutil}</p>

                           ) } </td>
                        <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2">
                            { (modifie && caseModifie === item.IDOutil) ? (
                                <input
                                type="text"
                                placeholder="Description"
                                className="appearance-none ml-2 bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight h-12 focus:outline-none"
                                aria-label="Description"
                                value={dataModifie.Description}
                                name='Description'
                                onChange={handleInputChangeData}
                                /> ):(
                                <p className="text-center">{item.Description}</p>
                            ) } 
                        </td>
                        <td>
                        { (modifie && caseModifie === item.IDOutil) ?(
                                <button
                                type="submit"
                                onClick={(e)=>{
                                  e.preventDefault()
                                  setModifie(true);
                                  setCaseModifie(0);
                                  ValideModification(item.IDOutil);
                                }}
                                className="inline-block px-2 flex   shadow py-2 bg-[#52B8B5] text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>

                                <p>Validée</p>

                                </button>
                            ): (  
                                <button
                                   type="submit"
                                   onClick={(e)=>{
                                     e.preventDefault()
                                     setModifie(true);
                                     setCaseModifie(item.IDOutil);
                                    
                                   }}
                                   className="inline-block px-2 flex   shadow py-2 bg-[#52B8B5] text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right"
                                 >
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-5">
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                       </svg>
                                   <p>Modifie</p>
                                 </button> )}

                        </td>
                        <td>
                        { ( modifie && caseModifie === item.IDOutil) ? (
                               <button
                               type="submit"
                               onClick={(e)=>{
                                 e.preventDefault()
                                 setDataModifie({
                                    Description :'',
                                    NomOutil : ''
                                 })
                                 setModifie(false);
                                 setCaseModifie(0);
                               }}
                               className="inline-block px-2 flex   shadow py-2 bg-[#52B8B5] text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right"
                             >
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                               </svg>

                               <p>Annuler</p>

                               </button>

                            ): (
                                <button
                                  type="submit"
                                  onClick={(e)=>{
                                    e.preventDefault()
                                    DeleteDemande(item.IDOutil)
                                  }}
                                  className="inline-block mr-4 px-2 flex  shadow py-2 bg-[#52B8B5] text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
    
                                  <p>Supprimer</p>
                                </button>)}


                        </td>
                            </tr>))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>  
        </div>
    )
}
export default OutilsDemande;