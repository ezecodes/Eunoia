import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu'
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Fade from '@material-ui/core/Fade';

import PublicIcon from '@material-ui/icons/Public';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications'
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Preloader from '../../Preloader'
import Header from '../Header'
import SearchBar from '../SearchBar'

import UserList from './UserList'
import GroupList from './GroupList'

import {setComponents} from '../../../Redux/features/componentSlice'
import { clearFromFetched, setSelectedUser } from '../../../Redux/features/otherSlice'
import { clearChats } from '../../../Redux/features/chatSlice'
import { 
	clearConversation, 
	alertBeforeClear, 
	searchRecentChats, 
	exitGroup, 
	alertGroupDeletion
} from '../../../Redux/features/recentChatsSlice'

import {
	deleteGroup
} from '../../../Redux/features/groupSlice'

import { assert, handleFetch, retrieveDate } from '../../../lib/script'

import emit from '../../../sockets/outgoing'

const useStyles = makeStyles({
	add: {
		fontSize: '2.9rem !important'
	},
	menu: {
		'& div': {
			top: '75px !important',
			// background: 'transparent'
		},
		'& .MuiMenuItem-root': {
			paddingLeft: '10px'
			// background: '#ffffffde',
			// backdropFilter: 'blur(7px)'
		},
		'& svg': {
			marginRight: 11,
			color: '#57565c',
			fontSize: '1.5rem'
		},
		'& .MuiListItemIcon-root': {
			minWidth: 40
		}
	},
	
	
	speedDial: {
		alignItems: 'flex-end',
		position: 'sticky',
		bottom: '1rem',
		right: '1rem',
		'& .MuiFab-primary': {
			background: 'cornflowerblue',
			color: '#fff'
		},

		'& .MuiSpeedDialAction-staticTooltipLabel': {
			color: '#fff',
			background: '#739be3',
			whiteSpace: 'nowrap'
		},

		'& .MuiSpeedDialAction-fab': {
			backgroundColor: '#739be3',
			color: '#fff'
		}
	},
	
})

const RecentChats = ({className}) => {
	const showRecentChats = useSelector(state => state.components.stack.recentChats)
	const chatToBeCleared = useSelector(state => state.recentChats.chatToBeCleared)
	const groupToBeDeleted = useSelector(state => state.recentChats.groupToBeDeleted)
	const input = useSelector(state => state.recentChats.input)
	const {id} = useSelector(state => state.account.account)

	const { useEffect, useState } = React
	const classes = useStyles()
	const dispatch = useDispatch()
	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)

	const toggleMenu = (event) => {
		setAnchorEl(event.target)
	}
	const handleClose =() => {
		setAnchorEl(null)
	}

	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const selectedGroup = useSelector(state => state.groups.selectedGroup)
	const recentChats = useSelector(state => state.recentChats.recentChats)
	const showLoader = useSelector(state => state.recentChats.showRecentUsersLoader)
	const fetchedUsers = useSelector(state => state.other.fetched)
	const onlineUsers = useSelector(state => state.socketActivity.onlineUsers)
	const fetchedGroups = useSelector(state => state.groups.fetchedGroups)

	const { username} = JSON.parse(localStorage.getItem('details'))
	const [showDial, setDial] = useState(false)
	const [visible, setDialVisibility] = useState(false)

	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}
	
	const closeDialog = ()=> {
		assert(chatToBeCleared) && dispatch(alertBeforeClear({}))
		assert(groupToBeDeleted) && dispatch(alertGroupDeletion({}))
	}

	const handleDelete = () => {
		if (assert(fetchedUsers.find(i => i === chatToBeCleared.username))) {
			dispatch(clearFromFetched(chatToBeCleared.username))
		}
		if (selectedUser.username === chatToBeCleared.username) {
			dispatch(setSelectedUser({}))
		}
		handleFetch(
			`chat/clearConversation/${id}/${chatToBeCleared.username}`,
			'delete'
		)
		dispatch(clearConversation(chatToBeCleared.username))
		dispatch(clearChats(chatToBeCleared.username))
	}

	const handleSearch = (value) => {
		dispatch(searchRecentChats(value))
	}

	const handleDial = () => {
		setDial(!showDial)
	}

	const openNewGroupComponent = () => {
		dispatch(setComponents({parent: 'stack', component: 'newGroup'}))
	}

	const handleGroupDelete = () => {
		emit(
			'removeGroupUser', 
			{
				_id: groupToBeDeleted, 
				username, 
				message: {
					type: 'alert',
					chatId: new Date().getTime() ,
					message: `${username} left the group`,
					timestamp: retrieveDate()
				}
			}
		)
		handleFetch(
			`chat/deleteGroup/${id}/${groupToBeDeleted}`,
			'delete'
		)
		dispatch(exitGroup(groupToBeDeleted))
		dispatch(deleteGroup(groupToBeDeleted))
	}

	const openDial = () => setDialVisibility(true)
	const closeDial = () => setDialVisibility(false)

	return (
			<section className={[classes.recentChats, className].join(' ')}
				onMouseEnter={openDial}
				onMouseLeave={closeDial}
			>
				<Header styles={{}} >
					<IconButton onClick={() => {
						handleClose()
						setComp({parent: 'stack', component: 'settings'})
					}}
					>
						<AccountCircleRoundedIcon style={{color: '#6e84ab'}} />
						{/*<Typography variant='inherit'> Profile </Typography>*/}
					</IconButton>
					
					<SearchBar 
						input={input} 
						placeholder='Search for users and groups'
						onChange={(val) => {
							handleSearch(val)
						}} 
					/>

					<IconButton onClick={toggleMenu} style={{background: open && '#0000000a'}} >
						<MoreVertIcon />
					</IconButton>
					<Menu 
						open={open} 
					   anchorOrigin={{
					    horizontal: 'right',
					    vertical: 'top'
					  }}
					  transformOrigin={{
					    vertical: 'top',
					    horizontal: 'right',
					  }}
						onClose={handleClose} 
						anchorEl={anchorEl} 
						className={classes.menu} 
					>
						<MenuItem onClick={() => { 
							handleClose()
							setComp({parent: 'stack', component: 'activeUsers'})
						}} >
							<PublicIcon />
							<Typography variant='inherit'> Network </Typography>
						</MenuItem>
							
					</Menu>

				</Header>
				<div className={classes.userslist}>
					{
						showLoader ? <Preloader /> : 

						recentChats.length  > 0 &&
						recentChats.map((chat, i) => {

							if (chat.chatType && chat.chatType === 'group') {
								const isFetchedGroup = () => {
									if (fetchedGroups.some(i => i === chat._id)) {
										return true
									} else {
										return false
									}
								}
								const isCurrentSelectedGroup = () => {
									if (selectedGroup._id === chat._id) return true
									else if (assert(groupToBeDeleted) && groupToBeDeleted._id === chat._id) {
										return true
									} else return false
								}
								return (
									<GroupList 
										{...chat}
										key={i} 
										userIsSelected={assert(selectedUser) ? true : false}
										isFetched={isFetchedGroup()}
										isCurrentSelectedGroup={isCurrentSelectedGroup()}
									/>
								)

							} else {

								let isCurrentSelectedUser = () => {
									if (assert(selectedUser) && selectedUser.username === chat.username) {
										return true
									} else if (assert(chatToBeCleared) && chatToBeCleared.username === chat.username) {
										return true
									} else return false
								}
								let isFetchedUser = () => {
									if (fetchedUsers.some(i => i.username === chat.username)) {
										return true
									} else return false
								}
								let isOnline = () => {
									let userInOnline = onlineUsers.find(i => i.username === chat.username)
									if (userInOnline !== undefined && userInOnline.online) return true
									else return false
								}
								return (
									<UserList 
										{...chat}
										key={i} 
										groupIsSelected={assert(selectedGroup) ? true : false}
										isOnline={isOnline()}
										isFetched={isFetchedUser()}
										isCurrentSelectedUser={isCurrentSelectedUser()} 
									/>
								)
							}
						})
					}
				</div>

				{ assert(chatToBeCleared) &&
					<Dialog
		        open={assert(chatToBeCleared)}
		        onClose={closeDialog}
		        aria-labelledby="alert-dialog-title"
		        aria-describedby="alert-dialog-description"
		      >
		        <DialogTitle id="alert-dialog-title">{"Clear conversation"}</DialogTitle>
		        <DialogContent>
		          <DialogContentText id="alert-dialog-description">
		            {`This action will permanently clear your entire chat history with ${chatToBeCleared.username}. Continue?`}
		          </DialogContentText>
		        </DialogContent>
		        <DialogActions>
		          <Button onClick={closeDialog} style={{color: 'red'}}>
		            Cancel
		          </Button>
		          <Button color="primary" autoFocus onClick={() => {
		          	handleDelete()
		          	closeDialog()
		          }} >
		            Delete
		          </Button>
		        </DialogActions>
		      </Dialog>
				}
				{ assert(groupToBeDeleted) &&
					<Dialog
		        open={assert(groupToBeDeleted)}
		        onClose={closeDialog}
		        aria-labelledby="alert-dialog-title"
		        aria-describedby="alert-dialog-description"
		      >
		        <DialogTitle id="alert-dialog-title">{"Clear group conversation"}</DialogTitle>
		        <DialogContent>
		          <DialogContentText id="alert-dialog-description">
		            {`This action will permanently clear your entire chat history with the seleceted group. Continue?`}
		          </DialogContentText>
		        </DialogContent>
		        <DialogActions>
		          <Button onClick={closeDialog} style={{color: 'red'}}>
		            Cancel
		          </Button>
		          <Button color="primary" autoFocus onClick={() => {
		          	handleGroupDelete()
		          	closeDialog()
		          }} >
		            Delete
		          </Button>
		        </DialogActions>
		      </Dialog>
				}
				<Fade in={visible || navigator.maxTouchPoints > 0}>
					<SpeedDial
		        ariaLabel="SpeedDial openIcon"
		        className={classes.speedDial}
		        icon={<SpeedDialIcon openIcon={<GroupAddIcon />} />}
		        onClose={handleDial}
		        onOpen={handleDial}
		        open={showDial}
		      >
	          <SpeedDialAction
	            icon={<GroupAddIcon />}
	            tooltipTitle={'Create new group'}
	            tooltipOpen
	            onClick={() => {
	            	handleDial()
	            	openNewGroupComponent()
	            }}
	          />
		      </SpeedDial>
		     </Fade>
			</section>

	)
}

export default RecentChats