import React from 'react'
import { Preloader, Puff } from 'react-preloader-icon'
import styled from 'styled-components'
import { useWinHeight } from '../hooks/hooks'

const Root = styled.div.attrs(props => ({

}))`
	height: ${props => props.height + 'px'};
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`

export default function ComponentLoader() {
	const height = useWinHeight()
	return (
		<Root height={height}>
			<Preloader
		    use={Puff}
		    size={60}
		    strokeWidth={6}
		    strokeColor="cornflowerblue"
		    duration={2000}
		  />
		</Root>
	)
}