import React, { useState , useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NewOutil from '../../components/NewOutil';


const NouvelleDemande = () => {
  



 //Pour recuperes les donnees des sieges poste et services de backend
 const { token } = useAuth();



 const [afficherDeuxiemeFormulaire, setAfficherDeuxiemeFormulaire] = useState(false);

 const [Sieges , setSieges]=useState([]);
 const [Services , setServices]=useState([]);
 const [Postes , setPostes]=useState([]);
//------- les fonction fetch -----------------------------
    useEffect(() => {
      const fetchSieges = () => {
        fetch('http://127.0.0.1:8000/siege/All-Sieges/', {
          headers: {
            Authorization: `Bearer ${token}`
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


  const [IDDemande , setIDDemande]=useState('');
//********************************************************************** */

  const [emailDestinataire, setEmailDestinataire] = useState('');
  const [serviceDestinataire, setServiceDestinataire] = useState('');
  const [siegeDestinataire, setSiegeDestinataire] = useState('');
  const [posteDestinataire, setPosteDestinataire] = useState('');
  //information sur la demande
  const [description, setDescription] = useState('');
  const [delaiDemande , setDelaiDemane] = useState('');
  const [objet, setObjet] = useState('');

  // mes information
  const [Monservice, setMonService] = useState('');
  const [Monsiege, setMonSiege] = useState('');
  const [Monposte, setMonPoste] = useState('');
  //------------------------------------------------------------------------------
  const [erreurDestinataire ,seterreurDestinataire]=useState(false)
  const [Meserreur ,setMeserreur]=useState(false)
  const [Emailerreru ,setEmailerreur]=useState(false)
  const [DateOublie ,setDateOublie]=useState(false)
  function soumettreFormulaire(e) {
    console.log(siegeDestinataire)
    e.preventDefault();
   
    
    if ( Monsiege ==="" ||  Monservice===""||Monposte===""){
      setMeserreur(true)
    }else if( siegeDestinataire === "" ||  serviceDestinataire===""||posteDestinataire===""){
      seterreurDestinataire(true)
    } else if (delaiDemande===''){
      setDateOublie(true)
     
    }else{
      setDateOublie(false)
      seterreurDestinataire(false)
      setMeserreur(false)
      setEmailerreur(false)

    const formData = {
      Description: description,
      ObjetDemande: objet,
      DateDernierDelai: delaiDemande !== '' ? delaiDemande : '0000-00-00',
      
      destinataire_email: emailDestinataire,

      MonSiege: Monsiege,
      MonService: Monservice,
      MonPoste: Monposte,
      
      NomSiegeDestinataire :siegeDestinataire ,
      NomServiceDestinataire : serviceDestinataire ,
      NomPosteDestinataire : posteDestinataire ,
      
    };
    console.log(formData)
    
    e.preventDefault();
    fetch('http://127.0.0.1:8000/Demandes/createdemande/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
         // throw new Error('Erreur lors de la requête');
        }
        return response.json();
      })
      .then((data) => {
        // Traitement des données de réponse si nécessaire
        console.log('Réponse du serveur :', data);
        if (data.detail === "L'adresse e-mail introduite est incorrecte"){
          setEmailerreur(true)
        }
        if(data.IDDemande){
          setIDDemande(data.IDDemande)
          setAfficherDeuxiemeFormulaire(true)
        }
      })
      .catch((error) => {
        console.error('Erreur :', error);
      });
    }
}

//-------------------------------------------- Annuler la demande -----------------------------------------------

  

  return (
    <div className="min-h-screen flex m-6 items-center justify-center">
    {!afficherDeuxiemeFormulaire  ? (<div className="mb:w-2/3 w-full p-6 bg-[#F5F5F5] rounded-lg shadow-md">
      <h1   style={{ color: '#52B8B5' }}  className="text-2xl font-bold mb-4">Nouvelle Demande</h1>
      <form className="">
        
         <div><h1   style={{ color: '#52B8B5' }}  className="text-lg font-medium mb-4">Mes Coordonnées</h1></div>
         <div className='grid my-4 grid-cols-3 md:grid-cols-3 gap-3'>
        <div className="">
          <label className="block text-sm font-medium text-gray-500">Mon siège</label>
          <select
            className="mt-2 p-2 block  shadow w-full text-gray-500  rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={Monsiege}
            onChange={(e) => setMonSiege(e.target.value)}
          > <option value="">Sélectionnez un siège</option>
           {Sieges.map((ps,index) => ( <option key={index} value={ps.NomSieges}>{ps.NomSiege}</option>))}
           
          </select>
        </div>
         <div className="">
          <label className="block text-sm font-medium text-gray-500">Mon service</label>
          <select
            className="mt-2 p-2 block  shadow w-full  text-gray-500 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={Monservice}
            onChange={(e) => setMonService(e.target.value)}
          >
            <option value="">Sélectionnez un service</option>
            {Services.map((ps ,index) => (  <option key={index} value={ps.NomService}>{ps.NomService}</option>))}
          </select>
        </div>
        <div className="">
          <label className="block text-sm font-medium text-gray-500">Mon poste</label>
           <select
            className="mt-2 p-2 block  shadow w-full  text-gray-500 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={Monposte}
            onChange={(e) => setMonPoste(e.target.value)}
          >
            <option value="">Sélectionnez un poste</option>
          {Postes.map((ps,index) => (  <option  key={index} value={ps.NomPoste}>{ps.NomPoste}</option>))}
          </select> 
        </div>
         
      
         </div>
        
         {Meserreur && (
      <p className=" float-right text-sm mr-3 mb-6 text-red-500">Veuillez remplir tous les champs requis : siège, service et poste </p>
    )}
       
       <div className=''><h1   style={{ color: '#52B8B5' }}  className="text-lg mt-5 font-medium mb-4">Coordonnées du Destinataire</h1></div>
      <div className='grid my-3 grid-cols-3 md:grid-cols-3 gap-3'>
        <div className="">
          <label className="block text-sm font-medium text-gray-500">Siège destinataire</label>
          <select
            className="mt-2 p-2 block  shadow w-full text-gray-500  rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={siegeDestinataire}
            onChange={(e) => setSiegeDestinataire(e.target.value)}
          >
            <option value="">Sélectionnez un siège</option>
            {Sieges.map((ps,index) => ( <option key={index} value={ps.NomSieges}>{ps.NomSiege}</option>))}
           
          </select>
        </div>
         <div className="">
          <label className="block text-sm font-medium text-gray-500">Service destinataire</label>
          <select
            className="mt-2 p-2 block  shadow w-full  text-gray-500 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={serviceDestinataire}
            onChange={(e) => setServiceDestinataire(e.target.value)}
          >
            <option value="">Sélectionnez un service</option>
            {Services.map((ps,index) => (  <option key={index} value={ps.NomService}>{ps.NomService}</option>))}
          </select>
        </div>
        <div className="">
          <label className="block text-sm font-medium text-gray-500">Poste destinataire</label>
          <select
            className="mt-2 p-2 block  shadow w-full  text-gray-500 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={posteDestinataire}
            onChange={(e) => setPosteDestinataire(e.target.value)}
          >
            <option value="">Sélectionnez un poste</option>
            {Postes.map((ps,index) => (  <option  key={index} value={ps.NomPoste}>{ps.NomPoste}</option>))}
          </select>
        </div>
       
      </div>
 {erreurDestinataire && (
      <p className=" float-right text-sm mr-3 text-red-500">Veuillez remplir tous les champs requis : siège, service et poste de destinataire</p>
    )}
      <div className='mb-6'>
          <label className="block mt-2 text-sm font-medium text-gray-500">Email du destinataire</label>
          <input
            type="text"
            className="mt-2 p-2  shadow block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={emailDestinataire}
            onChange={(e) => setEmailDestinataire(e.target.value)}
          />


{Emailerreru && (
      <p className=" float-right text-sm mr-3 text-red-500">L'adresse e-mail fournie est invalide ou inexistante</p>
    )}
      </div>
       
      <div><h1   style={{ color: '#52B8B5' }}  className="text-lg font-medium mb-4">Particularités de la Demande</h1></div>
        <div className='md:col-span-2 '>
          <label className="block text-sm font-medium text-gray-500">Objet de la demande</label>
          <input
            type="text"
            className="mt-2 p-2 block shadow w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={objet}
            onChange={(e) => setObjet(e.target.value)}
          />
       </div>
       
       <div className='md:col-span-2 '>
          <label className="block text-sm mt-4 font-medium text-gray-500">Délai de réception de la Demande</label>
          <input
            type="date"
            className="mt-2 p-2 block shadow w-full text-gray-500 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={delaiDemande}
            onChange={(e) => setDelaiDemane(e.target.value)}
          />
          {DateOublie && (
      <p className=" float-right text-sm mr-3 text-red-500">Vous avez oublié d'introduire la date de réception de la demande</p>
    )}


       </div>
      
        <div className="md:col-span-2 ">
          <label className="block mt-6 text-sm font-medium text-gray-500">Description</label>
          <textarea
            className="mt-2 p-6 block shadow w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="md:col-span-2 m-3 ">
        <button
            type="submit"
            onClick={(e)=>{soumettreFormulaire(e)}}
            className="inline-block px-4  shadow py-2 bg-[#52B8B5] text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right"
          >
            Suivant
          </button>

        </div>
      </form>
    </div>):(
      <NewOutil IDDemande={IDDemande}></NewOutil>
    )}
    </div>
  );
};

export default NouvelleDemande;
