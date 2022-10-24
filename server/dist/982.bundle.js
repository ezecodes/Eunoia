"use strict";(self.webpackChunkwebconnect=self.webpackChunkwebconnect||[]).push([[982],{6211:(e,t,n)=>{n.d(t,{Z:()=>E});var r=n(7462),a=n(885),o=n(5987),i=n(7294),s=n(2666),l=n(3291),c=n(8920),m=n(5653),d=n(3834),u={entering:{transform:"none"},entered:{transform:"none"}},p={enter:l.x9.enteringScreen,exit:l.x9.leavingScreen};const E=i.forwardRef((function(e,t){var n=e.children,l=e.disableStrictModeCompat,E=void 0!==l&&l,f=e.in,g=e.onEnter,h=e.onEntered,y=e.onEntering,v=e.onExit,b=e.onExited,w=e.onExiting,x=e.style,Z=e.timeout,S=void 0===Z?p:Z,C=e.TransitionComponent,N=void 0===C?s.ZP:C,k=(0,o.Z)(e,["children","disableStrictModeCompat","in","onEnter","onEntered","onEntering","onExit","onExited","onExiting","style","timeout","TransitionComponent"]),T=(0,c.Z)(),F=T.unstable_strictMode&&!E,j=i.useRef(null),O=(0,d.Z)(n.ref,t),P=(0,d.Z)(F?j:void 0,O),I=function(e){return function(t,n){if(e){var r=F?[j.current,t]:[t,n],o=(0,a.Z)(r,2),i=o[0],s=o[1];void 0===s?e(i):e(i,s)}}},J=I(y),M=I((function(e,t){(0,m.n)(e);var n=(0,m.C)({style:x,timeout:S},{mode:"enter"});e.style.webkitTransition=T.transitions.create("transform",n),e.style.transition=T.transitions.create("transform",n),g&&g(e,t)})),R=I(h),z=I(w),A=I((function(e){var t=(0,m.C)({style:x,timeout:S},{mode:"exit"});e.style.webkitTransition=T.transitions.create("transform",t),e.style.transition=T.transitions.create("transform",t),v&&v(e)})),q=I(b);return i.createElement(N,(0,r.Z)({appear:!0,in:f,nodeRef:F?j:void 0,onEnter:M,onEntered:R,onEntering:J,onExit:A,onExited:q,onExiting:z,timeout:S},k),(function(e,t){return i.cloneElement(n,(0,r.Z)({style:(0,r.Z)({transform:"scale(0)",visibility:"exited"!==e||f?void 0:"hidden"},u[e],x,n.props.style),ref:P},t))}))}))},3850:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(7294);const a=n(2788).ZP.div`
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
`;function i({autoComplete:e,type:t,id:n,value:o,error:i,helperText:s,onChange:l}){return r.createElement(a.Z,{required:!0,type:t,id:n,autoComplete:e,variant:"outlined",color:"primary",value:o,error:i,helperText:s,onChange:l})}function s({checked:e,onChange:t}){return r.createElement(o,null,r.createElement("input",{type:"checkbox",id:"persistLogin",onChange:t}),r.createElement("label",{htmlFor:"persistLogin"},"Keep me logged in"))}},1143:(e,t,n)=>{n.d(t,{z2:()=>a,zB:()=>r});const r=async(e,t)=>{try{t(await fetch("/auth/login",{method:"POST",headers:{"content-type":"application/json",Accept:"application/json"},body:JSON.stringify(e)}))}catch(e){console.log(e)}},a=async e=>{try{let t=await fetch("/auth/register",{method:"POST",headers:{"content-type":"application/json",Accept:"application/json"},body:JSON.stringify(e)});return await t.json()}catch(e){console.log(e)}}},7982:(e,t,n)=>{n.r(t),n.d(t,{default:()=>w});var r=n(7294),a=n(9711),o=n(6211),i=n(2318),s=n(3850),l=n(9704),c=n(2157),m=n(7397),d=n(7812),u=n(282),p=n(1270),E=n(1738),f=n(3084),g=n(8444),h=n(5953),y=n(1143),v=n(4199);const b=()=>{const e=(0,l.I0)(),[t,n]=r.useState({email:"",password:"",username:""}),[a,o]=r.useState(!1),[i,s]=r.useState({username:"",password:"",email:""}),[b,w]=r.useState({username:!1,password:!1,email:!1}),[x,Z]=r.useState(!1),[S,C]=r.useState(null),[N,k]=r.useState(!1);r.useEffect((()=>()=>clearInterval(S)),[]);const T=e=>{Z(e)};return r.createElement("form",{onSubmit:n=>{n.preventDefault(),T(!0),(0,y.z2)(t).then((t=>{if(T(!1),t.error){const e=Object.keys(t.error);let n={};e.map((e=>""!==t.error[e]&&(n[e]=!0))),((e,t)=>{w({...b,...e}),s({...i,...t})})(n,t.error)}else(0,v.cK)(t,(()=>{e((0,h.Pc)({open:!0,msg:"Registration successful ✌",severity:"success"})),T(!1),document.location="/"}))}))}},r.createElement("fieldset",null,r.createElement("div",{className:"formField"},r.createElement("label",{htmlFor:"username"}," User name "),r.createElement(g.Z,{type:"text",id:"username",value:t.username,error:b.username,helperText:i.username,onChange:e=>{const r=e.target.value;/[^a-z0-9_ ]/gi.test(r)?(s({...i,username:`user name cannot contain ${r[r.length-1]} `}),w({...b,username:!0})):r.includes(" ")?(s({...i,username:"user name cannot contain spaces"}),w({...b,username:!0})):isNaN(r[0])?(n({...t,username:r}),s({...i,username:""}),w({...b,username:!1})):(s({...i,username:"user name cannot start with a number"}),w({...b,username:!0}))},required:!0})),r.createElement("div",{className:"formField"},r.createElement("label",{htmlFor:"email"}," Email Address "),r.createElement(g.Z,{type:"email",id:"email",error:b.email,helperText:i.email,value:t.email,onChange:e=>{n({...t,email:e.target.value}),s({...i,email:""}),w({...b,email:!1})}})),r.createElement("div",{className:"formField"},r.createElement("label",{htmlFor:"new-password"}," Password "),r.createElement(c.Z,{required:!0,id:"new-password",variant:"outlined",onChange:e=>{n({...t,password:e.target.value})},color:"primary",type:N?"text":"password",autoComplete:"new-password",error:b.password,helperText:i.password,value:t.password,InputProps:{endAdornment:r.createElement(m.Z,{position:"end"},r.createElement(d.Z,{color:"secondary","aria-label":"Toggle password visibility",onClick:()=>{k(!N)}},N?r.createElement(p.Z,null):r.createElement(E.Z,null)))}}))),r.createElement("fieldset",null,r.createElement(g.J,{checked:a,onChange:()=>{o(!a)}})),r.createElement("fieldset",null,r.createElement("div",{className:"formField"},r.createElement(u.Z,{variant:"contained",disabled:x,color:"primary",type:"submit"},x?r.createElement(r.Fragment,null,"Register   ",r.createElement(f.Preloader,{use:f.Oval,size:20,strokeWidth:10,strokeColor:"#fff",duration:700})):"Register"))))},w=()=>r.createElement(o.Z,{in:!0},r.createElement("div",{className:"pageBody"},r.createElement("header",{className:"formHeader"},r.createElement(i.Z,{component:"h1"}," Welcome to ",r.createElement("strong",null," Webconnect ")," "),r.createElement(i.Z,{variant:"body1",className:"subText"}," Register your account ")),r.createElement("div",{className:"cta"},r.createElement(i.Z,{variant:"body1",className:"subText"}," Already have an account ? "),r.createElement(a.rU,{to:"/auth/login",className:"red underline"}," Log in ")),r.createElement(s.Z,null,r.createElement(b,null))))},4199:(e,t,n)=>{n.d(t,{$s:()=>a,DH:()=>o,cK:()=>r});const r=(e,t)=>{const{jwt:n,username:r,id:a}=e;sessionStorage.setItem("jwt",JSON.stringify(n)),localStorage.setItem("user",JSON.stringify({username:r,id:a})),t()},a=e=>{sessionStorage.setItem("jwt",JSON.stringify(e))},o=()=>{sessionStorage.clear(),localStorage.clear()}}}]);