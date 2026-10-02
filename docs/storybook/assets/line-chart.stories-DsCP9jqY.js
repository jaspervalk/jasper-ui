import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./monotone-HuNUjsj7.js";import{n as i,t as a}from"./line-Ds54L18h.js";import{n as o,t as s}from"./grid-C4ykyrAP.js";import{a as c,f as l,i as u,n as d,o as f,p,r as m,t as h,u as g}from"./gedeeld-C27eb9lz.js";import{n as _,t as v}from"./tooltip-DGqA1BDw.js";import{n as y,t as b}from"./x-axis-DlDFWlB9.js";import{n as x,t as S}from"./line-chart-ks1XgOE0.js";function C(e,t){this._context=e,this._t=t}function w(e){return new C(e,1)}function T(){return(T=e((()=>{C.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x=this._y=NaN,this._point=0},lineEnd:function(){0<this._t&&this._t<1&&this._point===2&&this._context.lineTo(this._x,this._y),(this._line||this._line!==0&&this._point===1)&&this._context.closePath(),this._line>=0&&(this._t=1-this._t,this._line=1-this._line)},point:function(e,t){switch(e=+e,t=+t,this._point){case 0:this._point=1,this._line?this._context.lineTo(e,t):this._context.moveTo(e,t);break;case 1:this._point=2;default:if(this._t<=0)this._context.lineTo(this._x,t),this._context.lineTo(e,t);else{var n=this._x*(1-this._t)+e*this._t;this._context.lineTo(n,this._y),this._context.lineTo(n,t)}}this._x=e,this._y=t}}})))()}var E,D,O,k,A,j;function M(){return(M=e((()=>{r(),T(),o(),i(),x(),v(),y(),g(),E=t(),D=l(1001),O=Array.from({length:12},(e,t)=>{let n=new Date(2025,9+t,1),r=Math.cos(Math.PI*2*n.getMonth()/12);return{date:n,dynamisch:Math.round((26+6*r+5*(D()-.5))*10)/10,vast:n.getFullYear()===2025?29.5:27.2}}),k={title:`Bibliotheek/Bklit/Lijngrafiek`,tags:[`autodocs`],decorators:c(),parameters:{layout:`fullscreen`,docs:{description:{component:u({naam:`line-chart`,wat:`hoe een waarde verandert door de tijd, voor één of meer reeksen.`,waarvoor:`een verloop dat je wilt volgen of vergelijken: stroomprijs per maand, waarde van een fonds, bezoekers per dag. Al in gebruik in het portefeuille-dashboard van het lab en in de catalogus (chart-thema).`,beperkingen:"de y-as begint bij positieve waarden altijd bij 0. Een portefeuille van € 180.000 die een paar procent schommelt wordt dan een platte streep bovenin; teken in dat geval een verschoven reeks en toon de echte waarde in tooltip en bijschrift (zoals `Waardeverloop` in het lab). Geen getallen op de y-as. Datums op de x-as staan zonder jaartal; loopt de reeks over meer dan een jaar, dan vallen labels met dezelfde tekst weg (*1 jan* komt maar één keer). De onthulling van links naar rechts negeert *beweging beperken*: geef `animationDuration={0}` via `useReducedMotion`. Tooltip alleen met de muis."})}}}},A={name:`Twee lijnen`,render:function(){let e=p();return(0,E.jsxs)(m,{titel:`Stroomprijs: dynamisch tegen vast`,uitleg:`De dynamische prijs volgt de seizoenen; het vaste tarief is een trap die één keer per jaar verandert.`,samenvatting:`Dynamisch tussen ongeveer 18 en 33 cent per kWh, hoog in de winter. Vast 29,5 cent tot en met december 2025, daarna 27,2 cent.`,children:[(0,E.jsxs)(S,{animationDuration:e,data:O,aspectRatio:``,className:d,children:[(0,E.jsx)(s,{horizontal:!0,numTicksRows:4}),(0,E.jsx)(a,{dataKey:`vast`,curve:w,stroke:`var(--chart-3)`,strokeWidth:2}),(0,E.jsx)(a,{dataKey:`dynamisch`,curve:n,stroke:`var(--chart-1)`,strokeWidth:2}),(0,E.jsx)(b,{numTicks:6}),(0,E.jsx)(_,{rows:e=>[{color:`var(--chart-1)`,label:`Dynamisch`,value:`${f(e.dynamisch)} ct`},{color:`var(--chart-3)`,label:`Vast`,value:`${f(e.vast)} ct`}]})]}),(0,E.jsx)(h,{items:[{label:`Dynamisch`,kleur:`var(--chart-1)`,lijn:!0},{label:`Vast tarief`,kleur:`var(--chart-3)`,lijn:!0}]})]})}},j=[`TweeLijnen`],A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  name: "Twee lijnen",
  render: function Render() {
    const duur = useAnimatieduur();
    return <Voorbeeld titel="Stroomprijs: dynamisch tegen vast" uitleg="De dynamische prijs volgt de seizoenen; het vaste tarief is een trap die één keer per jaar verandert." samenvatting="Dynamisch tussen ongeveer 18 en 33 cent per kWh, hoog in de winter. Vast 29,5 cent tot en met december 2025, daarna 27,2 cent.">
        <LineChart animationDuration={duur} data={prijzen} aspectRatio="" className={TIJDVORM}>
          <Grid horizontal numTicksRows={4} />
          <Line dataKey="vast" curve={curveStepAfter} stroke="var(--chart-3)" strokeWidth={2} />
          <Line dataKey="dynamisch" curve={curveMonotoneX} stroke="var(--chart-1)" strokeWidth={2} />
          <XAxis numTicks={6} />
          <ChartTooltip rows={p => [{
          color: "var(--chart-1)",
          label: "Dynamisch",
          value: \`\${decimaal(p.dynamisch as number)} ct\`
        }, {
          color: "var(--chart-3)",
          label: "Vast",
          value: \`\${decimaal(p.vast as number)} ct\`
        }]} />
        </LineChart>
        <Sleutel items={[{
        label: "Dynamisch",
        kleur: "var(--chart-1)",
        lijn: true
      }, {
        label: "Vast tarief",
        kleur: "var(--chart-3)",
        lijn: true
      }]} />
      </Voorbeeld>;
  }
}`,...A.parameters?.docs?.source}}}})))()}M();export{A as TweeLijnen,j as __namedExportsOrder,k as default};