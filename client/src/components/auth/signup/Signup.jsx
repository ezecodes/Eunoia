import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography, Zoom } from '@material-ui/core'

import AltFacebook from './AltFacebook'
import AltGoogle from './AltGoogle'
import BaseForm from '../BaseForm'

import Form from './Form'

const SignUp = () => {
	return (
		<Zoom in={true} >
			<div className='pageBody'>
				<header className='formHeader'> 
					<Typography component='h1'> Welcome to <strong> Webconnect </strong> </Typography>
					<Typography variant='body1' className='subText'> Register your account </Typography>
				</header>

				<div className='cta'>
					<Typography variant='body1' className='subText'> Already have an account ? </Typography>
					<Link to='/auth/login' className='red underline' > Log in </Link>
				</div>

				<BaseForm>
					<Form />
				</BaseForm>
			</div>

		</Zoom>
	)
}

export default SignUp