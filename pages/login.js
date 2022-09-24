import {signIn,useSession,getProviders,getSession} from 'next-auth/react'
import { useRouter } from 'next/router'
import {useEffect} from 'react'

export default function login({providers,session}) {
	// body...
	const router = useRouter();
	const id = Object.values(providers).map((provider)=>provider.id)

	console.log(session)
	useEffect(()=>{
		if(session){
			localStorage.setItem('chat-siris-session',JSON.stringify(session.user.name))
			router.push('/');
		}
	},[session])

	return(
		<div className="bg-cover h-screen w-full flex bg-[url('https://ik.imagekit.io/d3kzbpbila/bg_1sOh-7j7e.jpeg?ik-sdk-version=javascript-1.4.3&updatedAt=1662823467165')]">
				<div className="flex flex-col bg-gray-500 min-h-screen w-full bg-opacity-75 justify-center items-center">
					<img src="https://ik.imagekit.io/d3kzbpbila/logo_T6jFQJSSC.png?ik-sdk-version=javascript-1.4.3&updatedAt=1662823468334" 
					className="w-[20rem]"
					alt="..."/>
					<button
					onClick={()=>signIn()} 
					className="bg-blue-500 rounded-full p-5 mt-5 text-white hover:scale-110
					font-semibold transition ease-in-out duration-300" > 
						Login With {Object.values(providers).map((provider)=>provider.name)}
					</button>
				</div>
		</div>

		)
}

export async function getServerSideProps(context){
	const providers = await getProviders();
	const session = await getSession(context);
	return{
		props: {
			providers,
			session

		}
	}

}