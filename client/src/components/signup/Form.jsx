import React from 'react'
import { TextField, InputAdornment, IconButton, Checkbox, Button } from '@material-ui/core'
import { Visibility, VisibilityOff, LockSharp, AccountCircle, AlternateEmail } from '@material-ui/icons'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { Preloader, Oval } from 'react-preloader-icon'
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
			}
		},
		'& .MuiButton-contained.Mui-disabled': {
			color: '#fff',
			backgroundColor: '#9eb9e9'
		}
			
	}

})


const Form = () => {
	const classes = useStyles()
	// sessionStorage.setItem('refresh', 'false')
  const [input, setInputValues] = React.useState({
  	email: '', password: '', name: ''
  })
  const [checked, setCheckedState] = React.useState(false)

  const [helperText, setHelperText] =React.useState({
  	username: '', password: '', email: ''
  })

  const [error, setErrorState] = React.useState({
  	username: false, password: false, email: false
  })

  const [disabled, setButtonState] = React.useState(false)

	const [showPassword, changePasswordVisibility] = React.useState(false)

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
			setHelperText({...helperText, username: `username cannot contain ${val[val.length-1]} `})
			setErrorState({...error, username: true})
		} else if (val.includes(' ')) {
			setHelperText({...helperText, username: `username cannot contain spaces`})
			setErrorState({...error, username: true})
		}	else if (!isNaN(val[0])) {
			setHelperText({...helperText, username: `username cannot start with a number`})
			setErrorState({...error, username: true})
		} else {
			setInputValues({...input, name: val})
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
	const submitForm = (e) => {
		e.preventDefault()
		handleButtonState(true)
		handleFetch(
			'/user/register',
			'post',
			{username: input.name, email: input.email, password: input.password},
			(res) => {
				if (res.nameError) {
					handleError({username: true}, {username: res.nameError})
				} else if (res.emailError) {
					handleError({email: true}, {email: res.emailError})
				} else {
					localStorage.setItem('details', JSON.stringify(res))
					document.location.pathname = '/'
				}
				handleButtonState(false)
			},
			() => {
				handleButtonState(false)
			}
		)
	}
	return (
		<form className={classes.form} onSubmit={submitForm} >
			<fieldset>
			<div className={classes.formField}>
					<label htmlFor='username' > User name </label>
					<TextField
						required
						classes={{root: 'formInput'}} 
						type='text' 
						id='username' 
						autoComplete='username'
						variant='outlined' 
						color='primary' 
						value={input.name}
						error={error.username} 
						helperText={helperText.username}
						onChange={handleNameValue} 
						InputProps={{
							startAdornment: <InputAdornment position='start'>
								<AccountCircle fontSize='small' color='secondary' />
							</InputAdornment>
					}} />
				</div>
				<div className={classes.formField}>
					<label htmlFor='email'> Email Address </label>
					<TextField
						required
						type='email' 
						id='email' 
						error={error.email} 
						helperText={helperText.email}
						autoComplete='email'
						variant='outlined' 
						color='primary' 
						value={input.email}
						onChange={handleEmailValue} 
						InputProps={{
							startAdornment: <InputAdornment position='start'>
								<AlternateEmail fontSize='small' color='secondary' />
							</InputAdornment>
					}} />
				</div>
				<div className={classes.formField}>
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
			<fieldset>
				<div className={classes.formField}>
					<Button 
					variant='contained' 
					disabled={disabled}
					color='primary'
					type='submit'> 
						 {
							disabled ? 
								<>
									Register &nbsp;&nbsp;
									<Preloader use={Oval} size={20} strokeWidth={10} strokeColor='#fff' duration={1000} /> 
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