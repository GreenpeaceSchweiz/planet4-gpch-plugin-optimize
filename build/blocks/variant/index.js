(()=>{"use strict";var e,t={728:()=>{const e=window.wp.blocks,t=window.wp.i18n,a=window.wp.blockEditor,n=window.wp.components,i=window.wp.primitives,r=window.ReactJSXRuntime,l=(0,r.jsx)(i.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:(0,r.jsx)(i.Path,{fillRule:"evenodd",d:"M6.5 8a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM8 5a3 3 0 100 6 3 3 0 000-6zm6.5 11a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zm1.5-3a3 3 0 100 6 3 3 0 000-6zM5.47 17.41a.75.75 0 001.06 1.06L18.47 6.53a.75.75 0 10-1.06-1.06L5.47 17.41z",clipRule:"evenodd"})}),o=JSON.parse('{"UU":"planet4-gpch-plugin-optimize/variant"}');(0,e.registerBlockType)(o.UU,{icon:function(){return(0,r.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",className:"icon",viewBox:"0 0 30.7 30.7",children:[(0,r.jsx)("path",{fill:"#131313",d:"M30 30.7h-8V3.5a1.6 1.6 0 0 1 1.6-1.6h4.7c1 0 1.6.8 1.6 1.6v27.2Zm-6.7-1.3h5.3V3.5c0-.2-.1-.3-.2-.3h-4.8l-.2.1v26.1Zm-4 1.3h-8V10c0-.8.7-1.4 1.5-1.4h5c.9 0 1.5.6 1.5 1.4v20.7Zm-6.6-1.3H18V10l-.2-.1h-5l-.2.1v19.4zm-4 1.3h-8V16.4c0-.8.7-1.3 1.4-1.3h5.3c.7 0 1.3.5 1.3 1.3zm-6.6-1.3h5.3v-13H2.1Z"}),(0,r.jsx)("path",{fill:"#121212",d:"M22.9 2.7h6.3v27h-6.3z"})]})},edit:function({attributes:e,setAttributes:i,context:o}){let{variantId:s,variantName:p,targetPercentage:c}=e;if(void 0===s){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=8;s="";for(let a=0;a<t;a++)s+=e.charAt(Math.floor(Math.random()*e.length));i({variantId:s})}return void 0===p&&(p=s),void 0===c&&(c=50),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(a.InspectorControls,{children:[(0,r.jsxs)(n.PanelBody,{title:(0,t.__)("Variant Settings","planet4-gpch-plugin-optimize"),children:[(0,r.jsxs)("p",{children:[(0,r.jsx)("b",{children:"Variant ID: "}),s||""]}),(0,r.jsx)(n.TextControl,{__nextHasNoMarginBottom:!0,__next40pxDefaultSize:!0,label:(0,t.__)("Variant Name","planet4-gpch-plugin-optimize"),value:p||"",onChange:e=>i({variantName:e}),help:(0,t.__)("Used to identify the Variant in Mixpanel. Feel free to use a readable name. Don't change once the experiment has started!","planet4-gpch-plugin-optimize")})]}),(0,r.jsx)(n.PanelBody,{title:(0,t.__)("Targeting","planet4-gpch-plugin-optimize"),children:(0,r.jsx)(n.RangeControl,{__nextHasNoMarginBottom:!0,__next40pxDefaultSize:!0,label:"Target group percentage",afterIcon:l,value:c,onChange:e=>i({targetPercentage:e}),min:0,max:100,step:1,marks:[{value:25,label:"25%"},{value:50,label:"50%"},{value:75,label:"75%"},{value:100,label:"100%"}],railColor:"red",trackColor:"green"})})]}),(0,r.jsx)("div",{children:e.variantId===o["content-optimization/editorSelectedVariantId"]&&(0,r.jsx)("div",{...(0,a.useBlockProps)(),children:(0,r.jsx)(a.InnerBlocks,{})})})]})},save:function({attributes:e}){return(0,r.jsx)("div",{...a.useBlockProps.save({className:"gp-optimize-variant"}),"data-target-percentage":e.targetPercentage,"data-variant-id":e.variantId,"data-variant-name":e.variantName,children:(0,r.jsx)(a.InnerBlocks.Content,{})})}})}},a={};function n(e){var i=a[e];if(void 0!==i)return i.exports;var r=a[e]={exports:{}};return t[e](r,r.exports,n),r.exports}n.m=t,e=[],n.O=(t,a,i,r)=>{if(!a){var l=1/0;for(c=0;c<e.length;c++){for(var[a,i,r]=e[c],o=!0,s=0;s<a.length;s++)(!1&r||l>=r)&&Object.keys(n.O).every((e=>n.O[e](a[s])))?a.splice(s--,1):(o=!1,r<l&&(l=r));if(o){e.splice(c--,1);var p=i();void 0!==p&&(t=p)}}return t}r=r||0;for(var c=e.length;c>0&&e[c-1][2]>r;c--)e[c]=e[c-1];e[c]=[a,i,r]},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={222:0,290:0};n.O.j=t=>0===e[t];var t=(t,a)=>{var i,r,[l,o,s]=a,p=0;if(l.some((t=>0!==e[t]))){for(i in o)n.o(o,i)&&(n.m[i]=o[i]);if(s)var c=s(n)}for(t&&t(a);p<l.length;p++)r=l[p],n.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return n.O(c)},a=globalThis.webpackChunkplanet4_gpch_pluigin_optimize=globalThis.webpackChunkplanet4_gpch_pluigin_optimize||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))})();var i=n.O(void 0,[290],(()=>n(728)));i=n.O(i)})();