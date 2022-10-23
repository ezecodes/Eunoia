import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase'

const useStyles = makeStyles({
	searchbar: {
		width: '100%',
		border: '1px solid #cdd3dd',
		padding: '5px 15px',
		borderRadius: '100px',
		margin: '0 9px',
		'& .MuiInputBase-input': {
			fontSize: '.9rem',
			color: '#0d2c66',
		},
		'& .MuiInputAdornment-positionStart': {
			'& p': {
				color: '#63718d'
			}
		}	

	},

})


const SearchBar = ({input, onChange, placeholder = 'Search', classNames = []}) => {
	const classes = useStyles()
	return (
		<InputBase
			className={[classes.searchbar, ...classNames].join(' ')}
      placeholder={placeholder}
      type="text"
      value={input}
      onChange={({target}) => {
      	onChange(target.value)
      }}
    />
	)
}

export default SearchBar