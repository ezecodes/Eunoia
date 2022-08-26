import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton'
import InputBase from "@material-ui/core/InputBase";
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar'
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar'

import SendIcon from '@material-ui/icons/Send';
import GroupIcon from '@material-ui/icons/Group'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ReplyIcon from '@material-ui/icons/Reply'
import StarsIcon from '@material-ui/icons/Stars';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';

import { setComponents} from '../../../Redux/features/componentSlice'
import { 
	storeSentGroupChat, 
	storeReceivedGroupChat, 
	performGroupChatDelete , 
	setReply, 
	setHighlighted, 
	undoPendingDelete, 
	setPendingDelete,
	setSelectedGroupChat
} from '../../../Redux/features/groupSlice'

import {updateRecentGroupChats, syncRecentGroupWithDeleted} from '../../../Redux/features/recentChatsSlice'

import { handleAlert } from '../../../Redux/features/otherSlice'

import ChatActions from '../ChatActions'

import BaseCard from './BaseCard'
import HelperAlert from '../../HelperAlert'
import TypingSignal from '../TypingSignal'
import UserAvatar from '../UserAvatar'	
import GroupChatMessages from './GroupChatMessages'
import ReplyHandle from './ReplyHandle'

import { getWindowHeight, assert, getLastSeen, retrieveDate } from '../../../lib/script'
import emit from '../../../sockets/outgoing'

const useStyles = makeStyles({
	
	bottomSnackbar: {
		transform: 'none',
		bottom: '15%',
		'& .MuiSnackbarContent-message': {
			'& .MuiTypography-body1': {
				marginLeft: 10,
			},
			display: 'flex',
			alignItems: 'center',
		}
	},
	noMember: {
		background: '#ffffffa1',
		textAlign: 'center',
		borderRadius: '10px',
		padding: '10px',
		color:'#340000'
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

function GroupMessagesPane ({
	_id, 
	name,
	description,
	participants,
	createdBy, 
	messages, 
	admins,
	isCurrentSelected,
	isAParticipant,
	actionValues,
	settings,
}) {

	const dispatch = useDispatch()
	const classes = useStyles()
	const inputRef = React.createRef(null)

	const {pendingDelete, reply, typing} = actionValues
	const {allowChatForAdminsOnly} = settings

	const {id, username, online} = useSelector(state => state.account.account)
	const accountIsOnline = useSelector(state => state.account.account.online)
	const selectedChat = useSelector(state => state.groups.selectedChat)

	const [timerToDelete, setDeleteTimer] = React.useState(null)
	const [showInfo, setInfoPage] = React.useState(false)
	const [showSettings, setSettingsPage] = React.useState(false)
	const [hightlightTimer, setHighlightTimer] = React.useState(null)
	const [timer, setTimer] = React.useState(null)
	const [isTyping, setTyping] = React.useState(false)
	const [pos, setPos] = React.useState({})

	let typingArr = typing.filter(i => i.typing).map(i => i.username)


	React.useEffect(() => {
		if (assert(pendingDelete) && accountIsOnline) {
			clearTimeout(timerToDelete)

			let newTimerToDelete = setTimeout(() => {
				emit('deleteGroupChat', 
					{
						_id,
						chatId: pendingDelete.chatId
					}
				)
				
			}, 1700)

			setDeleteTimer(newTimerToDelete)
		}	
	}, [pendingDelete])

	React.useEffect(() => {
		const lastChat = messages.at(messages.length -1)
		if (lastChat) {
			dispatch(updateRecentGroupChats({_id, lastChat}))
		}
	}, [messages])

	const undoDelete = () => {
		dispatch(undoPendingDelete(_id))
		clearTimeout(timerToDelete)
	}

	const handleChatHighlight = () => {
		dispatch(setHighlighted({chatId: reply.chatId, _id, show: true}))
		clearTimeout(hightlightTimer)

		let newTimer = setTimeout(() => {
			dispatch(setHighlighted({chatId: reply.chatId, _id, show: false}))
		}, 1500)

		setHighlightTimer(newTimer)
	}
	
	const closeReplyHandle = () => {
		dispatch(setReply({open: false, _id}))
	}

	const handleTypingStatus = (bool) => {
		emit('groupTyping', {typing: bool, username, _id})
		
		setTyping(bool)
	}
	const listenForEnter = (e) => {
		if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
			e.preventDefault()
			sendMessage()
		}
	}
	const handleTextInput = (e) => {
		clearTimeout(timer)

		const newTimer = setTimeout(() => {
			handleTypingStatus(false)
		}, 1800)

		// This is vital to prevent multiple dispatches
		if (!isTyping) {
			handleTypingStatus(true)
		}

		setTimer(newTimer)
	}

	const sendMessage = () => {
		if (!online) {
			dispatch(handleAlert({open: true}))
			return
		}

		const input = inputRef.current.querySelector('textarea')
		if (input.value.replaceAll(' ', '') === '') {
			return
		}
		const _date = new Date()
		const dateNow = () => _date.getTime()
		const thisDate = dateNow()

		const chatObj = {
			_id,
			chat: {
				message: input.value,
				chatId: thisDate,
				sender: username,
				timestamp: retrieveDate(),
				reply
			}
		}
		emit('chatFromGroup', chatObj)
		handleTypingStatus(false)
		input.value = ''
		reply.open &&
		 dispatch(setReply({
			_id,
			open: false,
		}))
	}

	const handleInfo = () => {
		dispatch(setComponents({component: 'gRoot', parent: 'gInfos'}))
	}

	React.useEffect(() => {
		if (reply.open) {
			inputRef.current.querySelector('textarea').focus()
		}
	}, [reply])

	React.useEffect(() => {

		// set the position of a selected chat
		if (assert(selectedChat)) {
			setPos(JSON.parse(selectedChat.pos))
		}
	}, [selectedChat])

	const handleCopy = () => {
		navigator.clipboard.writeText(selectedChat.chat.message)
		closeActions()
	}

	const closeActions = (e) => {
		dispatch(setSelectedGroupChat({}))
	}

	const beginDelete = () => {
		if (!accountIsOnline) {
			handleAlert({open: true})
			return false
		}
		dispatch(setPendingDelete({pendingDelete: selectedChat.chat, _id}))
		dispatch(setReply({open: false, _id}))
	}

	const handleReply = () => {
		if (isCurrentSelected) {
			dispatch(setReply({
				_id,
				open: true,
				chatId: selectedChat.chat.chatId,
				sender: selectedChat.chat.sender,
			}))
		}
		
	}

	return (
		<BaseCard>
			<CardHeader
        avatar={
			    <Avatar >
			    	<GroupIcon />
			    </Avatar>
        }
        action={
        	<IconButton onClick={handleInfo} >
        		<InfoOutlinedIcon />
        	</IconButton>
        }
        title={<span> {name} </span>}
       	subheader={
       		typingArr.length > 0 ?
       			<TypingSignal>
       				{typingArr.join(', ')}
       			</TypingSignal>
       		: 
 					<>
 						{
 							participants.filter(i => i).sort((a, b) => {
 								if (a.username === username) return -1
 									else return 1
 							}).map(i => i.username).join(', ').replaceAll(username, 'You')
 						}
   				</>
       	}
      />

      <CardContent>
      	{
      		messages.length > 0 &&
      		<GroupChatMessages chats={messages} /> 

      	}
      	{assert(pos) && assert(selectedChat) &&
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
						{/*{
							reactions.map((reaction, i) => {
								return (
									<IconButton key={reaction.name}> {reaction.icon} </IconButton>
								)
							})
						}*/}
					</div>
					<div>
					{participants.findIndex(i => i.username === username) !== -1  &&
						<IconButton onClick={() => {
							handleReply()
							closeActions()
						}} >
							<ReplyIcon /> 
							<Typography component='span'> Reply </Typography>
						</IconButton>
					}

						<IconButton onClick={() => {
							handleCopy()
						}} >
							<FileCopyOutlinedIcon style={{color:'#958783'}} /> 
							<Typography component='span'> Copy </Typography>
						</IconButton>

						{selectedChat.chat.sender === username &&	
							<IconButton onClick={() => {
								beginDelete()
								closeActions()
							}} >
								<DeleteSweepIcon style={{color: '#ed143d'}} /> 
								<Typography component='span'> Delete </Typography>
							</IconButton>
						}
					</div>
				</ChatActions>
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
      </CardContent>

      <CardActions >
      	<ReplyHandle {...reply} 
      		closeReplyHandle={closeReplyHandle} 
      		handleChatHighlight={handleChatHighlight}
      	/>
      	{participants.findIndex(i => i.username === username) !== -1 ?
      	<InputBase
      		multiline
      		placeholder='Type your messages'
      		ref={inputRef}
      		className={classes.inputBase}
      		onChange={() => accountIsOnline && handleTextInput()}
      		// onKeyDown={listenForEnter}
      		maxRows={4}
      		onKeyDown={listenForEnter}
      		minRows={1}
      		onClick={() => {
      		}}
      		endAdornment={
						<InputAdornment position="end" style={{height: '100%'}}>
							<IconButton onClick={sendMessage} >
			      		<SendIcon color='primary' />
			      	</IconButton>
						</InputAdornment>
					}
      		// value={input}
      	/>
      	: 
      	<div className={classes.noMember}>
      		<span> You can't interact with this group <br /> 
      			as you are no longer a participant </span>
      	</div>
      	}
      </CardActions>
		</BaseCard>
	)
}

export default GroupMessagesPane