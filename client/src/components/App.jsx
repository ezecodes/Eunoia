import React from 'react'
import '../stylesheet/main.css'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import SafeComponent from './SafeComponent'

import RightPane from './main/rightPane/RightPane'

import HelperAlert from './HelperAlert'

import Auth from './auth/Auth' 
import SignUp from './auth/signup/Signup'
import Login from './auth/login/Login'

import Main from './main/Main'

const theme = createTheme({
	palette: {
		type: 'light',
		primary: {
			main: '#6495ed',
		}, 
		secondary: {
			main: '#344f7e'
		},
		headerInput: {
			main: 'transparent'
		}
	}
})

const App = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	React.useEffect(() => {
		if (!JSON.parse(sessionStorage.getItem('jwt')) || !JSON.parse(localStorage.getItem('user'))) {
			navigate('/auth/login')
		}
	}, [])
	
	return (
		<ThemeProvider theme={theme}>
			<section>
					{/*<SafeComponent>*/}
						<Routes>
							{JSON.parse(sessionStorage.getItem('jwt')) && 
								<Route path='/' element={<Main /> } >
									<Route path='/' element={<RightPane />} />
								</Route>
							}
							<Route path='/auth' element={<Auth />}>
								<Route path='/auth/signup' exact element={<SignUp /> } />
								<Route path='/auth/login' element={<Login /> } />
							</Route>
						</Routes>
					{/*</SafeComponent>*/}
				<HelperAlert />
			</section>
		</ThemeProvider>
	)
}

export default App