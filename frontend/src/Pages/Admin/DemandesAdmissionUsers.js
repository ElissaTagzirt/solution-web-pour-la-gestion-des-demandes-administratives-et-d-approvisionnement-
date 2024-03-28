import React, {useState, useEffect} from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate} from 'react-router-dom';


function DemandesAdmissionUsers() {
  const [users, setUser]=useState([]);
  const [reload,setreload]=useState(false);
  const [numeroDemande,setnumeroDemande]=useState(0);
  const [erreur,setErreur]=useState('');
  const [userdata,setUserdata]=useState({
    IDDemandeAdminition : 0,
    name: "",
    email: "",
    numeroDeTelephone: "",
    adresse: "",
    dateNaissance: ""
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserdata({
      ...userdata,
      [name]: value,
    });
  };
  const { token } = useAuth();
  const navigate = useNavigate();
  

  
  


  



  const headings = [
    {
      key: 'NumeroUtilisateur',
      value: 'N°',
    },
    {
      key: 'Nom',
      value: 'Nom',
    },
    {
        key: 'Date naissance',
        value: 'Date naissance',
      },
    {
      key: 'Telephone',
      value: 'Téléphone',
    },
    {
      key: 'Email',
      value: 'Email',
    },
    {
      key: 'Adresse',
      value: 'Adresse',
    },
    {
      key: 'options',
      value: 'options',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = 'http://127.0.0.1:8000/DemandeAdmissionUser/GetAlldemandesAdmission/';
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
    
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
    
        const data = await response.json();
        setUser(data);

        setreload(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    

    fetchData();
  }, [reload]);

  //------------------ Supprime demande ------------------------------------------
  const handleDelete = (demandeId) => {
    const apiUrl = `http://127.0.0.1:8000/DemandeAdmissionUser/DeleteDemandeAdmission/${demandeId}`;
  
    fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`, // Remplacez par votre jeton JWT
      },
    })
      .then((response) => {
        if (response.ok) {
          // La demande de suppression a réussi
          console.log(`La demande ${demandeId} a été supprimée avec succès.`);
          // Vous pouvez mettre à jour votre interface utilisateur ou effectuer d'autres actions ici
        } else {
          // La demande de suppression a échoué
          console.error(`La demande ${demandeId} n'a pas pu être supprimée.`);
          // Gérez les erreurs ici
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la demande de suppression : ', error);
        // Gérez les erreurs réseau ici
      });
  };

  //-------------------- Mettre a jour la demande ------------------------------------
  const updateDemandeAdmission = () => {
    const apiUrl = `http://127.0.0.1:8000/DemandeAdmissionUser/UpdateDemandeAdmission/`;
  
    try {
      fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userdata), // userdata doit contenir toutes les données nécessaires pour la mise à jour
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.message) {
          setErreur('');
          setnumeroDemande(0);
          setUserdata({
            IDDemandeAdminition: 0,
            name: "",
            email: "",
            numeroDeTelephone: "",
            adresse: "",
            dateNaissance: ""
          });
          setreload(true);
        } else if (data.detail) {
          setErreur(data.detail);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour de la demande:', error);
        throw error;
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la demande:', error);
      throw error;
    }
  };

// ----------------------------- Valide et ajouter  l'utilisateur --------------------------------------------------------
function getDemandeAdmissionUser(userId) {
    const apiUrl = `http://127.0.0.1:8000/DemandeAdmissionUser/GetDemandeadmissionUser/${userId}`;
  
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Données de demande d\'admission:', data);
      setreload(true);
      setnumeroDemande(0);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données de demande d\'admission:', error);
    });
  }
  
  
  
  
 
  


  return (
     <div className="">
       {erreur && (
        <p className="text-sm text-red-500 mt-4 ml-auto mr-5 text-right">{erreur}</p>
        )}

      <div className="container mx-auto py-3 px-4">
       

       <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto h-full   " >
          <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
            <thead>
              <tr className="text-left">
                {headings.map((heading) => (
                  <th
                    key={heading.key}
                    className={`bg-teal-500 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs ${heading.key}`}
                  >
                    {heading.value}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="border-dashed border-t text-gray-500 border-gray-200 px-6 py-3">
                  <div>
                       {user.IDDemandeAdminition}
                    </div>
                    
                    </td>
                  <td className="border-dashed border-t text-gray-500 border-gray-200 px-6 py-3">
                   {!( numeroDemande === user.IDDemandeAdminition) ? (  <div>{user.name} </div>):(
                    <input
                    type="text"
                    className=" w-3/8 px-4 py-2 mr-4 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                    id="name"
                    name="name"
                    value={userdata.name}
                    onChange={handleInputChange}
                    required
                  />
                   )}
                    </td>
                  <td className="border-dashed border-t text-gray-500 border-gray-200 px-6 py-3">
                  {!( numeroDemande === user.IDDemandeAdminition) ? (  <div>
                    {user.dateNaissance}</div>):(
                        <input
                        type="date"
                        className=" w-3/8 px-4 py-2 mr-4 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                        name="dateNaissance"
                        value={userdata.dateNaissance}
                        onChange={handleInputChange}
                        required
                    />)}
                    </td>
                  <td className="border-dashed border-t text-gray-500 border-gray-200 px-6 py-3">
                  {!( numeroDemande === user.IDDemandeAdminition) ? (  <div>
                    {user.numeroDeTelephone}</div>):(
                        <input
                        type="text"
                        className=" w-3/8 px-4 py-2 mr-4 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                        name="numeroDeTelephone"
                        value={userdata.numeroDeTelephone}
                        onChange={handleInputChange}
                        required
                    />)}</td>
                  <td className="border-dashed border-t text-gray-500 border-gray-200 px-6 py-3">
                  {!( numeroDemande === user.IDDemandeAdminition) ? (  <div>
                    
                    {user.email}</div>):( <input
                        type="text"
                        className=" w-3/8 px-4 py-2 mr-4 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                        name="email"
                        value={userdata.email}
                        onChange={handleInputChange}
                        required
                    />)}</td> 
                  <td className="border-dashed border-t text-gray-500 border-gray-200 px-6 py-3">
                    {!( numeroDemande === user.IDDemandeAdminition) ? (  <div>
                    
                    {user.adresse}</div>):( <input
                        type="text"
                        className=" w-3/8 px-4 py-2 mr-4 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:outline-none"
                        name="adresse"
                        value={userdata.adresse}
                        onChange={handleInputChange}
                        required
                    />)}</td>
                 
                        
                          <td className="border-dashed border-t text-gray-500 border-gray-200 px-3 py-3">
                          {!(numeroDemande===user.IDDemandeAdminition) ? (
                            <div className='flex'>
                                <button className='m-1 p-1 bg-teal-500 rounded-full'
                                 onClick={(e)=>{
                                    e.preventDefault()
                                    getDemandeAdmissionUser(user.IDDemandeAdminition)
                                     
                                 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>



                                </button>

                                <button className='m-1 p-1 bg-teal-500 rounded-full'
                                 onClick={(e)=>{
                                    e.preventDefault()
                                    setnumeroDemande(user.IDDemandeAdminition);
                                    setUserdata({
                                        IDDemandeAdminition : user.IDDemandeAdminition,    
                                        name:user.name ,
                                        email: user.email,
                                        numeroDeTelephone: user.numeroDeTelephone,
                                        adresse: user.adresse,
                                        dateNaissance: user.dateNaissance});
                                    console.log(numeroDemande)
                                     
                                 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>


                                </button>

                                <button className='m-1 p-1 bg-teal-500 rounded-full'
                                 onClick={(e)=>{
                                    e.preventDefault();
                                    handleDelete(user.IDDemandeAdminition);
                                    setreload(true);
                                     
                                 }}
                                >
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                 </svg>
                                </button>
                            </div> ):(<div className='flex'>
                                <button className='m-2 p-1 bg-teal-500 rounded-full'
                                 onClick={(e)=>{
                                    e.preventDefault()
                                    updateDemandeAdmission();
                                     
                                 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>




                                </button>
                                <button className='m-2 p-1 bg-teal-500 rounded-full'
                                 onClick={(e)=>{
                                    e.preventDefault()
                                    setnumeroDemande(0);
                                    setUserdata({
                                        IDDemandeAdminition : 0,
                                        name: "",
                                        email: "",
                                        numeroDeTelephone: "",
                                        adresse: "",
                                        dateNaissance: ""});
                                    setErreur('');      
                                     
                                 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                    </svg>




                                </button>

                            </div>)}
                          </td>
                </tr>
                
              ))}
            </tbody>
          </table>
        </div>  
      </div>
    </div>

  );
}

export default DemandesAdmissionUsers;
