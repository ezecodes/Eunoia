import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Preloader, ThreeDots } from 'react-preloader-icon'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		alignItems: 'center',
		fontSize: '.91rem',
		height: '20px',

		'& > div': {
			marginLeft: '8px'
		}
	},
})

function TypingSignal({children}) {
	const classes = useStyles()
	return (
		<span className={classes.root}>
			{children}
			<Preloader use={ThreeDots} size={32} strokeWidth={12} strokeColor='#6495ed' duration={800} /> 
		</span>
	)
}

export default TypingSignal