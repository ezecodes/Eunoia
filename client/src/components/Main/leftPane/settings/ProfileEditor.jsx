import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import EditIcon from '@material-ui/icons/Edit';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { makeStyles } from '@material-ui/core/styles';

import { Preloader, Oval } from 'react-preloader-icon'

import { profileUpdate} from '../../../../Redux/features/accountSlice'
import { handleAlert} from '../../../../Redux/features/otherSlice'

import { handleFetch } from '../../../../lib/script'

const useStyles = makeStyles((theme) => ({
	dialog: {
		'& .MuiDialog-paperWidthSm': {
			width: '350px'
		}
	},
	disabled: {
		color: 'rgba(0,0,0,.3)'
	},
	formField: {
		// display: 'flex',
		// flexDirection: 'column',
		marginBottom: '1rem',

		'& > label': {
			display: 'flex',
			alignItems: 'center',
			marginBottom: '.4rem',

			'& .MuiSvgIcon-root': {
				color: '#455a7e',
				fontSize: '1rem',
				marginLeft: '.5rem'
			}
		},
		'& > button': {
			color: '#fff',
			margin: '1rem 0 1.5rem 0'
		},

		'& .MuiFormControl-root': {

			width: '100%',

			'& .MuiOutlinedInput-input': {
				padding: '13px 10px'
			},

		},
		'& .MuiButton-contained.Mui-disabled': {
			color: '#fff',
			backgroundColor: '#9eb9e9'
		}
			
	},
	editIcon: {
		color: '#6e84ab'
	}
}))

const validate = (input) => {
	if (input.length < 4) {
		return {
			error: true,
			helperText: 'Name is too short'
		}
	}
	if (/[^a-z0-9_ ]/ig.test(input)) {
		return {
			error: true,
			helperText: `username cannot contain ${input[input.length-1]} `
		}
	} else if (!isNaN(input[0])) {
		return {
			error: true,
			helperText: `username cannot contain ${input[input.length-1]} `
		}
	} else {
		return {
			error: false,
		}
	}
}

const ProfileEditor = ({open}) => {
	const {id} = JSON.parse(localStorage.getItem('details'))
	const {useState, useEffect} = React
	const dispatch = useDispatch()
	const { displayName, bio} = useSelector(state => state.account.account)
	const classes = useStyles()
	const [dialog, setDialog] = useState(false)
	const [noSave, setDisabled] = useState(false)
	const [preloader, setPreloader] = useState(false)
	const [noInput, disableInput] = useState(false)

	const [error, setError] = useState({
		displayName: false, bio: false
	})
	const [helperText, setHelperText] = useState({
		displayName: 'This will be visible to all users', 
		bio: ''
	})
	
	const [values, setValue] = useState({
		displayName: displayName, bio: bio
	})

	useEffect(() => {
		setValue({displayName, bio})
		// if (!dialog) {
		// 	setDisabled(false)
		// 	setPreloader(false)
		// 	disableInput(false)
		// 	setValue({displayName: '', bio: ''})
		// 	setHelperText({displayName: '', bio: ''})
		// }
	}, [dialog])
	
	const changeDisplayName = (value) => {
		// if (value.length < 3) {
		// 	setError({...error, displayName: true})
		// 	setHelperText({...helperText, displayName: 'Name is too short'})
		// 	value !== '' && setDisabled(true)
		// } else {
		// 	setError({...error, displayName: false})
		// 	setHelperText({...helperText, displayName: ''})
		// 	setDisabled(false)
		// }
		
		setValue({...values, displayName: value})
	}

	const editBio = (value) => {
		// todo set max number of text for bio
		setValue({...values, bio: value})
	}

	const handleClose = () => {
		setDialog(false)
	}
	const handleUsernameValue = () => {

	}
	const openProfileEditor = () => {
		setDialog(true)
	}
	const saveProfileInfo = () => {
		setPreloader(true)
		setDisabled(true)
		disableInput(true)
		handleFetch(
			`/account/saveProfileInfo/${id}`, 
			'put', 
			{
				newDisplayName: values.displayName,
				newBio: values.bio
			}, 
			(res) => {
				dispatch(profileUpdate(res))
				dispatch(handleAlert({open: true, severity: 'success', msg: 'Profile updated successfully'}))
				setPreloader(false)
				setDisabled(false)
				disableInput(false)
				handleClose()
			}
		)
	}


	return (
	 <>
			<IconButton className={classes.profileEdit} onClick={() => openProfileEditor()}> 
				<EditIcon className={classes.editIcon} /> 
			</IconButton>
      <Dialog open={dialog} className={classes.dialog} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
       	 Edit Profile
       	 <EditIcon className={classes.editIcon} style={{fontSize: '1rem', marginLeft: '.5rem'}} />
        </DialogTitle>
        <DialogContent>
        	<form>
        		<fieldset>
							{/*<div className={classes.formField}>
								<label htmlFor='username' className={classes.disabled} > 
									Username 
								</label>
								<TextField
									required
									type='text' 
									autoComplete='username'
									id='username' 
									variant='outlined'
									disabled={true}
									color='primary' 
								/>
							</div>*/}
							<div className={classes.formField}>
								<label htmlFor='displayName' > Dispaly name </label>
								<TextField
									required
									type='text' 
									autoComplete='username'
									id='displayName' 
									variant='outlined' 
									color='primary' 
									placeholder='Set your display name here'
									error={error.displayName} 
									helperText={helperText.displayName}
									value={values.displayName}
									disabled={noInput}
									onChange={({target}) => {
										changeDisplayName(target.value)
									}}
								/>
							</div>
							<div className={classes.formField}>
								<label htmlFor='bio' > 
									Bio 
									<InfoOutlinedIcon className={classes.labelIcon} />
								</label>
								<TextField
									required
									type='text' 
									placeholder='Give a short description about yourself'
									autoComplete='bio'
									id='bio' 
									variant='outlined' 
									color='primary' 
									multiline={true}
									error={error.bio} 
									helperText={helperText.bio}
									value={values.bio}
									disabled={noInput}
									onChange={({target}) => {
										editBio(target.value)
									}} 
								/>
							</div>
						</fieldset>
        	</form>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button disabled={noSave} onClick={() => {
          	saveProfileInfo()
          }} color="primary">
          	{
							preloader ? 
								<>
									Save &nbsp;
									<Preloader use={Oval} size={20} strokeWidth={15} strokeColor='#9eb9e9' duration={1000} /> 
								</>
							: 'Save'
						}
          </Button>
        </DialogActions>
      </Dialog>
				{/*<Snackbar 
					// className={classes.bottomSnackbar}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformAnchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					autoHideDuration={4000} 
					message={openAlert.message}
					open={true}
					onClose={closeAlert}
				>
				<MuiAlert variant='filled' elevation={6} onClose={closeAlert} severity="success">
			    {openAlert.message}
			  </MuiAlert>
			</Snackbar>*/}
    </>
	)
}

export default ProfileEditor