import { useState, useCallback } from "react";
import PlotScene from "./components/PlotScene";
import ApartmentScene from "./components/ApartmentScene";
import RoomScene from "./components/RoomScene";
import FloorPlan from "./components/FloorPlan";
import { PLOTS, FLOORS, STATUS_COLOR, STATUS_BG } from "./data";

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const DARK = {
  bg:          "#070700",
  surface:     "#0d0d00",
  border:      "#2a2000",
  borderGold:  "#b8960c",
  gold:        "#d4af37",
  text:        "#e8d8a0",
  textMuted:   "rgba(232,216,160,0.50)",
  textDim:     "rgba(232,216,160,0.28)",
  inputBg:     "#0a0900",
  cardBg:      "#0a0900",
  sidebarBg:   "linear-gradient(160deg, #111100 0%, #0a0900 100%)",
  headerBg:    "linear-gradient(90deg, #0a0900 0%, #111000 50%, #0a0900 100%)",
  overlayBg:   "rgba(7,7,0,0.90)",
  popupBg:     "linear-gradient(160deg, #0f0e00, #0a0900)",
  toastBg:     "linear-gradient(135deg, #1a1200, #2a1e00)",
  sideTopBg:   "#0f0e00",
  miniMapBg:   "#050500",
  miniRoad:    "#2a1e00",
  modalBg:     "linear-gradient(160deg, #0f0e00, #0a0900)",
};
const LIGHT = {
  bg:          "#f5f0e8",
  surface:     "#ffffff",
  border:      "#ddd0aa",
  borderGold:  "#a07808",
  gold:        "#7a5500",
  text:        "#221500",
  textMuted:   "rgba(34,21,0,0.55)",
  textDim:     "rgba(34,21,0,0.35)",
  inputBg:     "#ffffff",
  cardBg:      "#ffffff",
  sidebarBg:   "linear-gradient(160deg, #fffdf5 0%, #f5f0e8 100%)",
  headerBg:    "linear-gradient(90deg, #1e1600 0%, #2e2000 50%, #1e1600 100%)",
  overlayBg:   "rgba(255,252,240,0.96)",
  popupBg:     "linear-gradient(160deg, #fffdf5, #f5f0e8)",
  toastBg:     "linear-gradient(135deg, #1e1600, #2e2000)",
  sideTopBg:   "#fffdf5",
  miniMapBg:   "#e8e0c8",
  miniRoad:    "#c8b880",
  modalBg:     "linear-gradient(160deg, #fffdf5, #f5f0e8)",
};

const gradGold = "linear-gradient(135deg, #b8960c 0%, #d4af37 50%, #f0d060 100%)";

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const GoldDivider = ({ T }) => (
  <div style={{ height:1, background:`linear-gradient(90deg,transparent,${T.borderGold},transparent)`, margin:"10px 0" }} />
);

const StatusBadge = ({ status }) => (
  <span style={{
    display:"inline-flex", alignItems:"center", gap:5,
    padding:"3px 10px", borderRadius:20,
    background:STATUS_BG[status], border:`1px solid ${STATUS_COLOR[status]}55`,
    color:STATUS_COLOR[status],
    fontFamily:"'Montserrat',sans-serif", fontSize:9, fontWeight:700,
    letterSpacing:"0.14em", textTransform:"uppercase",
  }}>
    <span style={{ width:6,height:6,borderRadius:"50%",background:STATUS_COLOR[status],display:"inline-block" }}/>
    {status}
  </span>
);

const GoldBtn = ({ children, onClick, small, outline, full, disabled, T }) => (
  <button onClick={onClick} disabled={disabled} style={{
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6,
    padding: small ? "6px 14px" : "11px 22px",
    width: full ? "100%" : "auto",
    borderRadius:6,
    border: outline ? `1px solid ${T.borderGold}` : "none",
    background: outline ? "transparent" : gradGold,
    color: outline ? T.gold : "#0a0800",
    fontFamily:"'Montserrat',sans-serif", fontWeight:700,
    fontSize: small ? 10 : 12, letterSpacing:"0.12em", textTransform:"uppercase",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1, transition:"all 0.2s",
    boxShadow: outline ? "none" : "0 4px 20px rgba(184,150,12,0.3)",
  }}>
    {children}
  </button>
);

const SideLabel = ({ children, T }) => (
  <div style={{
    fontFamily:"'Montserrat',sans-serif", fontSize:9, fontWeight:700,
    letterSpacing:"0.2em", textTransform:"uppercase", color:T.borderGold, marginBottom:8,
  }}>{children}</div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab]         = useState("plots");
  const [nightMode, setNightMode]         = useState(true);
  const [plotFilter, setPlotFilter]       = useState("all");
  const [searchQuery, setSearchQuery]     = useState("");
  const [selectedPlot, setSelectedPlot]   = useState(null);
  const [popupPos, setPopupPos]           = useState({ x:0, y:0 });
  const [zoomPlot, setZoomPlot]           = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedApt, setSelectedApt]     = useState(null);
  const [aptView, setAptView]             = useState("exterior");
  const [selectedRoom, setSelectedRoom]   = useState(null);
  const [bookModal, setBookModal]         = useState(null);
  const [bookingDone, setBookingDone]     = useState(false);
  const [enquiryForm, setEnquiryForm]     = useState({ name:"", phone:"", email:"" });

  const T = nightMode ? DARK : LIGHT;

  const plotCounts = {
    available: PLOTS.filter(p=>p.status==="available").length,
    sold:      PLOTS.filter(p=>p.status==="sold").length,
    reserved:  PLOTS.filter(p=>p.status==="reserved").length,
  };

  const filteredPlots = PLOTS.filter(p=>
    (plotFilter==="all"||p.status===plotFilter) &&
    (searchQuery===""||String(p.id).includes(searchQuery))
  );

  const handlePlotClick = useCallback((plot,pos)=>{
    setSelectedPlot(plot); setPopupPos(pos); setZoomPlot(plot);
  },[]);

  const handleFloorClick = (floor)=>{
    setSelectedFloor(floor); setSelectedApt(null); setSelectedRoom(null); setAptView("exterior");
  };

  const handleAptSelect = (apt)=>{
    setSelectedApt(apt); setSelectedRoom(null); setAptView("floorplan");
  };

  const handleRoomClick = (room)=>{ setSelectedRoom(room); setAptView("room"); };
  const openBook = (item,type)=>{ setBookModal({item,type}); setSelectedPlot(null); };
  const confirmBook = ()=>{ setBookModal(null); setBookingDone(true); setTimeout(()=>setBookingDone(false),4000); };

  // Styles (theme-aware)
  const s = {
    app:{ width:"100vw",height:"100vh",background:T.bg,display:"flex",flexDirection:"column",fontFamily:"'Cormorant Garamond',Georgia,serif",color:T.text,overflow:"hidden",transition:"background 0.3s" },
    header:{ height:60,background:T.headerBg,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",flexShrink:0,position:"relative",zIndex:10 },
    headerLine:{ position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent 0%,${T.borderGold} 30%,#d4af37 50%,${T.borderGold} 70%,transparent 100%)` },
    logoWrap:{ display:"flex",alignItems:"center",gap:14 },
    logoMark:{ width:36,height:36,borderRadius:"50%",border:`1.5px solid ${T.borderGold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,background:nightMode?"#0a0800":"#1e1600",boxShadow:`0 0 12px rgba(184,150,12,0.25)` },
    logoName:{ fontSize:20,fontWeight:600,letterSpacing:"0.06em",color:"#d4af37",lineHeight:1 },
    logoSub:{ fontSize:9,letterSpacing:"0.25em",textTransform:"uppercase",color:"rgba(212,175,55,0.55)",marginTop:2 },
    tabs:{ display:"flex",gap:2,background:nightMode?"#0a0900":"rgba(0,0,0,0.25)",borderRadius:6,padding:3,border:`1px solid ${nightMode?T.border:"rgba(212,175,55,0.3)"}` },
    tab:(a)=>({ padding:"6px 20px",borderRadius:4,border:"none",cursor:"pointer",fontFamily:"'Montserrat',sans-serif",fontWeight:600,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",background:a?gradGold:"transparent",color:a?"#0a0800":"rgba(212,175,55,0.65)",transition:"all 0.2s" }),
    headerRight:{ display:"flex",gap:8,alignItems:"center" },
    iconBtn:{ padding:"6px 14px",borderRadius:5,background:nightMode?"rgba(184,150,12,0.08)":"rgba(255,255,255,0.15)",border:`1px solid ${nightMode?T.border:"rgba(212,175,55,0.35)"}`,color:"rgba(212,175,55,0.85)",cursor:"pointer",fontFamily:"'Montserrat',sans-serif",fontSize:10,letterSpacing:"0.1em",transition:"all 0.2s" },
    body:{ flex:1,display:"flex",overflow:"hidden" },
    sidebar:{ width:272,background:T.sidebarBg,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",overflowY:"auto",flexShrink:0,padding:"0 0 12px",transition:"background 0.3s" },
    sideTop:{ padding:"16px 16px 12px",background:T.sideTopBg },
    sideSection:{ padding:"12px 16px",borderBottom:`1px solid ${T.border}` },
    canvas:{ flex:1,position:"relative",overflow:"hidden",background:T.bg },
    statGrid:{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10 },
    stat:(color,active)=>({ borderRadius:6,padding:"8px 4px",textAlign:"center",background:active?`${color}22`:T.cardBg,border:`1px solid ${active?color:T.border}`,cursor:"pointer",transition:"all 0.18s" }),
    statN:(color)=>({ fontSize:22,fontWeight:700,color,lineHeight:1,fontFamily:"'Cormorant Garamond',serif" }),
    statL:{ fontSize:8,letterSpacing:"0.14em",textTransform:"uppercase",color:T.textMuted,fontFamily:"'Montserrat',sans-serif" },
    input:{ width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:6,padding:"8px 12px",color:T.text,fontFamily:"'Montserrat',sans-serif",fontSize:11,outline:"none",boxSizing:"border-box",letterSpacing:"0.04em" },
    filterRow:{ display:"flex",gap:4,flexWrap:"wrap" },
    fBtn:(active,color)=>({ padding:"4px 10px",borderRadius:20,border:`1px solid ${active?color:T.border}`,background:active?`${color}20`:"transparent",color:active?color:T.textMuted,cursor:"pointer",fontSize:9,fontFamily:"'Montserrat',sans-serif",letterSpacing:"0.1em",fontWeight:600,textTransform:"uppercase",transition:"all 0.18s" }),
    plotRow:{ padding:"8px 10px",borderRadius:6,background:T.cardBg,border:`1px solid ${T.border}`,marginBottom:4,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.15s" },
    floorCard:(sel)=>({ padding:"10px 12px",borderRadius:6,background:sel?"":T.cardBg,backgroundImage:sel?gradGold:"none",border:`1px solid ${sel?T.borderGold:T.border}`,marginBottom:5,cursor:"pointer",transition:"all 0.18s",boxShadow:sel?`0 0 14px rgba(184,150,12,0.2)`:"none" }),
    aptCard:(status,sel)=>({ padding:"9px 11px",borderRadius:6,background:sel?T.surfaceHi:T.cardBg,border:`1px solid ${sel?T.borderGold:T.border}`,marginBottom:5,cursor:"pointer",transition:"all 0.18s" }),
    popup:{ position:"fixed",background:T.popupBg,border:`1px solid ${T.borderGold}`,borderRadius:12,padding:22,boxShadow:`0 24px 60px rgba(0,0,0,${nightMode?0.7:0.18}), 0 0 0 1px ${T.border}`,zIndex:100,minWidth:230,fontFamily:"'Montserrat',sans-serif",animation:"fadeIn 0.2s ease" },
    dataRow:{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7,fontSize:12 },
    dataKey:{ color:T.textMuted,fontSize:10,letterSpacing:"0.08em" },
    dataVal:{ color:T.text,fontWeight:600,fontSize:12 },
    overlay:{ position:"absolute",top:14,right:14,display:"flex",flexDirection:"column",gap:8,zIndex:20,pointerEvents:"none" },
    overlayCard:{ background:T.overlayBg,backdropFilter:"blur(12px)",border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",pointerEvents:"auto",boxShadow:nightMode?"none":`0 2px 16px rgba(0,0,0,0.12)` },
    miniMap:{ width:128,height:100,background:T.miniMapBg,borderRadius:6,border:`1px solid ${T.border}`,position:"relative",overflow:"hidden" },
    modal:{ position:"fixed",inset:0,background:nightMode?"rgba(0,0,0,0.75)":"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(6px)" },
    modalBox:{ background:T.modalBg,border:`1px solid ${T.borderGold}`,borderRadius:14,padding:32,width:380,maxWidth:"90vw",boxShadow:`0 40px 100px rgba(0,0,0,0.8)`,fontFamily:"'Montserrat',sans-serif",animation:"zoomIn 0.25s ease" },
    toast:{ position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:T.toastBg,border:`1px solid ${T.borderGold}`,color:"#d4af37",padding:"13px 28px",borderRadius:50,boxShadow:`0 8px 32px rgba(184,150,12,0.4)`,fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:600,letterSpacing:"0.1em",zIndex:300,animation:"slideUp 0.3s ease" },
    aptPanel:{ position:"absolute",inset:0,display:"flex",flexDirection:"column",background:T.bg,animation:"fadeIn 0.3s ease" },
    aptPanelHeader:{ height:52,background:nightMode?"linear-gradient(90deg,#0a0900,#111000)":"linear-gradient(90deg,#fffdf5,#fff8ec)",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",padding:"0 20px",gap:14,flexShrink:0 },
    viewToggle:{ display:"flex",gap:2,background:T.cardBg,borderRadius:5,padding:2,border:`1px solid ${T.border}` },
    vBtn:(active)=>({ padding:"5px 14px",borderRadius:3,border:"none",cursor:"pointer",fontFamily:"'Montserrat',sans-serif",fontWeight:600,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",background:active?gradGold:"transparent",color:active?"#0a0800":T.textMuted,transition:"all 0.18s" }),
    backBtn:{ background:"none",border:`1px solid ${T.border}`,borderRadius:5,color:T.textMuted,cursor:"pointer",fontFamily:"'Montserrat',sans-serif",fontSize:10,letterSpacing:"0.1em",padding:"5px 12px" },
  };

  return (
    <div style={s.app}>

      {/* ══ HEADER ══ */}
      <header style={s.header}>
        <div style={s.logoWrap}>
          <div style={s.logoMark}>⬡</div>
          <div>
            <div style={s.logoName}>Greenfield Estates</div>
            <div style={s.logoSub}>Luxury Living · Est. 2024</div>
          </div>
        </div>
        <div style={s.tabs}>
          {[["plots","🗺  Plot Layout"],["apartment","🏢  Apartment Tower"]].map(([key,label])=>(
            <button key={key} style={s.tab(activeTab===key)}
              onClick={()=>{ setActiveTab(key); setSelectedPlot(null); }}>
              {label}
            </button>
          ))}
        </div>
        <div style={s.headerRight}>
          <button style={s.iconBtn} onClick={()=>setNightMode(n=>!n)}>
            {nightMode?"☀  Day Mode":"🌙  Night Mode"}
          </button>
          <GoldBtn T={T} small outline onClick={()=>setBookModal({item:null,type:"enquiry"})}>
            Enquire Now
          </GoldBtn>
        </div>
        <div style={s.headerLine}/>
      </header>

      {/* ══ BODY ══ */}
      <div style={s.body}>

        {/* ─── SIDEBAR ─── */}
        <aside style={s.sidebar}>
          {activeTab==="plots" ? (
            <>
              <div style={s.sideTop}>
                <SideLabel T={T}>Availability</SideLabel>
                <div style={s.statGrid}>
                  {[
                    {key:"available",label:"Available",color:STATUS_COLOR.available},
                    {key:"sold",label:"Sold",color:STATUS_COLOR.sold},
                    {key:"reserved",label:"Reserved",color:STATUS_COLOR.reserved},
                  ].map(item=>(
                    <div key={item.key} style={s.stat(item.color,plotFilter===item.key)}
                      onClick={()=>setPlotFilter(plotFilter===item.key?"all":item.key)}>
                      <div style={s.statN(item.color)}>{plotCounts[item.key]}</div>
                      <div style={s.statL}>{item.label}</div>
                    </div>
                  ))}
                </div>
                <div style={s.filterRow}>
                  {[["all","All"],["available","Available"],["sold","Sold"],["reserved","Reserved"]].map(([f,l])=>(
                    <button key={f} style={s.fBtn(plotFilter===f,T.borderGold)} onClick={()=>setPlotFilter(f)}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={s.sideSection}>
                <SideLabel T={T}>Search</SideLabel>
                <input style={s.input} placeholder="Plot number..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
              </div>
              <div style={{...s.sideSection,flex:1,borderBottom:"none"}}>
                <SideLabel T={T}>Available ({filteredPlots.filter(p=>p.status==="available").length})</SideLabel>
                {filteredPlots.filter(p=>p.status==="available").map(p=>(
                  <div key={p.id} style={s.plotRow} onClick={()=>{ setSelectedPlot(p); setZoomPlot(p); }}>
                    <div>
                      <div style={{fontSize:12,fontWeight:600,color:T.text}}>Plot {p.id}</div>
                      <div style={{fontSize:9,color:T.textMuted,fontFamily:"'Montserrat',sans-serif",marginTop:1}}>{p.sqft} sqft · {p.facing}</div>
                    </div>
                    <div style={{fontSize:11,fontWeight:700,color:"#d4af37"}}>{p.price}</div>
                  </div>
                ))}
              </div>
              <GoldDivider T={T}/>
              <div style={{padding:"8px 16px"}}>
                <div style={{fontSize:9,color:T.textDim,fontFamily:"'Montserrat',sans-serif",letterSpacing:"0.08em",lineHeight:1.9}}>
                  🖱 DRAG → ROTATE  ·  ⚲ SCROLL → ZOOM<br/>⌨ WASD → NAVIGATE  ·  👆 CLICK → SELECT
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={s.sideTop}>
                <SideLabel T={T}>Unit Availability</SideLabel>
                <div style={s.statGrid}>
                  {[
                    {key:"available",label:"Available",color:STATUS_COLOR.available},
                    {key:"sold",label:"Sold",color:STATUS_COLOR.sold},
                    {key:"reserved",label:"Reserved",color:STATUS_COLOR.reserved},
                  ].map(item=>{
                    const cnt=FLOORS.flatMap(f=>f.apartments).filter(a=>a.status===item.key).length;
                    return(
                      <div key={item.key} style={s.stat(item.color,false)}>
                        <div style={s.statN(item.color)}>{cnt}</div>
                        <div style={s.statL}>{item.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={s.sideSection}>
                <SideLabel T={T}>Select Floor</SideLabel>
                {FLOORS.map(floor=>(
                  <div key={floor.id} style={s.floorCard(selectedFloor?.id===floor.id)} onClick={()=>handleFloorClick(floor)}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontSize:14,fontWeight:600,color:selectedFloor?.id===floor.id?"#0a0800":T.text}}>
                        {floor.label}
                      </div>
                      <div style={{fontSize:9,color:selectedFloor?.id===floor.id?"#0a0800":T.textMuted,fontFamily:"'Montserrat',sans-serif"}}>
                        {floor.apartments.filter(a=>a.status==="available").length} avail.
                      </div>
                    </div>
                    <div style={{fontSize:9,color:selectedFloor?.id===floor.id?"rgba(10,8,0,0.65)":T.textMuted,fontFamily:"'Montserrat',sans-serif",marginTop:2}}>
                      {floor.subtitle}
                    </div>
                  </div>
                ))}
              </div>
              {selectedFloor&&(
                <div style={s.sideSection}>
                  <SideLabel T={T}>{selectedFloor.label} — Units</SideLabel>
                  {selectedFloor.apartments.map(apt=>(
                    <div key={apt.id} style={s.aptCard(apt.status,selectedApt?.id===apt.id)} onClick={()=>handleAptSelect(apt)}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <span style={{fontSize:13,fontWeight:600,color:selectedApt?.id===apt.id?"#d4af37":T.text}}>{apt.name}</span>
                          <span style={{fontSize:9,color:T.textMuted,fontFamily:"'Montserrat',sans-serif",marginLeft:6}}>{apt.type}</span>
                        </div>
                        <StatusBadge status={apt.status}/>
                      </div>
                      <div style={{fontSize:10,color:T.textMuted,fontFamily:"'Montserrat',sans-serif",marginTop:3}}>{apt.area} · {apt.price}</div>
                    </div>
                  ))}
                </div>
              )}
              {selectedApt&&aptView!=="exterior"&&(
                <div style={{...s.sideSection,borderBottom:"none"}}>
                  <SideLabel T={T}>Rooms</SideLabel>
                  {selectedApt.rooms.map(room=>(
                    <div key={room.id} style={{
                      padding:"7px 10px",borderRadius:6,marginBottom:4,cursor:"pointer",
                      background:selectedRoom?.id===room.id?(nightMode?"#1a1400":T.surface):T.cardBg,
                      border:`1px solid ${selectedRoom?.id===room.id?T.borderGold:T.border}`,
                      display:"flex",alignItems:"center",gap:8,transition:"all 0.15s",
                    }} onClick={()=>handleRoomClick(room)}>
                      <span style={{fontSize:16}}>{room.icon}</span>
                      <div>
                        <div style={{fontSize:11,fontWeight:600,color:selectedRoom?.id===room.id?"#d4af37":T.text}}>{room.name}</div>
                        <div style={{fontSize:9,color:T.textMuted,fontFamily:"'Montserrat',sans-serif"}}>{room.size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <GoldDivider T={T}/>
              <div style={{padding:"8px 16px"}}>
                <div style={{fontSize:9,color:T.textDim,fontFamily:"'Montserrat',sans-serif",letterSpacing:"0.08em",lineHeight:1.9}}>
                  👆 CLICK FLOOR → SELECT UNIT → EXPLORE INSIDE
                </div>
              </div>
            </>
          )}
        </aside>

        {/* ─── CANVAS ─── */}
        <main style={s.canvas}>

          {activeTab==="plots"&&(
            <PlotScene filter={plotFilter} onPlotClick={handlePlotClick} zoomPlot={zoomPlot} nightMode={nightMode}/>
          )}

          {activeTab==="apartment"&&(
            <>
              <div style={{position:"absolute",inset:0,opacity:aptView==="exterior"?1:0,pointerEvents:aptView==="exterior"?"auto":"none",transition:"opacity 0.3s"}}>
                <ApartmentScene selectedFloor={selectedFloor} onFloorClick={handleFloorClick} nightMode={nightMode}/>
              </div>

              {selectedApt&&aptView!=="exterior"&&(
                <div style={s.aptPanel}>
                  <div style={s.aptPanelHeader}>
                    <button style={s.backBtn} onClick={()=>{ setAptView("exterior"); setSelectedRoom(null); }}>← BACK</button>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"#d4af37",fontWeight:600}}>
                      {selectedApt.name} &nbsp;·&nbsp; {selectedApt.type}
                    </div>
                    <StatusBadge status={selectedApt.status}/>
                    <div style={{marginLeft:"auto"}}>
                      <div style={s.viewToggle}>
                        <button style={s.vBtn(aptView==="floorplan")} onClick={()=>setAptView("floorplan")}>⊞ Floor Plan</button>
                        <button style={s.vBtn(aptView==="room")} disabled={!selectedRoom}
                          onClick={()=>selectedRoom&&setAptView("room")}>▣ Room View</button>
                      </div>
                    </div>
                    {selectedApt.status==="available"&&(
                      <GoldBtn T={T} small onClick={()=>openBook(selectedApt,"apartment")}>Book Now</GoldBtn>
                    )}
                  </div>

                  {aptView==="floorplan"&&(
                    <div style={{flex:1,overflowY:"auto",padding:24,display:"flex",flexDirection:"column",alignItems:"center"}}>
                      <div style={{marginBottom:16,textAlign:"center"}}>
                        <div style={{fontSize:11,color:T.textMuted,fontFamily:"'Montserrat',sans-serif",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Interactive Floor Plan</div>
                        <div style={{fontSize:10,color:T.textDim,fontFamily:"'Montserrat',sans-serif"}}>Click any room to enter 3D walkthrough</div>
                      </div>
                      <FloorPlan apartment={selectedApt} selectedRoom={selectedRoom} onRoomClick={(room)=>{ setSelectedRoom(room); setAptView("room"); }} nightMode={nightMode}/>
                      <div style={{marginTop:24,padding:20,background:T.cardBg,border:`1px solid ${T.border}`,borderRadius:8,width:"100%",maxWidth:520}}>
                        <div style={{fontSize:9,color:T.borderGold,fontFamily:"'Montserrat',sans-serif",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:12}}>Unit Details</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 24px"}}>
                          {[["Unit Name",selectedApt.name],["Type",selectedApt.type],["Area",selectedApt.area],["Price",selectedApt.price],["Floor",selectedFloor?.label],["Rooms",`${selectedApt.rooms.length} spaces`]].map(([k,v])=>(
                            <div key={k} style={s.dataRow}>
                              <span style={s.dataKey}>{k}</span>
                              <span style={{...s.dataVal,color:k==="Price"?"#d4af37":T.text}}>{v}</span>
                            </div>
                          ))}
                        </div>
                        {selectedApt.status==="available"&&(
                          <div style={{marginTop:16}}>
                            <GoldBtn T={T} full onClick={()=>openBook(selectedApt,"apartment")}>Book This Apartment</GoldBtn>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {aptView==="room"&&selectedRoom&&(
                    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
                      <div style={{...s.aptPanelHeader,borderTop:`1px solid ${T.border}`}}>
                        <button style={s.backBtn} onClick={()=>setAptView("floorplan")}>← FLOOR PLAN</button>
                        <span style={{fontSize:20,marginLeft:4}}>{selectedRoom.icon}</span>
                        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"#d4af37"}}>{selectedRoom.name}</div>
                        <div style={{fontSize:10,color:T.textMuted,fontFamily:"'Montserrat',sans-serif"}}>{selectedRoom.size} · {selectedRoom.area}</div>
                        <div style={{marginLeft:"auto",display:"flex",gap:4,flexWrap:"wrap"}}>
                          {selectedApt.rooms.map(r=>(
                            <button key={r.id} onClick={()=>setSelectedRoom(r)} style={{
                              padding:"4px 10px",borderRadius:20,cursor:"pointer",
                              fontFamily:"'Montserrat',sans-serif",fontWeight:600,fontSize:9,letterSpacing:"0.1em",
                              background:selectedRoom.id===r.id?gradGold:T.cardBg,
                              color:selectedRoom.id===r.id?"#0a0800":T.textMuted,
                              border:`1px solid ${selectedRoom.id===r.id?T.borderGold:T.border}`,
                              transition:"all 0.15s",
                            }}>{r.icon} {r.name.split(" ")[0]}</button>
                          ))}
                        </div>
                      </div>
                      <div style={{flex:1,position:"relative"}}>
                        <RoomScene room={selectedRoom} nightMode={nightMode}/>
                        <div style={{position:"absolute",top:14,left:14,background:T.overlayBg,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 14px",maxWidth:280,backdropFilter:"blur(8px)"}}>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:"#d4af37",marginBottom:4}}>{selectedRoom.name}</div>
                          <div style={{fontSize:10,color:T.textMuted,fontFamily:"'Montserrat',sans-serif",lineHeight:1.6}}>{selectedRoom.desc}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {aptView==="exterior"&&!selectedFloor&&(
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:T.overlayBg,backdropFilter:"blur(10px)",border:`1px solid ${T.border}`,borderRadius:12,padding:"20px 28px",textAlign:"center",pointerEvents:"none"}}>
                  <div style={{fontSize:28,marginBottom:8}}>🏢</div>
                  <div style={{fontFamily:"'Montserrat',sans-serif",fontSize:11,color:T.textMuted,letterSpacing:"0.1em"}}>CLICK A FLOOR ON THE BUILDING<br/>OR SELECT FROM THE SIDEBAR</div>
                </div>
              )}

              {aptView==="exterior"&&selectedApt&&(
                <div style={{position:"absolute",bottom:18,left:"50%",transform:"translateX(-50%)",background:T.overlayBg,backdropFilter:"blur(12px)",border:`1px solid ${T.borderGold}`,borderRadius:10,padding:"12px 22px",display:"flex",gap:20,alignItems:"center",boxShadow:`0 8px 32px rgba(0,0,0,0.3)`,zIndex:20}}>
                  <div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"#d4af37"}}>{selectedApt.name}</div>
                    <div style={{fontSize:9,color:T.textMuted,fontFamily:"'Montserrat',sans-serif"}}>{selectedApt.type} · {selectedApt.area}</div>
                  </div>
                  <div style={{fontSize:18,color:"#d4af37",fontWeight:600}}>{selectedApt.price}</div>
                  <StatusBadge status={selectedApt.status}/>
                  <GoldBtn T={T} small onClick={()=>setAptView("floorplan")}>Explore Inside →</GoldBtn>
                </div>
              )}
            </>
          )}

          {/* ── OVERLAYS ── */}
          {(activeTab==="plots"||(activeTab==="apartment"&&aptView==="exterior"))&&(
            <div style={s.overlay}>
              <div style={s.overlayCard}>
                <div style={{width:34,height:34,borderRadius:"50%",background:nightMode?"linear-gradient(135deg,#0a0800,#1a1200)":"linear-gradient(135deg,#fffdf0,#fff8e0)",border:`1.5px solid ${T.borderGold}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Montserrat',sans-serif",fontWeight:700,fontSize:11,color:T.borderGold}}>N</div>
              </div>
              {activeTab==="plots"&&(
                <div style={s.overlayCard}>
                  <div style={{fontSize:8,color:T.textDim,fontFamily:"'Montserrat',sans-serif",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:5}}>Site Map</div>
                  <div style={s.miniMap}>
                    {[{top:"12%",left:0,right:0,height:2},{top:"43%",left:0,right:0,height:2},{top:"68%",left:0,right:0,height:2},{top:0,bottom:0,left:"15%",width:2},{top:0,bottom:0,left:"50%",width:2},{top:0,bottom:0,right:"8%",width:2}].map((r,i)=>(
                      <div key={i} style={{position:"absolute",background:T.miniRoad,...r}}/>
                    ))}
                    {PLOTS.map(p=>{
                      const mx=((p.x+220)/440)*128, my=((p.z+190)/270)*100;
                      return <div key={p.id} style={{position:"absolute",left:mx,top:my,width:5,height:4,borderRadius:1,background:STATUS_COLOR[p.status],opacity:0.9}}/>;
                    })}
                  </div>
                </div>
              )}
              <div style={s.overlayCard}>
                {[["available","Available"],["sold","Sold"],["reserved","Reserved"]].map(([st,l])=>(
                  <div key={st} style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,fontFamily:"'Montserrat',sans-serif",fontSize:9,color:T.textMuted,letterSpacing:"0.08em"}}>
                    <span style={{width:9,height:9,borderRadius:2,background:STATUS_COLOR[st],flexShrink:0}}/>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ══ PLOT POPUP ══ */}
      {selectedPlot&&activeTab==="plots"&&(
        <div style={{...s.popup,left:Math.min(popupPos.x+14,window.innerWidth-260),top:Math.min(popupPos.y-16,window.innerHeight-340)}}>
          <button onClick={()=>setSelectedPlot(null)} style={{position:"absolute",top:10,right:12,background:"none",border:"none",cursor:"pointer",color:T.textMuted,fontSize:14}}>✕</button>
          <div style={{marginBottom:12}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:"#d4af37",fontWeight:600}}>Plot {selectedPlot.id}</div>
            <StatusBadge status={selectedPlot.status}/>
          </div>
          <GoldDivider T={T}/>
          {[["Area",`${selectedPlot.sqft} sq ft`],["Facing",selectedPlot.facing],["Price",selectedPlot.price],["Plot No.",`#${selectedPlot.id}`],["Dimensions","30 × 40 ft"]].map(([k,v])=>(
            <div key={k} style={s.dataRow}>
              <span style={s.dataKey}>{k}</span>
              <span style={{...s.dataVal,color:k==="Price"?"#d4af37":T.text}}>{v}</span>
            </div>
          ))}
          <GoldDivider T={T}/>
          {selectedPlot.status==="available"
            ? <GoldBtn T={T} full onClick={()=>openBook(selectedPlot,"plot")}>Reserve This Plot</GoldBtn>
            : <div style={{textAlign:"center",fontSize:10,color:STATUS_COLOR[selectedPlot.status],fontFamily:"'Montserrat',sans-serif",letterSpacing:"0.12em",textTransform:"uppercase"}}>Not Available</div>
          }
        </div>
      )}

      {/* ══ BOOKING MODAL ══ */}
      {bookModal&&bookModal.item&&(
        <div style={s.modal} onClick={()=>setBookModal(null)}>
          <div style={s.modalBox} onClick={e=>e.stopPropagation()}>
            <div style={{height:3,background:gradGold,borderRadius:"12px 12px 0 0",margin:"-32px -32px 24px"}}/>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"#d4af37",fontWeight:600,marginBottom:4}}>Reserve Your Property</div>
            <div style={{fontSize:10,color:T.textMuted,fontFamily:"'Montserrat',sans-serif",letterSpacing:"0.1em",marginBottom:16}}>
              {bookModal.type==="plot"?`PLOT #${bookModal.item.id} · ${bookModal.item.sqft} SQ FT`:`${bookModal.item.name} · ${bookModal.item.type} · ${bookModal.item.area}`}
            </div>
            <div style={{background:T.inputBg,border:`1px solid ${T.border}`,borderRadius:8,padding:"14px 16px",marginBottom:18}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 20px"}}>
                {(bookModal.type==="plot"?[["Property",`Plot #${bookModal.item.id}`],["Area",`${bookModal.item.sqft} sq ft`],["Facing",bookModal.item.facing],["Price",bookModal.item.price]]:[["Unit",bookModal.item.name],["Type",bookModal.item.type],["Area",bookModal.item.area],["Price",bookModal.item.price]]).map(([k,v])=>(
                  <div key={k} style={s.dataRow}>
                    <span style={s.dataKey}>{k}</span>
                    <span style={{...s.dataVal,color:k==="Price"?"#d4af37":T.text}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            {["name","phone","email"].map(field=>(
              <input key={field} style={{...s.input,marginBottom:8}} placeholder={field==="name"?"Your Full Name":field==="phone"?"Phone Number":"Email Address"} value={enquiryForm[field]} onChange={e=>setEnquiryForm(f=>({...f,[field]:e.target.value}))}/>
            ))}
            <div style={{display:"flex",gap:8,marginTop:6}}>
              <GoldBtn T={T} outline full onClick={()=>setBookModal(null)}>Cancel</GoldBtn>
              <GoldBtn T={T} full onClick={confirmBook}>Confirm Booking</GoldBtn>
            </div>
          </div>
        </div>
      )}

      {/* ══ ENQUIRY MODAL ══ */}
      {bookModal&&!bookModal.item&&(
        <div style={s.modal} onClick={()=>setBookModal(null)}>
          <div style={s.modalBox} onClick={e=>e.stopPropagation()}>
            <div style={{height:3,background:gradGold,borderRadius:"12px 12px 0 0",margin:"-32px -32px 24px"}}/>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"#d4af37",fontWeight:600,marginBottom:4}}>Get In Touch</div>
            <div style={{fontSize:10,color:T.textMuted,fontFamily:"'Montserrat',sans-serif",letterSpacing:"0.1em",marginBottom:20}}>OUR TEAM WILL CONTACT YOU WITHIN 24 HOURS</div>
            {["name","phone","email"].map(field=>(
              <input key={field} style={{...s.input,marginBottom:8}} placeholder={field==="name"?"Your Full Name":field==="phone"?"Phone Number":"Email Address"} value={enquiryForm[field]} onChange={e=>setEnquiryForm(f=>({...f,[field]:e.target.value}))}/>
            ))}
            <textarea style={{...s.input,height:70,resize:"none",marginBottom:12}} placeholder="Your message (optional)"/>
            <div style={{display:"flex",gap:8}}>
              <GoldBtn T={T} outline full onClick={()=>setBookModal(null)}>Cancel</GoldBtn>
              <GoldBtn T={T} full onClick={confirmBook}>Send Enquiry</GoldBtn>
            </div>
          </div>
        </div>
      )}

      {bookingDone&&(
        <div style={s.toast}>✦ &nbsp; Booking submitted. Our team will contact you shortly.</div>
      )}
    </div>
  );
}
