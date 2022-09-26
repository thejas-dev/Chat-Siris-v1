import styled from 'styled-components';
import logo from '../assets/logo.png'
import {AiOutlineSearch} from 'react-icons/ai'
import Contact from './Contact';
import {useState,useEffect} from 'react';
import axios from 'axios';
import {searchUsersRoute} from '../utils/ApiRoutes';
import {searchState,contactsState,revealState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil'
import searchRobo from '../assets/search.gif'
import {BiSearchAlt} from 'react-icons/bi'
import {BiMenuAltRight} from 'react-icons/bi'

const Header=styled.div`
	margin-bottom:2rem;


`

const Container = styled.div`
	.contacts{
		&::-webkit-scrollbar{
			width:0.2rem;
			&-thumb{
				background-color:#ffffff39;
				width:0.1rem;
				border-radius:1rem;
			}
		}		
	}
`


export default function Contacts({contacts,currentUser}) {
	// body...
	const [search,setSearch] = useRecoilState(searchState);
	const[reveal,setReveal] = useRecoilState(revealState);
	const [searchResult,setSearchResult] = useState('');
	const [contacts2,setContacts2] = useState([]);
	const [contacts3,setContacts3] = useState(['sdsadsa']);

	
	// rerender this component after 1s & 5s loading the page
	useEffect(()=>{
		setTimeout(function() {
			if(contacts3.length>0){
				setContacts3([])
			}
		}, 1000);
		setTimeout(function() {
			setContacts3([])
		}, 5000);
		setTimeout(function() {
			setContacts3([])
		}, 10000);
		setTimeout(function() {
			setContacts3([])
		}, 15000);
	},[])

	useEffect(()=>{
		setTimeout(function() {
			setContacts3([])
		}, 500);
		setTimeout(function() {
			setContacts3([])
		}, 5000);
	},[contacts])
	const Search = async(e) =>{
		if(e.target.value.length>1){
			const {data} = await axios.get(`${searchUsersRoute}/${currentUser?._id}/${e.target.value}`)
			setSearchResult(data);
			setContacts2(data)
		}
	}

	return(
		<div className="overflow-x-hidden relative h-[100vh]" >
			<BiMenuAltRight 
				onClick={()=>setReveal(false)}
				className="absolute md:hidden h-9 cursor-pointer w-9 text-white top-0 right-0" />
			<Header>
			<div className="flex w-100">
				<div className="flex w-full mt-2 justify-center gap-2 items-center">
					<img src={logo.src} alt="" className="h-10 w-10 rounded-full shadow-sm shadow-blue-700 "/> 
					<h2 className="text-white font-semibold text-2xl">Chat-Siris</h2>
				</div>
			</div>
			</Header>
			<div>
				<form onSubmit={(e)=>{
					e.preventDefault();
					setSearch('');
					}}>
					<div className="input w-full mb-5 flex items-center justify-start m-auto gap-1 rounded-full w-[90%] p-1  
						border-solid border-2 
						border-pink-700 bg-slate-200 text-center 
						text-gray-800">
							<button className="button">
								<AiOutlineSearch className="h-7 w-7 text-blue-500"/>
							</button>
						<input type="text" 
						onChange={(e)=>{
							setSearch(e.target.value)
							Search(e);
						}}
						value={search}
						placeholder="Username..." 
						className="outline-none w-[100%] bg-transparent pl-3 rounded-full p-1 focus:border-indigo-500 transition
						duration-300 ease-out " />
					</div>
				</form>
			</div>
			{search.length > 0 ? 
			<div>
				<Container>
				<div className="contacts w-full mb-3">

				{contacts2.length > 0 ? contacts2?.map((contact,index)=>(
						<Contact contact={contact} index={index} />
					))
				:
				<div className="flex flex-col items-center">
					<img src="https://ik.imagekit.io/d3kzbpbila/search_cra77E8sr.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1663440501514"
					alt="" className="w-full md:h h-[410px] mt-3"/>
					<h1 className="text-xl text-white flex " style={{textShadow:"2px 2px 2px #030854"}} >
					<BiSearchAlt className="h-9 w-8 text-green-500 animate-bounce" />
					Searching In My Petrol Tank
					</h1>
				</div>
				}
				</div>
				</Container>
			</div>
			 : 
			<div>
				<div className="recent-text ml-4 mb-1">
					<p className="text-white text-lg font-semibold" >Your Recent Chats :-</p>
				</div>
				<div className="contacts w-full mb-3">

				{contacts ? contacts?.map((contact,index)=>(
					<Contact contact={contact} key={index} />
				))
				:
				<div className="flex flex-col items-center justify-center" >
				<p className="text-green-400 font-bold mt-2 md:mt-10 text-xl" style={{textShadow:"2px 2px 7px black"}}>No Recent Chats!</p>
					<img src="https://ik.imagekit.io/d3kzbpbila/walle_sRRqK9p-m.png?ik-sdk-version=javascript-1.4.3&updatedAt=1663440442970" 
					alt="" className="w-full"/>

					
				</div>
				}
				</div>
			</div>
			}


			


		</div>

		)
}