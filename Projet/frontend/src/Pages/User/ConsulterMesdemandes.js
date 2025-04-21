import React ,{useState , useEffect} from "react";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const ConsulterMesdemandes = () => {
    const [data, setData] = useState([]);
    const [archive,setArchive]=useState(false);
    const { token } = useAuth();  
        useEffect(() => {
          const fetchData = () => {
            fetch('http://127.0.0.1:8000/Demandes/MesdemandesCreees/ ', {
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
                newData.sort((a, b) => {
                  const dateA = new Date(a.DateCreation);
                  const dateB = new Date(b.DateCreation);
          
                  return dateB - dateA;
                });
                setData(newData); // Mettre à jour l'état avec les nouvelles données
              })
              .catch(error => {
                console.error('Erreur lors de la récupération des données :', error);
              });
          };
          fetchData();
        }, [archive]);
    
    const navigate = useNavigate();
        
    const handleClickConsulterMADemande = (id) => {
           // e.preventDefault();
            navigate(`/user/ConsulterMaDemande/${id}`); 
    }
    const ArchiverDemande = (IDDemande) => {
      
      const url = `http://127.0.0.1:8000/Demandes/ArchiverDemande/${IDDemande}`;
  
      fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      .then(response => {
        if (!response.ok) {
          //throw new Error(`Erreur lors de la requête : ${response.status} ${response.statusText}`);
        }
        return response.json(); // Convertir la réponse en JSON
      })
      .then(data => {
        setArchive(true);
      })
      .catch(error => {
        console.error('Erreur lors de la requête :', error.detail);
        // Gérez les erreurs ici
      });
    }
      
        
    return (
      

      
      
         
        
        <div className="shadow rounded m-4 flex-grow ">
            
             <div className="flex items-center my-8 pl-8">
                <p className="text-lg font-medium mt-5 leading-none text-gray-700">
                La liste de mes demandes :
                </p>
            </div>

<div className="overflow-x-auto">
  <div className="inline-block min-w-full px-1 sm:px-2 lg:px-4">
    <div className="overflow-hidden">
      <table className="w-full text-center text-xs sm:text-sm font-light">
        <thead className="border-b bg-teal-500 font-medium text-white">
          <tr>
            <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">Numéro</th>
            <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">Objet</th>
            <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">Service</th>
            <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">Siège</th>
            <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">Email</th>
            <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">Date Mise à jour</th>
            <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2">État demande</th>
            <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2"></th>
            <th scope="col" className="px-1 sm:px-2 py-1 sm:py-2"></th>
          </tr>
        </thead>
        <tbody>
        {data.map(item => (
          <tr key={item.IDDemande} className="border-b dark:border-neutral-500 focus:outline-none border border-gray-100 rounded">
            <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2 font-medium">{item.IDDemande}</td>
            <td className="whitespace-pre-wrap px-1 sm:px-2 py-1 sm:py-2">{item.ObjetDemande}</td>
            <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2">{item.NomServiceDestinataire}</td>
            <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2">{item.NomSiegeDestinataire}</td>
            <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2">{item.destinataire_email}</td>
            <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2">{item.DateMiseAjour}</td>
            <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2">{item.StatueDemande}</td>
            <td className="whitespace-nowrap px-1 sm:px-2 py-1 sm:py-2">
          

              <button
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              handleClickConsulterMADemande(item.IDDemande)}}
            className="inline-block px-2 flex  shadow py-2 bg-[#52B8B5] text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            <p>Consulter</p>
            
          </button>
            </td>
            {["Validée", "Annuler", "inatteignable"].includes(item.StatueDemande) && (
          
            <td>
            
               <button
            type="submit"
            onClick={(e)=>{
              e.preventDefault()
              ArchiverDemande(item.IDDemande)
            }}
            className="inline-block px-2 flex  shadow py-2 bg-[#52B8B5] text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
            <p>Archiver</p>
          </button>
              

            </td> )}
          </tr>
           ))}
          {/* Autres lignes de tableau */}
        </tbody>
      </table>
    </div>
  </div>
</div>


        </div>
        
    )
}
export default ConsulterMesdemandes;