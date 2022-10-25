"use strict";(self.webpackChunkwebconnect=self.webpackChunkwebconnect||[]).push([[982],{3850:(e,t,a)=>{a.d(t,{Z:()=>l});var r=a(7294);const n=a(2788).ZP.div`
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
`,l=({children:e})=>r.createElement(n,null,e)},8444:(e,t,a)=>{a.d(t,{J:()=>s,Z:()=>o});var r=a(7294),n=a(2157);const l=a(2788).ZP.div`
	display: flex;
	justify-content: flex-end;

	& > input {
		margin-right: 10px;
	}
`;function o({autoComplete:e,type:t,id:a,value:l,error:o,helperText:s,onChange:c}){return r.createElement(n.Z,{required:!0,type:t,id:a,autoComplete:e,variant:"outlined",color:"primary",value:l,error:o,helperText:s,onChange:c})}function s({checked:e,onChange:t}){return r.createElement(l,null,r.createElement("input",{type:"checkbox",id:"persistLogin",onChange:t}),r.createElement("label",{htmlFor:"persistLogin"},"Keep me logged in"))}},1143:(e,t,a)=>{a.d(t,{z2:()=>n,zB:()=>r});const r=async(e,t)=>{try{t(await fetch("/auth/login",{method:"POST",headers:{"content-type":"application/json",Accept:"application/json"},body:JSON.stringify(e)}))}catch(e){console.log(e)}},n=async e=>{try{let t=await fetch("/auth/register",{method:"POST",headers:{"content-type":"application/json",Accept:"application/json"},body:JSON.stringify(e)});return await t.json()}catch(e){console.log(e)}}},7982:(e,t,a)=>{a.r(t),a.d(t,{default:()=>w});var r=a(7294),n=a(9711),l=a(6211),o=a(2318),s=a(3850),c=a(9704),i=a(2157),m=a(7397),u=a(7812),d=a(282),p=a(1270),h=a(1738),g=a(3084),E=a(8444),f=a(5953),y=a(1143),b=a(4199);const v=()=>{const e=(0,c.I0)(),[t,a]=r.useState({email:"",password:"",username:""}),[n,l]=r.useState(!1),[o,s]=r.useState({username:"",password:"",email:""}),[v,w]=r.useState({username:!1,password:!1,email:!1}),[Z,x]=r.useState(!1),[C,N]=r.useState(null),[k,S]=r.useState(!1);r.useEffect((()=>()=>clearInterval(C)),[]);const F=e=>{x(e)};return r.createElement("form",{onSubmit:a=>{a.preventDefault(),F(!0),(0,y.z2)(t).then((t=>{if(F(!1),t.error){const e=Object.keys(t.error);let a={};e.map((e=>""!==t.error[e]&&(a[e]=!0))),((e,t)=>{w({...v,...e}),s({...o,...t})})(a,t.error)}else(0,b.cK)(t,(()=>{e((0,f.Pc)({open:!0,msg:"Registration successful ✌",severity:"success"})),F(!1),document.location="/"}))}))}},r.createElement("fieldset",null,r.createElement("div",{className:"formField"},r.createElement("label",{htmlFor:"username"}," User name "),r.createElement(E.Z,{type:"text",id:"username",value:t.username,error:v.username,helperText:o.username,onChange:e=>{const r=e.target.value;/[^a-z0-9_ ]/gi.test(r)?(s({...o,username:`user name cannot contain ${r[r.length-1]} `}),w({...v,username:!0})):r.includes(" ")?(s({...o,username:"user name cannot contain spaces"}),w({...v,username:!0})):isNaN(r[0])?(a({...t,username:r}),s({...o,username:""}),w({...v,username:!1})):(s({...o,username:"user name cannot start with a number"}),w({...v,username:!0}))},required:!0})),r.createElement("div",{className:"formField"},r.createElement("label",{htmlFor:"email"}," Email Address "),r.createElement(E.Z,{type:"email",id:"email",error:v.email,helperText:o.email,value:t.email,onChange:e=>{a({...t,email:e.target.value}),s({...o,email:""}),w({...v,email:!1})}})),r.createElement("div",{className:"formField"},r.createElement("label",{htmlFor:"new-password"}," Password "),r.createElement(i.Z,{required:!0,id:"new-password",variant:"outlined",onChange:e=>{a({...t,password:e.target.value})},color:"primary",type:k?"text":"password",autoComplete:"new-password",error:v.password,helperText:o.password,value:t.password,InputProps:{endAdornment:r.createElement(m.Z,{position:"end"},r.createElement(u.Z,{color:"secondary","aria-label":"Toggle password visibility",onClick:()=>{S(!k)}},k?r.createElement(p.Z,null):r.createElement(h.Z,null)))}}))),r.createElement("fieldset",null,r.createElement(E.J,{checked:n,onChange:()=>{l(!n)}})),r.createElement("fieldset",null,r.createElement("div",{className:"formField"},r.createElement(d.Z,{variant:"contained",disabled:Z,color:"primary",type:"submit"},Z?r.createElement(r.Fragment,null,"Register   ",r.createElement(g.Preloader,{use:g.Oval,size:20,strokeWidth:10,strokeColor:"#fff",duration:700})):"Register"))))},w=()=>r.createElement(l.Z,{in:!0},r.createElement("div",{className:"pageBody"},r.createElement("header",{className:"formHeader"},r.createElement(o.Z,{component:"h1"}," Welcome to ",r.createElement("strong",null," Webconnect ")," "),r.createElement(o.Z,{variant:"body1",className:"subText"}," Register your account ")),r.createElement("div",{className:"cta"},r.createElement(o.Z,{variant:"body1",className:"subText"}," Already have an account ? "),r.createElement(n.rU,{to:"/auth/login",className:"red underline"}," Log in ")),r.createElement(s.Z,null,r.createElement(v,null))))}}]);