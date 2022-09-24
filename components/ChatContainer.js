import {FiSettings,FiLogOut} from 'react-icons/fi'
import ImageKit from "imagekit"
import Styled from 'styled-components';
import {signOut} from 'next-auth/react';
import {CgProfile} from 'react-icons/cg';
import {BiPhotoAlbum} from 'react-icons/bi'
import useRouter from "next/router";
import {useEffect,useRef,useState} from 'react'
import {currentChatState,revealState,currentUserState} from '../atoms/userAtom'
import {useRecoilState} from 'recoil';
import ChatBox from './ChatBox';
import {AiOutlineLoading3Quarters} from 'react-icons/ai'
import {toast,ToastContainer} from 'react-toastify';
import robot from '../assets/robot.gif';
import axios from 'axios';
import {sendMsgRoute,getAllMsgRoute,deleteAvatarRoute,changeNameRoute,changeBackgroundRoute,deleteBackgroundRoute,host} from '../utils/ApiRoutes'
import {BiMenuAltLeft} from 'react-icons/bi'
import Modal from '@mui/material/Modal';
import {AiOutlineEdit} from 'react-icons/ai'
import {io} from 'socket.io-client'


const Header=Styled.div`
background-color:#e34bb0;
height:13vh;
position:fixed;
width:75%;
z-index:1;
display:grid;
align-items:center;
grid-template-columns:90% 10%;
overflow:hidden;
@media only screen and (max-width:768px){
	height:9vh;
	width:100%;
}
.box{
	display:flex;
	justify-items:center;
	align-items:center;
	gap:1rem;
	padding:10px;

	.name{
	font-size:17px;
	display:flex;
	flex-wrap:wrap;
	}
}`


export default function ChatContainer() {
	// body...
	const[messages,setMessages] = useState([]);
	const[currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const[currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const[reveal,setReveal] = useRecoilState(revealState)
	const[sent,setSent] = useState([]);
	const[arrivalMessage,setArrivalMessage] = useState('')
	const[checked,setChecked] = useState(true)
	const scrollRef = useRef();
	const[open,setOpen] = useState(false);
	const router= useRouter;
	const socket = useRef();
	const[name,setName] = useState('');
	const[path2,setPath2] = useState('');
	const [url2,setUrl2] = useState('');
	const[uploaded2,setUploaded2]= useState(false);
	const[loader,setLoader] = useState(false);

	var imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});


	const pathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:image')){
				return true;				
			}
		}
	}

	useEffect(()=>{
		if(currentUser){
			socket.current = io(host);
			socket.current.emit('add-user',currentUser._id);
		}
	},[currentUser])


	const handleSendMsg = async(msg) =>{
		
		const result = await axios.post(sendMsgRoute,{
			from:currentUser._id,
			to:currentChat._id,
			message:msg,
		})
		socket.current.emit("add-msg",{
			to:currentChat._id,
			from:currentUser._id,
			message:msg,
		})
		const msgs = [...messages];
		msgs.push({fromSelf:true,message:msg});
		setMessages(msgs);
	}

	const handleOpen = () =>{
		setOpen(!open);
	}

	useEffect(()=>{
		const fetch = async() =>{
			const {data} = await axios.post(getAllMsgRoute,{
				from:currentUser?._id,
				to:currentChat?._id
			})
			setMessages(data);
		}
		fetch()
	},[currentChat])
	if(socket.current){
			socket.current.on('msg-recieve',(msg)=>{
				setArrivalMessage({
					fromSelf:false,
					message:msg,
				})
			})
		}

	useEffect(()=>{
		if(currentUser) {setName(currentUser.username);}
	},[currentUser])

	useEffect(()=>{
		if(arrivalMessage) {
			setMessages((prev)=>[...prev,arrivalMessage]);
		}
	},[arrivalMessage]);

	useEffect(()=>{
		scrollRef.current?.scrollIntoView({behaviour:"smooth"});
	},[messages])

	const resetAvatar = async() =>{
		const data = await axios.post(`${deleteAvatarRoute}/${currentUser._id}`)
		router.push('/Setavatar')
	}
	


	const sideBar = () =>{
		setReveal(true);
	}


	const handleName = async(e) =>{
		setName(e.target.value)
		let username= e.target.value
		const data = await axios.post(`${changeNameRoute}/${currentUser._id}`,{
			username:username,
		})
	}

	const reload = () =>{
		location.reload()
	}

	useEffect(()=>{
		if(path2.length>0){
			if(checked){
				toast.error("Please Try Again!")
				setChecked(false);
			}
			const image_input = document.querySelector('#file2');
			image_input.addEventListener('change',()=>{
				const reader = new FileReader();
			
				reader.addEventListener('load',()=>{
					let uploaded_image = reader.result;
					setUrl2(uploaded_image)
				});
				reader.readAsDataURL(image_input.files[0]);
			})
		}
	},[path2])


	useEffect(()=>{
	if(url2){
			const uploadImage = (url2) =>{
				if(pathCheck(url2)){
					setUploaded2(true)
					setLoader(true);
					imagekit.upload({
				    file : url2, //required
				    fileName : "thejashari",   //required
				    extensions: [
				        {
				            name: "google-auto-tagging",
				            maxTags: 5,
				            minConfidence: 95
				        }
				    ]
					}).then(response => {
					    uploadBackground(response.url)
					    setLoader(false)
					}).catch(error => {
					    console.log(error);
					});
				}else{
					toast("Please Select an Image",toastOption)
					setUrl2('')
					setLoader(false);
				}
			}
			uploadImage(url2);
		}
	},[url2])


	const toastOption={
		position:"bottom-right",
		autoClose:8800,
		pauseOnHover:true,
		draggable:true,
		theme:"dark",
	}
	

	const uploadBackground = async(res) =>{
		let backgroundImage = res;
		const data = await axios.post(`${changeBackgroundRoute}/${currentUser._id}`,{
			backgroundImage:backgroundImage,
		})
		reload();
	}


	const resetBackground = async()=>{
		let condi = confirm('Please Confirm to Reset Background Image')
		if(condi){
			const data = await axios.post(`${deleteBackgroundRoute}/${currentUser._id}`)
			reload();
		}
	}


	return(
		<div className="overflow-x-hidden bg-[#d9dbda]" >
		<ToastContainer/>
		<Modal
		open={open}
		onClose={handleOpen}
		>
		<div className="relative" >
		<FiSettings className="h-6 w-6 absolute right-5 top-5 text-white cursor-pointer hover:rotate-90 transition duration-300 ease-out"
		onClick={handleOpen}/>
		<div className="flex flex-col min-h-screen justify-center items-center border-none " >	
			<h2 className="text-xl text-white font-semibold mb-2">Username</h2>
			<div className="flex border-[1px] bg-black bg-opacity-30 p-1 border-white justify-center items-center rounded-full">
				<input 
				onChange={handleName}
				value={name}
				className="text-white text-center ml-2 outline-none font-semibold bg-transparent" type="text" />
				<AiOutlineEdit 
				onClick={reload}
				className="h-7 mr-2 cursor-pointer w-7 text-blue-500 hover:scale-110 transition duration-300 ease-out"  />
			</div>

			<div
			className="flex p-2 gap-2 mt-8 hover:scale-110 transition duration-400 ease-in-out" >
				<label htmlFor="file2" id="label_input" className="flex gap-2 cursor-pointer" >
					<div className={`ml-3 ${loader ? "animate-pulse" : ''} `} >
					<BiPhotoAlbum className="h-7 w-7 text-green-500 hover:scale-110 transition duration-400 ease-in-out"/>
					</div>
					<input type={`${loader ? "disabled" : "file"}`} id="file2" hidden accept="image/*" onChange={(e)=>setPath2(e.target.value)} />
					<h2 className="text-xl text-white font-semibold ">Change Background Image /</h2>
					{
						loader && <AiOutlineLoading3Quarters className="h-8 w-8 animate-spin text-blue-500"/>
					}
				</label>
				<span className={`text-blue-500 ${loader ? "hidden" : ""}
					hover:scale-120 transition duration-400 text-xl font-semibold ease-in-out`} onClick={resetBackground}><button>Reset</button></span> 

			</div>
			<div
			onClick={resetAvatar}
			className="flex p-2 gap-2 mt-8 cursor-pointer hover:scale-110 transition duration-400 ease-in-out" >
				<CgProfile className="h-7 w-7 text-green-500 hover:scale-110 transition duration-400 ease-in-out"/>
				<h2 className="text-xl text-white font-semibold ">Reset Avatar</h2>

			</div>
			<div onClick={()=>{
				signOut();
	 			localStorage.clear();
			}} 
			className="flex p-2 gap-2 mt-8 cursor-pointer hover:scale-110 transition duration-400 ease-in-out" >
				<FiLogOut className="h-8 w-8 text-blue-500 hover:scale-110 transition duration-400 ease-in-out"/>
				<h2 className="text-xl text-white font-semibold">Sign Out</h2>
			</div>

		</div>
		</div>
		</Modal>


		{currentChat? 
			<div>
				<Header>
					<div className="box">
						<div className="logo ml-2 flex align-center justify-center ">
							<img src={currentChat?.avatarImage} alt="" 
							className="rounded-full shadow-[0px_6px_1000px_150px_rgba(0,0,0,0.15)] shadow-red-500 transition duration-300 ease-out h-[3rem] w-[3rem] md:h-[3.8rem] md:w-[3.8rem]"/>
						</div>
						<div className="name">
							<p className="font-semibold text-white" >{currentChat?.username}</p>
						</div>
					</div>
					<div className="signout">
						<FiSettings className="h-6 w-6 text-white cursor-pointer hover:rotate-90 transition duration-300 ease-out "
						onClick={()=>{
							handleOpen();
	 					}}
						 />	
					</div>

				</Header>
					<ChatBox handleSendMsg={handleSendMsg} messages={messages} scrollRef={scrollRef} currentUser={currentUser} />
			</div>
		  :
			<div className="min-h-screen">
				<Header>
					<div className="box">
						<div className="logo ml-2 flex align-center justify-center ">
							<img src={currentUser?.avatarImage} alt="" 
							className="rounded-full shadow-[0px_6px_1000px_150px_rgba(0,0,0,0.15)] shadow-red-500 hover:scale-110 transition duration-300 ease-out h-[3rem] w-[3rem] md:h-[3.8rem] md:w-[3.8rem]"/>
						</div>
						<div className="name">
							<p className="font-semibold text-white" >{currentUser?.username}</p>
						</div>
					</div>
					<div className="signout">
						<FiSettings className="h-6 w-6 text-white cursor-pointer hover:rotate-90 transition duration-300 ease-out"
						onClick={()=>{
							handleOpen();
	 					}}
						 />	
					</div>

				</Header>
				<div className="flex min-h-screen relative justify-center flex-col items-center " > 
					<BiMenuAltLeft 
					onClick={()=>sideBar()}
					className="absolute md:hidden h-7 cursor-pointer w-7 text-blue-700 top-[9vh] left-0" />
					<img src={robot.src} alt="" />
					<h1 className="text-2xl m-2 text-center flex-wrap font-semibold text-slate-700">Welcome <span className="
					text-blue-700" >{currentUser?.username}</span> Tap on Any Chat to Start Texting</h1>
				</div>
			</div>
		 }
			

		</div>

		)
}