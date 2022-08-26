// import React from 'react'
// import { useSelector, useDispatch } from 'react-redux'

// import { makeStyles } from '@material-ui/core/styles';

// import DoneIcon from '@material-ui/icons/Done';
// import StarIcon from '@material-ui/icons/Star';
// import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
// import StarBorderIcon from '@material-ui/icons/StarBorder';
// import DoneAllIcon from '@material-ui/icons/DoneAll'

// import Typography from '@material-ui/core/Typography';
// import IconButton from '@material-ui/core/IconButton'

// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// import ListItemText from '@material-ui/core/ListItemText'
// import ListItem from '@material-ui/core/ListItem'
// import List from '@material-ui/core/List'
// import ListItemIcon from '@material-ui/core/ListItemIcon';

// import UserAvatar from '../UserAvatar'	
// import ChatActions from '../ChatActions'

// import { 
// 	resetUnread, 
// 	handleStarred, 
// 	alertBeforeClear, 
// } from '../../../Redux/features/recentChatsSlice'

// import {setComponents} from '../../../Redux/features/componentSlice'
// import { setSelectedUser, assertFetch } from '../../../Redux/features/otherSlice'
// import { fetchMessages } from '../../../Redux/features/chatSlice'
// import { setSelectedGroup } from '../../../Redux/features/groupSlice'

// import { assert, getDateValue, handleFetch } from '../../../lib/script'
// import emit from '../../../sockets/outgoing'




// function UserBaseList(props) {
// 	return (
// 		<ListItem
// 			button
// 			className={classes.listItem}
// 			selected={isCurrentSelectedUser || showMenu}
// 			onClick={handleClick}
// 			onContextMenu={openContextMenu}
// 			style={{display: visible ? 'flex' : 'none'}}
// 		>
// 			<ListItemIcon>
// 	      <UserAvatar
// 		      username={username} 
// 		      badge={isOnline}
// 		     />
// 	    </ListItemIcon>
// 	    <ListItemText 
//     		primary={
//     			<Typography component='h6'> {username}</Typography>
//     		} 
//     		secondary={secondary}
//     	>
//     		</ListItemText>
// 		</ListItem>
// 	)
// }

// export default UserBaseList