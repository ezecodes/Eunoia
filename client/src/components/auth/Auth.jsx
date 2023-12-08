import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Outlet, useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import ImageBanner from './ImageBanner'
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useWinHeight } from '../../hooks/hooks'
import styles from '../../stylesheet/transition.css'
import { Email, GitHub, LinkedIn } from '@material-ui/icons'
import { CSSTransition } from 'react-transition-group'

const Root = styled.section.attrs(props => ({

})) `
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	background: linear-gradient(45deg, #f4f6ff, #ffe8e859);

	.wrapper {
		display: flex;
		justify-content: space-around;
		height: 100%;
		padding: 2rem 0;

		@media (max-width: 1130px) {
		}
	}

	@media (max-width: 924px) {
		justify-content: center;
	}

	@media (max-height: 520px) {
		height: auto !important;
	}

	@media (max-width: 445px) {
		padding: 0
	}


	.textYellow {
		/**color: #ffc83d; **/
	}
	.subText {
		color: #787878;
	}

	.red {
		color: #e9001e;
	}
	.underline {
		text-decoration: underline;
	}
	& footer {
		bottom: 0;
		display: flex;
		margin-top: 10px;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.contact {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.contacts {
				a {
					margin-right: 4px;
				}
				svg {
					font-size: 20px;
					transition: .4s ease all;
				}
				svg:hover {
					font-size: 27px;
				}
			}
		}

		& > span {
			display: flex;
			align-items: center;
		}
		.subText {
			margin: 6px 0 5px;
			font-size: 14px;
			color: #787878;
		}

		.MuiSvgIcon-root {
			font-size: 1rem
		}
`

const FormPage = styled.div`
	width: 417px;
	height: min-content;
	background: #fff;
	padding: 1rem 2rem;
	box-shadow: 0 0 14px 2px #eee;

	@media (max-width: 445px) {
		width: 95%;
		margin-top: 1rem;
		padding: 1rem;
	}

	
	}

	.pageBody {
		width: 100%;
		.formHeader {
			margin: 1.2rem 0 .5rem 0;

			& h1 {
				font-size: 1.3rem;
				color: #4a4660;

				& strong {
					/**color: #6495ed; **/
				}
			}
		}
	}

	.cta {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		flex-direction: column;
		margin: .98rem;

		* {
			font-size: .95rem;
		}

		@media (max-width: 445px) {
			align-items: flex-end;
			flex-direction: column;
		}
	}

`
const Contact = ({show}) => {
	const nodeRef = React.useRef(null)
	const contacts = [
		{icon: <Email />, name: 'Email', link: 'mailto:elijaheze777@gmail.com'},
		{icon: <GitHub />, name: 'Github', link: 'https://github.com/elijh-e'},
		{icon: <LinkedIn />, name: 'LinkedIn', link: 'https://linkedin.com/in/elijah-eze-1b367521b'}
	]
	return (
		<CSSTransition
	    in={show}
	    nodeRef={nodeRef}
	    timeout={500}
	    classNames={{
	    	enter: styles.animate__animated,
				enterActive: styles.animate__zoomInUp,
				exit: styles.animate__animated,
				exitActive: styles.animate__zoomOutDown
	    }}
	    unmountOnExit
	  >
	  	<div ref={nodeRef} className='contacts'>
	  		{contacts.map((contact, i) => <a key={i} href={contact.link} title={contact.name} >{contact.icon}</a>)}
	  	</div>
	  </CSSTransition>
	)
}

const Auth = ({children}) => {
	const height = useWinHeight()
	const [showContact, setContact] = React.useState(false)
	function handleContactDisplay(state) {
		setContact(state)
	}
	return (
		<Root height={`${height}px`}>

			<div className='wrapper'>
				<ImageBanner />
				<FormPage>
					<Outlet />
				</FormPage>
			</div>

			<footer>
				<div className='contact'>
					<Contact show={showContact} />
					<span onMouseEnter={() => handleContactDisplay(true)} onMouseOut={() => {}}>
						Contact developer
					</span>
				</div>
				<span className='subText'> All rights reserved &copy;Eunoia </span>
			</footer>

		</Root>
	)
}

export default Auth