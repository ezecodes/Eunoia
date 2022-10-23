import React from 'react'

import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton'
import InputBase from "@material-ui/core/InputBase";
import Menu from '@material-ui/core/Menu'
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment';

import SendIcon from '@material-ui/icons/Send';
import TagFacesIcon from '@material-ui/icons/TagFaces';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import PhoneIcon from '@material-ui/icons/Phone';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloseIcon from '@material-ui/icons/Close';
import StarsIcon from '@material-ui/icons/Stars';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import ReplyIcon from '@material-ui/icons/Reply'

import common from '@material-ui/core/colors/common';

import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import { Link } from 'react-router-dom'

import { useDispatch,useSelector } from 'react-redux'
import {  
	storeSentChat, 
	setReply,
	handleStarredChat, 
	performChatDelete, 
	setPendingDelete,
	undoPendingDelete,
	setHighlighted,
	fetchUserProfile,
	handleReply,
	setSelectedChat,
	setUserInput,
	setUserProfile
} from '../../../Redux/features/chatSlice'

import { setTypingStatus, handleAlert } from '../../../Redux/features/otherSlice'
import {updateRecentChats, syncRecentsWithDeleted} from '../../../Redux/features/recentChatsSlice'

import { assert, getLastSeen, retrieveDate } from '../../../lib/script'
import emit from '../../../sockets/outgoing'
import HelperAlert from '../../HelperAlert'
import UserChatMessages from './UserChatMessages'
import UserAvatar from '../UserAvatar'
import ReplyHandle from './ReplyHandle'
import MessageInput from './MessageInput'
import BaseCard from './BaseCard'
import ChatActions from '../ChatActions'
import TypingSignal from '../TypingSignal'

const useStyles = makeStyles({
	emoji: {
		fill: '#363636',
		cursor: 'pointer'
	},
	error: {
		position: 'fixed',
		zIndex: '999',
		right: '10px',
		bottom: '50px'
	},
	
	snackbar: {
		transform: 'none'
	},
	noChats: {
		position: 'absolute',
		bottom: '1rem',
		left: '10%',
		textAlign: 'center',
		width: '80%',
		textShadow: '1px 1px 1px #eee',
		color: '#68431d'
	},
	bottomSnackbar: {
		bottom: '15%',
		'& .MuiSnackbarContent-message': {
			'& .MuiTypography-body1': {
				marginLeft: 10,
			},
			display: 'flex',
			alignItems: 'center',
		}
	},
	codeEle: {
		borderRadius: '4px',
		display: 'inline-flex',
		background: '#ffffff47',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '0 6px'
	}
})

function ActionNotifier(props) {
	const classes = useStyles()
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress + 10));
    }, 200);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return(
  	<>
  		<CircularProgress variant="determinate" value={progress} />
  		<Typography component='span'> {props.action} </Typography>
  	</>
  )
}

const UserMessagesPane = ({friend, typingStatus, onlineStatus, lastSeen}) => {
	const classes = useStyles()

	const dispatch = useDispatch()
	const {username, id} = useSelector(state => state.account.account)

	const profile = useSelector(state => state.components.profile)

	const selectedUser = useSelector(state => state.other.currentSelectedUser)

	const accountIsOnline = useSelector(state => state.account.account.online)

	const selectedChat = useSelector(state => state.chat.selectedChat)

	const [timerToDelete, setDeleteTimer] = React.useState(null)

	const {pendingDelete, starredChat, reply, showProfile, inputValue, scrollPos} = friend.actionValues
	const [showHelper, setHelperAlert] = React.useState(false)
	const [anchorEl, setAnchorEl] = React.useState(null)

	const [showPicker, setPicker] = React.useState(false)

	const [timer, setTimer] = React.useState(null)
	const [hightlightTimer, setHighlightTimer] = React.useState(null)

	const starredChatRef = React.createRef(null)
	const cardContentRef = React.createRef(null)

	const [typing, setTyping] = React.useState(false)
	const [pos, setPos] = React.useState({})

	const [secondaryText, setText] = React.useState('')

	React.useEffect(() => {
		if (onlineStatus) setText('online')
		else 
			if (lastSeen) setText(`last seen ${getLastSeen(lastSeen)}`)
			else setText('')
	}, [onlineStatus])

	React.useEffect(() => {
		const lastChat = friend.messages.at(-1)
		if (lastChat) {
			dispatch(updateRecentChats({lastChat, username: friend.username}))
		}
	}, [friend.messages])

	React.useEffect(() => {
		
		if (assert(pendingDelete)) {
			clearTimeout(timerToDelete)

			let newTimerToDelete = setTimeout(() => {
				function del(evt) {
					emit(evt, {
						deletedBy: username, 
						friendsName: friend.username, 
						chatId: pendingDelete.chatId,
						sender: pendingDelete.sender
					})
				}

				if (username === pendingDelete.sender) {
					del('deleteChatForAll')
				} else if (username !== pendingDelete.sender) {
					del('deleteChatForOne')
				}
				dispatch(performChatDelete({friendsName: friend.username, chatId: pendingDelete.chatId}))

				reply.open &&
				 dispatch(setReply({open: false, friendsName: friend.username}))
				
			}, 2000)
			setDeleteTimer(newTimerToDelete)
		}	
	}, [pendingDelete])

	const undoDelete = () => {
		dispatch(undoPendingDelete({friendsName: friend.username}))
		clearTimeout(timerToDelete)
	}

	const toggleMenu = (event) => {
		setAnchorEl(event.target)
	}
	const handleClose =() => {
		setAnchorEl(null)
	}
	
	const handleTypingStatus = (bool) => {
		if (!onlineStatus) return false
		emit('userIsTyping', {typing: bool, selectedUser: friend.username, user: username})
		setTyping(bool)
	}
	const handleUnstar = () => {
		emit('unstarChat', {starredBy: username, friendsName: friend.username, starred: {}})
		dispatch(handleStarredChat({starredChat: {}, friendsName: friend.username}))
	}

	const handleTextInput = (value) => {
		clearTimeout(timer)
		dispatch(setUserInput({username: friend.username, value}))

		const newTimer = setTimeout( async () => {
			handleTypingStatus(false)
		}, 1500)
		if (!typing) {// This is vital to prevent multiple dispatches
			handleTypingStatus(true)
		}
		setTimer(newTimer)
	}

	const closeReplyHandle = () => {
		dispatch(setReply({open: false, friendsName: friend.username}))
	}
	const closeHelper = () => setHelperAlert(false)

	const handleError = (info) => dispatch(handleAlert(info))

	const sendMessage = () => {
		const finalValue = inputValue.trim()
		if (finalValue.replaceAll(' ', '') === '') return false

		typing && handleTypingStatus(false)
		if (!accountIsOnline) {
			handleError({open: true})
			return false
		}
		const _date = new Date()
		const dateNow = () => _date.getTime()
		const thisDate = dateNow()

		const chatObj = {
			receiver: friend.username,
			sender: username,
			lastSent: thisDate,
			message: {
				message: finalValue,
				chatId: thisDate,
				sender: username,
				read: false,
				receiver: friend.username,
				timestamp: retrieveDate(),
				reply: reply
			}
		}

		emit('sentChat', chatObj)
		dispatch(storeSentChat(chatObj))
		reply.open && closeReplyHandle()
		dispatch(setUserInput({username: friend.username, value: ''}))
	}

	const handleChatHighlight = () => {
		dispatch(setHighlighted({chatId: reply.chatId, friendsName: friend.username, show: true}))
		clearTimeout(hightlightTimer)

		let newTimer = setTimeout(() => {
			dispatch(setHighlighted({chatId: reply.chatId, friendsName: friend.username, show: false}))
		}, 1500)

		setHighlightTimer(newTimer)
	}

	React.useEffect(() => {
		if (assert(selectedChat)) {
			setPos(JSON.parse(selectedChat.pos))
		}
	}, [selectedChat])

	const closeActions = () => {
		dispatch(setSelectedChat({}))
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(selectedChat.chat.message)
	}

	const beginDelete = () => {
		if (!accountIsOnline) {
			handleError({open: true})
			return false
		}
		dispatch(setPendingDelete({friendsName: friend.username, chat: selectedChat.chat}))
	}

	const handleReply = () => {
		dispatch(setReply({
			username,
			open: true,
			chatId: selectedChat.chat.chatId,
			sender: selectedChat.chat.sender,
			friendsName: friend.username
		}))
	}

	const handleUserProfile = () => dispatch(setUserProfile(true))

	return (
		<BaseCard>
			<CardHeader
        avatar={
          <div onClick={handleUserProfile}>
				    
	          <UserAvatar 
				      username={friend.username} 
				      badge={false}
				      style={{fontSize: '1.1rem'}}
				    />
				   </div>
        }
         action={
        	<IconButton onClick={handleUserProfile} >
        		<PermIdentityIcon />
        	</IconButton>
        }
        title={<span onClick={handleUserProfile}> {friend.username} </span>}
        subheader={
        	typingStatus ? <TypingSignal /> :
        		secondaryText
        }
      />
      <CardContent 
      	ref={cardContentRef}
      	className={classes.contents} 
      >

        { friend.messages.length > 0 ?
        	<UserChatMessages chats={friend.messages} />
        	: <div className={classes.noChats}> {'Start the conversation by saying Hi'} </div>
        }

				<Snackbar 
					className={[classes.bottomSnackbar, classes.snackbar].join(' ')}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					message={<ActionNotifier action={'Deleting...'} />}
					open={assert(pendingDelete)}
					action={
						<Button onClick={() => undoDelete()} style={{color: '#ffc4cf'}}> UNDO </Button>
					}
				/>
				{/*<Snackbar 
	    		open={showHelper}
	    		onClose={closeHelper}
			 		anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
		    	classNames={[classes.bottomSnackbar, classes.snackbar].join(' ')}
					autoHideDuration={3000}
				>
				  <MuiAlert variant='filled' elevation={6} onClose={closeHelper} severity={'info'}>
				    <span> 
	    					Press <code className={classes.codeEle} > win + Period (<strong> . </strong>) </code> to use emoji
	    				</span>
				  </MuiAlert>
				</Snackbar>
*/}
				{assert(selectedChat) && assert(pos) && 
				<ChatActions 
					open={assert(selectedChat)} 
					onClose={closeActions}
					anchorPosition={{
						top: pos.top,
						left: pos.left
					}} 
					anchorOrigin={{
				    vertical: 'bottom',
				    horizontal: selectedChat.chat.sender === username ? 'left' : 'right',
				  }}
				  transformOrigin={{
				    vertical: 'top',
				    horizontal: selectedChat.chat.sender === username ? 'right' : 'left',
				  }}
				>
					<div>
						<IconButton onClick={() => {
							handleReply()
							closeActions()
						}} >
							<ReplyIcon /> 
							<Typography component='span'> Reply </Typography>
						</IconButton>

						<IconButton onClick={() => {
							handleCopy()
							closeActions()
						}} >
							<FileCopyOutlinedIcon style={{color:'#958783'}} /> 
							<Typography component='span'> Copy </Typography>
						</IconButton>

						<IconButton onClick={() => {
							beginDelete()
							closeActions()
						}} >
							<DeleteSweepIcon style={{color: '#ed143d'}} /> 
							<Typography component='span'> Delete </Typography>
						</IconButton>
					</div>
				</ChatActions>
				}

      </CardContent>
      
      <CardActions className={classes.contents} >
      	<ReplyHandle {...reply} 
      		closeReplyHandle={closeReplyHandle} 
      		handleChatHighlight={handleChatHighlight}
      	/>
      	<MessageInput 
      		inputValue={inputValue}
    			handleTextInput={handleTextInput}
    			sendMessage={sendMessage}
    		/>
	      	
    	</CardActions>

		</BaseCard>
	)
}

export default UserMessagesPane