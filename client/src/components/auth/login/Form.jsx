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
import Input, { Check } from '../Input'

import { handleAlert } from '../../../Redux/features/otherSlice'
import { handleFetch } from '../../../lib/script'
import {signIn} from '../auth-api'
import { storeCredentials } from '../../../helpers/auth-helper'

const Form = ({login}) => {
	// sessionStorage.setItem('refresh', 'false')
	const dispatch = useDispatch()
	const [int, setInt] = React.useState(false)
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
  const [checked, setCheckbox] = React.useState(false)
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
	const handleCheckbox = () => setCheckbox(!checked)
	const handleClose = () => {
		setLoginAlert(false)
	}
	const handleButtonState = (bool) => {
		setButtonState(bool)
	}
	const errMsg = (msg) => {
		dispatch(handleAlert({
			open: true, msg, severity: 'error'
		}))
	}
	const successMsg = (msg) => {
		dispatch(handleAlert({
			open: true, msg, severity: 'success'
		}))
	}
	const submitForm = (e) => {
		e.preventDefault()
		handleButtonState(true)
		const req_obj = {
			username: input.username,
			password: input.password,
			persisLogin: checked
		}

		signIn(req_obj, async res => {
			handleButtonState(false)
			const jsonResponse = await res.json()
			if (res.status === 401) {
				errMsg(jsonResponse.error)
			} else if (res.status === 200) {
				storeCredentials(jsonResponse, () => {
					successMsg('Log in successful ✌')
					handleButtonState(false)
					document.location = '/'
				})
			} else {
				errMsg('Something went wrong')
			}
		})
	}
		
	return (
		<form onSubmit={submitForm}>
			<fieldset>
				<div className={'formField'}>
					<label htmlFor='username' > Username </label>
					<Input 
						type='text' 
						autoComplete='username'
						id='username'
						error={error.username} 
						helperText={helperText.username}
						value={input.username}
						onChange={handleUsernameValue} 
					/>
				</div>
				<div className={'formField'}>
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
					    	endAdornment: <InputAdornment position='end' >
					    		<IconButton color='secondary' aria-label='Toggle password visibility' onClick={() => handlePV()}>
					    			{showPassword ? <Visibility /> : <VisibilityOff />}
					    		</IconButton>
					    	</InputAdornment>
					    }}
					  />
				</div>
			</fieldset>
			<fieldset>
				<Check 
					checked={checked}
					onChange={handleCheckbox}
				/>
			</fieldset>
			{/*<fieldset>
				<div className={[classes.formField, classes.forgotPassword].join(' ')}>
					<button type='button'> Forgot Password? </button>
				</div>
			</fieldset>*/}
			<fieldset>
				<div className={'formField'}>
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