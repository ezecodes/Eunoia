import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import DoneAllIcon from '@material-ui/icons/DoneAll'
import DoneIcon from '@material-ui/icons/Done';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar'
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';

import common from '@material-ui/core/colors/common';
import blue from '@material-ui/core/colors/blue';
import deepOrange from '@material-ui/core/colors/deepOrange';

import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import StarsIcon from '@material-ui/icons/Stars';

import { assert } from '../../../lib/script'
import { socket } from '../Main'

import { setHighlighted, setSelectedGroupChat } from '../../../Redux/features/groupSlice'


const useStyles = makeStyles({
	indexedChats: {
		display: 'flex',
		flexDirection: 'column'
	},
	dateNotice: {
		textAlign: 'center',
		margin: '10px 0',
		position: 'sticky',
		zIndex: 20,
		top: '10px',
		
	},
	chatNotifier: {
		'& > span:first-child': {
			fontSize: '.83rem',
			padding: '3px 7px',
			background: common.white,
			boxShadow: '0 0 2px 0px #00000021',
			borderRadius: '5px',
			lineHeight: 1.3
		}
	},
	alert: {
		opacity: '.9',
		display: 'flex',
		justifyContent: 'center',
		marginBottom: '10px',

		'& > span': {
			display: 'flex',
			whiteSpace: 'pre-line',
			'& > span': {
				padding: '0 0 0 11px',
				fontSize: '.7rem',
				alignSelf: 'flex-end',
				opacity: .9
			}
		}
	},
	chatWrapper: {
		display: 'flex',
		position: 'relative',
		alignItems: 'flex-end',
		width: '100%',
		padding: '2px 0',
		transition: '.6s ease all'
	},
	flexStart: {
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		paddingLeft: '.5rem',

	},
	flexEnd: {
		alignSelf: 'flex-end',
		justifyContent: 'flex-end',
	},
	fromAccount: {
		marginLeft: '1rem',
		background: '#727f93',
		'& > span:last-of-type': {
			color: common.white
		}
	},
	fromFriend: {
		marginRight: '1rem',
		background: common.white
	},
	chatSingle: {
		maxWidth: '80%',
		whiteSpace: 'pre-line',
		width: 'auto',
		font: 'message-box',
		borderRadius: '5px' ,
		boxShadow: '1px 1px 1px 0px #00000012',
		position: 'relative',
		'& > span': {
			padding: '4px 4px 5px 7px'
			
		}
	},
	
	isLast: {
		marginBottom: 8
	},
	overflow: {
		maxHeight: '200px',
		overflowX: 'hidden',
		whiteSpace: 'pre-line',
		display: 'block'
	},
	sender: {
		display: 'block',
		color: '#ff845d',
		padding: '2px 0' ,
		fontSize: '.8rem', 
		fontWeight: 'bold',
	},
	myReply: {
		padding: '3px 10px 7px 1px',
		'& > span:first-child': {
			color: '#ef592a',
			fontWeight: 'bold',
			display: 'block',
			margin: '0px 0 2px 0'
		},
		'& > span:last-of-type': {
			// marginLeft: '2px'
		}
	},
	reply: {
		background: common.white,
		fontSize: '.85rem',
		paddingLeft: '6px' ,
		borderBottom: '1px solid #efefef',
		borderLeft: '2px solid #ffb55c',
		borderRadius: 'inherit',
		borderBottomLeftRadius: '0',
		borderBottomRightRadius: '0',
	},
	replyBlock: {
		padding: '0 10px 7px 2px',
		'& > span:first-child': {
			color: deepOrange[700],
			fontWeight: 'bold',
			fontSize: '.8rem',
			display: 'block',
			margin: '1px 0'
		},
		'& > span:last-of-type': {
		}
	},
	chatTime: {
		fontSize: '.65rem',
		marginLeft: 7,
		opacity: .9,
		position: 'sticky',
		top: '100px',
		float: 'right',
		bottom: '0',
	},
	deleted: {
		fontStyle: 'italic',
		padding: '3px 7px',
		background: '#fffadd',
		borderRadius: '5px',
		'& > span': {
			color: '#d96c6c !important',
		}
	},

	
})

const Chat = () => {
	return (
		<Chat >

		</Chat>
	)
}

const colors = [
 '#6495ed', 
 '#cb64ed',
	'#64ed94',
  '#7364ed',
  '#64a1ed',
  '#edb664',
  '#eda364',
  '#64c7ed',
  '#ed7d64',
  '#ed6471'
]

const ChatSingle = ({chat, isFirst, isLast}) => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const username = useSelector(state => state.account.account.username)

	let me = (chat.sender === username) ? true : false

	let className = me ? classes.fromAccount : classes.fromFriend
	let wrapperClass = me ? classes.flexEnd : classes.flexStart
	let wrapperStyle = {background: chat.highlightChat ? 'rgb(0 137 255 / 14%)' : 'inherit'}

	let bubbleClass = () => {
		if (me) {
			return 'rightBubble'
		} else {
			return 'leftBubble'
		}
	}

	const [open, setOpen] = React.useState(false)
	const [timer, setTimer] = React.useState(null)
	const chatRef = React.createRef(null)
	const [anchorEl, setAnchorEl] = React.useState(null)
	const {_id} = useSelector(state => state.groups.selectedGroup)

	const deleted = chat.message === '' ? true : false
	
	const handleChatHighlight = () => {
		dispatch(setHighlighted({chatId: chat.reply.chatId, _id, show: true}))
		clearTimeout(timer)

		let newTimer = setTimeout(() => {
			dispatch(setHighlighted({chatId: chat.reply.chatId, _id, show: false}))
		}, 1500)

		setTimer(newTimer)
	}

	React.useEffect(() => {
		chatRef.current.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
	}, [chat.highlightChat])

	const set = (target) => {
		dispatch(setSelectedGroupChat({
			chat, 
			pos: JSON.stringify(target.getBoundingClientRect())
		}))
	}

	const handleChatActions = (target) => {
		if (deleted) return false
		set(target)
	}

	const openContextMenu= (e) => {
		if (deleted) return false
		e.preventDefault()
		set(e.target)
	}

	return (
			<div 
				className={
					[classes.chatWrapper, wrapperClass, isFirst && classes.isFirst, isLast && classes.isLast].join(' ')} 
					style={wrapperStyle} 
					ref={chatRef} 
			>
				{
					deleted ? 
					<div className={[className, classes.deleted].join(' ')}>
						<span className={classes.deleted}> Deleted </span> 
					</div> 
					:
					chat.reply.open ? 
					<>
						<div className={[className, classes.chatSingle, isFirst && bubbleClass(), 'reply'].join(' ')} >

							<div 
								className={classes.reply} 
								onClick={() => { chat.reply.message !== '' && handleChatHighlight()}}
							>
								{!me && 
									<span className={classes.sender} 
									style={{color: colors[chat.sender.split(' ').join('').length -1] || '#ed6471'}} 
									> {chat.sender} </span>}

								<div className={!me ? classes.replyBlock : classes.myReply}>

									<span style={{color: colors[chat.reply.sender.split(' ').join('').length -1] || '#ed6471'}} > 
										{chat.reply.sender === username ? 'You' : chat.reply.sender} </span>

									{ chat.reply.message !== '' ?
											<span className={classes.overflow} > {chat.reply.message} </span>
										: 
											<div className={[className, classes.deleted].join(' ')}>
												<span className={classes.deleted}> Deleted </span> 
											</div> 
									}
								</div>
							</div>

							<span className={[classes.chat, classes.overflow].join(' ')} 
								onClick={({target}) => {
									assert(chat.chatId) && handleChatActions(target)
								}} 
								onContextMenu={openContextMenu}
							> 
								{chat.message}
								<span className={classes.chatTime}> {chat.timestamp.time} </span>
							</span>
						</div>
					</>
					:
					<>
						<div className={[className, classes.chatSingle, isFirst && bubbleClass()].join(' ')} >
							<span className={[classes.chat, classes.overflow].join(' ')} 
								onClick={({target}) => {
									assert(chat.chatId) && handleChatActions(target)
								}} 
								onContextMenu={openContextMenu}
							>
								{!me &&
								 <span className={classes.sender}
								 style={{color: colors[chat.sender.split(' ').join('').length -1] || '#ed6471'}} 
								 > {chat.sender} </span>}
								{chat.message}
								<span className={classes.chatTime}> {chat.timestamp.time} </span>
							</span>
						</div>
					</>
					
				}
			</div>
	)
}


const ChatsByDate = ({chat}) => {
	const classes = useStyles()
	const day = new Date().toDateString().slice(0, -5)
	const username = useSelector(state => state.account.account.username)
	
	return (
		<div >
			<header className={[classes.dateNotice, classes.chatNotifier].join(' ')} >
				<span> {chat.day === day ? 'Today' : chat.day} </span>
			</header>


			<div className={classes.indexedChats}>
				{
					chat.chats.length > 0 &&
						chat.chats.map((message, i) => {

							if (message.type === 'alert') {
								return (
									<div key={i} className={[classes.alert, classes.chatNotifier].join(' ')}>
										<span> 
    									{message.message.split(' ').map(i => i.replaceAll(username, 'You')).join(' ')}
										<span > {message.timestamp.time} </span>
										</span>
									</div>
								)
							} else {

							let indicators = {isFirst: false, isLast: false}

							if (i === 0) indicators.isFirst = true
							else if (i > 0) {
								if (message.sender !== chat.chats[i-1].sender) {
									indicators.isFirst = true
								} 
								if (i === chat.chats.length-1) indicators.isLast = true
								if (i < chat.chats.length-1) {

									if (message.sender !== chat.chats[i+1].sender) {
										indicators.isLast = true
									}

									if (message.sender !== chat.chats[i-1].sender && 
										message.sender === chat.chats[i+1].sender) {
										indicators.isFirst = true
									}

									if (message.sender !== chat.chats[i-1].sender && 
										message.sender !== chat.chats[i+1].sender) {
										indicators = {isFirst: true, isLast: true}
									}
								}
							}
							return (
								<ChatSingle key={message.chatId} chat={message} {...indicators} /> 
							)
						}
						})
				}
			</div>
		</div>
	)
}

const determineIndicator = (curr, prev, next) => {

}

const GroupChatMessages = ({chats}) => {
	/** Index chats by date **/
	const classes = useStyles()

	let dates = [], chatsIndexedByDate = []

	/** Index chats according to their dates */
	chats.forEach(i => {
		const dateInDates = dates.findIndex(d => d === i.timestamp.day)
		if (dateInDates === -1) {
			dates.push(i.timestamp.day)
		}
	})

	dates.forEach(day => {
		const chatsWithSameDate = chats.filter(chat => chat.timestamp.day === day)
		chatsIndexedByDate.push({day: day, chats: chatsWithSameDate})
	})

	return (
		<> 
				<div className={classes.chats}>
					{ chatsIndexedByDate.length > 0 &&
							chatsIndexedByDate.map((chatCollection, i) => <ChatsByDate key={i} chat={chatCollection} />)
					}
				</div>
		</>
	)
}

export default GroupChatMessages