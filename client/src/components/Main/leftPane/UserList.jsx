import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';

import DoneIcon from '@material-ui/icons/Done';
import StarIcon from '@material-ui/icons/Star';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import DoneAllIcon from '@material-ui/icons/DoneAll'

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton'

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon';

import UserAvatar from '../UserAvatar'	
import ChatActions from '../ChatActions'
import TypingSignal from '../TypingSignal'

import { 
	resetUnread, 
	handleStarred, 
	alertBeforeClear, 
} from '../../../Redux/features/recentChatsSlice'

import {setComponents} from '../../../Redux/features/componentSlice'
import { setSelectedUser, assertFetch } from '../../../Redux/features/otherSlice'
import { storeMessages } from '../../../Redux/features/chatSlice'
import { setSelectedGroup } from '../../../Redux/features/groupSlice'

import { assert, getDateValue, handleFetch } from '../../../lib/script'
import emit from '../../../sockets/outgoing'
import { fetchMessages } from '../../../api/chat'
import { starChat } from '../../../api/recent-chat'

const useStyles = makeStyles({
	listItem: {
		position: 'relative',
		padding: 12,
		'&.MuiListItem-root.Mui-selected': {
			backgroundColor: '#efefef',
			// backgroundColor: 'rgb(248 247 255)'
		},
		'&:hover': {
			backgroundColor: '#e3e3e34d',
			// backgroundColor: 'rgb(248 247 255)'
		},
		'& .MuiAvatar-root': {
			width: 45, height: 45
		},
		'& .MuiMenu-list': {
			padding: '2px 0'
		},
		'& .MuiListItemText-root': {
			marginLeft: '.3rem',
			'& .MuiListItemText-secondary': {
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				paddingInlineEnd: 10,
				marginTop: 2
			}
		}
	},

	chatMisc: {
		display: 'flex',
		alignItems: 'flex-end',
		flexDirection: 'column',
		justifyContent: 'center',
		fontSize: '.8rem',
		whiteSpace: 'nowrap'
	},
	lastSent: {
		marginBottom: 6,
		textAlign: 'right',
		color: '#53555e'
	},
	chatProps: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',

		'& > svg': {
			fontSize: '1.3rem',
			color: '#a2aab9'
		}
	},
	unread: {
		minWidth: 17,
		minHeight: 17,
		background: '#6495ed',
		borderRadius: '100%',
		color: '#fff',
		marginLeft: 6,
		textAlign: 'center'
	},
	typingStatus: {
		color: '#6495ed'
	},
	lastChat: {
		color: 'initial',
		fontSize: '.9rem',
		'& span': {
			color:' #9d9d9d'
		}
	},
	isRead: {
		color: '#6495ed'
	},
	chatRead: {
		'& svg': {
			fontSize: '.8rem',
			position: 'relative',
			top: 2
		}
	},

})


function UserList({
	isStarred,
	username,
	unread,
	visible,
	lastChat,
	chatType,
	isOnline,
	typing,
	groupIsSelected,
	isFetched,
	isCurrentSelectedUser
}) {
	const {username: accountName, id} = useSelector(state => state.account.account)
	const classes = useStyles()
	const dispatch = useDispatch()
	const [showMenu, setMenu] = React.useState(false)
	const [anchorEl, setAnchorEl] = React.useState(null)
	const [dateValue, setDateValue] = React.useState('')

	React.useEffect(() => {
		if (assert(lastChat)) {
			setDateValue(getDateValue(lastChat.chatId, lastChat.timestamp))
		}
	}, [lastChat])

	const setPane = () => {
		if (window.innerWidth < 660) {
			dispatch(setComponents({parent: 'leftPane', component: false}))
		}
	}

	const handleDispatch = () => {
		groupIsSelected && dispatch(setSelectedGroup({}))
		dispatch(setSelectedUser({username}))
		setPane()
	}

	const handleClick = (e) => {
		e.preventDefault()

		if (isCurrentSelectedUser) return
			
		if (assert(unread)) {
			dispatch(resetUnread(username))
			emit('chatIsRead', {
				sender: username,
				receiver: accountName,
			})
		}

		if (isFetched) {
			handleDispatch()
		} else {
			fetchMessages({username}, res => {
				dispatch(storeMessages(res))
				dispatch(assertFetch(username))
				handleDispatch()
			})
		}
	}

	const openContextMenu = (e) => {
		e.preventDefault()

		setMenu(true)
		setAnchorEl(e.currentTarget)
		return false
	}

	const closeContextMenu = (e) => {
		setMenu(false)
		setAnchorEl(null)
	}

	const starConversation = () => {
		const starred = {value: !isStarred.value, date: Date.now()}

		starChat({username, starred})
		// emit('starConversation', id, username, starred, () => {})
		dispatch(handleStarred({friendsName: username, isStarred: starred }))
	}
	const handleDelete = () => {
		dispatch(alertBeforeClear({username}))
	}
	
	return (
		<>
		<ListItem
			button
			className={classes.listItem}
			selected={isCurrentSelectedUser || showMenu}
			onClick={handleClick}
			onContextMenu={openContextMenu}
			style={{display: visible ? 'flex' : 'none'}}
		>
  		<ListItemIcon>
	      <UserAvatar
		      username={username} 
		      badge={isOnline}
		     />
	    </ListItemIcon>
    	<ListItemText 
    		primary={
    			<Typography component='h6'> {username}</Typography>
    		} 
    		secondary={
    			typing ?
    				<TypingSignal />
    			: 
    				<span className={classes.lastChat}> 
    					{lastChat.sender === accountName && 
    						<span className={classes.chatRead}> 
									{
										lastChat.read ? <DoneAllIcon className={classes.isRead} /> 
										: <DoneIcon />
									}
    						</span> 
    					} 
    					 <span> {lastChat.message} </span>
    				</span>
    		}
    	/>
     	<div className={classes.chatMisc} > 
     		<span 
     			className={classes.lastSent} 
     			style={{color: assert(unread) ? '#6495ed' : 'initial'}}
     		> 
     			{dateValue}
     		</span>

     			<span className={classes.chatProps}> 
     				{
							isStarred.value &&
								<StarIcon />
						}
     				{assert(unread) && 
     					<span className={classes.unread}> {unread.length} </span>
     				} 
     				
     			</span>
	     	</div>
	   </ListItem>
	     
  	<ChatActions 
   		open={showMenu} 
   		anchorEl={anchorEl} 
   		onClose={closeContextMenu}
   		anchorOrigin={{
		    vertical: 'center',
		    horizontal: 'center',
		  }}
		  transformOrigin={{
		    vertical: 'center',
		    horizontal: 'center',
		  }}
   	>
   		<div> 
   			<IconButton onClick={() => {
   				starConversation()
   				closeContextMenu()
   			}} >	
   				{isStarred.value ? <StarIcon style={{color: '#6495ed'}} /> : 
   					<StarBorderIcon style={{color: '#6495ed'}} />
   				}
					<Typography component='span'> {`${isStarred.value ? 'Unstar' : 'Star'} conversation` }</Typography>
   			</IconButton>
   			<IconButton onClick={() => {
   				handleDelete()
   				closeContextMenu()
   			}} >	
   				<DeleteSweepIcon style={{color: '#ff6a6a'}} />
					<Typography component='span'> Clear conversation </Typography>
   			</IconButton>
   		</div>

   	</ChatActions>
   	</>
	)
}

export default UserList