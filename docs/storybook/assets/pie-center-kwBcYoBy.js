import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{a as n,i as r,r as i}from"./pie-context-Di4AdiYL.js";import{n as a,t as o}from"./utils-umGKk4pA.js";import{n as s,r as c,t as l}from"./chart-stat-flow-DJMNZCWO.js";import{i as u,n as d,r as f,t as p}from"./chart-center-typography-DSjieYet.js";function m({defaultLabel:e=`Total`,formatOptions:t=s,children:i,className:a=``,valueClassName:c=f,labelClassName:u=d,prefix:m,suffix:g}){let{data:_,totalValue:v,innerRadius:y,geometryScrubbing:b}=n(),{hoveredIndex:x}=r(),S=b?null:x,C=S===null?null:_[S],w=C?C.value:v,T=C?C.label:e,E=y*2-16;return y<=0?null:i&&C?(0,h.jsx)(`div`,{className:o(p,`flex items-center justify-center`,a),style:{width:E,height:E},children:i({value:w,label:T,isHovered:S!==null,data:C})}):(0,h.jsx)(`div`,{className:o(p,`flex flex-col items-center justify-center text-center`,a),style:{width:E,height:E},children:(0,h.jsx)(l,{formatOptions:t,label:T,labelClassName:u,prefix:m,suffix:g,value:w,valueClassName:c})})}var h;function g(){return(g=e((()=>{a(),u(),c(),i(),h=t(),m.displayName=`PieCenter`,m.__docgenInfo={description:`PieCenter displays content in the center of a donut/pie chart.

This component renders as pure HTML (not inside SVG foreignObject) to avoid
Safari's WebKit bug #23113 where HTML content with CSS transforms/opacity
inside foreignObject renders at incorrect positions.

The parent PieChart uses CSS Grid stacking to overlay this HTML content
on top of the SVG slices.`,methods:[],displayName:`PieCenter`,props:{defaultLabel:{required:!1,tsType:{name:`string`},description:`Label shown below the value. Default: "Total" when not hovering`,defaultValue:{value:`"Total"`,computed:!1}},formatOptions:{required:!1,tsType:{name:`ChartStatFlowFormat`},description:`Format options for NumberFlow. Default: standard notation`,defaultValue:{value:`{
  notation: "standard",
  maximumFractionDigits: 0,
}`,computed:!1}},children:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(props: {
  value: number;
  label: string;
  isHovered: boolean;
  data: { label: string; value: number; color?: string; fill?: string };
}) => ReactNode`,signature:{arguments:[{type:{name:`signature`,type:`object`,raw:`{
  value: number;
  label: string;
  isHovered: boolean;
  data: { label: string; value: number; color?: string; fill?: string };
}`,signature:{properties:[{key:`value`,value:{name:`number`,required:!0}},{key:`label`,value:{name:`string`,required:!0}},{key:`isHovered`,value:{name:`boolean`,required:!0}},{key:`data`,value:{name:`signature`,type:`object`,raw:`{ label: string; value: number; color?: string; fill?: string }`,signature:{properties:[{key:`label`,value:{name:`string`,required:!0}},{key:`value`,value:{name:`number`,required:!0}},{key:`color`,value:{name:`string`,required:!1}},{key:`fill`,value:{name:`string`,required:!1}}]},required:!0}}]}},name:`props`}],return:{name:`ReactNode`}}},description:`Custom render function for complete control over center content`},className:{required:!1,tsType:{name:`string`},description:`Additional class name for the container`,defaultValue:{value:`""`,computed:!1}},valueClassName:{required:!1,tsType:{name:`string`},description:`Class name for the value text. Scales with center size via container queries.`,defaultValue:{value:`"font-bold tabular-nums leading-none text-[clamp(0.75rem,22cqw,1.875rem)]"`,computed:!1}},labelClassName:{required:!1,tsType:{name:`string`},description:`Class name for the label text. Scales with center size via container queries.`,defaultValue:{value:`"max-w-full truncate leading-tight text-[clamp(0.75rem,9cqw,0.875rem)]"`,computed:!1}},prefix:{required:!1,tsType:{name:`string`},description:`Prefix to show before the number (e.g., "$")`},suffix:{required:!1,tsType:{name:`string`},description:`Suffix to show after the number (e.g., "%")`}}}})))()}export{g as n,m as t};