import axios from 'axios'
import ImageKit from "imagekit"
import {useState,useEffect} from 'react'
import bg from '../assets/bg.jpeg';
import loader from '../assets/loader.gif'
import { useRouter } from 'next/router'
import {loginRoutes,registerRoutes} from '../utils/ApiRoutes'
import {IoMdImages} from 'react-icons/io'
import Loader from '../components/Loader'
import {currentUserState} from '../atoms/userAtom'
import {useRecoilState} from 'recoil'
import {useSession} from 'next-auth/react'
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function Setavatar() {
	const[path,setPath] = useState('');
	const[url,setUrl] = useState('')
	const[uploaded,setUploaded] = useState(false);
	const[imgurl,setImgurl] = useState(undefined);
	const[currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const router = useRouter();
	const {data:session} = useSession();

var imagekit = new ImageKit({
    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
});


const pathCheck = (path) =>{
		if(path){
			if(path.split('.').includes('jpg')){
				return true;
			}else if(path.split('.').includes('jpeg')){
				return true;
			}else if(path.split('.').includes('png')){
				return true;
			}
		}
}
	
useEffect(()=>{
		const image_input = document.querySelector('#file1');
		image_input.addEventListener('change',()=>{
			const reader = new FileReader();
		
			reader.addEventListener('load',()=>{
				let uploaded_image = reader.result;
				setUrl(uploaded_image)
				document.querySelector('#display').style.backgroundImage = `url(${uploaded_image})`;
				document.querySelector('#display-container').style.display = 'block';
				
			});
			reader.readAsDataURL(image_input.files[0]);
		})
	
},[path])
	
	useEffect(()=>{
		if(session){
			handleValidation();
		}

	},[session])


	const handleValidation = async() =>{
		let username = session.user.name
		let email = session.user.email
		const {data} = await axios.post(loginRoutes,{
			email,
		});
		if(data.status === false){
			const {data} = await axios.post(registerRoutes,{
				username,
				email,
			})
		}
		if(!localStorage.getItem('chat-siris-app')){
			localStorage.setItem('chat-siris-app',JSON.stringify(data?.user?.username));
		}
		setCurrentUser(data?.user)
		
		if(data?.user?.isAvatarImageSet){
			router.push('/');
		}
	
	}


	const uploadImage = (e) =>{
		if(pathCheck(path)){

			setUploaded(true)
			e.preventDefault();
			imagekit.upload({
		    file : url, //required
		    fileName : "thejashari",   //required
		    extensions: [
		        {
		            name: "google-auto-tagging",
		            maxTags: 5,
		            minConfidence: 95
		        }
		    ]
			}).then(response => {
			    setImgurl(response.url);
			}).catch(error => {
			    console.log(error.message);
			});

		}else{

			toast("Please Select an Image With Image Format",toastOption)
		}
	}
	if(uploaded){
		return (<Loader imgurl={imgurl}  />)
	}

	const toastOption={
		position:"bottom-right",
		autoClose:8800,
		pauseOnHover:true,
		draggable:true,
		theme:"dark",
	}

	const notSelected = () =>{
		if(path){
			toast('Select an Image with JPG or JPEG or PNG format',toastOption)
		}
	}


	return(
	<div>
		
		<ToastContainer/>

		<div className="flex flex-col min-h-screen w-full bg-[url('https://ik.imagekit.io/d3kzbpbila/bg_1sOh-7j7e.jpeg?ik-sdk-version=javascript-1.4.3&updatedAt=1662823467165')] 
		">
			<div className="flex flex-col bg-gray-800 h-screen w-full bg-opacity-75 justify-center items-center
			text-">
			<label htmlFor="file1" id="label_input" className="cursor-pointer" >
				<div className="flex flex-col animate-pulse md:flex-row justify-center gap-1 items-center justify-center" >
					<IoMdImages className="h-10 w-10 text-green-500"/>
					<h2 className="text-white text-green-300" >Please Select an Avatar to Continue</h2>
				</div>
				<input type="file" id="file1" hidden onChange={(e)=>setPath(e.target.value)} />
			</label>
			<div id="display-container" className="object-contain hidden items-center justify-center h-[200px] w-[200px]" >
				<div className="h-full w-full rounded-xl bg-center bg-cover mt-2 bg-center" id="display"></div>
			</div>
			<button onClick={(e)=>uploadImage(e)} className="border p-3 pl-10 pr-10 font-semibold border-2 border-solid hover:border-dotted mt-10 rounded-full bg-blue-500
				text-white hover:scale-110 transition duration-300 ease-in-out" >Submit</button>
			</div>
		</div>
			
	</div>
		)
}






