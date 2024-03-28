import React, {useState, useEffect} from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate} from 'react-router-dom';


function UsersAdmin() {
  const [users, setUser]=useState([]);
  const [Sieges,setSieges]=useState([]);
  const [Services,setServices]=useState([]);
  const [Postes,setPostes]=useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPoste, setFilterPoste] = useState('str');
  const [filterSiege, setFilterSiege] = useState('str');
  const [filterService, setFilterService] = useState('str');
  const [showFilters, setShowFilters] = useState(false);
  const [reload ,setreload] = useState(false)
  
 
  const { token } = useAuth();
  const navigate = useNavigate();
  

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(searchTerm, filterPoste, filterService, filterSiege);
  
    if (searchTerm !== '' || filterPoste !== 'str' || filterService !== 'str' || filterSiege !== 'str') {
      let url ; 
      if (searchTerm === ''){
        url = `http://127.0.0.1:8000/Admin/FilerUserForAdmin/str/${filterSiege}/${filterService}/${filterPoste}`;
        }else{
         url = `http://127.0.0.1:8000/Admin/FilerUserForAdmin/${searchTerm}/${filterSiege}/${filterService}/${filterPoste}`;
        }
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      };
  
      fetch(url, { method: 'GET', headers })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
          }
          // Utilisez la méthode json() pour extraire les données JSON
          return response.json();
        })
        .then((data) => {
          // Maintenant, vous pouvez utiliser les données JSON
          console.log(data); // <--- Modifiez cette ligne
          setUser(data);
          setSearchTerm('');
          setFilterPoste('str');
          setFilterService('str');
          setFilterSiege('str');
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des données:', error);
          throw error;
        });
    }else{
      setreload (!reload)
    }
  };
  
  


  



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
      key: 'Type utilisateur',
      value: 'Type utilisateur',
    },
    {
      key: 'options',
      value: 'options',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = 'http://127.0.0.1:8000/Admin/Get_users/';
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
        setUser(data.users); // Supposons que le serveur renvoie un objet contenant les utilisateurs directement
        setPostes(data.Postes);
        setServices(data.Services);
        setSieges(data.Sieges);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    

    fetchData();
  }, [reload]);


  return (
    <div className="">
      <div className="container mx-auto py-6 px-4">
       
        
       <div className='py-4 border-b mb-5'> 
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Rechercher par nom, email, téléphone..."
          className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none flex-grow border border-teal-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full"
          onClick={(e) => {
            handleSearch(e)
          }}
        >
          Rechercher
        </button>
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
        </svg>

        </button>
      </div>

      {showFilters && (
        <div className="mb-4 ">
          <div className="mb-4 ">
          <select
            className="bg-white h-10 px-5 pr-10  text-gray-500 rounded-full text-sm border border-teal-300 focus:outline-none"
            value={filterPoste}
            onChange={(e) => setFilterPoste(e.target.value)}
          >
            <option value="">Tous les postes</option>
              { Postes && (Postes.map((sp) => ( <option value={sp}>{sp}</option>)))}
          </select>
          <select
            className="bg-white h-10 px-5 pr-10 text-gray-500 rounded-full text-sm border border-teal-300 focus:outline-none ml-4"
            value={filterSiege}
            onChange={(e) => setFilterSiege(e.target.value)}
          >
            <option value="">Tous les sièges</option>
          { Sieges && (Sieges.map((sg) => ( <option value={sg}>{sg}</option>)))}
          </select>
          <select
            className="bg-white h-10 px-5 pr-10   text-gray-500 rounded-full text-sm border border-teal-300 focus:outline-none ml-4"
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
          >
            <option value="">Tous les services</option>
            {Services && ( Services.map((sv) => ( <option value={sv}>{sv}</option>)))} 
          </select>
        </div>

        </div>
      )}
</div>

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
                  <td className="border-dashed border-t text-gray-500 border-gray-200 px-6 py-3">{user.IDUser}</td>
                  <td className="border-dashed border-t text-gray-500 border-gray-200 px-6 py-3">{user.name}</td>
                  <td className="border-dashed border-t text-gray-500 border-gray-200 px-6 py-3">{user.numeroDeTelephone}</td>
                  <td className="border-dashed border-t text-gray-500 border-gray-200 px-6 py-3">{user.email}</td> 
                  <td className="border-dashed border-t text-gray-500 border-gray-200 px-6 py-3">{user.adresse}</td>
                  <td className="border-dashed border-t text-gray-500 border-gray-200 px-6 py-3">
  {user.typeUser === false ? 'Utilisateur' : 'Administrateur'}
                        </td> 
                        
                          <td className="border-dashed border-t text-gray-500 border-gray-200 px-6 py-3">

                            <div className='flex'>
                                <button className='m-2'
                                 onClick={(e)=>{
                                    e.preventDefault()
                                     navigate(`/admin/ConsulterUser/${user.IDUser}`)
                                     
                                 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                                    </svg> 

                                </button>
                                
                            </div>
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

export default UsersAdmin;
