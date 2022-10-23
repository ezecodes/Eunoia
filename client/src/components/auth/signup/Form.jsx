import React from 'react'
import { useDispatch } from 'react-redux'
import { TextField, InputAdornment, IconButton, Checkbox, Button } from '@material-ui/core'
import { Visibility, VisibilityOff, LockSharp, AccountCircle, AlternateEmail } from '@material-ui/icons'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { Preloader, Oval } from 'react-preloader-icon'
import { makeStyles } from '@material-ui/core/styles';
import Input, { Check } from '../Input'
import { handleAlert } from '../../../Redux/features/otherSlice'

import {register} from '../auth-api'
import { storeCredentials } from '../../../helpers/auth-helper'

const Form = () => {
	const dispatch = useDispatch()
  const [input, setInputValues] = React.useState({
  	email: '', password: '', username: ''
  })
  const [checked, setCheckedState] = React.useState(false)

  const [helperText, setHelperText] =React.useState({
  	username: '', password: '', email: ''
  })

  const [error, setErrorState] = React.useState({
  	username: false, password: false, email: false
  })

  const [disabled, setButtonState] = React.useState(false)
  const [int, setInt] = React.useState(null)
	const [showPassword, changePasswordVisibility] = React.useState(false)

	React.useEffect(() => {
		return () => clearInterval(int)
	}, [])

	const handlePV = () => {
		changePasswordVisibility(!showPassword)
	}
	const handleEmailValue = e => {
		setInputValues({...input, email: e.target.value})
		setHelperText({...helperText, email: ''})
		setErrorState({...error, email: false})
	}
	const handlePasswordValue = e => {
		setInputValues({...input, password: e.target.value})
	}
	const handleNameValue = e => {
		const val = e.target.value

		if (/[^a-z0-9_ ]/ig.test(val)) {
			setHelperText({...helperText, username: `user name cannot contain ${val[val.length-1]} `})
			setErrorState({...error, username: true})
		} else if (val.includes(' ')) {
			setHelperText({...helperText, username: `user name cannot contain spaces`})
			setErrorState({...error, username: true})
		}	else if (!isNaN(val[0])) {
			setHelperText({...helperText, username: `user name cannot start with a number`})
			setErrorState({...error, username: true})
		} else {
			setInputValues({...input, username: val})
			setHelperText({...helperText, username: ''})
			setErrorState({...error, username: false})
		}

	}
	const handleButtonState = (bool) => {
		setButtonState(bool)
	}
	const handleCheckbox = () => {
		setCheckedState(!checked)
	}
	const handleError = (errObj, helperObj) => {
		setErrorState({...error, ...errObj})
		setHelperText({...helperText, ...helperObj})
	}
	const successMsg = (msg) => {
		dispatch(handleAlert({
			open: true, msg, severity: 'success'
		}))
	}
	const submitForm = (e) => {
		e.preventDefault()
		handleButtonState(true)

		register(input).then(res => {
			handleButtonState(false)
			if (res.error) {
				const keys = Object.keys(res.error)
				let errObj = {}
				keys.map(i => res.error[i] !== '' && (errObj[i] = true))
				handleError(errObj, res.error)
			} else {
				storeCredentials(res, () => {
					successMsg('Log in successful ✌')
					handleButtonState(false)
					document.location = '/'
				})
			}
		})
	}
	return (
		<form onSubmit={submitForm} >
			<fieldset>
			<div className={'formField'}>
					<label htmlFor='username' > User name </label>
					<Input 
						type='text'
						id='username'
						value={input.username}
						error={error.username} 
						helperText={helperText.username}
						onChange={handleNameValue} 
						required
					/>
				</div>
				<div className={'formField'}>
					<label htmlFor='email'> Email Address </label>
					<Input 
						type='email' 
						id='email'
						error={error.email} 
						helperText={helperText.email} 
						value={input.email}
						onChange={handleEmailValue} 
					/>
				</div>
				<div className={'formField'}>
					<label htmlFor='new-password'> Password </label>
					  <TextField
							required
					    id="new-password"
					    variant="outlined"
					    onChange={handlePasswordValue}
					    color="primary"
					    type={showPassword ? 'text' : 'password'}
					    autoComplete='new-password'
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
			<fieldset>
				<div className={'formField'}>
					<Button 
					variant='contained' 
					disabled={disabled}
					color='primary'
					type='submit'> 
						 {
							disabled ? 
								<>
									Register &nbsp;&nbsp;
									<Preloader use={Oval} size={20} strokeWidth={10} strokeColor='#fff' duration={700} /> 
								</>
							: 'Register'
						}
					</Button>
				</div>
			</fieldset>
		</form>
	)
}

export default Form