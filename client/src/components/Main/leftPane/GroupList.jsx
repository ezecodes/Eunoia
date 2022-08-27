import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import GroupIcon from '@material-ui/icons/Group'
import DoneIcon from '@material-ui/icons/Done';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton'
import Avatar from '@material-ui/core/Avatar'

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';

import ChatActions from '../ChatActions'
import TypingSignal from '../TypingSignal'

import {setComponents} from '../../../Redux/features/componentSlice'
import { setSelectedGroup, fetchGroupChats, setFetchedGroup, fetchChatsFromLS } from '../../../Redux/features/groupSlice'
import { setSelectedUser } from '../../../Redux/features/otherSlice'
import { 
	resetUnread, 
	starGroup, 
	handleGroupUnread,
	alertGroupDeletion,
	updateGroupField
} from '../../../Redux/features/recentChatsSlice'

import { assert, getDateValue, handleFetch} from '../../../lib/script'
import emit from '../../../sockets/outgoing'

const useStyles = makeStyles({
	listItem: {
		position: 'relative',
		padding: 12,
		'&.MuiListItem-root.Mui-selected': {
			backgroundColor: '#e3e3e34d',
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
			'& > h6, & > p': {
				marginLeft: '.3rem',
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
	lastGroupChat: {
		'& > span:first-child': {
			color: '#d99a5a',
			fontWeight: 'bold'
		},
		'& > span:last-of-type': {
			color: '#9d9d9d'
		}
	},
	textPrimary: {
		color: '#9d9d9d',


	},

})

function GroupList ({
	_id,
	name,
	isStarred,
	typing, 
	visible, 
	unread, 
	lastChat,
	isNull,
	userIsSelected,
	isCurrentSelectedGroup, 
	isFetched
}) {
	const {id, username} = useSelector(state => state.account.account)
	const classes = useStyles()
	const dispatch = useDispatch()
	const [showMenu, setMenu] = React.useState(false)
	const [anchorEl, setAnchorEl] = React.useState(null)
	const [secText, setText] = React.useState()
	const [dateValue, setDateValue] = React.useState('')
	const [subText, setSubText] = React.useState('')

	React.useEffect(() => {
		if (assert(lastChat)) {
			setDateValue(getDateValue(lastChat.chatId, lastChat.timestamp))
		}
	}, [lastChat])

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

	const handleStar = () => {
		const starredObj = {value: !isStarred.value, date: Date.now()}

		handleFetch(
			`chat/starGroup/${id}/${_id}`,
			'put',
			{starredObj}
		)

		dispatch(starGroup({_id, starredObj }))
	}
	
	const setPane = () => {
		if (window.innerWidth < 660) {
			dispatch(setComponents({parent: 'leftPane', component: false}))
		}
	}
	const handleDispatch = () => {
		dispatch(setSelectedGroup({_id}))
		userIsSelected && dispatch(setSelectedUser({}))
		setPane()
	}

	const setAlert = () => dispatch(alertGroupDeletion(_id))

	const handleClick = () => {

		// the user is not a participant or group is currently selected
		if (isNull || isCurrentSelectedGroup) return 

		if (assert(unread)) {
			handleFetch(
				`chat/clearGroupUnread/${id}/${_id}`,
				'delete',
			)

			dispatch(updateGroupField({
				_id,
				field: {
					unread: []
				}
			}))
		}

		if (isFetched) {
			handleDispatch()
		} else {
			dispatch(fetchGroupChats({id, _id})).then(() => {
				dispatch(setFetchedGroup(_id))
				handleDispatch()
			})
		}
	}

	return (
		<><ListItem	
			button
			className={classes.listItem}
			onClick={handleClick}
			selected={isCurrentSelectedGroup || showMenu}
			onContextMenu={openContextMenu}
			style={{display: visible ? 'flex' : 'none'}}
		>
			<ListItemIcon>
	      <Avatar>
	      	<GroupIcon />
	      </Avatar>
	    </ListItemIcon>
	    <ListItemText 
    		primary={
    			<Typography component='h6'> {name}</Typography>
    		} 
    		secondary={
    			<span>
    				{
    					typing.some(i => i.typing) &&
    					<TypingSignal>
    						{ typing.map(i => i.username).join(', ') }
    					</TypingSignal>
    				}

    				{
    					(assert(lastChat) && !typing.some(i => i.typing)) &&
			  				<span className={[classes.lastGroupChat].join(' ')}> 
    							{
    								(lastChat.type && lastChat.type === 'alert') ?
    									lastChat.message.split(' ').map(i => i.replaceAll(username, 'You')).join(' ')
					    			:
									 	<>
										 	<span>
										 		{lastChat.sender.replaceAll(username, 'You')}:
										 	</span>
										 	<span>&nbsp;{lastChat.message} </span>
									 	</>
									}
			  				</span>
    				}
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
   				handleStar()
   				closeContextMenu()
   			}} >	
   				{isStarred.value ? <StarIcon style={{color: '#6495ed'}} /> : 
   					<StarBorderIcon style={{color: '#6495ed'}} />
   				}
					<Typography component='span'> {`${isStarred.value ? 'Unstar' : 'Star'} group` }</Typography>
   			</IconButton>
   			<IconButton onClick={() => {
   				setAlert()
   				closeContextMenu()
   			}} >	
   				<DeleteSweepIcon style={{color: '#ff6a6a'}} />
					<Typography component='span'> Exit group </Typography>
   			</IconButton>
   		</div>

   	</ChatActions>
		</>
	)
}

export default GroupList