import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-Q1GcV6wX.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{a as r,d as i,i as a,l as o,r as s,t as c,u as l}from"./gedeeld-C27eb9lz.js";import{n as u,t as d}from"./pie-center-kwBcYoBy.js";import{c as f,f as p,n as m,o as h,t as g,u as _}from"./legend-DSpor9em.js";import{i as v,n as y,r as b,t as x}from"./pie-slice-Bdt6taYc.js";var S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{S=t(),g(),u(),v(),y(),l(),C=n(),w=[{label:`Warmtepomp`,value:182,color:`var(--chart-1)`},{label:`Overig`,value:64,color:`var(--chart-2)`},{label:`Wassen en drogen`,value:46,color:`var(--chart-3)`},{label:`Koken`,value:38,color:`var(--chart-4)`},{label:`Verlichting`,value:21,color:`var(--chart-5)`}],T=w.reduce((e,t)=>e+t.value,0),E=[{label:`Instagram`,value:5240,color:`var(--chart-1)`},{label:`Nieuwsbrief`,value:3110,color:`var(--chart-2)`},{label:`Direct`,value:2380,color:`var(--chart-3)`},{label:`Zoekmachine`,value:1460,color:`var(--chart-4)`}],D=E.reduce((e,t)=>e+t.value,0),O={title:`Bibliotheek/Bklit/Taartgrafiek`,tags:[`autodocs`],decorators:r(),parameters:{layout:`fullscreen`,docs:{description:{component:a({naam:`pie-chart`,wat:`hoe een geheel verdeeld is over een paar delen. Als volle taart of als donut met een getal in het midden.`,waarvoor:`een verdeling met hooguit vijf delen die samen 100% zijn: beleggingen naar soort, stroom per apparaat, bezoekers per kanaal. Zet de getallen er als tekst of tabel naast; een taart toont verhoudingen, geen precieze waarden.`,beperkingen:"vijf kleuren (`--chart-1` tot `--chart-5`); in de huisstijlen van de werkbank zijn dat grijstinten. De svg is `aria-hidden` en de punten reageren alleen op de muis, niet op het toetsenbord: de legenda of tabel ernaast draagt de informatie. Een doel of vergelijking toont de taart niet zelf (zie de portefeuille in het lab: twee ringen, nu en doel)."})}}}},k={name:`Verdeling (volle taart)`,render:function(){let[e,t]=(0,S.useState)(null);return(0,C.jsx)(s,{titel:`Stroomverbruik in september`,uitleg:`Een volle taart met een legenda ernaast. Wijs een punt of een regel in de legenda aan: de andere vervagen.`,samenvatting:`Totaal ${o(T)} kWh. ${w.map(e=>`${e.label} ${o(e.value)} kWh`).join(`, `)}.`,children:(0,C.jsxs)(`div`,{className:`grid items-center gap-6 sm:grid-cols-[minmax(0,16rem)_minmax(0,22rem)] sm:gap-10`,children:[(0,C.jsx)(b,{data:w,hoveredIndex:e,onHoverChange:t,padAngle:.02,className:`mx-auto max-w-64`,children:w.map((e,t)=>(0,C.jsx)(x,{index:t,hoverEffect:`grow`,showGlow:!1},e.label))}),(0,C.jsx)(p,{items:w.map(e=>({...e,maxValue:T})),hoveredIndex:e,onHoverChange:t,children:(0,C.jsxs)(_,{className:`flex items-center gap-3`,children:[(0,C.jsx)(h,{}),(0,C.jsx)(f,{className:`flex-1 text-sm`}),(0,C.jsx)(m,{className:`font-mono text-sm text-foreground tabular-nums`,formatValue:e=>`${o(e)} kWh`,showPercentage:!0,formatPercentage:e=>i(e/100),percentageClassName:`w-10 text-right`})]})})]})})}},A={name:`Donut met totaal`,render:()=>(0,C.jsxs)(s,{titel:`Bezoekers per kanaal, week voor de kaartverkoop`,uitleg:`Met een gat in het midden komt er ruimte voor één getal. Wijs een stuk aan en het midden toont dat kanaal.`,samenvatting:`${o(D)} bezoekers. ${E.map(e=>`${e.label} ${o(e.value)}`).join(`, `)}.`,children:[(0,C.jsx)(`div`,{className:`mx-auto w-full max-w-72`,children:(0,C.jsxs)(b,{data:E,innerRadius:78,padAngle:.03,cornerRadius:4,children:[E.map((e,t)=>(0,C.jsx)(x,{index:t,showGlow:!1},e.label)),(0,C.jsx)(d,{defaultLabel:`bezoekers`})]})}),(0,C.jsx)(c,{className:`justify-center`,items:E.map(e=>({label:e.label,kleur:e.color,waarde:o(e.value)}))})]})},j=[`Verdeling`,`Donut`],k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: "Verdeling (volle taart)",
  render: function Render() {
    const [actief, setActief] = useState<number | null>(null);
    return <Voorbeeld titel="Stroomverbruik in september" uitleg="Een volle taart met een legenda ernaast. Wijs een punt of een regel in de legenda aan: de andere vervagen." samenvatting={\`Totaal \${getal(stroomTotaal)} kWh. \${stroom.map(d => \`\${d.label} \${getal(d.value)} kWh\`).join(", ")}.\`}>
        <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,16rem)_minmax(0,22rem)] sm:gap-10">
          <PieChart data={stroom} hoveredIndex={actief} onHoverChange={setActief} padAngle={0.02} className="mx-auto max-w-64">
            {stroom.map((d, i) => <PieSlice key={d.label} index={i} hoverEffect="grow" showGlow={false} />)}
          </PieChart>
          <Legend items={stroom.map(d => ({
          ...d,
          maxValue: stroomTotaal
        }))} hoveredIndex={actief} onHoverChange={setActief}>
            <LegendItem className="flex items-center gap-3">
              <LegendMarker />
              <LegendLabel className="flex-1 text-sm" />
              <LegendValue className="font-mono text-sm text-foreground tabular-nums" formatValue={v => \`\${getal(v)} kWh\`} showPercentage formatPercentage={p => procent(p / 100)} percentageClassName="w-10 text-right" />
            </LegendItem>
          </Legend>
        </div>
      </Voorbeeld>;
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  name: "Donut met totaal",
  render: () => <Voorbeeld titel="Bezoekers per kanaal, week voor de kaartverkoop" uitleg="Met een gat in het midden komt er ruimte voor één getal. Wijs een stuk aan en het midden toont dat kanaal." samenvatting={\`\${getal(kanalenTotaal)} bezoekers. \${kanalen.map(d => \`\${d.label} \${getal(d.value)}\`).join(", ")}.\`}>
      <div className="mx-auto w-full max-w-72">
        <PieChart data={kanalen} innerRadius={78} padAngle={0.03} cornerRadius={4}>
          {kanalen.map((d, i) => <PieSlice key={d.label} index={i} showGlow={false} />)}
          <PieCenter defaultLabel="bezoekers" />
        </PieChart>
      </div>
      <Sleutel className="justify-center" items={kanalen.map(d => ({
      label: d.label,
      kleur: d.color,
      waarde: getal(d.value)
    }))} />
    </Voorbeeld>
}`,...A.parameters?.docs?.source}}}})))()}M();export{A as Donut,k as Verdeling,j as __namedExportsOrder,O as default};