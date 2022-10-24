import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import InputAdornment from '@material-ui/core/InputAdornment';

import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import { Preloader, Oval } from 'react-preloader-icon'

import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import LocalPhoneIcon from '@material-ui/icons/LocalPhone'
import Switch from '@material-ui/core/Switch';
import PhotoIcon from '@material-ui/icons/Photo'
import CheckIcon from '@material-ui/icons/Check'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import EditIcon from '@material-ui/icons/Edit';
import SecurityIcon from '@material-ui/icons/Security'
import LockIcon from '@material-ui/icons/Lock'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import CancelIcon from '@material-ui/icons/Cancel';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import OutlinedInput from '@material-ui/core/OutlinedInput';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { setComponents} from '../../../../Redux/features/componentSlice'
import { editAccountInfo} from '../../../../Redux/features/accountSlice'

import UserAvatar from '../../UserAvatar'
import Header from '../../Header'
import NetworkProgress from '../../NetworkProgress'
import ProfileEditor from './ProfileEditor'

import { handleFetch } from '../../../../lib/script'
import { setNotify , logout} from '../../../../api/account'
import { clearAuth } from '../../../../helpers/auth-helper'

const useStyles = makeStyles((theme) => ({
	
	inputs: {
		display: 'flex',
	},
	editButton: {
		textTransform: 'none',
		color: '#486eb3',
		background: '#f3f3f3',
		padding: 0,
		fontSize: '1rem'
	},
	headerActions: {
		position: 'absolute',
		right: 0,
		
	},

	banner: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		paddingTop: '1rem'
	},
	profileInfo: {
		padding: '1rem 0 .5rem 0',
		width: '100%'
	},
	
	profileImage: {
		position: 'relative'
	},
	avatarPlaceholder: {
		position: 'absolute',
		top: 0,
		width: '100%',
		cursor: 'pointer',
		height: '100%',
		zIndex: 20,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		background: '#ffffffb5',
		borderRadius: '100%',
		'& .MuiSvgIcon-root': {
			fontSize: '3rem',
			color: '#494f5af2'
		},
		'& .MuiTypography-body1': {
			fontSize: '1.2rem',
			color: '#13171e',
			textShadow: '1px 1px 0px #e9e9e9'
		}
	},
	info: {
		margin: '0 auto',
		// justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		marginBottom: 12,
		'& .MuiListItem-root': {
			padding: '0 16px'
		},
		'& .MuiListItemIcon-root': {
			minWidth: 0,
			marginRight: 6
		},
		'& .MuiTypography-body1': {
			fontSize: '1.07rem'
		},
		'& .MuiTypography-h2':{
			fontSize: '1.3rem'
		},
		'& .MuiIconButton-root': {
			alignSelf: 'flex-end'
		},
		'& .MuiSvgIcon-root': {
			marginLeft: 5, 
			fontSize: '1rem',
		}
	},
	infoHandle: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		marginBottom: '10px',
		'& > span:first-child': {
			fontSize: '.9rem',
			color: '#707f91',
			display: 'flex',
			alignItems: 'center'
		},
		'& > span:last-of-type': {
			marginLeft: '3px'
		}
	},
	list: {
		width: '100%',
    backgroundColor: theme.palette.background.paper,
    '& > .MuiListItem-root': {
    	padding: '0 5px 5px 18px',
    	cursor: 'pointer',
    	'& .MuiTypography-body1': {
    		color: '#000'
    	},
    	'& .MuiSvgIcon-root': {
    		fontSize: '1.3rem'
    	}
    },
	},
	nested: {
		padding: '0 10px 0 18px'
	},
	logout: {
		'& .MuiListItemIcon-root': {
			minWidth: '35px'
		}
	},
}))

const Settings = ({className}) => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const { username, id, displayName, bio, status, email, notifications} = useSelector(state => state.account.account)
	const [showProgress, setProgress] = React.useState(false)

	const [showInput, setInputs] = React.useState({name: false, bio: false})

	const [nameInput, setNameValue] = React.useState('')

	const [bioInput, setBioValue] = React.useState('')

	const [timerToValidateName, setTimer] = React.useState(null)
	const [isUpdatingName, updateNameStatus] = React.useState(false)
	const [helperText, setHelperText] = React.useState({name: ''})
	const [inputError, setInputError] = React.useState({name: false})
	const [showInputCloseIcon, setInputCloseIcon] = React.useState({name: true})
	const [openDialog, setDialog] = React.useState(false);
	const [daysUntil, setDaysUntil] = React.useState('')
	const [openEditor, setEditor] = React.useState(false)

	const [showPhotoIcon, setIcon] = React.useState(false)

	const [anchorEl, setAnchorEl] = React.useState(null)
	const open = Boolean(anchorEl)

  const handleClickOpen = () => {
    setDialog(true);
  };
  const handleMenu = (e) => {
  	setAnchorEl(e.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)

  const handleBioInput = (value) => {
  	setBioValue(value)
  }

	const setComp = (obj) => {
		dispatch(setComponents(obj))
	}
	const handleInputVisibility = input => {
		setInputs({...showInput, ...input})
	}

	const handleNotification = (obj) => {
		setProgress(true)
		const req_body = {update: obj}
		setNotify(req_body, res => {
			dispatch(editAccountInfo(res))
			setProgress(false)
		})
	}
	const callToLogout = () => {
		logout(res => {
			clearAuth()
			document.location = '/'
		})
	}

	const showAvatarPlaceholder = (bool) => {
		setIcon(bool)
	}
	return (
		<section className={[classes.settings, className].join(' ')}>
			<Header>
				<IconButton onClick={() => setComp({parent: 'stack', component: 'recentChats'})}>
					<KeyboardBackspaceIcon  />
				</IconButton>
				<Typography component='h6'> Profile </Typography>
				<div className={classes.headerActions}>
					<ProfileEditor />
				</div>
				{ showProgress &&
					<NetworkProgress />
				}
			</Header>
			
			<div className={classes.profileBody}>
				<div className={classes.banner}>
					<div className={classes.profileImage} 
						onMouseOver={() => showAvatarPlaceholder(true)} 
						onMouseLeave={() => showAvatarPlaceholder(false)} 
					>
						<Fade in={showPhotoIcon}>
							<div className={classes.avatarPlaceholder}>
								<AddAPhotoIcon />
								{/*<Typography > Upload photo </Typography>*/}
							</div>
						</Fade>
		        <UserAvatar username={username} style={{
		        	width: 200, height: 200, fontSize: '4rem'
		        }} badge={false} />
					</div>

					<div className={classes.profileInfo}>
						<div className={classes.info}>
							<ListItem title='username'>
				        <ListItemText primary={
				        	<span className={classes.infoHandle}>
			        			<span> User name </span>
			        			<span> {'@' + username} </span>
			        		</span>
				        } />
				      </ListItem>

				      { displayName !== undefined && displayName !== '' &&
					      <ListItem title='display name'>
					        <ListItemText primary={
					        	<span className={classes.infoHandle}>
				        			<span> Display name </span>
				        			<span> {displayName} </span>
				        		</span>
					        } />
					      </ListItem>
				      }
			       <ListItem>
				        <ListItemText 
				        	primary={
				        		bio === '' ? 
				        		<span style={{fontStyle: 'italic', color: '#818181'}}> Your bio is empty </span>
				        		: 
				        		<span className={classes.infoHandle}>
				        			<span> Bio <InfoOutlinedIcon /> </span>
				        			<span> {bio} </span>
				        		</span>
				        	}
				        /> 
				      </ListItem>
						</div>
					</div>
				</div>
				<Divider />
				<div className={classes.settings}>
						
					<List component="div" className={classes.list}
						subheader={
			        <ListSubheader component="div" id="nested-list-subheader">
			          Account
			        </ListSubheader>
			      }
		      >
	          <ListItem onClick={() => setComp({component: 'contactInfo', parent: 'stack'})}>
	            <ListItemText primary="Contact info" />
	            <NavigateNextIcon />
	          </ListItem>
	          <ListItem onClick={() => setComp({component: 'resetPassword', parent: 'stack'})}>
	            <ListItemText primary="Update password" />
	            <NavigateNextIcon />
	          </ListItem>
	        </List>
						
					<List component="div" className={classes.list} 
						subheader={
			        <ListSubheader component="div" id="nested-list-subheader">
			          Notification
			        </ListSubheader>
			      }
					>
	          <ListItem button
	          	onClick={() => handleNotification({...notifications, notify: !notifications.notify})} >
	            <ListItemText primary="Notification" />
	            <Switch 
	            	checked={notifications.notify}
	            	color='primary'
	            />
	          </ListItem>
	          <ListItem  button
	          	onClick={() => handleNotification({...notifications, sound: !notifications.sound})}
	          >
	            <ListItemText primary="Sound" />
            	<Switch 
            		checked={notifications.sound}
            		color='primary'
            	/>
	          </ListItem>
	        </List>

	        <List>
	        	<ListItem 
	        		button
	        		className={classes.logout}
	          	onClick={() => callToLogout()}
	          >
	          	<ListItemIcon>
            		<ExitToAppIcon />
            	</ListItemIcon>
	            <ListItemText primary="Log out" />
	          </ListItem>
	        </List>

				</div>
			</div>
		</section>
	)
}

export default Settings