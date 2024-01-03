"use strict";(self.webpackChunkEunoia=self.webpackChunkEunoia||[]).push([[223],{6211:(e,t,n)=>{n.d(t,{Z:()=>g});var r=n(7462),a=n(885),o=n(5987),i=n(7294),s=n(2666),l=n(3291),c=n(8920),m=n(5653),d=n(3834),u={entering:{transform:"none"},entered:{transform:"none"}},p={enter:l.x9.enteringScreen,exit:l.x9.leavingScreen};const g=i.forwardRef((function(e,t){var n=e.children,l=e.disableStrictModeCompat,g=void 0!==l&&l,E=e.in,f=e.onEnter,y=e.onEntered,h=e.onEntering,v=e.onExit,b=e.onExited,w=e.onExiting,x=e.style,S=e.timeout,Z=void 0===S?p:S,C=e.TransitionComponent,k=void 0===C?s.ZP:C,N=(0,o.Z)(e,["children","disableStrictModeCompat","in","onEnter","onEntered","onEntering","onExit","onExited","onExiting","style","timeout","TransitionComponent"]),T=(0,c.Z)(),j=T.unstable_strictMode&&!g,O=i.useRef(null),P=(0,d.Z)(n.ref,t),F=(0,d.Z)(j?O:void 0,P),L=function(e){return function(t,n){if(e){var r=j?[O.current,t]:[t,n],o=(0,a.Z)(r,2),i=o[0],s=o[1];void 0===s?e(i):e(i,s)}}},I=L(h),J=L((function(e,t){(0,m.n)(e);var n=(0,m.C)({style:x,timeout:Z},{mode:"enter"});e.style.webkitTransition=T.transitions.create("transform",n),e.style.transition=T.transitions.create("transform",n),f&&f(e,t)})),M=L(y),z=L(w),A=L((function(e){var t=(0,m.C)({style:x,timeout:Z},{mode:"exit"});e.style.webkitTransition=T.transitions.create("transform",t),e.style.transition=T.transitions.create("transform",t),v&&v(e)})),B=L(b);return i.createElement(k,(0,r.Z)({appear:!0,in:E,nodeRef:j?O:void 0,onEnter:J,onEntered:M,onEntering:I,onExit:A,onExited:B,onExiting:z,timeout:Z},N),(function(e,t){return i.cloneElement(n,(0,r.Z)({style:(0,r.Z)({transform:"scale(0)",visibility:"exited"!==e||E?void 0:"hidden"},u[e],x,n.props.style),ref:F},t))}))}))},3850:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(7294);const a=n(2788).ZP.div`
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
`,o=({children:e})=>r.createElement(a,null,e)},8444:(e,t,n)=>{n.d(t,{J:()=>s,Z:()=>i});var r=n(7294),a=n(2157);const o=n(2788).ZP.div`
	display: flex;
	justify-content: flex-end;

	& > input {
		margin-right: 10px;
	}
`;function i({autoComplete:e,type:t,id:n,value:o,error:i,helperText:s,onChange:l}){return r.createElement(a.Z,{required:!0,type:t,id:n,autoComplete:e,variant:"outlined",color:"primary",value:o,error:i,helperText:s,onChange:l})}function s({checked:e,onChange:t}){return r.createElement(o,null,r.createElement("input",{type:"checkbox",id:"persistLogin",onChange:t}),r.createElement("label",{htmlFor:"persistLogin"},"Keep me logged in"))}},1143:(e,t,n)=>{n.d(t,{z2:()=>a,zB:()=>r});const r=async(e,t)=>{try{t(await fetch("/auth/login",{method:"POST",headers:{"content-type":"application/json",Accept:"application/json"},body:JSON.stringify(e)}))}catch(e){console.log(e)}},a=async e=>{try{let t=await fetch("/auth/register",{method:"POST",headers:{"content-type":"application/json",Accept:"application/json"},body:JSON.stringify(e)});return await t.json()}catch(e){console.log(e)}}},2223:(e,t,n)=>{n.r(t),n.d(t,{default:()=>w});var r=n(7294),a=n(9711),o=n(6211),i=n(2318),s=n(3850),l=n(2157),c=n(7397),m=n(7812),d=n(282),u=n(1270),p=n(1738),g=n(3084),E=n(9704),f=n(8444),y=n(5953),h=n(1143),v=n(4199);const b=({login:e})=>{const t=(0,E.I0)(),[n,a]=r.useState(!1),[o,i]=r.useState(!1),[s,b]=r.useState(!1),[w,x]=r.useState({username:"",password:""}),[S,Z]=r.useState({username:"",password:""}),[C,k]=r.useState({username:!1,password:!1}),[N,T]=r.useState(!1),[j,O]=r.useState(!1),P=e=>{b(e)},F=e=>{t((0,y.Pc)({open:!0,msg:e,severity:"error"}))};return r.createElement("form",{onSubmit:e=>{e.preventDefault(),P(!0);const n={username:w.username,password:w.password,persisLogin:N};(0,h.zB)(n,(async e=>{P(!1);const n=await e.json();401===e.status?F(n.error):200===e.status?(0,v.cK)(n,(()=>{t((0,y.Pc)({open:!0,msg:"Log in successful ✌",severity:"success"})),P(!1),document.location="/"})):F("Something went wrong")}))}},r.createElement("fieldset",null,r.createElement("div",{className:"formField"},r.createElement("label",{htmlFor:"username"}," Username "),r.createElement(f.Z,{type:"text",autoComplete:"username",id:"username",error:C.username,helperText:S.username,value:w.username,onChange:e=>{O(!1);const t=e.target.value;/[^a-z0-9_ ]/gi.test(t)?(Z({...S,username:"Invalid name"}),k({...C,username:!0})):(x({...w,username:t.trimLeft()}),Z({...S,username:""}),k({...C,username:!1}))}})),r.createElement("div",{className:"formField"},r.createElement("label",{htmlFor:"current-password"}," Password "),r.createElement(l.Z,{required:!0,autoComplete:"current-password",id:"current-password",variant:"outlined",onChange:e=>{x({...w,password:e.target.value}),O(!1)},color:"primary",type:o?"text":"password",error:C.password,helperText:S.password,value:w.password,InputProps:{endAdornment:r.createElement(c.Z,{position:"end"},r.createElement(m.Z,{color:"secondary","aria-label":"Toggle password visibility",onClick:()=>{i(!o)}},o?r.createElement(u.Z,null):r.createElement(p.Z,null)))}}))),r.createElement("fieldset",null,r.createElement(f.J,{checked:N,onChange:()=>T(!N)})),r.createElement("fieldset",null,r.createElement("div",{className:"formField"},r.createElement(d.Z,{variant:"contained",color:"primary",disabled:s,classes:{root:"button"},type:"submit"},s?r.createElement(r.Fragment,null,"Login   ",r.createElement(g.Preloader,{use:g.Oval,size:20,strokeWidth:10,strokeColor:"#fff",duration:700})):"Login"))),j&&r.createElement(Snackbar,{anchorOrigin:{vertical:"bottom",horizontal:"center"},open:alert.open,onClose:()=>{O(!1)},color:"primary",key:"bottomright"},r.createElement(Alert,{severity:alert.type,color:alert.type,variant:"filled"},alert.text)))},w=()=>r.createElement(o.Z,{in:!0},r.createElement("div",{className:"pageBody"},r.createElement("header",{className:"formHeader"},r.createElement(i.Z,{component:"h1"}," ",r.createElement("span",{className:"textYellow"}," Hi there, ")," Welcome back 👏 "),r.createElement(i.Z,{variant:"body1",className:"subText"}," Log in with the data you entered during your registration. ")),r.createElement("div",{className:"cta"},r.createElement(i.Z,{variant:"body1",className:"subText"}," Don't have an account ? "),r.createElement(a.rU,{to:"/auth/signup",className:"red underline"}," Register now ")),r.createElement(s.Z,null,r.createElement(b,null))))},4199:(e,t,n)=>{n.d(t,{$s:()=>a,DH:()=>o,cK:()=>r});const r=(e,t)=>{const{jwt:n,username:r,id:a}=e;sessionStorage.setItem("jwt",JSON.stringify(n)),localStorage.setItem("user",JSON.stringify({username:r,id:a})),t()},a=e=>{sessionStorage.setItem("jwt",JSON.stringify(e))},o=()=>{sessionStorage.clear(),localStorage.clear()}}}]);