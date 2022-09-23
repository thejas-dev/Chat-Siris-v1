import {currentChatState} from '../atoms/userAtom'
import {useRecoilState} from 'recoil'
import {AiOutlineArrowRight} from 'react-icons/ai'
import {useEffect,useState} from 'react';


export default function Contact(contact,key) {
	// body...
	const[currentChat,setCurrentChat] = useRecoilState(currentChatState)
	const[style,setStyle] = useState({})
	const index = 2
	useEffect(()=>{
		if(currentChat){
			if(currentChat._id === contact.contact._id){
				setStyle(selectedStyle)
				
			}else{
				setStyle(defaultStyle)
			}	
		}
	},[currentChat])
	const defaultStyle={
		background:"#f0eded",
		transition:"all",
		transitionDuration:"0.4s",
		transitionTimingFunction:"ease-out",
	}
	const selectedStyle={
		background:"#0bd447",
		transition:"all",
		transitionDuration:"0.4s",
		transitionTimingFunction:"ease-out",
	}
	useEffect(()=>{
		setStyle(defaultStyle)
	},[])

	return(
		<div className="flex items-center justify-center mt-3"
		onClick={()=>{
			setCurrentChat(contact.contact)}}
		>
			<div id={`container-${index}`} className="container relative h-[4rem] flex w-[80%] md:w-[94%] rounded-lg 
			hover:scale-105 duration-400 transition-all ease-out
			align-center items-center border border-2 h-[4rem]
			shadow-md shadow-purple-700 hover:shadow-red-500 cursor-pointer
			border-purple-700 hover:border-red-700  gap-2 overflow-hidden" style={style}>
				<div>
					<img src={contact.contact.avatarImage} alt="" 
					className="h-12 ml-2 mr-2 w-12 rounded-full"
					/>
				</div>
				<div className="flex flex-wrap w-[100%] overflow-hidden" >
					<button
	 				className="text-lg ml-2 text-gray-800 font-semibold"
					><p className="truncate">{contact.contact.username}</p></button>
				</div>
				<div className="arrow flex-end absolute right-5">
					<AiOutlineArrowRight className="text-gray-600 h-5 w-5"/>
				</div>
			</div>

		</div>

		)
}