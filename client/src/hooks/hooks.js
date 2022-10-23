import React from 'react'

export const useWinHeight = () => {
	const [height, setHeight] = React.useState(`${window.innerHeight}`)
	
	function handleHeight() {
		setHeight(`${window.innerHeight}`)
	}

	window.addEventListener('resize', handleHeight)

	React.useEffect(() => {
		return () => window.removeEventListener('resize', handleHeight)
	}, [])
	
	return height
}

