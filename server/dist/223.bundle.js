"use strict";(self.webpackChunkwebconnect=self.webpackChunkwebconnect||[]).push([[223],{3850:(e,t,a)=>{a.d(t,{Z:()=>o});var r=a(7294);const n=a(2788).ZP.div`
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
`,o=({children:e})=>r.createElement(n,null,e)},8444:(e,t,a)=>{a.d(t,{J:()=>s,Z:()=>l});var r=a(7294),n=a(2157);const o=a(2788).ZP.div`
	display: flex;
	justify-content: flex-end;

	& > input {
		margin-right: 10px;
	}
`;function l({autoComplete:e,type:t,id:a,value:o,error:l,helperText:s,onChange:c}){return r.createElement(n.Z,{required:!0,type:t,id:a,autoComplete:e,variant:"outlined",color:"primary",value:o,error:l,helperText:s,onChange:c})}function s({checked:e,onChange:t}){return r.createElement(o,null,r.createElement("input",{type:"checkbox",id:"persistLogin",onChange:t}),r.createElement("label",{htmlFor:"persistLogin"},"Keep me logged in"))}},1143:(e,t,a)=>{a.d(t,{z2:()=>n,zB:()=>r});const r=async(e,t)=>{try{t(await fetch("/auth/login",{method:"POST",headers:{"content-type":"application/json",Accept:"application/json"},body:JSON.stringify(e)}))}catch(e){console.log(e)}},n=async e=>{try{let t=await fetch("/auth/register",{method:"POST",headers:{"content-type":"application/json",Accept:"application/json"},body:JSON.stringify(e)});return await t.json()}catch(e){console.log(e)}}},2223:(e,t,a)=>{a.r(t),a.d(t,{default:()=>w});var r=a(7294),n=a(9711),o=a(6211),l=a(2318),s=a(3850),c=a(2157),i=a(7397),m=a(7812),u=a(282),d=a(1270),p=a(1738),g=a(3084),h=a(9704),y=a(8444),E=a(5953),f=a(1143),b=a(4199);const v=({login:e})=>{const t=(0,h.I0)(),[a,n]=r.useState(!1),[o,l]=r.useState(!1),[s,v]=r.useState(!1),[w,x]=r.useState({username:"",password:""}),[C,Z]=r.useState({username:"",password:""}),[k,S]=r.useState({username:!1,password:!1}),[N,F]=r.useState(!1),[P,T]=r.useState(!1),L=e=>{v(e)},j=e=>{t((0,E.Pc)({open:!0,msg:e,severity:"error"}))};return r.createElement("form",{onSubmit:e=>{e.preventDefault(),L(!0);const a={username:w.username,password:w.password,persisLogin:N};(0,f.zB)(a,(async e=>{L(!1);const a=await e.json();401===e.status?j(a.error):200===e.status?(0,b.cK)(a,(()=>{t((0,E.Pc)({open:!0,msg:"Log in successful ✌",severity:"success"})),L(!1),document.location="/"})):j("Something went wrong")}))}},r.createElement("fieldset",null,r.createElement("div",{className:"formField"},r.createElement("label",{htmlFor:"username"}," Username "),r.createElement(y.Z,{type:"text",autoComplete:"username",id:"username",error:k.username,helperText:C.username,value:w.username,onChange:e=>{T(!1);const t=e.target.value;/[^a-z0-9_ ]/gi.test(t)?(Z({...C,username:"Invalid name"}),S({...k,username:!0})):(x({...w,username:t.trimLeft()}),Z({...C,username:""}),S({...k,username:!1}))}})),r.createElement("div",{className:"formField"},r.createElement("label",{htmlFor:"current-password"}," Password "),r.createElement(c.Z,{required:!0,autoComplete:"current-password",id:"current-password",variant:"outlined",onChange:e=>{x({...w,password:e.target.value}),T(!1)},color:"primary",type:o?"text":"password",error:k.password,helperText:C.password,value:w.password,InputProps:{endAdornment:r.createElement(i.Z,{position:"end"},r.createElement(m.Z,{color:"secondary","aria-label":"Toggle password visibility",onClick:()=>{l(!o)}},o?r.createElement(d.Z,null):r.createElement(p.Z,null)))}}))),r.createElement("fieldset",null,r.createElement(y.J,{checked:N,onChange:()=>F(!N)})),r.createElement("fieldset",null,r.createElement("div",{className:"formField"},r.createElement(u.Z,{variant:"contained",color:"primary",disabled:s,classes:{root:"button"},type:"submit"},s?r.createElement(r.Fragment,null,"Login   ",r.createElement(g.Preloader,{use:g.Oval,size:20,strokeWidth:10,strokeColor:"#fff",duration:700})):"Login"))),P&&r.createElement(Snackbar,{anchorOrigin:{vertical:"bottom",horizontal:"center"},open:alert.open,onClose:()=>{T(!1)},color:"primary",key:"bottomright"},r.createElement(Alert,{severity:alert.type,color:alert.type,variant:"filled"},alert.text)))},w=()=>r.createElement(o.Z,{in:!0},r.createElement("div",{className:"pageBody"},r.createElement("header",{className:"formHeader"},r.createElement(l.Z,{component:"h1"}," ",r.createElement("span",{className:"textYellow"}," Hi there, ")," Welcome back 👏 "),r.createElement(l.Z,{variant:"body1",className:"subText"}," Log in with the data you entered during your registration. ")),r.createElement("div",{className:"cta"},r.createElement(l.Z,{variant:"body1",className:"subText"}," Don't have an account ? "),r.createElement(n.rU,{to:"/auth/signup",className:"red underline"}," Register now ")),r.createElement(s.Z,null,r.createElement(v,null))))}}]);