import { useRouter } from 'next/router'
import {useEffect,useState,useRef} from 'react'
import {session,getSession,signOut} from 'next-auth/react'
import axios from 'axios'
import {loginRoutes,registerRoutes,allUsersRoute,setRecentChatRoute,host} from '../utils/ApiRoutes'
import {currentUserState,currentChatState,searchState,revealState} from '../atoms/userAtom'
import {useRecoilState} from 'recoil'
import styled from 'styled-components'
import Contacts from './Contacts'
import ChatContainer from './ChatContainer';

const Container = styled.div`
	display:flex;
	flex-direction:column;
	
	.container-2{
		height:100vh;
		background-color:#00000076;
		display:flex;
		transition:width 0.7s;
		transition-timing-function: ease-in-out;
		.contacts{
			@media only screen and (max-width:768px){
				width:0;
				transition:width 0.5s;
				transition-timing-function: ease-in-out;
			}
		}
		.chat{
			width:75%;
			@media only screen and (max-width:768px){
				width:100%;
				transition:width 0.5s;
				transition-timing-function:ease-in-out;
			}
		}
		
	}
	.reveal{
		.contacts{
			width:100%;
			transition:width 0.7s;
			transition-timing-function: ease-in-out;
		}
		.chat{
			width:0%;
			transition:width 0.7s;
			transition-timing-function:ease-in-out;
		}
			grid-template-columns:100% 0%;
			transition:grid-template-columns 1s;
			transition-timing-function: ease-in-out;
		}
`

export default function Home({session}) {
	const[currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const[contacts,setContacts] = useState(null);
	const[currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const[reveal,setReveal] = useRecoilState(revealState);
	const [search,setSearch] = useRecoilState(searchState);
	const router = useRouter();
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
		
		if(!data?.user?.isAvatarImageSet){
			router.push('/Setavatar');
		}
	
	}
	
	useEffect(()=>{
		if(currentUser && currentUser.recentChats.length > 0){
			if(!contacts){
			const result = [];
			const fetching = async()=>{
				const data = await currentUser.recentChats.map((recentChat)=>{
					const fetch =async()=>{
						let data = await axios.get(`${allUsersRoute}/${currentUser?._id}/${recentChat}`)
						result.unshift(data.data[0])
					}
				fetch();
				});
				setContacts(result)
			}
			fetching();
			}
		}
	},[currentUser])



	useEffect(()=>{
		setReveal(false)
		if(currentChat){
			const fetch = async() =>{
				const existRecentChat=currentUser?.recentChats;
				if(existRecentChat.length>0){
					const currentChatid = currentChat._id.split();
					if(existRecentChat.includes(currentChat._id) === false){
						existRecentChat = currentChatid.concat(existRecentChat)
					}
				}else{
					existRecentChat = currentChat?._id
				}
				let currentChatArray = existRecentChat;
				const {data} = await axios.post(`${setRecentChatRoute}/${currentUser?._id}`,{
					chatId:currentChatArray,
				})
				currentChatFetch(data);
				
			}
			fetch();
			setSearch('')
		}
	},[currentChat])

	const currentChatFetch = async(data) =>{
		const result = [];
		const fetching = async()=>{
			const data = await data.recentChats.map((recentChat)=>{
				const fetch =async()=>{
					console.log(recentChat)
					let data = await axios.get(`${allUsersRoute}/${currentUser?._id}/${recentChat}`)
					console.log(data)
					result.unshift(data.data[0])
				}
			fetch();
			});
			setContacts(result)
			console.log(result)
		}
		fetching();
	}


	useEffect(()=>{
		if(reveal){
			let sidebar = document.getElementById('container-2')
			sidebar.classList.add('reveal');
		}else{			
			let sidebar = document.getElementById('container-2')
			if(sidebar){
				sidebar.classList.remove('reveal');
			}
		}
	},[reveal]);


	

	
// <button onClick={()=>{
// 				signOut()
// 				localStorage.clear();
// 			}}>signOut</button>

	return(
<div className="w-full min-h-screen">
<Container>	
	<div id="container-2" className="container-2 ">
		<div id="sidebar" className="contacts transition-all duration-400 ease-in-out md:w-[25%] bg-gradient-to-r from-[#e34bb0] to-[#f23081] ">
			<Contacts contacts={contacts} currentUser={currentUser}/>
		</div>
		<div className="chat bg-[#f5f5f5]">
			<ChatContainer/>
		</div>
	</div>
</Container>
</div>
		)
}


