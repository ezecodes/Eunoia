import React from 'react'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'
import { handleAlert } from '../Redux/features/otherSlice'
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from 'react-redux' 

const useStyles = makeStyles({
	root: {
		'& .MuiAlert-message': {
			whiteSpace: 'pre-line',
			textAlign: 'center'
		}
	}
})

function HelperAlert () {
	const classes = useStyles()
	const dispatch = useDispatch()
	const closeError = () => dispatch(handleAlert({open: false}))
	const {open, msg, severity} = useSelector(state => state.other.alert)
	return (
	 <Snackbar 
	 		open={open}
	 		anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'center',
			}}
    	className={classes.root}
			onClose={closeError}
			autoHideDuration={8000}
		>
		  <MuiAlert variant='filled' elevation={6} onClose={closeError} severity={severity}>
		    {msg}
		  </MuiAlert>
		</Snackbar>
	)
}

export default HelperAlert
// HelperAlert.prop