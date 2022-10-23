import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Outlet, useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import ImageBanner from './ImageBanner'
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useWinHeight } from '../../hooks/hooks'

const Root = styled.section.attrs(props => ({

})) `
	overflow-y: scroll;
	display: flex;
	height: ${props => props.height};
	flex-direction: column;
	justify-content: space-around;
	background: linear-gradient(45deg, #f4f6ff, #ffe8e859);

	.wrapper {
		display: flex;
		justify-content: space-around;
		height: 100%;
		padding: 5rem 0;

		@media (max-width: 1130px) {
			padding: 2rem 0;
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
		justify-content: center;

		& > span {
			display: flex;
			align-items: center;
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
const Auth = ({children}) => {
	const height = useWinHeight()
	return (
		<Root height={`${height}px`}>

			<div className='wrapper'>
				<ImageBanner />
				<FormPage>
					<Outlet />
				</FormPage>
			</div>

			<footer>
				<span className='subText' > All rights reserved &copy; Webconnect </span>
			</footer>

		</Root>
	)
}

export default Auth