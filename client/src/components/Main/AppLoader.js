import React from 'react'
import { Preloader, Circles } from 'react-preloader-icon'
import styled from 'styled-components'

const Root = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 50px;
	flex-direction: column;

	em {
		color: #555674;
		margin-top: 10px;
	}
`

export default function AppLoader() {
	return (
		<Root>
			<Preloader use={Circles}
		    size={60}
		    strokeWidth={6}
		    strokeColor="cornflowerblue"
		    duration={2000} 
		  /> 
			<em>Organizing your chat experience...</em>
		</Root>
	)
}