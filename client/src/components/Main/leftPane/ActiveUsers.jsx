import React from 'react'

import { useSelector, useDispatch } from 'react-redux'
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { setComponents} from '../../../Redux/features/componentSlice'
import Preloader from '../../Preloader'

import { setSelectedUser, assertFetch } from '../../../Redux/features/otherSlice'
import { storeMessages } from '../../../Redux/features/chatSlice'
import { resetUnread } from '../../../Redux/features/recentChatsSlice'
import { searchActiveUsers } from '../../../Redux/features/activeUsersSlice'
import { setSelectedGroup } from '../../../Redux/features/groupSlice'

import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import { Link } from 'react-router-dom'
import {CSSTransition } from 'react-transition-group'

import Header from '../Header'
import UserAvatar from '../UserAvatar'
import SearchBar from '../SearchBar'

import { getLastSeen, assert } from '../../../lib/script'
import emit from '../../../sockets/outgoing'
import { fetchMessages } from '../../../api/chat'

const useStyles = makeStyles({
	backBtn: {
		fontSize: '1.2rem !important',
	},	
	searchbar: {
		marginRight: '5px'
	},
	arrow: {
		textAlign: 'right',
		cursor: 'pointer'
	},
	listItem: {
		'&.MuiListItem-root.Mui-selected': {
			backgroundColor: '#efefef',
			// backgroundColor: 'rgb(248 247 255)'
		},
		'$:hover': {
			backgroundColor: '#e3e3e34d',
			// backgroundColor: 'rgb(248 247 255)'
		},
		position: 'relative',
		'& .MuiAvatar-root': {
			width: 45, height: 45
		},
		'& .MuiListItemText-root': {
			marginLeft: '.3rem'
		}
	},
})

const UserList = ({user, style, secondaryItems, groupSelected}) => {
	const {id, username} = useSelector(state => state.account.account)
	const classses = useStyles()
	const dispatch = useDispatch()
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const allFetchedUsers = useSelector(state => state.other.fetched)
	const find = useSelector(state => state.recentChats.recentChats).find(i => i.username === user.username)
	const [timer, setTimer] = React.useState(null)
	const [secondaryText, setText] = React.useState('')

	React.useEffect(() => {
		if (user.online) {
			setText('')
		} else {
			setText('last seen ' + getLastSeen(user.lastSeen))
		}
	}, [user.online])
	const setPane = () => {
		if (window.innerWidth < 660 ) {
			dispatch(setComponents({parent: 'leftPane', component: false}))
		}
	}

	const handleClick = () => {
		if (selectedUser.username === user.username) return
			
		if (find !== undefined) {
			if (find.unread > 0) {
				dispatch(resetUnread(user.username))
				emit('chatIsRead', {
					sender: user.username,
					receiver: username,
				})
			}
		}
		
		if (allFetchedUsers.find(i => i === user.username) !== undefined) {
			dispatch(setSelectedUser(user))
			setPane()
			groupSelected && dispatch(setSelectedGroup({}))
		} else {
			fetchMessages({username: user.username}, res => {
				dispatch(storeMessages(res))
				dispatch(assertFetch(user.username))
				dispatch(setSelectedUser(user))
				groupSelected && dispatch(setSelectedGroup({}))
				setPane()
			})
		}
			
	}
	return (
		<ListItem	button 
			className={classses.listItem}
			selected={user.username === selectedUser.username}
			style={{display: user.visible === true ? 'flex' : 'none'}}
  		onClick={handleClick}>
    		<ListItemIcon>
		      <UserAvatar
			      username={user.username} 
			      badge={user.online ? true : false}
			     />
		    </ListItemIcon>
      	<ListItemText 
      		primary={<Typography component='h6' style={{fontFamily: 'Roboto'}}> {user.username}</Typography>} 
      		secondary={user.lastSeen && secondaryText}
      	/>
    </ListItem>
	)
}


const ActiveUsers = ({className}) => {
	const { useEffect } = React
	const classes = useStyles()
	const dispatch = useDispatch()
	const activeUsers = useSelector(state => state.activeUsers.activeUsers)
	const showLoader = useSelector(state => state.activeUsers.showActiveUsersLoader)
	const input = useSelector(state => state.activeUsers.input)
	const selectedGroup = useSelector(state => state.groups.selectedGroup)

	const setComponent = () => {
		dispatch(setComponents({parent: 'stack', component: 'recentChats'}))
	}

	const handleSearch = (value) => {
		dispatch(searchActiveUsers(value))
	}
	return (
			<section className={[classes.activeUsers, className].join(' ')}>
				<Header>
					<IconButton onClick={setComponent} >
						<KeyboardBackspaceIcon />
					</IconButton>

					<SearchBar 
						input={input} 
						classNames={[classes.searchbar]}
						placeholder='Search for all users'
						onChange={(val) => {
							handleSearch(val)
						}} 
					/>

				</Header>

				<div className={classes.userslist}>
					{
						showLoader ? <Preloader /> : 
						activeUsers.map(user => {
							return (
								<UserList user={user} key={user.username} groupSelected={assert(selectedGroup)} />
							)
						})
					}
				</div>
			</section>
	)
}
export default ActiveUsers