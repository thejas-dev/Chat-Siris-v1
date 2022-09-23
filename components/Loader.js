import loader from '../assets/loader.gif';
import { useRouter } from 'next/router';
import axios from 'axios';
import {getSession,useSession} from 'next-auth/react'
import {setAvatarRoutes} from '../utils/ApiRoutes'
import {currentUserState} from '../atoms/userAtom'
import {useRecoilState} from 'recoil'

export default function Loader(imgurl){
	// body...
	const {data:session} = useSession();
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const router = useRouter();


	if(imgurl.imgurl !== undefined ){
		router.push('/');
		const addImage = async()=>{
			const {data} = await axios.post(`${setAvatarRoutes}/${currentUser?._id}`,{
				image:imgurl.imgurl,
			});
			if(data.isSet){
				console.log("done")
			}
		}
		addImage();
	}

	return(
		<div className="flex min-h-screen bg-gray-900 w-full justify-center items-center
		">
			<img src={loader.src} alt="not found" />
		</div>

		)
}