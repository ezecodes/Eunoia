import React from 'react'
import { useDispatch,useSelector } from 'react-redux'
import UserAvatar from '../UserAvatar'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { CSSTransition } from 'react-transition-group';

import CallIcon from '@material-ui/icons/Call'
import VideocamIcon from '@material-ui/icons/Videocam'
import InfoIcon from '@material-ui/icons/Info'
import EmailIcon from '@material-ui/icons/Email'
import TwitterIcon from '@material-ui/icons/Twitter'
import FacebookIcon from '@material-ui/icons/Facebook'
import InstagramIcon from '@material-ui/icons/Instagram'
import LocalPhoneIcon from '@material-ui/icons/LocalPhone'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import Zoom from '@material-ui/core/Zoom';

import Backdrop from '@material-ui/core/Backdrop';

import PersonPinIcon from '@material-ui/icons/PersonPin';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { setUserProfile } from '../../../Redux/features/chatSlice'
import { setComponents} from '../../../Redux/features/componentSlice'

import Header from '../Header'
import { useWinHeight } from '../../../hooks/hooks'
import styles from '../../../stylesheet/transition.css'

const useStyles = makeStyles({
	
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
			// marginTop: '5px'
		},

		'& > div': {
			width: '100%',
			display: 'flex',
			alignItems: 'center',
			paddingBottom: '13px',

			'& .MuiSvgIcon-root': {
				// fontSize: '1.4rem',
				marginRight: '5px',
				color: '#595a5aab',
				fontSize: '1.2rem'
			},

			'& .MuiTypography-body1': {
				textAlign: 'left',
				paddingLeft: '11px',
				marginLeft: '5px',
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
			'& > span': {
				margin: '7px 7px 0',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				textTransform: 'capitalize',
				position: 'relative',
				transition: '.6s ease all',

				'& > span': {
					position: 'absolute',
					left: 0,
					zIndex: '50',
					background: '#fff',
					padding: '10px',
					boxShadow: '0px 0px 5px 0px #ababab',
					borderRadius: '10px',

					'& > a': {
						textDecoration: 'underline',
						color: '#294eb5'
					}
				},

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


const UserProfile = ({username, displayName, joined, bio, socials, show}) => {
	const dispatch = useDispatch()
	const classes = useStyles()
	const {id} = useSelector(state => state.account.account)
	const [cur, setCur] = React.useState('')
	const nodeRef = React.useRef(null)
	const height = useWinHeight()

	const setComp = (obj) => {
		dispatch(setUserProfile(false))
	}

  const handleCall = () => {

  }
  const handleSocial = (name) => {
  	setCur(name)
  }
	return (
		<CSSTransition
	    in={show}
	    nodeRef={nodeRef}
	    timeout={500}
	    classNames={{
	    	enter: styles.animate__animated,
				enterActive: styles.animate__fadeInRight,
				exit: styles.animate__animated,
				exitActive: styles.animate__fadeOutRight
	    }}
	    unmountOnExit
	  >
		<div style={{height: `${height}px`}} ref={nodeRef}>
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
		    		<PermIdentityIcon />
		    		<Typography> @{username}</Typography>
		    	</div>
		    	{
		    		displayName !== '' &&
		    		<div>
			    		<PersonPinIcon />
			    		<Typography> {displayName}</Typography>
			    	</div>
		    	}
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
			    					<span key={i} onMouseEnter={() => handleSocial(social.name)} onMouseLeave={() => handleSocial('')} >
				    					{find.icon} {social.name}
				    					<Zoom in={cur === social.name}>
					    					<span>
					    						Follow link <br />
					    						<a href={social.link} rel='noreferrer' target='_blank' > {social.link} </a>
					    					</span>
					    				</Zoom>
				    				</span>
			    			)
			    		})
			    	}
			    </div>
		    </div>}
			</div>
		</div>
		</CSSTransition>
	)
}

export default UserProfile