import React from 'react'
import '../stylesheet/main.css'
import { useSelector, useDispatch } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import SafeComponent from './SafeComponent'

import HelperAlert from './HelperAlert'
import ComponentLoader from './ComponentLoader'

const RightPane = React.lazy(() => import('./main/rightPane/RightPane'))
const Main = React.lazy(() => import('./main/Main'))
const Auth = React.lazy(() => import('./auth/Auth' ))
const Login = React.lazy(() => import('./auth/login/Login'))
const SignUp = React.lazy(() =>import('./auth/signup/Signup') )

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
				<React.Suspense fallback={<ComponentLoader />}>
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
				<HelperAlert />
				</React.Suspense>
			</section>
		</ThemeProvider>
	)
}

export default App