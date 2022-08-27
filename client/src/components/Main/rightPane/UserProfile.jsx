import React from 'react'
import { useDispatch,useSelector } from 'react-redux'
import UserAvatar from '../UserAvatar'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';

import CallIcon from '@material-ui/icons/Call'
import VideocamIcon from '@material-ui/icons/Videocam'
import InfoIcon from '@material-ui/icons/Info'
import EmailIcon from '@material-ui/icons/Email'
import TwitterIcon from '@material-ui/icons/Twitter'
import FacebookIcon from '@material-ui/icons/Facebook'
import InstagramIcon from '@material-ui/icons/Instagram'
import LocalPhoneIcon from '@material-ui/icons/LocalPhone'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';

import Backdrop from '@material-ui/core/Backdrop';

import PersonPinIcon from '@material-ui/icons/PersonPin';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { ReactTransitionGroup } from 'react-transition-group'

import { setUserProfile } from '../../../Redux/features/chatSlice'
import { setComponents} from '../../../Redux/features/componentSlice'

import Header from '../Header'
import { getWindowHeight } from '../../../lib/script'

const useStyles = makeStyles({
	profilePage: {
		background: '#fff',
		width: 350,
		minWidth: 300,
		height: '100%',
		position: 'absolute',
		right: 0,
		zIndex: 200,
		height: '100%'
	},
	body: {
		padding: '26px 20px 0 20px',
	},
	banner: {
		display: 'flex',
		justifyContent: 'center'
	},
	profileContacts: {
		marginTop: '1.1rem',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',

		'& > div:first-child .MuiTypography-body1': {
			fontWeight: 'bold'
		},
		'& > div:last-of-type': {
			marginTop: '14px'
		},

		'& > div': {
			width: '100%',
			display: 'flex',
			alignItems: 'center',
			paddingBottom: '5px',

			'& .MuiSvgIcon-root': {
				// fontSize: '1.4rem',
				marginRight: '5px',
				color: '#595a5aab'
			},

			'& .MuiTypography-body1': {
				textAlign: 'left'
			}
		}
		// '& .MuiTypography-body1:first-child': {
		// 	fontSize: '1.2rem',
		// 	fontWeight: 'bold',
		// 	marginBottom: '.2rem'
		// },
		// '& .MuiTypography-body1:last-of-type': {
		// 	fontSize: '1.05rem',
		// 	lineHeight: 1.3
		// }	
	},
	socials: {
		marginTop: '1rem',

		'& > h4': {
			fontSize: '.8rem',
			textTransform: 'uppercase',
			marginBottom: '5px',
			fontWeight: 'normal !important'
		},

		'& > div': {
			display: 'flex',
			flexWrap: 'wrap',
			"& > a:hover": {
				textDecoration: 'underline'
			},
			'& > a': {
				margin: '5px 7px 0',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				transition: '.6s ease all',
				'& svg': {
					marginRight: '.3rem',
					fontSize: '1.6rem'
				}
			},
		}
	},
	backdrop: {
		width: '100%',
		height: '100%',
		position:'absolute',
		zIndex: 190
	},
})

const actions = [
	{icon: <TwitterIcon style={{color: '#1DA1F2'}} /> , name: 'twitter'},
	{icon: <FacebookIcon style={{color: '#4267B2'}} /> , name: 'facebook'},
	{icon: <InstagramIcon style={{color: '#C13584'}} /> , name: 'instagram'},
	{icon: <EmailIcon /> , name: 'email'},
]


const UserProfile = ({username, displayName, joined, bio, socials}) => {
	const dispatch = useDispatch()
	const classes = useStyles()
	const {id} = JSON.parse(localStorage.getItem('details'))

	const setComp = (obj) => {
		dispatch(setUserProfile(false))
	}

  const handleCall = () => {

  }
	return (
		<Slide in={true} direction='left'>
		<div className={[classes.profilePage, 'animate__animated', 'animate__fadeInRight'].join(' ')} 
			style={{height: `${getWindowHeight()}px`}}
		>
			<Header>
				<IconButton onClick={() => setComp({component: 'profile', value: false})} >
					<KeyboardArrowLeftIcon />
				</IconButton>
				<Typography component='h6'>  </Typography>
			</Header>

			<div className={classes.body}>
				<div className={classes.banner}>
					<UserAvatar username={username} style={{
		        	width: 200, height: 200, fontSize: '4rem'
		        }} badge={false} />
		    </div>

		    <div className={classes.profileContacts}>
		    	<div>
		    		{/*<PersonPinIcon />*/}
		    		<Typography> @{username}</Typography>
		    	</div>
		    	<div>
		    		<InfoOutlinedIcon />
		    		<Typography>{bio}</Typography>
		    	</div>

		    </div>
		    {socials.length > 0 && socials &&
		    <div className={classes.socials}>
		    	<h4>Social handles</h4>
		    	<div>
			    	{
			    		socials.map((social, i) => {
			    			const find = actions.find(action => action.name === social.name)
			    			return (
			    				find !== undefined &&
			    					<a href={social.link} rel='noreferrer' target='_blank'>
			    						{find.icon}
			    					</a>	
			    			)
			    		})
			    	}
			    </div>
		    </div>}
			</div>
		</div>
		</Slide>
	)
}

export default UserProfile