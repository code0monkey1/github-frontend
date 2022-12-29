import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const CLIENT_ID=process.env.REACT_APP_GITHUB_CLIENT_ID
 
  console.log("The client ID is " + CLIENT_ID)
  
  const [rerender,setRerender] = useState()

  useEffect(() => {
    
    const queryString=window.location.search
    const urlParams=new URLSearchParams(queryString)
    const codeParam=urlParams.get('code')
    console.log("codeParam",codeParam)

    if(codeParam && localStorage.getItem('accessToken')===null) {
        
      const getAccessToken=async()=>{

        const response = await axios.get("http://localhost:4000/github/access-token/?code="+codeParam)

         const data = response.data

         console.log("access token received from the server : " + JSON.stringify(data,null,2))

         if(data.access_token){
          
          localStorage.setItem("accessToken",data.access_token)

          setRerender(!rerender)
         }
      }
      
      getAccessToken()
     
    }
  }, [])

  const getUserData = async () =>{
      
    const config = {
    headers: { 
      "Authorization": "Bearer " + localStorage.getItem("accessToken")
      }
    }

      const response = await axios.get("http://localhost:4000/github/user-data",config)

      const data = response.data

      console.log("User data received :" + JSON.stringify( data,null,2 ))

  }
  
  
  const loginWithGithub=()=>{
  
     window.location.assign("https://github.com/login/oauth/authorize?client_id="+CLIENT_ID);

  }

  const logOut=()=>{
    localStorage.removeItem('accessToken')
    setRerender(!rerender)
  }
  return (
    <div className="App">
      <header className="App-header">
        {
            localStorage.getItem('accessToken')?<>
             <div>User Logged In</div>
             <button onClick={getUserData}>
               View User Data
             </button>
             <button onClick={logOut}>LogOut</button>
            </>
           :
            <button onClick={loginWithGithub}>Login With GitHub</button>
        }
      
      </header>
    </div>
  );
}

export default App;
