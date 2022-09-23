import { atom } from 'recoil';


export const currentUserState = atom({
	key:"currentUserState",
	default:null,
})


export const currentChatState = atom({
	key:"currentChatState",
	default:null,
})

export const searchState = atom({
	key:"searchState",
	default:''
})


export const revealState = atom({
	key:'revealState',
	default:false
})