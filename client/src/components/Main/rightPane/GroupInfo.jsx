import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import Badge from '@material-ui/core/Badge';

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import GroupIcon from '@material-ui/icons/Group'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';
import MessageIcon from '@material-ui/icons/Message';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import UserAvatar from '../UserAvatar'	
import ChatActions from '../ChatActions'

import { setComponents} from '../../../Redux/features/componentSlice'

import { getWindowHeight, handleFetch, retrieveDate } from '../../../lib/script'
import emit from '../../../sockets/outgoing'

const useStyles = makeStyles({
	backdrop: {
		position: 'fixed',
		width: '100%',
		background: '#0000002b'
	},
	bottomSnackbar: {
		width: '100%'
	},

	groupInfo: {

		// opacity: .7
	},

	info: {
		minWidth: '300px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',

		'& .MuiTypography-root': {whiteSpace: 'pre-line'}
		// left: 
	}, 
	header: {
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-end',

		'& .MuiIconButton-root': {
			'& svg':{
				fontSize: '1.4rem'
			}
		}
	},
	
	banner: {
		// padding: '10px 0',
		width: '100%'
	},
	infos: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginBottom: '1rem',
		padding: '0 10px',
		textAlign: 'center',

		'& .MuiAvatar-root': {
			padding: '52px',
			borderRadius: '100%',
			marginBottom: 4,

			'& > svg': {
				fontSize: '5rem'
			}
		},

		'& > .MuiSvgIcon-root': {
			fontSize: '1.2rem'
		},

		'& .MuiTypography-body1': {
			fontSize: '1.2rem'
		},

		'& .MuiTypography-body2': {
			fontSize: '1rem'
		}
	},
	list: {
		margin: '5px 0'
	},
	wrap: {
		padding: '10px 15px'
	},
	
	
	participantsList: {
		'& .MuiListSubheader-sticky': {
			position: 'initial'
		},

		'& .MuiTypography-body2': {
			whiteSpace: 'nowrap',
			textOverflow: 'ellipsis',
			maxWidth: '200px',
			overflow: 'hidden'
		},
		// '& .MuiListItemSecondaryAction-root': {
		// 	'& .MuiSvgIcon-root': {
		// 		color: '#7180a1'
		// 	}
		// }
	}
})

function ListsForNorminalUsers ({
	isTheAccountOwner, 
	username, 
	bio, 
	isAnAdmin, 
	isGroupCreator
}) {
	return (
		<ListItem	
  	>
  		<ListItemIcon>
    		{
  				isGroupCreator ?
    		  <Badge 
    		  	overlap='rectangular'
    		  	badgeContent={
    		  		<CheckCircleIcon color='secondary'style={{fontSize: '.9rem'}} />
    		  	}
    		  	anchorOrigin={{
		          vertical: 'bottom',
		          horizontal: 'right',
		        }}
    		  >
    		  	<UserAvatar username={username} badge={false} />
    		  </Badge>
    		  : <UserAvatar username={username} badge={false} />
    		}
	    </ListItemIcon>
    	<ListItemText 
    		primary={
    			<Typography 
	    			style={{fontFamily: 'Roboto'}}> 
    				{isTheAccountOwner ? 'You': username}
    			</Typography>
    		} 
    		secondary={bio || ''}
    	/>
  		{ isAnAdmin &&
  		<ListItemSecondaryAction>
				<IconButton edge="end" aria-label="Group admin" title="Group admin">
          <SupervisorAccountIcon color='primary' />
        </IconButton>
    	</ListItemSecondaryAction>
    	}
    </ListItem>
	)
}

function ListsForAdminsOnly ({
	username, 
	bio, 
	isGroupCreator, 
	isAnAdmin, 
	isTheAccountOwner, 
	assignAdmin, 
	blockGroupUser
}) {
	const [anchorEl, setAnchorEl] = React.useState(null)
	const [showMenu, setMenu] = React.useState(false)
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
	
	return (
		<>
		<ListItem	
			button={isTheAccountOwner ? false : true} 
			onContextMenu={openContextMenu}
			selected={showMenu}
  	>
  		<ListItemIcon>
  			{
  				isGroupCreator ?
    		  <Badge 
    		  	overlap='rectangular'
    		  	badgeContent={
    		  		<CheckCircleIcon color='secondary'style={{fontSize: '.9rem'}} />
    		  	}
    		  	anchorOrigin={{
		          vertical: 'bottom',
		          horizontal: 'right',
		        }}
    		  >
    		  	<UserAvatar username={username} badge={false} />
    		  </Badge>

    		  : <UserAvatar username={username} badge={false} />
  			}
	    </ListItemIcon>
    	<ListItemText 
    		primary={
    			<Typography 
	    			style={{fontFamily: 'Roboto'}}> 
    				{isTheAccountOwner ? 'You': username}
    			</Typography>
    		} 
    		secondary={bio || ''}
    	/>
    	{isAnAdmin &&
  		<ListItemSecondaryAction>
				<IconButton edge="end" aria-label="Group admin" title="Group admin" >
          <SupervisorAccountIcon color='primary' />
        </IconButton>
    	</ListItemSecondaryAction>
    	}
    	
  	</ListItem>
  	{ !isTheAccountOwner &&
    	 <ChatActions 
	   		open={showMenu} 
	   		anchorEl={anchorEl} 
	   		onClose={closeContextMenu}
	   		
	   	>
	   		<div> 
	   			<IconButton onClick={() => {
	   				assignAdmin(username)
	   				closeContextMenu()
	   			}} >	
	   				<SupervisorAccountIcon style={{color: '#6495ed'}} />
						<Typography component='span'> 
							{
								isAnAdmin ?
								'Drop admin role' : 'Assign admin role'
							}
						</Typography>
	   			</IconButton>
	   			<IconButton onClick={() => {
	   				blockGroupUser(username)
	   				closeContextMenu()
	   			}} >	
	   				<RemoveCircleOutlineIcon style={{color: '#ff6a6a'}} />
						<Typography component='span'> Remove user </Typography>
	   			</IconButton>
	   		</div>

	   	</ChatActions>
	   }
	   </>
	)
}

function GroupInfo({participants, _id, name, description, show, createdBy, admins, settings}) {
	const classes = useStyles()
	const dispatch = useDispatch()
	const accountName = useSelector(state => state.account.account.username)
	const id = useSelector(state => state.account.account.id)
	const [open, setOpen] = React.useState(false)
	const activeUsers = useSelector(state => state.activeUsers.activeUsers)
	participants = participants.filter((i) => i).sort((a, b) => {
		if (a.username === createdBy.username && b.username !== createdBy.username) {
			return -1
		}
		if (a.username === accountName  && b.username !== accountName) {
			return -1
		}
	})

	React.useEffect(() => {
		// console.log(admins)
		// console.log(admins[admins.length -1])
	}, [admins])
	
	const setDisplay = () => dispatch(setComponents({component: 'gRoot', parent: 'gInfos', value: false}))
		
	const addGroupMembers = (username) => {
		dispatch(setComponents({component: 'gMembers', parent: 'gInfos'}))
	}

	const closeAlert = () => {
		setOpen(false)
	}

	const assignAdmin = (username) => {
		emit('addAdmin', {_id, username})
		
	}

	const blockGroupUser = username => {
		if (!admins.some(i => i.username === accountName)) return
		const _date = new Date()
		const dateNow = () => _date.getTime()
		const thisDate = dateNow()

		emit(
			'removeGroupUser', 
			{
				_id, 
				username, 
				message: {
					type: 'alert',
					chatId: thisDate,
					message: `${accountName} removed ${username}`,
					timestamp: retrieveDate()
				}
			}
		)
	}
	
	const showGroupSettings = () => {
		dispatch(setComponents({component: 'gSettings', parent: 'gInfos'}))
	}
	const SettingsEle = () => {
		return (
			<IconButton onClick={showGroupSettings}> 
				<SettingsIcon />
			</IconButton>
		)
	}
	return (
		<>
		<Slide in={true} direction='left'>
			<div className={classes.groupInfo}>
			<div className={classes.info}>
				<div className={classes.header}>
					<IconButton onClick={setDisplay}> 
						<KeyboardArrowDownIcon style={{color: '#999'}}  />
					</IconButton>
					{
						admins.findIndex(i => i.username === accountName) !== -1 &&
						<IconButton onClick={addGroupMembers}> 
							<PersonAddIcon />
						</IconButton>
					}
					{settings.allowEditForAdminsOnly &&
						admins.findIndex(i => i.username === accountName) !== -1 &&
						<SettingsEle />
					}
					{!settings.allowEditForAdminsOnly &&
						<SettingsEle />
					}
				</div>
				<div className={classes.banner}>
					<div className={classes.infos}>
						<Avatar>
			      	<GroupIcon />
			      </Avatar>
			      <Typography component='h1'> {name} </Typography>
			      <Typography component='span' variant='body2'> {description} </Typography>
			     </div>
					<Divider />
					<List 
						className={[classes.participantsList, classes.list].join(' ')}
						subheader={
			        <ListSubheader component="div" id="nested-list-subheader">
			          <Typography color='textPrimary'> Participants </Typography>
			        </ListSubheader>
			      }
					>
					{
						admins.some(i => i.username === accountName) ?
							participants.map((user, i) => {

								const userInActive = activeUsers.find(i => i.username === user.username) || {}
								return (
									<ListsForAdminsOnly 
										key={i}
										{...userInActive}
										username={user.username}
										assignAdmin={username => assignAdmin(username)}
										blockGroupUser={username => blockGroupUser(username)}
										isGroupCreator={createdBy.username === user.username ? true : false}
										isTheAccountOwner={accountName === user.username ? true : false}
										isAnAdmin={
											admins.findIndex(i => i.username === user.username) !== -1 ? true : false
										}
									/>
								)
							})
						: 
						participants.map((user, i) => {
							const userInActive = activeUsers.find(i => i.username === user.username) || {}
							return (
								<ListsForNorminalUsers 
									key={i}
									{...userInActive}
									username={user.username}
									isGroupCreator={createdBy.username === user.username ? true : false}
									isTheAccountOwner={accountName === user.username ? true : false}
									isAnAdmin={
										admins.findIndex(i => i.username === user.username) !== -1 ? true : false
									}
								/>
							)
						})
					}
					</List>
				</div>
			</div>

			
			</div>

		</Slide>
		</>
	)
}

export default GroupInfo