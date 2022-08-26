import React from 'react'

import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	progress: {
		position: 'absolute',
		top: '120%',
		width: '98%',
		height: '3px',
		margin: '0 auto'
	},
})

const NetworkProgress = () => {
	const classes = useStyles()
	return (
		<LinearProgress color="primary" className={classes.progress} />
	)
}

export default NetworkProgress