const ROOM_COLORS = {
  living:   { night:{ bg:"#1a1200", border:"#d4af37", label:"#d4af37" }, day:{ bg:"#fff8e8", border:"#b8960c", label:"#7a5500" } },
  kitchen:  { night:{ bg:"#0d0d1a", border:"#8888cc", label:"#aaaaee" }, day:{ bg:"#eff0ff", border:"#5555aa", label:"#333388" } },
  master:   { night:{ bg:"#0d0800", border:"#c8963c", label:"#c8963c" }, day:{ bg:"#fff2e8", border:"#c06820", label:"#884400" } },
  bed2:     { night:{ bg:"#080d0d", border:"#6abfbf", label:"#6abfbf" }, day:{ bg:"#e8f8f8", border:"#2a8888", label:"#1a6666" } },
  bed3:     { night:{ bg:"#0a080d", border:"#a06abf", label:"#a06abf" }, day:{ bg:"#f4eeff", border:"#7744aa", label:"#553388" } },
  balcony:  { night:{ bg:"#000a1a", border:"#6aaabf", label:"#6aaabf" }, day:{ bg:"#e8f4ff", border:"#2277aa", label:"#115588" } },
  terrace:  { night:{ bg:"#00050a", border:"#4a8aaf", label:"#4a8aaf" }, day:{ bg:"#e0eff8", border:"#1a6699", label:"#0a4466" } },
  bathroom: { night:{ bg:"#0a0a0a", border:"#888888", label:"#888888" }, day:{ bg:"#f4f4f4", border:"#666666", label:"#444444" } },
};
const CELL=window.innerWidth<=768?52:64;

export default function FloorPlan({ apartment, selectedRoom, onRoomClick, nightMode }) {
  if(!apartment) return null;
  const maxCol=Math.max(...apartment.layout.map(([c,,w])=>c+w));
  const maxRow=Math.max(...apartment.layout.map(([,r,,h])=>r+h));
  const W=maxCol*CELL, H=maxRow*CELL;
  const mode=nightMode?"night":"day";

  return (
    <div style={{width:"100%",overflowX:"auto",padding:"8px 0",WebkitOverflowScrolling:"touch"}}>
      <div style={{display:"inline-block",position:"relative",width:W,height:H,background:nightMode?"#0a0800":"#f0e8d0",border:`2px solid #b8960c`,borderRadius:4,margin:"0 auto",boxShadow:nightMode?"0 0 40px rgba(184,150,12,0.15)":"0 4px 24px rgba(0,0,0,0.12)"}}>
        {/* Grid */}
        {Array.from({length:maxRow+1}).map((_,r)=>(<div key={r} style={{position:"absolute",left:0,right:0,top:r*CELL,height:1,background:nightMode?"rgba(184,150,12,0.08)":"rgba(160,120,8,0.12)",pointerEvents:"none"}}/>))}
        {Array.from({length:maxCol+1}).map((_,c)=>(<div key={c} style={{position:"absolute",top:0,bottom:0,left:c*CELL,width:1,background:nightMode?"rgba(184,150,12,0.08)":"rgba(160,120,8,0.12)",pointerEvents:"none"}}/>))}

        {apartment.layout.map(([col,row,w,h,label,roomId])=>{
          const colors=(ROOM_COLORS[roomId]||{night:{bg:"#111",border:"#555",label:"#888"},day:{bg:"#eee",border:"#888",label:"#444"}})[mode];
          const isSel=selectedRoom?.id===roomId;
          return (
            <div key={roomId} onClick={()=>{const r=apartment.rooms.find(r=>r.id===roomId);if(r)onRoomClick(r);}} style={{
              position:"absolute",left:col*CELL+3,top:row*CELL+3,width:w*CELL-6,height:h*CELL-6,
              background:colors.bg,border:`2px solid ${isSel?"#d4af37":colors.border}`,
              borderRadius:3,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",transition:"all 0.18s",
              boxShadow:isSel?`0 0 0 2px #d4af37, inset 0 0 20px rgba(212,175,55,0.10)`:nightMode?"inset 0 0 12px rgba(0,0,0,0.5)":"inset 0 0 8px rgba(0,0,0,0.04)",
              overflow:"hidden",
            }}>
              {isSel&&(<div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,rgba(212,175,55,0.08) 0%,transparent 50%,rgba(212,175,55,0.08) 100%)`,pointerEvents:"none"}}/>)}
              <div style={{fontSize:h*CELL>80?22:16,marginBottom:h*CELL>80?4:2}}>{apartment.rooms.find(r=>r.id===roomId)?.icon||"🚪"}</div>
              <div style={{fontFamily:"'Montserrat',sans-serif",fontSize:w*CELL>120?11:9,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",color:isSel?"#d4af37":colors.label,textAlign:"center",padding:"0 4px",lineHeight:1.3}}>{label}</div>
              {h*CELL>80&&w*CELL>100&&(<div style={{fontFamily:"'Montserrat',sans-serif",fontSize:9,color:nightMode?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.35)",marginTop:3}}>{apartment.rooms.find(r=>r.id===roomId)?.size}</div>)}
              {isSel&&(<div style={{position:"absolute",bottom:4,fontFamily:"'Montserrat',sans-serif",fontSize:8,color:"rgba(212,175,55,0.7)",letterSpacing:"0.12em"}}>ENTER ROOM ↗</div>)}
            </div>
          );
        })}
        <div style={{position:"absolute",bottom:6,right:8,fontFamily:"'Montserrat',sans-serif",fontSize:10,color:nightMode?"rgba(184,150,12,0.5)":"rgba(120,85,0,0.5)",letterSpacing:"0.1em"}}>N ↑</div>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:12,justifyContent:"center"}}>
        {apartment.rooms.map(r=>{
          const c=(ROOM_COLORS[r.id]||{night:{border:"#555",label:"#888"},day:{border:"#888",label:"#444"}})[mode];
          return (
            <div key={r.id} style={{display:"flex",alignItems:"center",gap:5,fontFamily:"'Montserrat',sans-serif",fontSize:10,color:c.label,letterSpacing:"0.08em"}}>
              <span style={{width:8,height:8,borderRadius:2,background:c.border,display:"inline-block"}}/>
              {r.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
