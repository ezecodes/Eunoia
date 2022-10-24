"use strict";(self.webpackChunkwebconnect=self.webpackChunkwebconnect||[]).push([[251],{6856:(e,a,n)=>{n.d(a,{Z:()=>d});var o=n(7462),i=n(5987),r=n(7294),t=n(6010),l=n(4670),s=r.forwardRef((function(e,a){var n=e.disableSpacing,l=void 0!==n&&n,s=e.classes,d=e.className,c=(0,i.Z)(e,["disableSpacing","classes","className"]);return r.createElement("div",(0,o.Z)({className:(0,t.Z)(s.root,d,!l&&s.spacing),ref:a},c))}));const d=(0,l.Z)({root:{display:"flex",alignItems:"center",padding:8,justifyContent:"flex-end",flex:"0 0 auto"},spacing:{"& > :not(:first-child)":{marginLeft:8}}},{name:"MuiDialogActions"})(s)},9525:(e,a,n)=>{n.d(a,{Z:()=>d});var o=n(7462),i=n(5987),r=n(7294),t=n(6010),l=n(4670),s=r.forwardRef((function(e,a){var n=e.classes,l=e.className,s=e.dividers,d=void 0!==s&&s,c=(0,i.Z)(e,["classes","className","dividers"]);return r.createElement("div",(0,o.Z)({className:(0,t.Z)(n.root,l,d&&n.dividers),ref:a},c))}));const d=(0,l.Z)((function(e){return{root:{flex:"1 1 auto",WebkitOverflowScrolling:"touch",overflowY:"auto",padding:"8px 24px","&:first-child":{paddingTop:20}},dividers:{padding:"16px 24px",borderTop:"1px solid ".concat(e.palette.divider),borderBottom:"1px solid ".concat(e.palette.divider)}}}),{name:"MuiDialogContent"})(s)},6083:(e,a,n)=>{n.d(a,{Z:()=>c});var o=n(7462),i=n(5987),r=n(7294),t=n(6010),l=n(4670),s=n(2318),d=r.forwardRef((function(e,a){var n=e.children,l=e.classes,d=e.className,c=e.disableTypography,p=void 0!==c&&c,m=(0,i.Z)(e,["children","classes","className","disableTypography"]);return r.createElement("div",(0,o.Z)({className:(0,t.Z)(l.root,d),ref:a},m),p?n:r.createElement(s.Z,{component:"h2",variant:"h6"},n))}));const c=(0,l.Z)({root:{margin:0,padding:"16px 24px",flex:"0 0 auto"}},{name:"MuiDialogTitle"})(d)},4170:(e,a,n)=>{n.d(a,{Z:()=>f});var o=n(7462),i=n(5987),r=n(4942),t=n(7294),l=n(6010),s=n(4670),d=n(3871),c=n(9550),p=n(3637),m=t.forwardRef((function(e,a){var n=e.children,r=e.classes,s=e.className,d=e.invisible,c=void 0!==d&&d,m=e.open,u=e.transitionDuration,x=e.TransitionComponent,h=void 0===x?p.Z:x,v=(0,i.Z)(e,["children","classes","className","invisible","open","transitionDuration","TransitionComponent"]);return t.createElement(h,(0,o.Z)({in:m,timeout:u},v),t.createElement("div",{className:(0,l.Z)(r.root,s,c&&r.invisible),"aria-hidden":!0,ref:a},n))}));const u=(0,s.Z)({root:{zIndex:-1,position:"fixed",display:"flex",alignItems:"center",justifyContent:"center",right:0,bottom:0,top:0,left:0,backgroundColor:"rgba(0, 0, 0, 0.5)",WebkitTapHighlightColor:"transparent"},invisible:{backgroundColor:"transparent"}},{name:"MuiBackdrop"})(m);var x=n(3291),h=n(9895),v={enter:x.x9.enteringScreen,exit:x.x9.leavingScreen},b=t.forwardRef((function(e,a){var n=e.BackdropProps,r=e.children,s=e.classes,m=e.className,x=e.disableBackdropClick,b=void 0!==x&&x,f=e.disableEscapeKeyDown,g=void 0!==f&&f,k=e.fullScreen,Z=void 0!==k&&k,E=e.fullWidth,y=void 0!==E&&E,w=e.maxWidth,W=void 0===w?"sm":w,C=e.onBackdropClick,S=e.onClose,B=e.onEnter,N=e.onEntered,D=e.onEntering,T=e.onEscapeKeyDown,P=e.onExit,M=e.onExited,R=e.onExiting,A=e.open,K=e.PaperComponent,$=void 0===K?h.Z:K,F=e.PaperProps,I=void 0===F?{}:F,Y=e.scroll,j=void 0===Y?"paper":Y,H=e.TransitionComponent,X=void 0===H?p.Z:H,L=e.transitionDuration,z=void 0===L?v:L,O=e.TransitionProps,U=e["aria-describedby"],q=e["aria-labelledby"],G=(0,i.Z)(e,["BackdropProps","children","classes","className","disableBackdropClick","disableEscapeKeyDown","fullScreen","fullWidth","maxWidth","onBackdropClick","onClose","onEnter","onEntered","onEntering","onEscapeKeyDown","onExit","onExited","onExiting","open","PaperComponent","PaperProps","scroll","TransitionComponent","transitionDuration","TransitionProps","aria-describedby","aria-labelledby"]),J=t.useRef();return t.createElement(c.Z,(0,o.Z)({className:(0,l.Z)(s.root,m),BackdropComponent:u,BackdropProps:(0,o.Z)({transitionDuration:z},n),closeAfterTransition:!0},b?{disableBackdropClick:b}:{},{disableEscapeKeyDown:g,onEscapeKeyDown:T,onClose:S,open:A,ref:a},G),t.createElement(X,(0,o.Z)({appear:!0,in:A,timeout:z,onEnter:B,onEntering:D,onEntered:N,onExit:P,onExiting:R,onExited:M,role:"none presentation"},O),t.createElement("div",{className:(0,l.Z)(s.container,s["scroll".concat((0,d.Z)(j))]),onMouseUp:function(e){e.target===e.currentTarget&&e.target===J.current&&(J.current=null,C&&C(e),!b&&S&&S(e,"backdropClick"))},onMouseDown:function(e){J.current=e.target}},t.createElement($,(0,o.Z)({elevation:24,role:"dialog","aria-describedby":U,"aria-labelledby":q},I,{className:(0,l.Z)(s.paper,s["paperScroll".concat((0,d.Z)(j))],s["paperWidth".concat((0,d.Z)(String(W)))],I.className,Z&&s.paperFullScreen,y&&s.paperFullWidth)}),r))))}));const f=(0,s.Z)((function(e){return{root:{"@media print":{position:"absolute !important"}},scrollPaper:{display:"flex",justifyContent:"center",alignItems:"center"},scrollBody:{overflowY:"auto",overflowX:"hidden",textAlign:"center","&:after":{content:'""',display:"inline-block",verticalAlign:"middle",height:"100%",width:"0"}},container:{height:"100%","@media print":{height:"auto"},outline:0},paper:{margin:32,position:"relative",overflowY:"auto","@media print":{overflowY:"visible",boxShadow:"none"}},paperScrollPaper:{display:"flex",flexDirection:"column",maxHeight:"calc(100% - 64px)"},paperScrollBody:{display:"inline-block",verticalAlign:"middle",textAlign:"left"},paperWidthFalse:{maxWidth:"calc(100% - 64px)"},paperWidthXs:{maxWidth:Math.max(e.breakpoints.values.xs,444),"&$paperScrollBody":(0,r.Z)({},e.breakpoints.down(Math.max(e.breakpoints.values.xs,444)+64),{maxWidth:"calc(100% - 64px)"})},paperWidthSm:{maxWidth:e.breakpoints.values.sm,"&$paperScrollBody":(0,r.Z)({},e.breakpoints.down(e.breakpoints.values.sm+64),{maxWidth:"calc(100% - 64px)"})},paperWidthMd:{maxWidth:e.breakpoints.values.md,"&$paperScrollBody":(0,r.Z)({},e.breakpoints.down(e.breakpoints.values.md+64),{maxWidth:"calc(100% - 64px)"})},paperWidthLg:{maxWidth:e.breakpoints.values.lg,"&$paperScrollBody":(0,r.Z)({},e.breakpoints.down(e.breakpoints.values.lg+64),{maxWidth:"calc(100% - 64px)"})},paperWidthXl:{maxWidth:e.breakpoints.values.xl,"&$paperScrollBody":(0,r.Z)({},e.breakpoints.down(e.breakpoints.values.xl+64),{maxWidth:"calc(100% - 64px)"})},paperFullWidth:{width:"calc(100% - 64px)"},paperFullScreen:{margin:0,width:"100%",maxWidth:"100%",height:"100%",maxHeight:"none",borderRadius:0,"&$paperScrollBody":{margin:0,maxWidth:"100%"}}}}),{name:"MuiDialog"})(b)}}]);