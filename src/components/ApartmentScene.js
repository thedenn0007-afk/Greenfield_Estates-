import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FLOORS } from "../data";

export default function ApartmentScene({ selectedFloor, onFloorClick, nightMode }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const camRef = useRef({ theta:0.55, phi:0.72, radius:230 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x:0, y:0 });
  const floorMeshesRef = useRef([]);

  useEffect(()=>{
    const el=mountRef.current; if(!el) return;
    const W=el.clientWidth, H=el.clientHeight;
    const scene=new THREE.Scene();

    const skyColor = nightMode ? "#030303" : "#c9e8f5";
    scene.background=new THREE.Color(skyColor);
    scene.fog=new THREE.Fog(skyColor, nightMode?250:300, nightMode?550:700);

    const camera=new THREE.PerspectiveCamera(52,W/H,0.5,800);
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.shadowMap.enabled=true; el.appendChild(renderer.domElement); rendererRef.current=renderer;

    // Ground
    const groundColor = nightMode ? 0x060606 : 0x7ab55c;
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),new THREE.MeshLambertMaterial({color:groundColor}));
    ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
    const gridColor = nightMode ? 0x1a1400 : 0x5a9040;
    const gridH=new THREE.GridHelper(500,40,gridColor,gridColor); gridH.position.y=0.1; scene.add(gridH);

    // Pool
    const poolWaterColor = nightMode ? 0x001a33 : 0x1a9ed4;
    const pool=new THREE.Mesh(new THREE.BoxGeometry(44,1.2,26),new THREE.MeshLambertMaterial({color:poolWaterColor,transparent:true,opacity:0.9}));
    pool.position.set(-72,0.6,55); scene.add(pool);
    const poolBorder=new THREE.Mesh(new THREE.BoxGeometry(46,0.5,28),new THREE.MeshLambertMaterial({color:0xb8960c}));
    poolBorder.position.set(-72,0,55); scene.add(poolBorder);
    const water=new THREE.Mesh(new THREE.PlaneGeometry(42,24),new THREE.MeshLambertMaterial({color:nightMode?0x003366:0x0099cc,transparent:true,opacity:0.7}));
    water.rotation.x=-Math.PI/2; water.position.set(-72,1.25,55); scene.add(water);

    // Walking track
    const trackColor = nightMode ? 0x1a1200 : 0xcc9933;
    const trackRing=new THREE.Mesh(new THREE.RingGeometry(56,63,48),new THREE.MeshLambertMaterial({color:trackColor,side:THREE.DoubleSide}));
    trackRing.rotation.x=-Math.PI/2; trackRing.position.set(-72,0.15,55); scene.add(trackRing);

    // Garden
    const gardenColor = nightMode ? 0x0a1a08 : 0x4aaa2a;
    const garden=new THREE.Mesh(new THREE.BoxGeometry(90,0.3,20),new THREE.MeshLambertMaterial({color:gardenColor}));
    garden.position.set(-20,0.15,90); scene.add(garden);

    // Building podium
    const podiumColor = nightMode ? 0x0c0c08 : 0xe8e0cc;
    const podium=new THREE.Mesh(new THREE.BoxGeometry(90,5,65),new THREE.MeshLambertMaterial({color:podiumColor}));
    podium.position.set(20,2.5,0); podium.castShadow=true; scene.add(podium);
    const podiumTrim=new THREE.Mesh(new THREE.BoxGeometry(92,1,67),new THREE.MeshLambertMaterial({color:0xb8960c}));
    podiumTrim.position.set(20,5,0); scene.add(podiumTrim);

    // Parking
    const parkingColor = nightMode ? 0x080808 : 0xbbbbbb;
    const parking=new THREE.Mesh(new THREE.BoxGeometry(90,3,65),new THREE.MeshLambertMaterial({color:parkingColor}));
    parking.position.set(20,-1.5,0); scene.add(parking);

    // Building floors
    floorMeshesRef.current=[];
    const floorH=12, startY=5;
    const floorColors = nightMode
      ? [0x111100, 0x111100, 0x111100, 0x111100]
      : [0xf5edd8, 0xf0e8d0, 0xeee0c8, 0xeadcc0];
    const selectedFloorColor = nightMode ? 0x2a2000 : 0xd4c070;

    FLOORS.forEach((floor,idx)=>{
      const isSel=selectedFloor?.id===floor.id;
      const floorMat=new THREE.MeshLambertMaterial({
        color:isSel?selectedFloorColor:floorColors[idx],
        emissive:isSel?(nightMode?0x1a1000:0x2a1800):0x000000,
        emissiveIntensity:isSel?0.2:0,
      });
      const floorMesh=new THREE.Mesh(new THREE.BoxGeometry(86,floorH,62),floorMat);
      floorMesh.position.set(20,startY+idx*floorH+floorH/2,0);
      floorMesh.castShadow=true; floorMesh.userData={floorId:floor.id};
      scene.add(floorMesh); floorMeshesRef.current.push(floorMesh);

      // Slab
      const slabColor = isSel ? 0xd4af37 : (nightMode ? 0x2a1e00 : 0xc8a830);
      const slab=new THREE.Mesh(new THREE.BoxGeometry(88,0.8,64),new THREE.MeshLambertMaterial({color:slabColor}));
      slab.position.set(20,startY+idx*floorH,0); scene.add(slab);

      // Windows
      const winColor = nightMode ? 0x1a1200 : 0x88ccee;
      const winEmissive = nightMode ? 0x2a1800 : 0x000000;
      const winMat=new THREE.MeshLambertMaterial({color:winColor,transparent:true,opacity:nightMode?0.85:0.7,emissive:winEmissive,emissiveIntensity:nightMode?0.6:0});
      for(let w=-3;w<=3;w++){
        [-1,1].forEach(side=>{
          const win=new THREE.Mesh(new THREE.BoxGeometry(7,5,0.4),winMat);
          win.position.set(20+w*11,startY+idx*floorH+6,side*31.3); scene.add(win);
          const frame=new THREE.Mesh(new THREE.BoxGeometry(7.4,5.4,0.2),new THREE.MeshLambertMaterial({color:0xb8960c}));
          frame.position.set(20+w*11,startY+idx*floorH+6,side*31.5); scene.add(frame);
        });
      }
      // Balcony
      const balColor = nightMode ? 0x0a0800 : 0xddccaa;
      const railMat=new THREE.MeshLambertMaterial({color:0xb8960c});
      for(let bw=-3;bw<=3;bw++){
        const bal=new THREE.Mesh(new THREE.BoxGeometry(9,0.3,3),new THREE.MeshLambertMaterial({color:balColor}));
        bal.position.set(20+bw*11,startY+idx*floorH+1,32.5); scene.add(bal);
        const rail=new THREE.Mesh(new THREE.BoxGeometry(9,2.5,0.15),railMat);
        rail.position.set(20+bw*11,startY+idx*floorH+2.5,34); scene.add(rail);
      }
    });

    // Rooftop
    const roofH=startY+FLOORS.length*floorH;
    const roofColor = nightMode ? 0x0c0c00 : 0xddcc88;
    const roof=new THREE.Mesh(new THREE.BoxGeometry(88,4,64),new THREE.MeshLambertMaterial({color:roofColor}));
    roof.position.set(20,roofH+2,0); scene.add(roof);
    const roofTrim=new THREE.Mesh(new THREE.BoxGeometry(90,1,66),new THREE.MeshLambertMaterial({color:0xb8960c}));
    roofTrim.position.set(20,roofH+3.5,0); scene.add(roofTrim);
    const spire=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,18,8),new THREE.MeshLambertMaterial({color:0xd4af37}));
    spire.position.set(20,roofH+14,0); scene.add(spire);
    const spireTop=new THREE.Mesh(new THREE.ConeGeometry(1.5,3,8),new THREE.MeshLambertMaterial({color:0xd4af37}));
    spireTop.position.set(20,roofH+24,0); scene.add(spireTop);

    // Gate
    const gateBodyColor = nightMode ? 0x1a1200 : 0xf0ead8;
    [[-15,65],[15,65]].forEach(([gx,gz])=>{
      const p=new THREE.Mesh(new THREE.BoxGeometry(4,18,4),new THREE.MeshLambertMaterial({color:gateBodyColor}));
      p.position.set(gx+20,9,gz); scene.add(p);
      const cap=new THREE.Mesh(new THREE.BoxGeometry(5,3,5),new THREE.MeshLambertMaterial({color:0xb8960c}));
      cap.position.set(gx+20,19,gz); scene.add(cap);
    });
    const gBeam=new THREE.Mesh(new THREE.BoxGeometry(34,3,3),new THREE.MeshLambertMaterial({color:0xb8960c}));
    gBeam.position.set(20,17,65); scene.add(gBeam);

    // Trees
    const trunkC = nightMode ? 0x1a0d00 : 0x5d3a1a;
    const crownC = nightMode ? 0x0a1a08 : 0x2d8a2d;
    const addTree=(x,z)=>{
      const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.9,7,8),new THREE.MeshLambertMaterial({color:trunkC}));
      trunk.position.set(x,3.5,z); scene.add(trunk);
      const crown=new THREE.Mesh(new THREE.SphereGeometry(4,8,6),new THREE.MeshLambertMaterial({color:crownC}));
      crown.position.set(x,9,z); scene.add(crown);
    };
    [-50,-30,-10,10,30,50,70,90].forEach(x=>addTree(x,-95));
    [-60,-40,-20,0,20,40,60].forEach(x=>addTree(x,95));
    [-50,-30,-10,10,30,50].forEach(z=>{addTree(-100,z);addTree(140,z);});

    // Lighting
    if(nightMode){
      scene.add(new THREE.AmbientLight(0x0d0b00,0.4));
      const sun=new THREE.DirectionalLight(0x1a1500,0.5);
      sun.position.set(100,180,80); sun.castShadow=true; scene.add(sun);
      scene.add(new THREE.DirectionalLight(0xb8960c,0.2));
      const poolGlow=new THREE.PointLight(0x003366,0.8,60);
      poolGlow.position.set(-72,3,55); scene.add(poolGlow);
    } else {
      scene.add(new THREE.AmbientLight(0xfff5e0,0.6));
      const sun=new THREE.DirectionalLight(0xffffff,1.3);
      sun.position.set(120,200,90); sun.castShadow=true; sun.shadow.mapSize.width=2048; sun.shadow.mapSize.height=2048; scene.add(sun);
      scene.add(new THREE.HemisphereLight(0x87ceeb,0x7ab55c,0.35));
    }

    const updateCamera=()=>{
      const c=camRef.current;
      camera.position.x=20+c.radius*Math.sin(c.theta)*Math.sin(c.phi);
      camera.position.y=c.radius*Math.cos(c.phi)+25;
      camera.position.z=c.radius*Math.cos(c.theta)*Math.sin(c.phi);
      camera.lookAt(20,30,0);
    };
    updateCamera();

    const onMouseDown=(e)=>{isDraggingRef.current=false;lastMouseRef.current={x:e.clientX,y:e.clientY};};
    const onTouchStart=(e)=>{isDraggingRef.current=false;const touch=e.touches[0];lastMouseRef.current={x:touch.clientX,y:touch.clientY};};
    const onMouseMove=(e)=>{
      if(e.buttons===1){
        isDraggingRef.current=true;
        camRef.current.theta-=(e.clientX-lastMouseRef.current.x)*0.005;
        camRef.current.phi=Math.max(0.12,Math.min(1.5,camRef.current.phi+(e.clientY-lastMouseRef.current.y)*0.005));
        lastMouseRef.current={x:e.clientX,y:e.clientY}; updateCamera();
      }
    };
    const onTouchMove=(e)=>{
      e.preventDefault();
      if(e.touches.length===1){
        isDraggingRef.current=true;
        const touch=e.touches[0];
        camRef.current.theta-=(touch.clientX-lastMouseRef.current.x)*0.005;
        camRef.current.phi=Math.max(0.12,Math.min(1.5,camRef.current.phi+(touch.clientY-lastMouseRef.current.y)*0.005));
        lastMouseRef.current={x:touch.clientX,y:touch.clientY}; updateCamera();
      }
    };
    const onWheel=(e)=>{camRef.current.radius=Math.max(50,Math.min(450,camRef.current.radius+e.deltaY*0.28));updateCamera();};
    const onClick=(e)=>{
      if(isDraggingRef.current) return;
      const rect=el.getBoundingClientRect();
      const mouse=new THREE.Vector2(((e.clientX-rect.left)/W)*2-1,-((e.clientY-rect.top)/H)*2+1);
      const raycaster=new THREE.Raycaster(); raycaster.setFromCamera(mouse,camera);
      const hits=raycaster.intersectObjects(floorMeshesRef.current);
      if(hits.length>0){const floor=FLOORS.find(f=>f.id===hits[0].object.userData.floorId);if(floor)onFloorClick(floor);}
    };

    el.addEventListener("mousedown",onMouseDown); 
    el.addEventListener("touchstart",onTouchStart,{passive:true});
    window.addEventListener("mousemove",onMouseMove);
    window.addEventListener("touchmove",onTouchMove,{passive:false});
    el.addEventListener("wheel",onWheel); el.addEventListener("click",onClick);
    const animate=()=>{ frameRef.current=requestAnimationFrame(animate); renderer.render(scene,camera); };
    animate();
    const onResize=()=>{const w=el.clientWidth,h=el.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);};
    window.addEventListener("resize",onResize);

    return()=>{
      cancelAnimationFrame(frameRef.current);
      el.removeEventListener("mousedown",onMouseDown); 
      el.removeEventListener("touchstart",onTouchStart);
      window.removeEventListener("mousemove",onMouseMove);
      window.removeEventListener("touchmove",onTouchMove);
      el.removeEventListener("wheel",onWheel); el.removeEventListener("click",onClick);
      window.removeEventListener("resize",onResize);
      if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  },[nightMode,selectedFloor,onFloorClick]);

  return <div ref={mountRef} style={{width:"100%",height:"100%",cursor:"crosshair"}}/>;
}
