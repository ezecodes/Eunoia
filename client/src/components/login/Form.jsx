import React from 'react'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import { Visibility, VisibilityOff, LockSharp, AccountCircle } from '@material-ui/icons'
// import 'from' '../../'eet'/main.css'
import { Preloader, ThreeDots, Oval } from 'react-preloader-icon'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';

import { handleAlert } from '../../Redux/features/otherSlice'

import { handleFetch } from '../../lib/script'
import HelperAlert from '../HelperAlert'

const useStyles = makeStyles({
	formField: {
		// display: 'flex',
		// flexDirection: 'column',
		marginBottom: '1rem',

		'& > label': {
			display: 'block',
			marginBottom: '.4rem'
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
			
	}

})


const Form = ({login}) => {
	const classes = useStyles()
	// sessionStorage.setItem('refresh', 'false')
	const dispatch = useDispatch()
	const [showPassword, changePasswordVisibility] = React.useState(false)
  const [disabled, setButtonState] = React.useState(false)
  const [input, setInputValues] = React.useState({
  	username: '', password: ''
  })
  const [helperText, setHelperText] = React.useState({
  	username: '', password: ''
  })
  const [error, setErrorState] = React.useState({
  	username: false, password: false
  })
  const [showLoginAlert, setLoginAlert] = React.useState(false)
	const handlePasswordValue = e => {
		setInputValues({...input, password: e.target.value})
		setLoginAlert(false)
	}
	const handlePV = () => {
		changePasswordVisibility(!showPassword)
	}
	const handleUsernameValue = e => {
		setLoginAlert(false)
		const val = e.target.value
		if (/[^a-z0-9_ ]/ig.test(val)) {
			setHelperText({...helperText, username: `Invalid name`})
			setErrorState({...error, username: true})
		} else {
			setInputValues({...input, username: val.trimLeft()})
			setHelperText({...helperText, username: ''})
			setErrorState({...error, username: false})
		}

	}
	const handleClose = () => {
		setLoginAlert(false)
	}
	const handleButtonState = (bool) => {
		setButtonState(bool)
	}
	const submitForm = (e) => {
		e.preventDefault()
		handleButtonState(true)
		handleFetch(
			'/user/login', 
			'post', 
			{username: input.username, password: input.password},
			(res) => {
				dispatch(handleAlert({
					open: true,
					msg: 'Log in successful',
					severity: 'success'
				}))
				handleButtonState(false)
				localStorage.setItem('details', JSON.stringify(res))
				document.location.pathname = '/'
			},
			(err) => {
				dispatch(handleAlert({
					open: true,
					msg: 'Something went wrong. \n Try again.',
					severity: 'error'
				}))
				handleButtonState(false)
			}
		)
	}
	return (
		<form className={classes.form} onSubmit={submitForm} >
			<fieldset>
				<div className={classes.formField}>
					<label htmlFor='username' > Username </label>
					<TextField
						required
						type='text' 
						autoComplete='username'
						id='username' 
						variant='outlined' 
						color='primary' 
						error={error.username} 
						helperText={helperText.username}
						value={input.username}
						onChange={handleUsernameValue} 
						InputProps={{
							startAdornment: <InputAdornment position='start'>
								<AccountCircle fontSize='small' color='secondary' />
							</InputAdornment>
					}} />
				</div>
				<div className={classes.formField}>
					<label htmlFor='current-password' > Password </label>
					  <TextField
							required
							autoComplete='current-password'
					    id="current-password"
					    variant="outlined"
					    onChange={handlePasswordValue}
					    color="primary"
					    type={showPassword ? 'text' : 'password'}
					    error={error.password}
					    helperText={helperText.password}
					    value={input.password}
					    InputProps={{
					    	startAdornment: <InputAdornment position='start'>
					    		<LockSharp fontSize='small' color='secondary' />
					    	</InputAdornment>,
					    	endAdornment: <InputAdornment position='end' >
					    		<IconButton color='secondary' aria-label='Toggle password visibility' onClick={() => handlePV()}>
					    			{showPassword ? <Visibility /> : <VisibilityOff />}
					    		</IconButton>
					    	</InputAdornment>
					    }}
					  />
				</div>
			</fieldset>
			{/*<fieldset>
				<div className={[classes.formField, classes.forgotPassword].join(' ')}>
					<button type='button'> Forgot Password? </button>
				</div>
			</fieldset>*/}
			<fieldset>
				<div className={classes.formField}>
					<Button 
					variant='contained' 
					color='primary'
					disabled={disabled}
					classes={{root: 'button'}} 
					type='submit'> 
						{
							disabled ? 
								<>
									Login &nbsp;&nbsp;
									<Preloader use={Oval} size={20} strokeWidth={10} strokeColor='#fff' duration={700} /> 
								</>
							: 'Login'
						}
					</Button>
				</div>
			</fieldset>
			{showLoginAlert && 
				<Snackbar
		    anchorOrigin={{vertical: 'bottom', horizontal: 'center' }}
		    open={alert.open}
		    onClose={handleClose}
		    color='primary'
		    key={'bottom' + 'right'}>  
		  	<Alert severity={alert.type} color={alert.type} variant='filled'>
		  		{ alert.text }
		  	</Alert>
		  </Snackbar>
			}
		</form>
	)
}

export default Form