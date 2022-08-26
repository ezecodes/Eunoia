import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Preloader, ThreeDots } from 'react-preloader-icon'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		alignItems: 'center',
		fontSize: '.91rem',
		height: '16px',

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
			<Preloader use={ThreeDots} size={28} strokeWidth={10} strokeColor='#b9b9b9' duration={900} /> 
		</span>
	)
}

export default TypingSignal