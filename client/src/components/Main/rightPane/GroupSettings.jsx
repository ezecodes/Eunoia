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

import Header from '../Header'
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
	},
	bottomSnackbar: {
		width: '100%'
	},
})
function GroupSettings({group, description, settings, createdBy}) {
	const dispatch = useDispatch()
	const classes = useStyles()
	const {createdGroups, id, username, online} = useSelector(state => state.account.account)
	const {groupName, groupId} = group
	const [showProgress, setProgress] = React.useState(false)
	const nameRef = React.createRef(null)
	const descRef = React.createRef(null)

	const [value, setValue] = React.useState(() => settings.allowEditForAdminsOnly ? 'admins' : 'all');

	const closeComp = () => {
		dispatch(setComponents({component: 'gRoot', parent: 'gInfos'}))
	}
	const closeAlert = () => {
		setOpen(false)
	}
	const handleRadioChange = (value) => {
    setValue(value);
    emit('handleGroupSettings', id, groupId, {
    	allowEditForAdminsOnly: value === 'admins' ? true : false
    })
  };
  const setErr = (val) => {
  	dispatch(handleAlert(val))
  }

  const saveName = () => {
		const nameInput = nameRef.current.querySelector('input')
  	if (!online) {
  		setErr({open: true})
  		closeComp()
  		return false
  	}
  	if (nameInput.value === groupName) return false
		if (nameInput.value.match(/[0-9a-z]/ig) === null) {
			nameInput.value = groupName
			setErr({open: true, msg: 'Group name can\'t be empty', severity: 'info'})
			closeComp()
			return false
		}
  	const _date = new Date()
		const dateNow = () => _date.getTime()
		const thisDate = dateNow()

		emit('editGroupName', id, createdBy, {
			groupName: nameInput.value,
			groupId,
			message: {
				type: 'alert',
				chatId: thisDate,
				message: `${username} changed the group name`,
				timestamp: retrieveDate()
			},
				
		})

  }
 
	const saveDescription = () => {
		const descInput = descRef.current.querySelector('textarea')
		if (!online) {
  		setErr({open: true})
  		closeComp()
  		return false
  	}

		if (descInput.value === description) return false
		
		const _date = new Date()
		const dateNow = () => _date.getTime()
		const thisDate = dateNow()
		
		emit('editGroupDescription', id, {
			description: descInput.value,
			groupId,
			message: {
				type: 'alert',
				chatId: thisDate,
				message: `${username} changed the group description`,
				timestamp: retrieveDate()
			}
		})
	}
	
  React.useEffect(() => {
  	if (nameRef.current !== undefined && nameRef.current !== null) {
  	 (nameRef.current.querySelector('input').value = groupName)
  	}
  	if (descRef.current !== undefined && descRef.current !== null) {
  	 (descRef.current.querySelector('textarea').value = description)
  	}
		if (settings.allowEditForAdminsOnly) setValue('admins')
		else setValue('all')
  }, [])

	return (
		<>
		<Slide in={true} direction='left'>
		<div className={classes.groupInfo}>
		<Header>
			<IconButton onClick={closeComp}>
				<KeyboardBackspaceIcon />
			</IconButton>
			<Typography component='h6'> Update Group Settings </Typography>
			{ showProgress &&
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
			{ createdBy.username === username &&
			<div className={classes.critical}>
				<FormLabel component="legend">Who can edit group info</FormLabel>
        <RadioGroup aria-label="group-info" name="info" value={value} onChange={({target}) => handleRadioChange(target.value)}>
          <FormControlLabel value="admins" control={<Radio />} label="Admins only"  />
          <FormControlLabel value="all" control={<Radio />} label="All participants"  />
        </RadioGroup>
      </div>
    	}
		</div>
		</div>
		</Slide>
		</>
	)
}

export default GroupSettings