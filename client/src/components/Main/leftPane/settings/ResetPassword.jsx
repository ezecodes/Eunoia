import React from 'react'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MuiAlert from '@material-ui/lab/Alert';

import { Visibility, VisibilityOff } from '@material-ui/icons'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import LockSharpIcon  from '@material-ui/icons/LockSharp'
import SecurityIcon  from '@material-ui/icons/Security'
import Snackbar from '@material-ui/core/Snackbar'
import RepeatIcon from '@material-ui/icons/Repeat';

import { Preloader, ThreeDots } from 'react-preloader-icon'
import {CSSTransition } from 'react-transition-group'

import { setComponents } from '../../../../Redux/features/componentSlice'
import { handleAlert } from '../../../../Redux/features/otherSlice'
import { useDispatch, useSelector } from 'react-redux'

import Header from '../../Header'
import NetworkProgress from '../../NetworkProgress'
import { matchPassword, resetPassword } from './api-helper'

const useStyles = makeStyles({
	body: {
		margin: '20px 0'
	},
	form: {
		width: '90%',
		margin: '0 auto',
		display: 'flex',
		flexDirection: 'column',
		
		'& .MuiFormControl-root': {
			paddingBottom: 10
		},
		'& .MuiButtonGroup-root': {
			marginTop: 10,
			flexDirection: 'column',
			'& button': {
				boxShadow: '-1px 1px 1px 0px #c3c3c3',
				fontSize: '.84rem',
				marginBottom: 10,
				color: '#fff',
			},
		}
	},
	input: {
		'& .MuiOutlinedInput-root': {
			'& input': {
				padding: '10px',
				fontSize: '.95rem',
			},
			'& .MuiSvgIcon-root': {
				fontSize: '1.2rem'
			}
		}
	},
	
})

const ResetPassword = ({className}) => {
	const {id} = useSelector(state => state.account.account)
	const dispatch = useDispatch()
	const classes = useStyles()
	const [passwordUpdateStatus, setPasswordUpdateStatus] = React.useState({severity: '', msg: '', show: false})
	const [requestIsProcessing, setReqIsProcessing] = React.useState(false)

	const [showPassword, handlePV] = React.useState({
		former: false, newPassword: false, confirmPassword: false
	})

	const [values, setInputs] = React.useState({
		former: '', newPassword: '', confirmPassword: ''
	})
	const [error, setError] = React.useState({
		former: false, newPassword: false, confirmPassword: false
	})
	const [help, setHelp] = React.useState({
		former: '', newPassword: '', confirmPassword: ''
	})
	const handleClose = () => {
		setPasswordUpdateStatus({show: false})
	}
	const updatePassword  = async () => {
		setReqIsProcessing(true)
		resetPassword(values, res => {
			setInputs({...values, former: '', newPassword: '', confirmPassword: ''})
			setReqIsProcessing(false)
			closeResetPasswordPage()
			if (res.status === 200) {
				dispatch(handleAlert({open: true, msg: 'Password updated successfully', severity: 'success'}))
			} else {
				dispatch(handleAlert({open: true, msg: 'Something went wrong', severity: 'error'}))
			}
			
		})
	}
	const _matchPassword = async (e) => {
		e.preventDefault()
		setReqIsProcessing(true)
		const {former, newPassword, confirmPassword} = values
		matchPassword({former}, async res => {
			setReqIsProcessing(false) 
			if (res.status === 403) {
				setError({...error, former: true})
				setHelp({...help, former: 'Passwords do not match'})
				return
			}

			if (newPassword !== confirmPassword) {
				setError({...error, confirmPassword: true, newPassword: true})
				setHelp({...help, confirmPassword: 'Passwords do not match'})
				return
			}
			if (newPassword.length < 5) {
				setError({...error, confirmPassword: true, newPassword: true})
				setHelp({...help, confirmPassword: 'Password is too short. Password length should be more than 5 characters'})
				return
			}
			updatePassword()
		})

	}
	
	const closeResetPasswordPage = () => {
		dispatch(setComponents({component: 'settings', parent: 'stack'}))
	}

	const setValue = (input, ele) => {
		setError({...error, former: false, newPassword: false, confirmPassword: false})
		setHelp({...help, former: '', newPassword: '', confirmPassword: ''})

		if (ele === 'former') setInputs({...values, former: input})
		if (ele === 'newPassword') setInputs({...values, newPassword: input})
		if (ele === 'confirmPassword') setInputs({...values, confirmPassword: input})
	}

	const setPasswordVisibility = which => {
		handlePV( {...showPassword, [`${which}`]: !showPassword[`${which}`] } )
	}
 
	return (
		<>
			<section className={[classes.resetPassword, className].join(' ')} >
		  	<Header>
					<IconButton onClick={closeResetPasswordPage}>
						<KeyboardBackspaceIcon />
					</IconButton>
					<Typography component='h6' > Reset Password </Typography>
					{ requestIsProcessing &&
						<NetworkProgress />
					}
				</Header>
				<div className={classes.body}>
					<form onSubmit={_matchPassword} className={classes.form} >
						<TextField 
							variant='outlined'
							onChange={e => setValue(e.target.value, 'former')} 
							className={classes.input}
							value={values.former} 
							placeholder='Former password' type='password'
							required
							error={error.former}
						  type={showPassword.former ? 'text' : 'password'}
							helperText={help.former}
							autoComplete='current-password'
							InputProps={{
								startAdornment: <InputAdornment position='start'>
					    		<SecurityIcon color='secondary' />
					    	</InputAdornment>,
					    	endAdornment: <InputAdornment position='end' >
					    		<IconButton color='secondary' aria-label='Toggle password visibility' 
					    			onClick={() => setPasswordVisibility('former')}>
					    			{showPassword.former ? <Visibility /> : <VisibilityOff />}
					    		</IconButton>
					    	</InputAdornment>
					    }}
						/>
						<TextField variant='outlined' 
							className={classes.input}
							onChange={e => setValue(e.target.value, 'newPassword')} 
							value={values.newPassword} 
							placeholder='New password' 
							type='password'
							required
							autoComplete='new-password'
							error={error.newPassword}
						  type={showPassword.newPassword ? 'text' : 'password'}
							InputProps={{
								startAdornment: <InputAdornment position='start'>
					    		<LockSharpIcon color='secondary' />
					    	</InputAdornment>,
					    	endAdornment: <InputAdornment position='end' >
					    		<IconButton color='secondary' aria-label='Toggle password visibility' 
					    			onClick={() => setPasswordVisibility('newPassword')}>
					    			{showPassword.newPassword ? <Visibility /> : <VisibilityOff />}
					    		</IconButton>
					    	</InputAdornment>
					    }}
						/>
						<TextField variant='outlined' 
							className={classes.input} 
							onChange={e => setValue(e.target.value, 'confirmPassword')} value={values.confirmPassword} 
							placeholder='Confirm password' 
							type='password'
							required
							autoComplete='new-password'
							error={error.confirmPassword}
							helperText={help.confirmPassword}
						  type={showPassword.confirmPassword ? 'text' : 'password'}
							InputProps={{
								startAdornment: <InputAdornment position='start'>
					    		<RepeatIcon color='secondary' />
					    	</InputAdornment>,
					    	endAdornment: <InputAdornment position='end' >
					    		<IconButton color='secondary' aria-label='Toggle password visibility' 
					    			onClick={() => setPasswordVisibility('confirmPassword')}>
					    			{showPassword.confirmPassword ? <Visibility /> : <VisibilityOff />}
					    		</IconButton>
					    	</InputAdornment>
					    }}
						/>
						<ButtonGroup>
							<Button 
								variant='contained' 
								disabled={requestIsProcessing}
								type='submit'
								color='primary'
							> 
								Update password
							</Button>
							<Button 
								onClick={closeResetPasswordPage}
								color='primary'
								variant='contained' 
								type='button'
								> 
									Cancel
							</Button>
						</ButtonGroup>
					</form>
				</div>
				
			</section>
		</>
	)
}

export default ResetPassword