import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function RoomScene({ room, nightMode }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const camRef = useRef({ theta:0, phi:0 });
  const keysRef = useRef({});
  const [hoveredFurniture, setHoveredFurniture] = useState(null);
  const furnitureMeshesRef = useRef([]);
  const cameraRef = useRef(null);

  useEffect(()=>{
    const el=mountRef.current; if(!el||!room) return;
    const W=el.clientWidth, H=el.clientHeight;

    const scene=new THREE.Scene();
    const bgColor = nightMode ? (room.color||"#0a0a00") : "#f8f2e8";
    scene.background=new THREE.Color(bgColor);
    scene.fog=new THREE.Fog(bgColor, nightMode?18:22, nightMode?40:50);

    const camera=new THREE.PerspectiveCamera(75,W/H,0.1,100);
    camera.position.set(0,1.65,0); cameraRef.current=camera;

    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.shadowMap.enabled=true; el.appendChild(renderer.domElement); rendererRef.current=renderer;

    const RW=10, RH=3.2, RD=9;

    // Floor
    const floorColor = nightMode ? 0x0a0800 : 0xe8dcc0;
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(RW,RD),new THREE.MeshLambertMaterial({color:floorColor}));
    floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; scene.add(floor);
    const veinColor = nightMode ? 0x1a1400 : 0xd4c090;
    const veins=new THREE.GridHelper(Math.max(RW,RD),8,veinColor,veinColor); veins.position.y=0.01; scene.add(veins);

    // Walls
    const wallColor = nightMode ? 0x111108 : 0xf5edd8;
    const wallMat=new THREE.MeshLambertMaterial({color:wallColor});
    const trimMat=new THREE.MeshLambertMaterial({color:0xb8960c});
    // Back wall
    const backWall=new THREE.Mesh(new THREE.PlaneGeometry(RW,RH),wallMat);
    backWall.position.set(0,RH/2,-RD/2); scene.add(backWall);
    // Front wall halves
    const frontL=new THREE.Mesh(new THREE.PlaneGeometry(RW/2-0.8,RH),wallMat);
    frontL.position.set(-RW/4-0.4,RH/2,RD/2); frontL.rotation.y=Math.PI; scene.add(frontL);
    const frontR=new THREE.Mesh(new THREE.PlaneGeometry(RW/2-0.8,RH),wallMat);
    frontR.position.set(RW/4+0.4,RH/2,RD/2); frontR.rotation.y=Math.PI; scene.add(frontR);
    const doorTop=new THREE.Mesh(new THREE.PlaneGeometry(1.6,RH*0.25),wallMat);
    doorTop.position.set(0,RH*0.875,RD/2); doorTop.rotation.y=Math.PI; scene.add(doorTop);
    // Side walls
    const leftWall=new THREE.Mesh(new THREE.PlaneGeometry(RD,RH),wallMat);
    leftWall.rotation.y=Math.PI/2; leftWall.position.set(-RW/2,RH/2,0); scene.add(leftWall);
    const rightWall=new THREE.Mesh(new THREE.PlaneGeometry(RD,RH),wallMat);
    rightWall.rotation.y=-Math.PI/2; rightWall.position.set(RW/2,RH/2,0); scene.add(rightWall);
    // Ceiling
    const ceilColor = nightMode ? 0x0d0b00 : 0xfaf4e8;
    const ceiling=new THREE.Mesh(new THREE.PlaneGeometry(RW,RD),new THREE.MeshLambertMaterial({color:ceilColor}));
    ceiling.rotation.x=Math.PI/2; ceiling.position.y=RH; scene.add(ceiling);

    // Crown moulding
    const moulding=(x1,z1,x2,z2)=>{
      const len=Math.sqrt((x2-x1)**2+(z2-z1)**2), angle=Math.atan2(x2-x1,z2-z1);
      const m=new THREE.Mesh(new THREE.BoxGeometry(len,0.12,0.12),trimMat);
      m.position.set((x1+x2)/2,RH-0.06,(z1+z2)/2); m.rotation.y=angle; scene.add(m);
      const b=new THREE.Mesh(new THREE.BoxGeometry(len,0.12,0.12),trimMat);
      b.position.set((x1+x2)/2,0.06,(z1+z2)/2); b.rotation.y=angle; scene.add(b);
    };
    moulding(-RW/2,-RD/2,RW/2,-RD/2); moulding(-RW/2,RD/2,RW/2,RD/2);
    moulding(-RW/2,-RD/2,-RW/2,RD/2); moulding(RW/2,-RD/2,RW/2,RD/2);

    // Window
    if(room.id!=="bathroom"){
      const winFrame=new THREE.Mesh(new THREE.BoxGeometry(3.5,2.2,0.12),trimMat);
      winFrame.position.set(2,1.8,-RD/2+0.06); scene.add(winFrame);
      const winGlassColor = nightMode ? 0x001133 : 0x88ccee;
      const winGlass=new THREE.Mesh(new THREE.PlaneGeometry(3.2,2),new THREE.MeshLambertMaterial({color:winGlassColor,transparent:true,opacity:nightMode?0.7:0.6,emissive:nightMode?0x001122:0x224488,emissiveIntensity:nightMode?0.5:0.15}));
      winGlass.position.set(2,1.8,-RD/2+0.13); scene.add(winGlass);
      const crossH=new THREE.Mesh(new THREE.BoxGeometry(3.4,0.06,0.06),trimMat); crossH.position.set(2,1.8,-RD/2+0.14); scene.add(crossH);
      const crossV=new THREE.Mesh(new THREE.BoxGeometry(0.06,2.1,0.06),trimMat); crossV.position.set(2,1.8,-RD/2+0.14); scene.add(crossV);
    }

    // Door frame
    const dfH=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.1,0.12),trimMat); dfH.position.set(0,RH*0.75,RD/2-0.05); scene.add(dfH);
    const dfL=new THREE.Mesh(new THREE.BoxGeometry(0.08,RH*0.75,0.1),trimMat); dfL.position.set(-0.76,RH*0.375,RD/2-0.05); scene.add(dfL);
    const dfR=new THREE.Mesh(new THREE.BoxGeometry(0.08,RH*0.75,0.1),trimMat); dfR.position.set(0.76,RH*0.375,RD/2-0.05); scene.add(dfR);

    // Ceiling light
    const fixture=new THREE.Mesh(new THREE.CylinderGeometry(0.7,0.5,0.25,12),trimMat); fixture.position.set(0,RH-0.15,0); scene.add(fixture);
    const bulbEmissive = nightMode ? 0.9 : 0.3;
    const bulb=new THREE.Mesh(new THREE.SphereGeometry(0.35,8,6),new THREE.MeshLambertMaterial({color:0xfff5cc,emissive:0xd4a800,emissiveIntensity:bulbEmissive}));
    bulb.position.set(0,RH-0.45,0); scene.add(bulb);

    // Furniture
    furnitureMeshesRef.current=[];
    (room.furniture||[]).forEach(item=>{
      const mat=new THREE.MeshLambertMaterial({color:item.color});
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(item.w,item.h,item.d),mat);
      mesh.position.set(item.x,item.h/2,item.z); mesh.castShadow=true; mesh.receiveShadow=true;
      mesh.userData={label:item.label,isFurniture:true}; scene.add(mesh);
      const edgeColor = nightMode ? 0x3a2a00 : 0x8a7000;
      const edges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(item.w+0.04,item.h+0.04,item.d+0.04)),new THREE.LineBasicMaterial({color:edgeColor}));
      edges.position.set(item.x,item.h/2,item.z); scene.add(edges);
      furnitureMeshesRef.current.push(mesh);
    });

    // Lighting
    if(nightMode){
      scene.add(new THREE.AmbientLight(0x1a1400,0.4));
      const mainLight=new THREE.PointLight(0xfff5cc,0.7,25); mainLight.position.set(0,RH-0.5,0); mainLight.castShadow=true; scene.add(mainLight);
      scene.add(new THREE.DirectionalLight(0xb8960c,0.15).position.set(5,3,5)&&new THREE.DirectionalLight(0xb8960c,0.15));
    } else {
      scene.add(new THREE.AmbientLight(0xfff8e8,0.7));
      const sunLight=new THREE.DirectionalLight(0xffffff,0.9); sunLight.position.set(5,8,3); sunLight.castShadow=true; scene.add(sunLight);
      const fillLight=new THREE.DirectionalLight(0xffeedd,0.3); fillLight.position.set(-5,3,-5); scene.add(fillLight);
      const mainLight=new THREE.PointLight(0xfff5cc,0.4,25); mainLight.position.set(0,RH-0.5,0); scene.add(mainLight);
    }

    const updateCamera=()=>{
      camera.position.set(0,1.65,0);
      camera.lookAt(Math.sin(camRef.current.theta)*Math.cos(camRef.current.phi)*5,1.65+Math.sin(camRef.current.phi)*5,Math.cos(camRef.current.theta)*Math.cos(camRef.current.phi)*5);
    };
    updateCamera();

    const lastMouse = {x:0, y:0};
    const onMouseDown=(e)=>{lastMouse.x=e.clientX; lastMouse.y=e.clientY;};
    const onTouchStart=(e)=>{const touch=e.touches[0];lastMouse.x=touch.clientX; lastMouse.y=touch.clientY;};
    const onMouseMove=(e)=>{
      if(e.buttons===1){
        camRef.current.theta-=(e.clientX-lastMouse.x)*0.004;
        camRef.current.phi=Math.max(-0.8,Math.min(0.8,camRef.current.phi-(e.clientY-lastMouse.y)*0.004));
        lastMouse.x=e.clientX; lastMouse.y=e.clientY; updateCamera();
      }
    };
    const onTouchMove=(e)=>{
      e.preventDefault();
      if(e.touches.length===1){
        const touch=e.touches[0];
        camRef.current.theta-=(touch.clientX-lastMouse.x)*0.004;
        camRef.current.phi=Math.max(-0.8,Math.min(0.8,camRef.current.phi-(touch.clientY-lastMouse.y)*0.004));
        lastMouse.x=touch.clientX; lastMouse.y=touch.clientY; updateCamera();
      }
    };
    const onKeyDown=(e)=>{keysRef.current[e.key.toLowerCase()]=true;};
    const onKeyUp=(e)=>{keysRef.current[e.key.toLowerCase()]=false;};
    const onClick=(e)=>{
      const rect=el.getBoundingClientRect();
      const mouse=new THREE.Vector2(((e.clientX-rect.left)/W)*2-1,-((e.clientY-rect.top)/H)*2+1);
      const raycaster=new THREE.Raycaster(); raycaster.setFromCamera(mouse,camera);
      const hits=raycaster.intersectObjects(furnitureMeshesRef.current);
      setHoveredFurniture(hits.length>0?hits[0].object.userData.label:null);
    };

    el.addEventListener("mousedown",onMouseDown); 
    el.addEventListener("touchstart",onTouchStart,{passive:true});
    window.addEventListener("mousemove",onMouseMove);
    window.addEventListener("touchmove",onTouchMove,{passive:false});
    el.addEventListener("click",onClick); window.addEventListener("keydown",onKeyDown); window.addEventListener("keyup",onKeyUp);

    const animate=()=>{
      frameRef.current=requestAnimationFrame(animate);
      const keys=keysRef.current, speed=0.06;
      const dir=new THREE.Vector3(Math.sin(camRef.current.theta),0,Math.cos(camRef.current.theta));
      const right=new THREE.Vector3(Math.cos(camRef.current.theta),0,-Math.sin(camRef.current.theta));
      const pos=camera.position, half=[RW/2-0.5,RD/2-0.5];
      if(keys["w"]||keys["arrowup"]){pos.x-=dir.x*speed;pos.z-=dir.z*speed;}
      if(keys["s"]||keys["arrowdown"]){pos.x+=dir.x*speed;pos.z+=dir.z*speed;}
      if(keys["a"]||keys["arrowleft"]){pos.x-=right.x*speed;pos.z-=right.z*speed;}
      if(keys["d"]||keys["arrowright"]){pos.x+=right.x*speed;pos.z+=right.z*speed;}
      pos.x=Math.max(-half[0],Math.min(half[0],pos.x)); pos.z=Math.max(-half[1],Math.min(half[1],pos.z)); pos.y=1.65;
      updateCamera(); renderer.render(scene,camera);
    };
    animate();
    const onResize=()=>{const w=el.clientWidth,h=el.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);};
    window.addEventListener("resize",onResize);

    return()=>{
      cancelAnimationFrame(frameRef.current);
      el.removeEventListener("mousedown",onMouseDown); 
      el.removeEventListener("touchstart",onTouchStart);
      window.removeEventListener("mousemove",onMouseMove);
      window.removeEventListener("touchmove",onTouchMove);
      el.removeEventListener("click",onClick); window.removeEventListener("keydown",onKeyDown); window.removeEventListener("keyup",onKeyUp);
      window.removeEventListener("resize",onResize);
      if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  },[room,nightMode]);

  const hintColor = nightMode ? "rgba(212,175,55,0.6)" : "rgba(120,85,0,0.6)";
  const tooltipBg = nightMode ? "rgba(0,0,0,0.85)" : "rgba(255,248,230,0.95)";
  const tooltipBorder = nightMode ? "#b8960c" : "#a07808";
  const tooltipColor = nightMode ? "#d4af37" : "#7a5500";

  return (
    <div style={{width:"100%",height:"100%",position:"relative"}}>
      <div ref={mountRef} style={{width:"100%",height:"100%",cursor:"crosshair"}}/>
      {hoveredFurniture&&(
        <div style={{position:"absolute",bottom:80,left:"50%",transform:"translateX(-50%)",background:tooltipBg,border:`1px solid ${tooltipBorder}`,borderRadius:8,padding:"6px 16px",color:tooltipColor,fontFamily:"'Montserrat',sans-serif",fontSize:12,letterSpacing:"0.1em",pointerEvents:"none"}}>
          {hoveredFurniture}
        </div>
      )}
      <div style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",background:tooltipBg,border:`1px solid ${tooltipBorder}44`,borderRadius:8,padding:"5px 14px",color:hintColor,fontFamily:"'Montserrat',sans-serif",fontSize:10,letterSpacing:"0.12em",pointerEvents:"none",whiteSpace:"nowrap"}}>
        DRAG TO LOOK · WASD TO WALK · CLICK FURNITURE
      </div>
    </div>
  );
}
