// 2D SLAM-style UI illustration. Generated waypoints demonstrate a proposed app flow,
// not recorded robot performance or a claim about production area-planning functionality.
const {renderVideo,rect,text,circle,line,clamp,ease}=require('./render-beachbot-video.cjs');
const cyan='#0caea9',muted='#71838d',fg='#22333d';
const area=[[343,232],[675,232],[675,493],[343,493],[343,232]];
const start=[320,348],wps=[[400,288],[610,288],[610,441],[400,441]],route=[start,...wps];
const lengths=route.slice(1).map((p,i)=>Math.hypot(p[0]-route[i][0],p[1]-route[i][1]));
const total=lengths.reduce((a,b)=>a+b,0);
const walls=[[[151,167],[151,131],[785,131],[785,618],[151,618],[151,514]],[[151,201],[151,447]],[[151,320],[265,320],[265,401]],[[266,131],[266,246]],[[470,131],[470,195]],[[706,194],[706,347],[785,347]],[[706,424],[706,529]],[[491,551],[491,618]],[[260,519],[260,550],[355,550]],[[577,550],[625,550],[625,618]]];
let seed=19; const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
let speckles='';
walls.forEach(points=>points.slice(1).forEach((b,i)=>{const a=points[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let j=0;j<len/3;j++){const k=rand(),x=a[0]+(b[0]-a[0])*k+(rand()-.5)*16,y=a[1]+(b[1]-a[1])*k+(rand()-.5)*16;speckles+=circle(x,y,.5+rand()*1.6,'#61737a55');}}));
function travel(p){let left=p*total,points=[start],pos=start,angle=0,done=0;for(let i=0;i<lengths.length;i++){const a=route[i],b=route[i+1],k=Math.min(1,left/lengths[i]);pos=[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k];angle=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;points.push(pos);left-=lengths[i];if(left<-.001)break;done++;}return{points,pos,angle,done};}
function frame(t){
  const generated=t>=3.5,running=t>=5.1&&t<11.6,complete=t>=11.6;
  const p=clamp((t-5.1)/6.5),trip=travel(p),areaP=clamp((t-.6)/1.8),routeP=ease((t-3.5)/.7);
  let s=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750"><defs><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">${circle(1,1,.8,'#c5d1d6')}</pattern><clipPath id="m">${rect(80,130,742,534,'white',12)}</clipPath><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5 0 10Z" fill="${cyan}"/></marker></defs><g font-family="Segoe UI, Arial, sans-serif">`;
  s+=rect(0,0,1200,750,'#e9eff1',0)+rect(0,0,62,750,'#101f28',0)+text(19,40,'G',25,'#4edbd1',700);
  [108,175,242].forEach((y,i)=>{s+=rect(9,y-29,44,48,i===0?'#17454a':'#101f28',10)+text(22,y,['◇','☷','⌖'][i],25,i===0?'#4edbd1':'#8297a2');});
  s+=text(83,45,'Unitree Go2',26,fg,600)+text(268,45,'/ Mission control',19,muted);
  s+=rect(1042,19,132,30,'#d6eae8',15)+text(1058,40,'SIMULATION',13,'#24847f',600);
  s+=rect(80,76,742,588,'#f9fbfc',13,'#cdd9dd')+rect(80,76,742,54,'#13272f',13)+rect(80,105,742,25,'#13272f',0);
  s+=text(102,110,'Live map',21,'#edf9f7',600)+circle(712,103,4,'#45d8ac')+text(726,110,'Live',17,'#77d6b9');
  s+=`<g clip-path="url(#m)">${rect(80,130,742,534,'#e4ecef',0)}${rect(80,130,742,534,'url(#dots)',0)}`;
  s+=`<polygon points="151,131 785,131 785,618 151,618" fill="#fff"/>`;
  s+=`<path d="M151 131H266V246H151Z M706 131H785V347H706Z M260 550H355V618H260Z" fill="#f0f4f5"/>`;
  walls.forEach(pts=>{s+=line(pts,'#a1b0b633',12)+line(pts,'#344951',5.5);});s+=speckles;
  // Draw a work area with corner taps, then generate four numbered waypoints.
  if(t>=.6){const count=1+Math.min(4,Math.floor(areaP*4)),verts=area.slice(0,count);if(areaP===1)s+=`<polygon points="${area.map(p=>p.join(',')).join(' ')}" fill="#0caea90d"/>`;s+=line(verts,cyan,2,'stroke-dasharray="7 5"');verts.forEach(([x,y])=>{s+=circle(x,y,5,'white')+circle(x,y,3,cyan);});}
  if(generated){s+=line(route,cyan,2.5,`pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1-routeP}" opacity=".65"`);for(let i=0;i<wps.length;i++){if(t<3.5+i*.14)continue;const [x,y]=wps[i],reached=trip.done>i;s+=circle(x,y,17,'#ffffff')+circle(x,y,13,reached?'#159779':'#5d7682')+text(x-4,y+5,reached?'✓':String(i+1),13,'white',600);}}
  if(running||complete)s+=line(trip.points,cyan,4);
  const [x,y]=trip.pos;s+=circle(x,y,35,'#0caea916')+circle(x,y,23,'#0caea922')+circle(x,y,13,'white')+circle(x,y,10,cyan)+`<path d="M14 0L26 -6 26 6Z" transform="translate(${x} ${y}) rotate(${trip.angle})" fill="${cyan}"/>`;
  // Restrained scan lines keep the map readable.
  if(running){for(let i=0;i<9;i++){const a=(i/9)*Math.PI*2+t*.3;s+=line([[x+16*Math.cos(a),y+16*Math.sin(a)],[x+46*Math.cos(a),y+46*Math.sin(a)]],cyan,1,'opacity=".19"');}}
  s+=rect(99,581,36,64,'#ffffff',8,'#cfdbdf')+text(109,606,'+',20,fg)+text(109,632,'−',20,fg)+line([[164,630],[221,630]],muted,2)+text(178,650,'5 m',11,muted);
  s+=rect(535,632,264,23,'#f5f9faf0',6)+text(547,648,'Illustrated occupancy grid · SLAM',11,muted);
  s+='</g>';
  s+=rect(839,76,337,588,'#ffffff',13,'#cdd9dd')+text(862,111,'Mission planner',21,fg,600);
  const phase=complete?'Complete':running?'Navigating':generated?'Route ready':areaP===1?'Area selected':'Select work area';
  s+=rect(861,130,292,37,'#edf6f5',8)+circle(878,148,4,cyan)+text(891,155,phase,16,'#24847f',600);
  s+=text(862,204,'AREA 01',12,muted,600)+text(862,233,areaP===1?'Work area selected':'Tap corners on the map',17,fg);
  s+=rect(861,252,292,42,generated?'#e8f1f3':'#123f47',8)+text(915,279,'Generate waypoints',16,generated?muted:'#e8fcfa',600);
  s+=text(862,326,'WAYPOINTS',12,muted,600)+text(1108,326,generated?'04':'00',15,fg,600);
  if(!generated)s+=text(862,366,'Generate a route to continue',14,muted);
  else wps.forEach((_,i)=>{const yy=363+i*45,reached=trip.done>i,next=running&&trip.done===i;s+=circle(878,yy-5,12,reached?'#e0f5ec':next?'#d8f1ef':'#eef2f4')+text(874,yy,reached?'✓':String(i+1),12,reached?'#159779':fg,600)+text(902,yy,`Waypoint ${String(i+1).padStart(2,'0')}`,15,fg)+text(1093,yy,reached?'Done':next?'Next':'',12,reached?'#159779':cyan);});
  s+=line([[862,524],[1153,524]],'#e2eaed',1)+text(862,554,'Mission progress',14,muted)+text(1083,558,`${trip.done} / 4`,21,fg,600);
  s+=rect(862,575,291,5,'#e7edef',3)+rect(862,575,Math.max(.01,291*p),5,cyan,3);
  s+=rect(861,604,292,42,generated?cyan:'#cfdbdf',8)+text(965,631,complete?'Complete':running?'Running…':'Start mission',16,generated?'#fff':muted,600);
  s+=rect(80,681,1096,49,'#ffffff',10,'#cdd9dd')+circle(103,705,4,'#24b18b')+text(116,711,'Robot connected',15,fg)+text(316,711,'Localization ready',15,muted)+text(550,711,'Battery 84%',15,muted)+text(799,711,'Map  /  indoor-sim',15,muted)+text(1040,711,'2D SLAM',14,cyan,600);
  let point=null;
  if(t<2.5){const k=clamp((t-.6)/1.8)*4,i=Math.min(3,Math.floor(k)),f=ease(k-i);point=[area[i][0]+(area[i+1][0]-area[i][0])*f,area[i][1]+(area[i+1][1]-area[i][1])*f];}
  else if(t<3.8){const k=ease((t-2.6)/.6);point=[343+(1006-343)*k,232+40*k];}
  else if(t<5.3){const k=ease((t-4)/.7);point=[1006,272+352*k];}
  if(point){const [px,py]=point;if((t>3.4&&t<3.65)||(t>5&&t<5.2))s+=circle(px,py,20,'#0caea922');s+=`<path d="M${px} ${py}l5 22 5-8 9-2Z" fill="#182c35" stroke="white" stroke-width="1.5"/>`;}
  return s+'</g></svg>';
}
renderVideo('go2-slam-mission',frame,14,4.5).catch(e=>{console.error(e);process.exitCode=1;});
