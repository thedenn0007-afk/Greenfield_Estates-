import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PLOTS, STATUS_HEX3 } from "../data";

export default function PlotScene({ filter, onPlotClick, zoomPlot, nightMode }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x:0, y:0 });
  const camRef = useRef({ theta:0.8, phi:0.85, radius:380, targetX:0, targetZ:-60 });
  const keysRef = useRef({});
  const treeGroupRef = useRef(null);
  const timeRef = useRef(0);
  const plotMeshesRef = useRef([]);
  const zoomAnimRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!zoomPlot || !cameraRef.current) return;
    const cam = camRef.current;
    const startR=cam.radius, startTX=cam.targetX, startTZ=cam.targetZ;
    const targetR=90, targetTX=zoomPlot.x, targetTZ=zoomPlot.z;
    let t=0;
    clearInterval(zoomAnimRef.current);
    zoomAnimRef.current = setInterval(()=>{
      t+=0.04; if(t>=1){t=1;clearInterval(zoomAnimRef.current);}
      const ease=t<0.5?2*t*t:-1+(4-2*t)*t;
      cam.radius=startR+(targetR-startR)*ease;
      cam.targetX=startTX+(targetTX-startTX)*ease;
      cam.targetZ=startTZ+(targetTZ-startTZ)*ease;
      cam.phi=Math.max(0.25,0.85-ease*0.4);
      if(cameraRef.current){
        cameraRef.current.position.x=cam.targetX+cam.radius*Math.sin(cam.theta)*Math.sin(cam.phi);
        cameraRef.current.position.y=cam.radius*Math.cos(cam.phi);
        cameraRef.current.position.z=cam.targetZ+cam.radius*Math.cos(cam.theta)*Math.sin(cam.phi);
        cameraRef.current.lookAt(cam.targetX,0,cam.targetZ);
      }
    },16);
    return ()=>clearInterval(zoomAnimRef.current);
  },[zoomPlot]);

  useEffect(()=>{
    const el=mountRef.current; if(!el) return;
    const W=el.clientWidth, H=el.clientHeight;
    const scene=new THREE.Scene();

    // Sky colour
    const skyColor = nightMode ? "#030303" : "#d6eaf8";
    scene.background=new THREE.Color(skyColor);
    scene.fog=new THREE.Fog(skyColor, nightMode?350:450, nightMode?700:900);

    const camera=new THREE.PerspectiveCamera(52,W/H,0.5,1200);
    cameraRef.current=camera;
    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement); rendererRef.current=renderer;

    // Ground
    const groundColor = nightMode ? 0x080808 : 0x8fbc6a;
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(700,700,60,60),new THREE.MeshLambertMaterial({color:groundColor}));
    ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);

    // Grid
    const gridColor = nightMode ? 0x1a1500 : 0x6a9c44;
    const grid=new THREE.GridHelper(700,50,gridColor,gridColor);
    grid.position.y=0.05; scene.add(grid);

    // Roads
    const roadColor = nightMode ? 0x0a0a0a : 0x555555;
    const roadMat=new THREE.MeshLambertMaterial({color:roadColor});
    const addRoad=(x,z,w,d)=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(w,0.3,d),roadMat);
      m.position.set(x,0.15,z); m.receiveShadow=true; scene.add(m);
      // kerb
      const kerbColor = nightMode ? 0x3a2800 : 0x888888;
      const kerbMat=new THREE.MeshLambertMaterial({color:kerbColor});
      const kL=new THREE.Mesh(new THREE.BoxGeometry(w,0.35,0.8),kerbMat);
      kL.position.set(x,0.17,z+d/2); scene.add(kL);
      const kR=new THREE.Mesh(new THREE.BoxGeometry(w,0.35,0.8),kerbMat);
      kR.position.set(x,0.17,z-d/2); scene.add(kR);
    };
    addRoad(0,-205,700,14); addRoad(0,-135,700,10);
    addRoad(0,-65,700,10);  addRoad(0,5,700,14);
    addRoad(-225,-100,14,300); addRoad(225,-100,14,300); addRoad(-5,-100,14,300);

    // Road centre lines
    const dashMat=new THREE.MeshLambertMaterial({color:nightMode?0xb8960c:0xffffff});
    for(let i=-300;i<300;i+=22){
      const d=new THREE.Mesh(new THREE.BoxGeometry(10,0.4,1.2),dashMat);
      d.position.set(i,0.2,-205); scene.add(d);
    }

    // Plots
    plotMeshesRef.current=[];
    PLOTS.forEach(plot=>{
      const visible=filter==="all"||plot.status===filter;
      const col=STATUS_HEX3[plot.status];
      const geo=new THREE.BoxGeometry(plot.w-2,0.6,plot.d-2);
      const mat=new THREE.MeshLambertMaterial({color:col,transparent:true,opacity:visible?0.85:0.12});
      const mesh=new THREE.Mesh(geo,mat);
      mesh.position.set(plot.x,0.3,plot.z); mesh.castShadow=true; mesh.receiveShadow=true;
      mesh.userData={plotId:plot.id,isPlot:true};
      scene.add(mesh);
      const borderColor = nightMode ? col : 0x222222;
      const border=new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(plot.w-1,0.8,plot.d-1)),
        new THREE.LineBasicMaterial({color:borderColor})
      );
      border.position.set(plot.x,0.4,plot.z); scene.add(border);
      const plateColor = nightMode ? 0x1a1200 : 0x333322;
      const plate=new THREE.Mesh(new THREE.BoxGeometry(8,0.5,4),new THREE.MeshLambertMaterial({color:plateColor}));
      plate.position.set(plot.x,1,plot.z); scene.add(plate);
      plotMeshesRef.current.push(mesh);
    });

    // Trees
    const treeGroup=new THREE.Group(); treeGroupRef.current=treeGroup;
    const trunkColor = nightMode ? 0x1a0d00 : 0x5d3a1a;
    const crownColor = nightMode ? 0x0a1a08 : 0x2d7a2d;
    const addTree=(x,z,s=1)=>{
      const trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.7*s,1.1*s,6*s,8),new THREE.MeshLambertMaterial({color:trunkColor}));
      trunk.position.set(x,3*s,z); trunk.castShadow=true; treeGroup.add(trunk);
      const crown=new THREE.Mesh(new THREE.SphereGeometry(5*s,8,6),new THREE.MeshLambertMaterial({color:crownColor}));
      crown.position.set(x,9*s,z); crown.castShadow=true; treeGroup.add(crown);
    };
    for(let i=-260;i<=220;i+=32){addTree(i,-193,0.8);addTree(i,-217,0.75);}
    for(let i=-190;i<=10;i+=28){addTree(-237,i,0.7);addTree(237,i,0.7);}
    scene.add(treeGroup);

    // Clubhouse
    const bldColor = nightMode ? 0x111100 : 0xf5e6c8;
    const clubBase=new THREE.Mesh(new THREE.BoxGeometry(50,16,35),new THREE.MeshLambertMaterial({color:bldColor}));
    clubBase.position.set(-60,8,65); clubBase.castShadow=true; scene.add(clubBase);
    const clubRoof=new THREE.Mesh(new THREE.ConeGeometry(34,12,4),new THREE.MeshLambertMaterial({color:nightMode?0x1a1500:0xcc8800}));
    clubRoof.position.set(-60,22,65); clubRoof.rotation.y=Math.PI/4; scene.add(clubRoof);
    const trim=new THREE.Mesh(new THREE.BoxGeometry(52,1.5,37),new THREE.MeshLambertMaterial({color:0xb8960c}));
    trim.position.set(-60,16.5,65); scene.add(trim);
    // columns
    for(let cx=-70;cx<=-50;cx+=10){
      const col=new THREE.Mesh(new THREE.CylinderGeometry(0.8,0.8,16,8),new THREE.MeshLambertMaterial({color:0xb8960c}));
      col.position.set(cx,8,83); scene.add(col);
    }

    // Park
    const park=new THREE.Mesh(new THREE.BoxGeometry(65,0.3,55),new THREE.MeshLambertMaterial({color:nightMode?0x0a1a08:0x5aaa3a}));
    park.position.set(145,0.15,65); scene.add(park);
    const parkBorder=new THREE.Mesh(new THREE.BoxGeometry(67,0.5,57),new THREE.MeshLambertMaterial({color:0x2a1800}));
    parkBorder.position.set(145,0,65); scene.add(parkBorder);
    for(let px=120;px<=170;px+=16) for(let pz=42;pz<=88;pz+=16) addTree(px,pz,0.55);

    // Water tower
    const wt=new THREE.Mesh(new THREE.CylinderGeometry(7,7,22,16),new THREE.MeshLambertMaterial({color:nightMode?0x111111:0x999999}));
    wt.position.set(-195,11,75); scene.add(wt);
    const wtCap=new THREE.Mesh(new THREE.ConeGeometry(9,6,16),new THREE.MeshLambertMaterial({color:0xb8960c}));
    wtCap.position.set(-195,25,75); scene.add(wtCap);

    // Gate
    const gateBodyColor = nightMode ? 0x1a1200 : 0xf5f0e0;
    const gateMat=new THREE.MeshLambertMaterial({color:0xb8960c});
    [[-18,95],[18,95]].forEach(([gx,gz])=>{
      const p=new THREE.Mesh(new THREE.BoxGeometry(5,22,5),new THREE.MeshLambertMaterial({color:gateBodyColor}));
      p.position.set(gx,11,gz); scene.add(p);
      const cap=new THREE.Mesh(new THREE.BoxGeometry(6,4,6),gateMat);
      cap.position.set(gx,24,gz); scene.add(cap);
    });
    const arch=new THREE.Mesh(new THREE.BoxGeometry(40,4,4),gateMat);
    arch.position.set(0,22,95); scene.add(arch);

    // Street lights
    const poleColor = nightMode ? 0x1a1400 : 0x888888;
    for(let li=-220;li<=220;li+=45){
      const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.35,12,6),new THREE.MeshLambertMaterial({color:poleColor}));
      pole.position.set(li,6,-197); scene.add(pole);
      const lampEmissive = nightMode ? 0x6a5000 : 0x000000;
      const lamp=new THREE.Mesh(new THREE.SphereGeometry(1,6,6),new THREE.MeshLambertMaterial({color:nightMode?0xd4af37:0xffffcc,emissive:lampEmissive,emissiveIntensity:nightMode?0.5:0}));
      lamp.position.set(li,12.5,-197); scene.add(lamp);
      if(nightMode){const pl=new THREE.PointLight(0xd4af37,0.7,50);pl.position.set(li,12,-197);scene.add(pl);}
    }

    // Lighting
    if(nightMode){
      scene.add(new THREE.AmbientLight(0x0a0800,0.35));
      const sun=new THREE.DirectionalLight(0x1a1200,0.4);
      sun.position.set(120,200,100); sun.castShadow=true;
      sun.shadow.mapSize.width=2048; sun.shadow.mapSize.height=2048;
      scene.add(sun);
      scene.add(new THREE.DirectionalLight(0xb8960c,0.25).position.set(-100,80,-200)&&new THREE.DirectionalLight(0xb8960c,0.25));
    } else {
      scene.add(new THREE.AmbientLight(0xfff5e0,0.65));
      const sun=new THREE.DirectionalLight(0xffffff,1.3);
      sun.position.set(150,250,120); sun.castShadow=true;
      sun.shadow.mapSize.width=2048; sun.shadow.mapSize.height=2048;
      scene.add(sun);
      // Sky fill
      const sky=new THREE.HemisphereLight(0x87ceeb,0x8fbc6a,0.4);
      scene.add(sky);
    }

    const updateCamera=()=>{
      const c=camRef.current;
      camera.position.x=c.targetX+c.radius*Math.sin(c.theta)*Math.sin(c.phi);
      camera.position.y=c.radius*Math.cos(c.phi);
      camera.position.z=c.targetZ+c.radius*Math.cos(c.theta)*Math.sin(c.phi);
      camera.lookAt(c.targetX,0,c.targetZ);
    };
    updateCamera();

    const onMouseDown=(e)=>{isDraggingRef.current=false;lastMouseRef.current={x:e.clientX,y:e.clientY};};
    const onMouseMove=(e)=>{
      if(e.buttons===1){
        isDraggingRef.current=true;
        camRef.current.theta-=(e.clientX-lastMouseRef.current.x)*0.005;
        camRef.current.phi=Math.max(0.18,Math.min(1.45,camRef.current.phi+(e.clientY-lastMouseRef.current.y)*0.005));
        lastMouseRef.current={x:e.clientX,y:e.clientY}; updateCamera();
      }
    };
    const onWheel=(e)=>{camRef.current.radius=Math.max(50,Math.min(650,camRef.current.radius+e.deltaY*0.35));updateCamera();};
    const onClick=(e)=>{
      if(isDraggingRef.current) return;
      const rect=el.getBoundingClientRect();
      const mouse=new THREE.Vector2(((e.clientX-rect.left)/W)*2-1,-((e.clientY-rect.top)/H)*2+1);
      const raycaster=new THREE.Raycaster(); raycaster.setFromCamera(mouse,camera);
      const hits=raycaster.intersectObjects(plotMeshesRef.current);
      if(hits.length>0){const plot=PLOTS.find(p=>p.id===hits[0].object.userData.plotId);if(plot)onPlotClick(plot,{x:e.clientX,y:e.clientY});}
    };
    const onKeyDown=(e)=>{keysRef.current[e.key.toLowerCase()]=true;};
    const onKeyUp=(e)=>{keysRef.current[e.key.toLowerCase()]=false;};

    el.addEventListener("mousedown",onMouseDown); window.addEventListener("mousemove",onMouseMove);
    el.addEventListener("wheel",onWheel); el.addEventListener("click",onClick);
    window.addEventListener("keydown",onKeyDown); window.addEventListener("keyup",onKeyUp);

    const animate=()=>{
      frameRef.current=requestAnimationFrame(animate); timeRef.current+=0.008;
      const keys=keysRef.current;
      if(keys["w"]||keys["arrowup"])    camRef.current.phi=Math.max(0.18,camRef.current.phi-0.012);
      if(keys["s"]||keys["arrowdown"])  camRef.current.phi=Math.min(1.45,camRef.current.phi+0.012);
      if(keys["a"]||keys["arrowleft"])  camRef.current.theta-=0.018;
      if(keys["d"]||keys["arrowright"]) camRef.current.theta+=0.018;
      if(keys["q"]) camRef.current.radius=Math.max(50,camRef.current.radius-3);
      if(keys["e"]) camRef.current.radius=Math.min(650,camRef.current.radius+3);
      if(Object.values(keys).some(Boolean)) updateCamera();
      if(treeGroupRef.current) treeGroupRef.current.children.forEach((c,i)=>{if(c.geometry.type==="SphereGeometry")c.rotation.z=Math.sin(timeRef.current+i*0.4)*0.03;});
      renderer.render(scene,camera);
    };
    animate();

    const onResize=()=>{if(!el)return;const w=el.clientWidth,h=el.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);};
    window.addEventListener("resize",onResize);

    return()=>{
      cancelAnimationFrame(frameRef.current);
      el.removeEventListener("mousedown",onMouseDown); window.removeEventListener("mousemove",onMouseMove);
      el.removeEventListener("wheel",onWheel); el.removeEventListener("click",onClick);
      window.removeEventListener("keydown",onKeyDown); window.removeEventListener("keyup",onKeyUp);
      window.removeEventListener("resize",onResize);
      if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  },[nightMode,filter,onPlotClick]);

  return <div ref={mountRef} style={{width:"100%",height:"100%",cursor:"crosshair"}}/>;
}
