import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert';
import InputAdornment from '@material-ui/core/InputAdornment';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import CheckIcon from '@material-ui/icons/Check'
import { CSSTransition } from 'react-transition-group';
import styles from '../../../stylesheet/transition.css'

import Header from '../Header'
import Loader from './Loader'
import NetworkProgress from '../NetworkProgress'

import { handleAlert } from '../../../Redux/features/otherSlice'
import { setComponents} from '../../../Redux/features/componentSlice'

import { retrieveDate } from '../../../lib/script'
import emit from '../../../sockets/outgoing'

const useStyles = makeStyles({
	body: {
		padding: '27px 15px 10px 15px'
	},
	editor: {
		'&:first-child': {
			marginBottom: 10
		},

		'& > label': {
			fontSize: '.9rem',
			color: '#939393',
			display: 'block'
		},
		'& > div': {
			display: 'flex',
			justifyContents: 'center',
			alignItems:'center',
			'& .MuiFormControl-root': {
				width: '97%',
				margin: '0 auto',

				'& .MuiInputBase-input': {
					padding: '7px 10px'
				}
			}
		}

	},
	critical: {
		margin: '25px 0 0 0',
		'& > div': {
			padding: '10px 0',

			'& > label': {
				fontSize: '1rem',
				marginLeft: '10px'
			}
		}
	},
	bottomSnackbar: {
		width: '100%'
	},
})
function GroupSettings({_id, name, description, settings, isAdmin, show}) {
	const dispatch = useDispatch()
	const classes = useStyles()
	const {id, username, online} = useSelector(state => state.account.account)
	const [showProgress, setProgress] = React.useState(false)
	const nameRef = React.createRef(null)
	const descRef = React.createRef(null)
	const [loading, setLoader] = React.useState(false)
	const nodeRef = React.useRef(null)

	const closeComp = () => {
		dispatch(setComponents({component: 'gRoot', parent: 'gInfos', value: false}))
	}
	const closeAlert = () => {
		setOpen(false)
	}
	const handleRadioChange = (value) => {
		setLoader(true)
    emit('handleGroupSettings', {
    	_id,
    	settings: {
    		allowEditForAdminsOnly: value === 'admins' ? true : false
    	}
    }, () => loaded('settings'))
    
  };
  const setErr = (val) => {
  	dispatch(handleAlert(val))
  }
  function loaded(field) {
  	setLoader(false)
  	dispatch(handleAlert({open: true, msg: `Group ${field} updated successfully `, severity: 'success'}))
  	closeComp()
  }
  const saveName = () => {
		const nameInput = nameRef.current.querySelector('input')
  	if (!online) {
  		setErr({open: true})
  		closeComp()
  		return false
  	}
  	if (nameInput.value.trim() === name) return false
		if (nameInput.value.match(/[0-9a-z]/ig) === null) {
			nameInput.value = name
			closeComp()
			setErr({open: true, msg: 'Group name can\'t be blank', severity: 'info'})
			return false
		}
  	const _date = new Date()
		const dateNow = () => _date.getTime()
		const thisDate = dateNow()

		setLoader(true)
		emit(
			'editGroupName', 
			{
				_id,
				groupName: nameInput.value,
				message: {
					type: 'alert',
					chatId: thisDate,
					message: `${username} changed the group name`,
					timestamp: retrieveDate()
			},
		}, () => loaded('name'))

  }
 
	const saveDescription = () => {
		const descInput = descRef.current.querySelector('textarea')
		if (!online) {
  		setErr({open: true})
  		closeComp()
  		return false
  	}

		if (descInput.value.trim() === description) return false
		setLoader(true)
		const _date = new Date()
		const dateNow = () => _date.getTime()
		const thisDate = dateNow()
		
		emit('editGroupDescription', {
			_id,
			description: descInput.value,
			message: {
				type: 'alert',
				chatId: thisDate,
				message: `${username} changed the group description`,
				timestamp: retrieveDate()
			}
		}, () => loaded('description'))
	}

	React.useEffect(() => {
  	if (nameRef.current) {
  	 (nameRef.current.querySelector('input').value = name)
  	}
  	if (descRef.current) {
  	 (descRef.current.querySelector('textarea').value = description)
  	}
  }, [])

	return (
		<>
		<CSSTransition
	    in={show}
	    nodeRef={nodeRef}
	    timeout={500}
	    classNames={{
	    	enter: styles.animate__animated,
				enterActive: styles.animate__fadeInRight,
				exit: styles.animate__animated,
				exitActive: styles.animate__fadeOutRight
	    }}
	    unmountOnExit
	  >
		<div className={classes.groupInfo} ref={nodeRef}>
		<Header>
			<IconButton onClick={closeComp}>
				<KeyboardBackspaceIcon />
			</IconButton>
			<Typography component='h6'> Update Group Settings </Typography>
			{ loading &&
				<NetworkProgress />
			}
		</Header>
		<div className={classes.body}>
			<div className={classes.textFields}>
				<div className={classes.editor} >
					<label htmlFor='groupName'> Group name </label>
					<div>
					<TextField 
						id='groupName'
						ref={nameRef}
					/>
						<IconButton onClick={saveName} >
		      		<CheckIcon color='primary' />
		      	</IconButton>
					</div>
				</div>
				<div className={classes.editor} >
					<label htmlFor='groupDesc'> Group description </label>
					<div>
					<TextField 
						multiline={true}
						id='groupDesc'
						ref={descRef}
					
					/>
					<IconButton onClick={saveDescription} >
	      		<CheckIcon color='primary' />
	      	</IconButton>
					</div>
				</div>
			</div>
			{ isAdmin &&
			<div className={classes.critical}>
				<legend>Who can edit group info</legend>

				<div>
					<input type="radio" id='admins' name='settings' checked={
						settings.allowEditForAdminsOnly 
					} onChange={e => handleRadioChange(e.target.id)} />
					<label htmlFor="admins">Admins</label>
				</div>
				<div>
					<input type="radio" id='all' name='settings' checked={
						!settings.allowEditForAdminsOnly 
					} onChange={e => handleRadioChange(e.target.id)} />
					<label htmlFor="all">All participants</label>
				</div>
      </div>
    	}
		</div>
		</div>
		</CSSTransition>
		</>
	)
}

export default GroupSettings