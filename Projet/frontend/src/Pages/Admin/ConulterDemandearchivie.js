import React ,{useState , useEffect} from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
const ConsulterDemandesArchivie = () => {
    const [data, setData] = useState([]);
    const [reload , setReload]=useState(false)
    const { token } = useAuth();
    const navigate = useNavigate();  
    useEffect(() => {
        const fetchData = () => {
          fetch('http://127.0.0.1:8000/Demandes/UsersDemandesArchive/', {
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
              newData.sort((a, b) => {
                const dateA = new Date(a.DateMiseAjour);
                const dateB = new Date(b.DateMiseAjour);
        
                return dateB - dateA;
              });
              setData(newData); // Mettre à jour l'état avec les nouvelles données
              
            })
            .catch(error => {
              console.error('Erreur lors de la récupération des données :', error);
            });
        };
        fetchData();
      }, [reload]);

  
  
      const DeleteDemande = (IDDemande) => {
      
        const url = `http://127.0.0.1:8000/Demandes/Delete/${IDDemande}`;
        
    
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
          if (data.message === "demande supprime") {
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
      

    const handleClickConsulterDemande = (IDDemande) => {
        /// e.preventDefault();
        console.log(IDDemande)
         navigate(`/admin/ConsulterDemande/${IDDemande}`);
 }

    return (
        <div className="shadow rounded m-4">
             <div className="flex items-center my-8 pl-8">
                <p className="text-2xl font-medium mt-5 leading-none text-teal-500">
                La liste des demandes archiviées:
                </p>
            </div>

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full px-1 sm:px-2 lg:px-4">
                <div className="overflow-hidden">
                    <table className="w-full text-center text-xs sm:text-sm font-light">
                    <thead className="border-b bg-teal-500  font-medium text-white">
                        <tr>
                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">Numéro</th>
                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">Objet</th>
                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">e-mail createur</th>
                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">e-mail destinataire</th>

                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">Date Mise à jour</th>
                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">État demande</th>
                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2"></th>
                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2"></th>
                        <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2"></th>
                        </tr>
                    </thead> 
                    <tbody>
                      {data.map(item => (  <tr key={item.IDDemande} className="border-b dark:border-neutral-500 focus:outline-none border border-gray-100  rounded">
                        <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2 font-medium">{item.IDDemande}</td>
                        <td className="whitespace-pre-wrap px-1 sm:px-2 py-1 sm:py-2">{item.ObjetDemande}</td>
                        <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2">{item.createur_email}</td>
                        <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2">{item.destinataire_email}</td>
                        <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2">
                          {format(new Date(item.DateMiseAjour), 'dd/MM/yyyy HH:mm:ss')}
                        </td>
                        <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2">{item.StatueDemande}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                        <button
                            type="submit"
                            onClick={(e) => {
                              e.preventDefault()
                              handleClickConsulterDemande(item.IDDemande)}}
                            className="inline-block px-2 flex  shadow py-2 bg-[#52B8B5] text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            <p>Consulter</p>
                            
                          </button>
                          </td>
                          
                            <td>
            
                            <button
                              type="submit"
                              onClick={(e)=>{
                                e.preventDefault()
                                DeleteDemande(item.IDDemande)
                              }}
                              className="inline-block ml-2 px-2 flex  shadow py-2 bg-[#52B8B5] text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>

                              <p>Supprimer</p>
                            </button>


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
export default ConsulterDemandesArchivie;