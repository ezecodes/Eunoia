import React from 'react'

import { CSSTransition } from 'react-transition-group'
import { makeStyles } from '@material-ui/core/styles';
import common from '@material-ui/core/colors/common';
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert';

const ActiveUsers = React.lazy(() => import('./ActiveUsers'))
const RecentChats = React.lazy(() => import('./RecentChats'))
const NewGroup = React.lazy(() => import('./NewGroup'))
const Settings = React.lazy(() => import('./settings/Settings'))
const ResetPassword = React.lazy(() => import('./settings/ResetPassword'))
const ContactInfo = React.lazy(() => import('./settings/ContactInfo'))

import ComponentLoader from '../../ComponentLoader'

import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import IconButton from '@material-ui/core/IconButton'

import styles from '../../../stylesheet/transition.css'

import { useSelector } from 'react-redux'

import styled from 'styled-components'

const classNames = [styles.animate__fadeInRight, styles.animate__animated].join(' ')

const Root = styled.section.attrs(props => ({

}))`
	z-index: 25;
	display: flex;
	width: ${props => props.width + 'px'};
	min-width: ${props => props.minWidth + 'px'};
	max-width: 400px;

	.wrap {
		background: ${common.white};
		width: 100%;
		overflow-y: scroll;

		& > section {
			width: 100%
		}

	}


	@media (max-width: 660px) {
		width: 100%;
		max-width: 100%;
		min-width: 100%;
	}

	.resize {
		cursor: col-resize;
		display: flex;
		align-items: center;
		width: 1px;

		.MuiSvgIcon-root {
			fill: #a5a5a5;
		}

		@media (max-width: 660px) {
			display: none;
		}

	}
`

const LeftPane = () => {
	const {
		activeUsers,
		recentChats,
		contactInfo,
		settings,
		resetPassword,
		newGroup
	} = useSelector(state => state.components.stack)

	const DEFAULT_WIDTH = 330
	const [width, setWidth] = React.useState(DEFAULT_WIDTH)
	
	const startResize = evt => {
		setWidth( width + evt.movementX )
	}
	return (
		<Root width={width} minWidth={DEFAULT_WIDTH} >
			<div className='wrap'>
				<React.Suspense fallback={<ComponentLoader />}>
					{activeUsers && <ActiveUsers className={classNames}/>}
					{recentChats && <RecentChats className={classNames} />}
					{newGroup && <NewGroup className={classNames} />}
					{settings && <Settings className={classNames} />}
					{contactInfo && <ContactInfo className={classNames}/>}
					{resetPassword && <ResetPassword className={classNames}/>}
				</React.Suspense>
			</div>
			{/*<div className='resize' onMouseDown={beginDrag} >
				<DragIndicatorIcon />
			</div>*/}
		</Root>
			
	)
}

export default LeftPane