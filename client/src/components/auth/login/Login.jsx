import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Typography, Zoom } from '@material-ui/core'
import BaseForm from '../BaseForm'
import Form from './Form'

const Login = () => {
	return (
		<Zoom in={true}>
			<div className='pageBody'>
				<header className='formHeader'> 
					<Typography component='h1'> <span className='textYellow'> Hi there, </span> Welcome back 👏👏 </Typography>
					<Typography variant='body1' className='subText'> Log in with the data you entered during your registration. </Typography>
				</header>

				<div className='cta'>
					<Typography variant='body1' className='subText'> Don't have an account ? </Typography>
					<Link to='/auth/signup' className='red underline'> Register now </Link>
				</div>

				<BaseForm>
					<Form />
				</BaseForm>

			</div>
		</Zoom>
	)
}

export default Login