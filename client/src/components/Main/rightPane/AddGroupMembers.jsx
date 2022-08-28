import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import Slide from '@material-ui/core/Slide';
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase'
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DoneIcon from '@material-ui/icons/Done';

import { makeStyles } from '@material-ui/core/styles';

import { setComponents} from '../../../Redux/features/componentSlice'
import { handleAlert } from '../../../Redux/features/otherSlice'

import UserAvatar from '../UserAvatar'
import Header from '../Header'
import NetworkProgress from '../NetworkProgress'
import Preloader from '../../Preloader'
import SearchBar from '../SearchBar'

import { retrieveDate } from '../../../lib/script'
import emit from '../../../sockets/outgoing'

const useStyles = makeStyles({
	groupUsers: {

	},
	header: {
		// position: 'sticky',
		// top: 0,
		// background: '#fff',
		// zIndex: 20
	},
	searchbar: {
		width: '94%',
		paddingLeft: '20px',
		margin: '15px 0 10px 12px',
		// border: '1px solid #b3b3c1',
		borderRadius: '30px',
		boxShadow: '0 0 5px 2px #e9e9e9',
		height: '40px'
	},
	chips: {
		padding: '10px',
		'& .MuiChip-root': {
			marginRight: 5,
			marginBottom: 5
		},
		'& .MuiChip-iconColorPrimary': {
			color: '#fafafa'
		},
		'& .MuiAvatar-root': {
			height: '28px',
			width: '28px',
			fontSize: '1rem'
		},
		'& .MuiChip-label': {

		}
	},
	listItem: {
		position: 'relative',
	},
	checked: {
		position: 'absolute',
		right: '10px',

		'& .MuiSvgIcon-root': {
			fontSize: '1rem',
			color: '#8e9bb1'
		}
	},
	fab: {
		'&:hover': {
			backgroundColor: 'cornflowerblue'
		},
		height: 'auto',
		width: 'auto',
		padding: '3% !important',
		background: 'cornflowerblue',
		color: '#fff',
		boxShadow: '0 0 5px 1px #0000001c',
		position: 'sticky',
		bottom: '1rem',
		left: '85%'
	},
	participants: {
		margin: '20px 0' ,

		'& > div': {
			paddingLeft: 5,
			marginTop: 8,
			display: 'flex',

			'& > div': {
				marginRight: 3
			}
		}
	},
})

const UserList = ({user, isSelected, setSelected, searchTerm}) => {
	const classes = useStyles()
	const dispatch = useDispatch()
	return (
		<ListItem	
			button 
			className={classes.listItem}
			style={{
				display: user.username.toLowerCase().includes(searchTerm.toLowerCase()) ? 'flex' : 'none'
			}}
			// selected={user.username === selectedUser.username}
			// style={{display: user.hidden === true ? 'none' : 'flex'}}
  		onClick={() => setSelected({username: user.username})}
  		disabled={isSelected}
  	>
  		<ListItemIcon>
	      <UserAvatar username={user.username} />
	    </ListItemIcon>
    	<ListItemText 
    		primary={<Typography component='h6' style={{fontFamily: 'Roboto'}}> {user.username}</Typography>} 
    	/>
    	{ isSelected &&
	    	<div className={classes.checked}>
	    		<CheckCircleIcon />
	    	</div>
	    }
    </ListItem>
	)
}

const AddGroupMembers = ({activeUsers, participants, _id}) => {
	// TODO: ADD group rules on dialog
	const {id, username, online} = useSelector(state => state.account.account)
	const classes = useStyles()
	const dispatch = useDispatch()
	const showLoader = useSelector(state => state.activeUsers.showActiveUsersLoader)
	const [selectedUsers, appendSelected] = React.useState([])
	const group = useSelector(state => state.groups.selectedGroup)
	const [searchTerm, setSearch] = React.useState('')
	const [loading, setLoader] = React.useState(false)

	const closeComp = () => {
		dispatch(setComponents({component: 'gRoot', parent: 'gInfos'}))
	}
	function loaded(msg) {
		setLoader(false)
		dispatch(handleAlert({open: true, msg, severity: 'success'}))
		closeComp()
	}
	const setSelected = (user) => {
		let find = selectedUsers.findIndex(i => i.username === user.username)
		if (find === -1) {
			appendSelected([...selectedUsers, user])
		} else {
			appendSelected(_selectedUsers => _selectedUsers.filter(i => i.username !== user.username))
		}
	}

	const handleSearch = (value) => {
		setSearch(value)
	}

	const emitGroupMembers = () => {
		if (!online) {
			dispatch(handleAlert({open: true}))
			closeComp()
			return 
		}
		setLoader(true)

		const _date = new Date()
		const dateNow = () => _date.getTime()
		const thisDate = dateNow()
		
		const groupInfo = {
			_id,
			members: selectedUsers,
			message: {
				type: 'alert',
				chatId: thisDate,
				message: `${username} added ${selectedUsers.map(i => i.username).join(', ')} to the group`,
				timestamp: retrieveDate() ,
			},
		}
		emit('addGroupMembers', groupInfo, () => loaded('Action successful'))
	
	}
	return (
		<Slide in={true} direction='left'>
		<div className={[classes.groupUsers].join(' ')}>
			<Header>
				<IconButton onClick={closeComp} >
					<KeyboardBackspaceIcon />
				</IconButton>
				<Typography component='h6'> Add group members </Typography>
				{ loading &&
					<NetworkProgress />
				}
			</Header>
			<InputBase
					className={classes.searchbar}
		      placeholder='Search a user'
		      type="text"
		      onChange={({target}) => {
		      	handleSearch(target.value)
		      }}
		    />
			<div className={classes.chips}>
				{
					selectedUsers.map((user, i) => {
						return (
							<Chip
								key={user.username}
				        icon={
				        	<UserAvatar username={user.username} badge={false} />
				        }
				        label={user.username}
				        color="primary"
				        onDelete={() => setSelected(user)}
				        variant="outlined"
				      />
				     )
					})
				}
			</div>
			<div className={classes.userslist}>
				{
					showLoader ? <Preloader /> : 
					activeUsers.map((user) => {
						return (
							<UserList 
								key={user.username} 
								user={user} 
								setSelected={(_user) => setSelected(_user)}
								searchTerm={searchTerm}
								isSelected={
									selectedUsers.findIndex(i => i.username === user.username) !== -1 ? true : false 
									||
									participants.findIndex(i => i.username === user.username) !== -1 ? true : false
								} 
							/>
						)
					})
				}
			</div>
			<IconButton
        variant="extended"
        size="small"
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={emitGroupMembers}
        disabled={selectedUsers.length > 0 ? false : true}
      >
        <DoneIcon className={classes.extendedIcon} />
      </IconButton>

		</div>
		</Slide>
	)
}

export default AddGroupMembers