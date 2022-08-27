import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setComponents } from '../../../Redux/features/componentSlice'
import TextField from '@material-ui/core/TextField'
import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search'
import { Link } from 'react-router-dom'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles } from '@material-ui/core/styles';

import { assert, getWindowHeight } from '../../../lib/script'
import UserAvatar from '../UserAvatar'

import UserMessagesPane from './UserMessagesPane'
import UserProfile from './UserProfile'
import GroupMessagesPane from './GroupMessagesPane'
import GroupInfo from './GroupInfo'
import GroupSettings from './GroupSettings'
import AddGroupMembers from './AddGroupMembers'

const useStyles = makeStyles({
	rightPane: {
		flex: 9,
		position: 'relative',
		width: 0,

		['@media (max-width: 625px)']: {
			width: '100%',
			zIndex: 30,
			flex: 1
			// display: 'none'
		},
	},
	panes: {
		height: '100%',
		display: 'flex',
		overflow: 'hidden',

		'& > div:first-child': {
			flex: 7
		},
		'& > div:nth-child(2), > div:nth-child(3)': {
			minWidth: '330px',
			maxWidth: '330px',
			background: '#fff',
			zIndex: 100,
			// boxShadow: '-1px -1px 6px 3px #0000000d',
			backdropFilter: 'blur(4px)',
			overflowY: 'scroll',
			overflowX: 'hidden',
			marginLeft: '5px',
			height: '100%',

			['@media (max-width: 660px)']: {
				marginLeft: '0',
				width: '100%',
				maxWidth: '100%',
				minWidth: '100%'
			},
		}
	}
})


const RightPane = ({user}) => {
	const dispatch = useDispatch()
	const classes = useStyles()
	const {username} = useSelector(state => state.account.account)
	const privateChats = useSelector(state => state.chat.privateChats)
	const groupChats = useSelector(state => state.groups.groupChats)
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const selectedGroup = useSelector(state => state.groups.selectedGroup)
	const activeUsers = useSelector(state => state.activeUsers.activeUsers)
	const showUserProfile = useSelector(state => state.chat.showUserProfile)
	const {gSettings, gRoot, gMembers} = useSelector(state => state.components.gInfos)

	const [anchorEl, setAnchorEl] = React.useState(null)
	const open = Boolean(anchorEl)
	const toggleMenu = (event) => {
		setAnchorEl(event.target)
	}
	const handleClose =() => {
		setAnchorEl(null)
	}
	const setComponent = (obj) => {
		dispatch(setComponents(obj))
	}
	
	return (
		<section className={classes.rightPane} style={{height: `${getWindowHeight()}px`}} >
			{
				assert(groupChats) &&
				groupChats.map((groupChat, i) => {

					const isCurrentSelected = () => {
						if (assert(selectedGroup) && selectedGroup._id === groupChat._id) {
							return true
						}	else return false
					}
				
					return (
						<div className={classes.panes} key={groupChat._id} style={{
							display: isCurrentSelected() ? 'flex' : 'none'
						}} >
							<GroupMessagesPane {...groupChat} isCurrentSelected={isCurrentSelected()}  />

							{ gRoot &&
				      	<GroupInfo
					      	{...groupChat}
					      />
					    }

					    {
					    	gMembers && 
					    	<AddGroupMembers
					    		_id={groupChat._id}
					    		activeUsers={activeUsers}
					    		participants={groupChat.participants}
					    	/>
					    }

				      { gSettings &&
				      	<GroupSettings 
					      	_id={groupChat._id}
					      	isAdmin={groupChat.admins.some(i => i.username === username)}
					      	name={groupChat.name}
					      	description={groupChat.description}
					      	createdBy={groupChat.createdBy}
					      	settings={groupChat.settings}
					      />
					    }
						</div>
					)
				})
			}
			{
				assert(privateChats) &&
					privateChats.map( (friend, i) => {

						let userInAll = () => {
							const find = activeUsers.find(usr => usr.username === friend.username)
							return find
						}
						let isSelectedUser = () => {
							if (selectedUser.username === friend.username) {
								return true
							} else return false
						}
						
						return (
							<div className={classes.panes} key={i} 
								style={{
									display: isSelectedUser() ? 'flex' : 'none'
								}}
							>
								<UserMessagesPane 
									key={i} 
									friend={friend} 
									typingStatus={userInAll().typing}
									onlineStatus={userInAll().online}
									lastSeen={userInAll().lastSeen}
								/>

								{showUserProfile && isSelectedUser() &&
									<UserProfile 
										{...friend}
										{...userInAll()}
									/>
								}
							</div>
						)
					})
			}
		</section>
	)
}

export default RightPane