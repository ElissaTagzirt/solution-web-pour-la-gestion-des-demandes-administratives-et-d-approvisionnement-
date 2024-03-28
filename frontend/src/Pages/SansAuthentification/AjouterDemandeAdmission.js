import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AjouterDemandeAdmission = () => {
  
  
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [numeroDeTelephone, setNumeroDeTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [motDePasse, setMotDePasse] = useState(''); 
  const [DateNaissance,setDateNaissance]=useState('');
  const [erreur, setErreur] = useState('');
  const [DemandeValide , setDemandeValide]=useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(''); // Ajout de l'état pour le message de confirmation
  const navigate = useNavigate();




  const soumettreFormulaire = (e) => {
    e.preventDefault();
    console.log("aqlida")
    // Vérifier que tous les champs sont remplis
    if (nom==='' || email==='' || numeroDeTelephone==='' || adresse==='' || motDePasse==='' || DateNaissance ==='') {
      setErreur('Tous les champs sont obligatoires.');
      
    }else {
  
    const apiUrl = 'http://127.0.0.1:8000/DemandeAdmissionUser/createDemande/';
  
    const requestBody = {
      hashed_password: motDePasse,
      name: nom,
      email: email,
      numeroDeTelephone: numeroDeTelephone,
      adresse: adresse,
      dateNaissance: DateNaissance,
    };
  
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {console.log(data)
      if (data.message) {
        // La demande a été créée avec succès
        
        setDemandeValide(true);
        setConfirmationMessage('Votre demande a été correctement enregistrée et transmise.');
        setErreur('');
        setNom ('');
        setEmail('');
        setNumeroDeTelephone('');
        setAdresse('');
        setMotDePasse('');
        setDateNaissance('');
        setErreur('');

      } else if (data.detail) {
        // Une erreur s'est produite lors de la création de la demande
        console.log(data)
        setDemandeValide(false);
        setErreur(data.detail);
      }
    })
    .catch(error => {
      console.error('Erreur lors de la requête : ', error);
      setDemandeValide(false);
      setErreur('Une erreur s\'est produite lors de la soumission de la demande.');
    });
  }
}
  
  



  

  return (
   <div>
     { !DemandeValide ? (
    <div className=" flex m-10 items-center justify-center">
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
              envoyer demande
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
            
            <button
              type="submit"
              onClick={(e)=>{
                e.preventDefault();
                setNom('');
                setEmail('');
                setNumeroDeTelephone('');
                setAdresse('');
                setMotDePasse('');
                setErreur('');
                navigate('/auth');
            }}
              className="inline-block px-4 mr-4 shadow py-2 bg-[#52B8B5] text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right"
            >
              Sortir
            </button>
            
            
          </div>
        </form>
      </div>
    </div>):(
     <div className="flex m-8 items-center justify-center h-screen">
     <div className="mb:w-1/3 w-2/3 p-10 bg-[#F5F5F5] rounded-lg shadow-md">
       <h1 style={{ color: '#52B8B5' }} className="text-2xl m-10 font-bold mb-4">Confirmation</h1>
       <p
       className='text-gray-500 mt-10 ml-12 mb-10 text-lg'
       >{confirmationMessage}</p>
     
    
        <button
            type="button"
            onClick={(e)=>{
                e.preventDefault();
                setDemandeValide(false);
                setErreur('');
                setNom ('');
                setEmail('');
                setNumeroDeTelephone('');
                setAdresse('');
                setMotDePasse('');
                setDateNaissance('');
                setErreur('');
                navigate('/auth');

            }}
            className="mt-4 mb-10 px-4 py-2 bg-[#52B8B5] text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right"
        >
            Retourner à la page d'accueil
        </button>

     </div>
   </div>
    )}
   </div>     
  );
};

export default AjouterDemandeAdmission;
