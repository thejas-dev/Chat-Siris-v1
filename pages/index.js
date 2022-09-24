import {useEffect} from 'react'
import {useRouter} from 'next/router'
import {getSession,useSession} from 'next-auth/react'
import Home from '../components/Home'

const Index = () => {
    const router = useRouter();
  	
  	const {data:session} = useSession();
   
  	useEffect(()=>{
      
        if(!session){
          router.push('/login')
      }
    
    
  },[session])
 



  return(
  	<div>
  		
       <Home session={session} />
  	</div>
	)

  }

export default Index;



export async function getServerSideProps(context){
  const session = await getSession();

  return{
    props:{
      session,
    }
  }

}
