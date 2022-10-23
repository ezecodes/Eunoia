import React from 'react'
import styled from 'styled-components'

const Root = styled.div`
	.formField {
		margin-bottom: 1rem;

		& > label {
			display: block;
			margin-bottom: .4rem;
		}
		& > button {
			color: #fff;
			margin: 1rem 0 1.5rem 0;

			@media (max-width: 488px) {
				width: 100%
			}
		}

		.MuiFormControl-root {
			width: 100%;

			.MuiOutlinedInput-input {
				padding: 13px 10px
			}

		}

		.MuiButton-contained.Mui-disabled {
			color: #fff;
			background-color: #9eb9e9;
		}
			
	}
`

const BaseForm = ({children}) => {
	return (
		<Root>
			{children}
		</Root>
	)
}

export default BaseForm