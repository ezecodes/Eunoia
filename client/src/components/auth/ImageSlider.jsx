import React from 'react'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import Fade from '@material-ui/core/Fade';

import image1 from '../../../public/images/undraw_mobile_encryption_re_yw3o.svg'
import image2 from '../../../public/images/undraw_my_notifications_re_ehmk.svg'
import image3 from '../../../public/images/undraw_chatting_re_j55r.svg'
import image4 from '../../../public/images/undraw_group_chat_re_frmo.svg'

import styled from 'styled-components'

const Root = styled.div`
	width: 40%;
	padding: 2rem 0;
	display: flex;
	position: relative;
	align-items: center;
	flex-direction: column;

	@media (max-width: 924px) {
		display: none;
	}

	.slideParent1 {
		height: 100%;
		width: 75%;
	}
	.buttons {
		bottom: 0;

		@media (max-height: 520px) {
			bottom: -1rem;
		}

	}
	& > div {
		position: absolute;
	}
	.slide {
		display: flex;
		align-items: center;
		flex-direction: column;

		.image {
			margin-bottom: 1.5rem;
			& img {
				width: 100%;
			}
		}

		.text {
			& p {
				text-shadow: 0px 1px 0px #ffffff;
				font-size: 1.2rem;
			}
		}
	}
`

const Button = styled.button.attrs(props => ({

}))`
	.MuiSvgIcon-root {
		transition: all ease 1s;
		font-size: 1rem;
		fill: ${props => props.cur ? '#6495ed' : '#f98b99' };
	}

`

const ImageBanner = () => {
	const {useState, useEffect} = React
	const urls = [
		{url: image2, text: 'See those notifications as soon as they appear' },
		{url: image3, text: 'Converse with friends and pals in real time'},
		{url: image4, text: 'Sync all group discussions in real-time!'},
	]

	const [index, setIndex] = useState(0)
	const [slide, setSlide] = useState(urls[index])
	const [interval, setInt] = useState(null)
	const [className, setName] = useState([])

	function startSlide() {
		const newInt = setInterval(() => {
			setIndex((prev) => {
				if (prev === urls.length -1) {
					return 0
				} else {
					return prev + 1
				}
			})
			
		}, 5000)
		setInt(newInt)
	}

	useEffect(() => {
		startSlide()
		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		setSlide(urls[index])
	}, [index])

	function handleSlide(arg) {
		if (!Object.keys(urls).includes(arg)) return

		setIndex(arg)
		clearInterval(interval)
		startSlide()
	}

	return (
		<Root>
		
			<div className='slideParent1'>
				{
					urls.map((item, i) => {
						return (
							item.url === slide.url &&
							<Fade in={true} key={i} >		
								<div className='slide'>
									<div className={'image'}> 
										<img src={item.url} />
									</div>
									<div className='text'>	
										<p> {item.text} </p>
									</div>
								
								</div>
							</Fade>
						)
					})
				}
			</div>
			<div className='buttons'>
					{
						urls.map((i, idx) => {
							return (
								<Button cur={index === idx} key={idx} onClick={() => handleSlide(idx)} >
									<FiberManualRecordIcon />
								</Button>
							)
						})
					}
				</div>
			
		</Root>
	)
}

export default ImageBanner