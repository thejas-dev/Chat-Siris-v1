import {revealState} from '../atoms/userAtom'
import ImageKit from "imagekit"
import {useState,useEffect} from 'react';
import {BiMenuAltLeft,BiMicrophone} from 'react-icons/bi'
import {AiOutlineSend,AiOutlineLoading3Quarters} from 'react-icons/ai'
import Styled from 'styled-components'
import {v4 as uuidv4} from 'uuid'; 
import {useRecoilState} from 'recoil'
import {MdPhotoLibrary} from 'react-icons/md'
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Backdrop from '@mui/material/Backdrop';
import {BsRecordCircle} from 'react-icons/bs';
import styled from 'styled-components'
import MicRecorder from 'mic-recorder-to-mp3';
const Mp3Recorder = new MicRecorder({ bitRate: 128 });


const Container = styled.div`
	.chats{
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


export default function ChatBox({handleSendMsg,messages,scrollRef,currentUser}) {
	// body...
	const[showEmojiPicker,setShowEmojiPicker] = useState(false);
	const[reveal,setReveal] = useRecoilState(revealState);
	const[msg,setMsg] = useState('');
	const[path,setPath] = useState('');
	const[url,setUrl] = useState('');
	const[imgurl,setImgurl] = useState('');
	const[uploaded,setUploaded] = useState(false);
	const[loader,setLoader] = useState(false);
	const [open, setOpen] = useState(false);
	const[path3,setPath3] = useState('');
	const[path4,setPath4] = useState('');
	const[url3,setUrl3] = useState('');
	const [revealRec,setRevealRec] = useState(false);
	const[isRecording,setIsRecording]= useState(false);
    const[isBlocked,setIsBlocked] = useState(false);
    const[time,setTime] = useState(true);
	
	const handleClose = () => {
	    setOpen(false);
	};
	  const handleToggle = () => {
	  	if(!loader && !revealRec  ){
	    	setOpen(!open);
	  	}
	};
	const revealRecFunc = () =>{
		setRevealRec(true);
		start();
	}

	const dateToTime = () =>{
		setTime(!time);
	}

	function dConvert(i) {
		let split=i.split('T');
		const date = split[0];
		return date;
	}

	function tConvert(i) {
	let split = i.split('T');
	const date = split[0];
	let time = split[1].split('.')[0]
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1); // Remove full string match value


      time[2] = Number(time[2]) + 30;

      if(Number(time[2])>60){
      	time[2] = Number(time[2]) -60
      	if(time[2]<10){
      		time[2] = 0+ time[2].toString()
      	}
      	time[0] = Number(time[0]) + 1
      }

      time[0] = Number(time[0]) + 5;
      time[5] = +time[0] < 12 || time[0] === 24 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
      
      time.splice(3,1)
      
    }
    return time.join(''); // return adjusted time or original string
  	}

	var imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

	const Linkcheck = (str) =>{
	  return str.includes('https://ik.imagekit.io/');
	} 

	const Audiocheck = (str) =>{
		return str.includes('https://ik.imagekit.io/d3kzbpbila/Audios')
	}

	const pathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:image')){
				return true;				
			}
		}
	}

	const audioPathCheck = (path) =>{
		if(path){
			if(path.split('/').includes('data:audio')){
				return true;
			}
		}
	}

	const sendMsg = (event) =>{
		event.preventDefault();
		if(msg.length>0){
			handleSendMsg(msg)
		}
		setMsg('')
	}
	const sendImg = (res) =>{
		handleSendMsg(res)
		setUrl('')
	}
	const sendAudio = (res) =>{
		handleSendMsg(res)
		setUrl3('')
	}
	useEffect(()=>{
		if(url.length>0){
			setLoader(true);
		}
	},[url])
	useEffect(()=>{
		const image_input = document.querySelector('#file1');
		image_input.addEventListener('change',()=>{
			const reader = new FileReader();
		
			reader.addEventListener('load',()=>{
				let uploaded_image = reader.result;
				setUrl(uploaded_image)
			});
			reader.readAsDataURL(image_input.files[0]);
		})
	},[path])

	useEffect(()=>{
		const image_input = document.querySelector('#file3');
		image_input.addEventListener('change',()=>{
			const reader = new FileReader();
			
			reader.addEventListener('load',()=>{
				let uploaded_image = reader.result;
				setUrl3(uploaded_image)
			});
			reader.readAsDataURL(image_input.files[0]);
		})
	},[path3])


	const blobToBase64 = (blobURL) =>{
		var reader = new FileReader();
		reader.onload = function() {
			let dataurl = reader.result;
			setUrl3(dataurl)
		}
		reader.readAsDataURL(blobURL);
	}

	const toastOption={
		position:"bottom-right",
		autoClose:8800,
		pauseOnHover:true,
		draggable:true,
		theme:"dark",
	}

useEffect(()=>{
	if(url){
		const uploadImage = (url) =>{
			if(pathCheck(url)){

				setUploaded(true)
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
				    sendImg(response.url);
				    setLoader(false)
				}).catch(error => {
				    console.log(error);
				});

			}else{
				toast("Please Select an Image or Gif",toastOption)
				setUrl('')
			}
		}
		uploadImage(url);
	}
},[url])

useEffect(()=>{
	if(url3){
		const uploadImage = (url3) =>{
			if(audioPathCheck(url3)){
				setLoader(true)
				setUploaded(true)
				imagekit.upload({
			    file : url3, //required
			    folder:"Audios",
			    fileName : "thejashari",   //required
			    extensions: [
			        {
			            name: "google-auto-tagging",
			            maxTags: 5,
			            minConfidence: 95
			        }
			    ]
				}).then(response => {
				   	sendAudio(response.url);
				    setLoader(false)
				}).catch(error => {
				    console.log(error);
				});

			}else{
				toast("Please Select an Image or Gif",toastOption)
				setUrl('')
			}
		}
		uploadImage(url3);
	}
},[url3])

	let myStyle = {
		backgroundImage:"url(`${currentUser.backgroundImage}`)",
	}

	const start = () => {
  	navigator.mediaDevices.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true })
      },
    )
    record();
  };
  const record = () =>{
  	if (isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          setIsRecording(true)
        }).catch((e) => console.error(e));
    }
  }

 const stop = () => {
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        blobToBase64(blob)
        setIsRecording(false);
      }).catch((e) => console.log(e));
  };



	return(
	<div className="bg-cover bg-center" style={{backgroundImage : currentUser.backgroundImage ? `url(${currentUser.backgroundImage})` : '' }}>
	<div className={`${currentUser.backgroundImage ? "bg-black bg-opacity-40" : ""}`} >
		<ToastContainer/>
		 <Backdrop
	        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
	        open={open}
	        onClick={handleClose}
	      >
	      <div className="flex justify-center items-center text-center gap-5" >
	      	<label htmlFor="file3" id="label_input" className="cursor-pointer" >
 					<div className="mr-3 flex flex-col hover:scale-110 transition duration-400 ease-in-out hover:font-bold items-center justify-center gap-2" >
 						<MdPhotoLibrary className="h-7 w-7 text-blue-500"/>
 						<h2 className="text-white font-semibold">Select from Gallery</h2>
				    </div>
 				<input type="file" id="file3" accept="audio/*" hidden onChange={(e)=>setPath3(e.target.value)} />
			</label>
			<label htmlFor="file4" id="label_input" onClick={revealRecFunc} className="cursor-pointer" >
 					<div className="mr-3 flex flex-col hover:scale-110 transition duration-400 ease-in-out hover:font-bold  items-center justify-center gap-2" >
 						<BsRecordCircle className="h-7 w-7 text-red-500"/>
 						<h2 className="text-white font-semibold">Record</h2>
				    </div>
 				<input type="file" id="file4" accept="audio/*" disabled hidden onChange={(e)=>setPath4(e.target.value)} />
			</label>
		</div>
	      </Backdrop>
		<div className="relative h-[100vh] overflow-x-hidden overflow-scroll" >
			{
				loader && <AiOutlineLoading3Quarters className="h-8 w-8 fixed m-3 mt-7 left-0 top-[11vh] animate-spin text-xl font-semibold text-orange-500"/>
			}
			<BiMenuAltLeft 
				onClick={()=>setReveal(true)}
				className={`md:hidden  z-20 fixed h-8 ${reveal ? "top-[-10vh]" : "top-[9vh]" } cursor-pointer w-8 text-white left-0 transition duration-700 ease-in-out `} />
			<br/><br/><br/>
			<Container>
			
			<div className="chats flex flex-col mt-7">
				{messages?.map((message,index)=>{
					return(
					<div ref={scrollRef} className={` ${message.fromSelf? "hover:mr-5 transition-all duration-500 ease-in-out " : "hover:ml-5 transition-all duration-500 ease-in-out " }`} >
						<div className={`flex ${message.fromSelf? "justify-end" : "justify-start" }`}>
						{
							Linkcheck(message.message) ?
							Audiocheck(message.message) ?
							<div className={`rounded-3xl shadow-xl relative
							${message.fromSelf ? "text-slate-700 bg-white border-blue-500" : "text-slate-100 bg-gradient-to-l from-[#e34bb0] to-[#f23081] border-green-600"} 
							p-[2px] m-2	border-2 max-w-sm md:max-w-2xl 
							`}>
								<audio src={message.message} controls className="rounded-3xl" />
								<span onClick={dateToTime} className={` ${message.fromSelf ? "text-gray-500" : "text-slate-500"} absolute right-4 bottom-0 text-[11px] `} >{time? tConvert(message.updatedAt) : dConvert(message.updatedAt)}</span>
							</div>
							:
							<div className= {`rounded-3xl shadow-xl
							${message.fromSelf ? "text-slate-700 bg-white border-blue-500" : "text-slate-100 bg-gradient-to-l from-[#e34bb0] to-[#f23081] border-green-600"} 
							p-[2px] m-2	border-2 items-end gap-1 flex flex-col max-w-sm md:max-w-2xl md:p-2
							`}>
							<img className="rounded-3xl" src={message.message} alt='' />
							<span onClick={dateToTime}  className={` ${message.fromSelf ? "text-gray-500" : "text-slate-200"} text-[13px] mr-2 `} >{time? tConvert(message.updatedAt) : dConvert(message.updatedAt)}</span>
							</div>

							: <div className={`relative rounded-3xl shadow-xl
							${message.fromSelf ? "text-slate-700 flex bg-white border-blue-500" : "text-slate-100 bg-gradient-to-l flex from-[#e34bb0] to-[#f23081] border-indigo-600"} 
							p-[8px] m-2	border-2  items-end gap-2 max-w-sm md:max-w-2xl overflow-hidden
							`} 
							><p>{message.message}</p><span onClick={dateToTime} className={` ${message.fromSelf ? "text-gray-500" : "text-slate-200"} text-[12px] whitespace-nowrap`} >{time? tConvert(message.updatedAt) : dConvert(message.updatedAt)}</span></div>
						}
												
						</div>
					</div>
					)}
				)}

			</div>
			</Container>
			<br/>
			<br/>
			<br/>
		
					 
		</div>
		<div className="fixed bottom-0 rounded-full flex justify-center w-[100%] md:w-[75%]">
			<form 
			onSubmit={(event)=>{
				sendMsg(event)
			}}
			className={`w-full flex justify-center rounded-full border-2 border-rose-400 transition duration-400 
			ease-in-out focus-within:border-blue-500  ${currentUser.backgroundImage ? "bg-black bg-opacity-40" : "bg-[#d9dbda]" } bg-opacity-70 shadow-lg shadow-indigo-300 focus-within:shadow-indigo-400 justify-around
			w-[90%] items-center mb-3`} >
				<label htmlFor="file1" id="label_input" className="cursor-pointer" >
					<div className="ml-3" >
						<MdPhotoLibrary className={`h-7 w-7 ${loader ? "text-red-500" : "text-blue-500" }`}/>
					</div>
					<input type={`${loader ? "disabled" : "file"}`} id="file1" accept="image/*" hidden onChange={(e)=>setPath(e.target.value)} />
				</label>
				<input type="text" 
				onChange={(e)=>setMsg(e.target.value)}
				value={msg}
				placeholder="Type Something here...."
				className={`w-[90%] ${currentUser.backgroundImage ? "text-white" : "text-black" } rounded-full outline-none focus:ring-0 bg-transparent text-lg text-white p-3`} />
				<div className="relative flex justify-center items-center">
					<div className="audio" id="audio"></div>
					<BsRecordCircle 
					onClick={()=>{
						setRevealRec(false);
						stop();
					}}
					className={`h-7 w-7 cursor-pointer text-red-500 right-[50px] shadow-xl rounded-full shadow-indigo-300 hover:scale-125 transition duration-400 ease-in-out animate-pulse ${revealRec? "absolute" : "hidden"} `}/>
					<button className="relative" >
						<BiMicrophone onClick={handleToggle} className={`h-7 w-7 mr-3 cursor-pointer ${loader ? "text-red-500" : "text-blue-500" }`}/>
					</button>
				</div>
				<button className="submit">
					<AiOutlineSend className="h-7 w-7 mr-3 text-blue-500 cursor-pointer"/>
				</button>
			</form>
		</div>
	</div>
	</div>
		)
}

// 