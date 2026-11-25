// Deterministic UI motion study, based on the user's coverage-planner reference.
// All terrain, telemetry and camera imagery are illustrations; no real robot connection.
const sharp = require('sharp');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs/promises');
const path = require('node:path');
const W = 1200, H = 750, FPS = 24, SECONDS = 14;
const OUT = path.resolve(__dirname, '../public/assets');
const cyan = '#21d9cf', ink = '#091317', muted = '#8ca3a7';
const clamp = n => Math.max(0, Math.min(1, n));
const ease = n => { n = clamp(n); return n * n * (3 - 2 * n); };
const rect = (x,y,w,h,fill,rx=12,stroke='none') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}"/>`;
const text = (x,y,s,size=18,fill='#eaf4f3',weight=400) => `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}">${s}</text>`;
const circle = (x,y,r,fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const line = (points,color,width=2,extra='') => `<polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
let seed=7;
const random = () => { seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; };
const trees = Array.from({length:85},()=>{
  const x=95+random()*680, y=100+random()*390, r=5+random()*13;
  if(x>290&&x<625&&y>150&&y<440) return '';
  return circle(x+3,y+4,r,'#15322e')+circle(x,y,r,['#416950','#527450','#345d46'][Math.floor(random()*3)]);
}).join('');
const boundary=[[300,180],[570,180],[620,230],[620,390],[580,430],[300,430],[275,390],[275,225],[300,180]];
const route=[];
for(let i=0;i<8;i++) {
  const y=210+i*27, a=[305,y], b=[590,y];
  route.push(...(i%2?[b,a]:[a,b]));
}
const lengths=route.slice(1).map((p,i)=>Math.hypot(p[0]-route[i][0],p[1]-route[i][1]));
const total=lengths.reduce((a,b)=>a+b,0);
function travel(progress) {
  let remaining=progress*total, points=[route[0]], pos=route[0], angle=0;
  for(let i=0;i<lengths.length;i++) {
    const a=route[i],b=route[i+1],k=Math.min(1,remaining/lengths[i]);
    pos=[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k];
    angle=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;
    points.push(pos); remaining-=lengths[i]; if(remaining<=0) break;
  }
  return {points,pos,angle};
}
function frame(t) {
  const planned=t>=3.1, running=t>=4.7&&t<11, done=t>=11;
  const progress=clamp((t-4.7)/6.3), trip=travel(progress);
  const reveal=ease((t-3.1)/1.0);
  const status=done?'Complete':running?'Running':planned?'Ready to start':'Draw area';
  let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><clipPath id="map">${rect(78,75,798,435,'white')}</clipPath><linearGradient id="sea" x2="1" y2="1"><stop stop-color="#225c62"/><stop offset="1" stop-color="#0d303e"/></linearGradient><linearGradient id="land" x2="1" y2="1"><stop stop-color="#617b50"/><stop offset="1" stop-color="#2b5547"/></linearGradient></defs><g font-family="Segoe UI, Arial, sans-serif">`;
  s+=rect(0,0,W,H,ink,0)+rect(0,0,60,H,'#0c1b20',0);
  s+=text(18,39,'B',24,cyan,700);
  [100,166,232].forEach((y,i)=>{s+=rect(10,y-26,40,44,i===0?'#123d40':'#0c1b20',9);s+=text(21,y+3,['◇','▥','☷'][i],24,i===0?cyan:muted);});
  s+=text(80,40,'Beachbot',24,'#eaf4f3',600)+text(214,40,'/ Coverage planner',20,muted);
  s+=rect(1025,15,150,34,'#12383b',17)+text(1045,38,'SIMULATION',14,cyan,600);
  s+=`<g clip-path="url(#map)">${rect(78,75,798,435,'url(#sea)')}`;
  s+=`<path d="M78 75H632 Q680 126 705 180T716 300 Q710 370 650 420T590 510H78Z" fill="#a0a48a"/><path d="M78 75H610 Q660 130 680 190T690 300 Q684 365 630 405T570 510H78Z" fill="url(#land)"/>`;
  s+=`<path d="M80 145 Q180 130 230 205T240 345Q255 475 550 480" fill="none" stroke="#aeb29a" stroke-width="13"/><path d="M95 147 Q180 135 225 208T235 345Q250 470 550 480" fill="none" stroke="#c4c4ac" stroke-width="3"/>`;
  s+=trees;
  for(let i=0;i<13;i++) {const x=710+(i%3)*40,y=110+i*31;s+=`<path d="M${x} ${y}q12 -5 22 0" fill="none" stroke="#609090" stroke-opacity=".25" stroke-width="2"/>`;}
  const boundaryProgress=clamp((t-.4)/2), vertices=boundary.slice(0,Math.min(boundary.length,1+Math.floor(boundaryProgress*boundary.length)));
  if(t>=.4){s+=line(vertices,cyan,2.3,'stroke-dasharray="6 5"'); vertices.forEach(([vx,vy])=>{s+=circle(vx,vy,4,'#eafffa')+circle(vx,vy,2,cyan);});}
  if(boundaryProgress===1)s+=`<polygon points="${boundary.map(p=>p.join(',')).join(' ')}" fill="${cyan}" fill-opacity=".055"/>`;
  if(planned) s+=line(route,cyan,2.8,`pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1-reveal}" opacity=".8"`);
  if(running||done)s+=line(trip.points,'#e0fff9',6,'opacity=".6"');
  const [x,y]=trip.pos;
  s+=circle(x,y,22,'#21d9cf22')+`<g transform="translate(${x} ${y}) rotate(${trip.angle})">${rect(-11,-8,22,16,'#effcf9',4,'#063b40')}${rect(5,-5,7,10,cyan,2)}<path d="M-7 -10v-3M6 -10v-3M-7 10v3M6 10v3" stroke="#effcf9" stroke-width="3"/></g>`;
  s+=rect(98,94,154,29,'#0b1c23bb',8)+text(112,114,'ILLUSTRATED MAP',11,'#d6e6df',600);
  s+=rect(100,398,34,78,'#0b1c23dd',7)+text(111,423,'+',22)+text(112,462,'−',22);
  s+=line([[151,468],[221,468]],'#eaf4f3',2)+text(171,490,'20 m',12);
  // Small camera illustration: enough to suggest the view without competing with the map.
  s+=rect(650,362,206,130,'#8faeb4',10,'#36535b')+`<path d="M651 430L703 395 741 418 781 406 855 424V490H651Z" fill="#4e7049"/><path d="M736 491L775 423 794 423 806 491" fill="#b7b7a2"/>`;
  s+=rect(658,370,96,23,'#0b1c23cc',6)+circle(669,381,3,cyan)+text(679,386,'Camera mock',11);
  s+='</g>';
  s+=rect(890,75,286,435,'#0f1e24',12,'#20353c')+text(914,111,'Robot status',21,'#eaf4f3',600);
  s+=text(914,149,'beach-sim-01',17,muted)+circle(919,179,4,'#2de29d')+text(932,185,'Connected',15);
  s+=line([[912,210],[1152,210]],'#263b40',1);
  s+=text(914,249,'Battery',16,muted)+text(1100,249,'85%',20)+rect(914,267,238,4,'#263b40',2)+rect(914,267,202,4,cyan,2);
  s+=text(914,318,'GPS',16,muted)+text(1060,318,'RTK Fixed',18,cyan);
  s+=text(914,373,'Mission',16,muted)+text(1034,373,status,17,done?cyan:'#eaf4f3');
  s+=text(914,425,'Coverage',16,muted)+text(1072,431,`${Math.round(progress*89)}%`,30,'#eaf4f3',600);
  s+=text(914,481,done?'Simulation result':'Auto coverage',14,muted);
  s+=rect(78,524,1098,48,'#102128',10,'#20353c')+text(99,555,'Manual',17,muted)+text(203,555,'Auto',17,cyan,600)+text(280,555,'›',20,muted)+text(310,555,'Coverage Plan 1',17);
  s+=rect(78,586,250,140,'#0f1e24',12,'#20353c')+text(98,619,'Plan',16,muted)+rect(95,638,216,45,'#12373b',8,'#217078')+circle(113,660,5,cyan)+text(130,666,'Coverage Plan 1',16)+text(98,708,'1 work area',14,muted);
  s+=rect(342,586,478,140,'#0f1e24',12,'#20353c')+text(364,619,'Coverage settings',17,'#eaf4f3',600);
  s+=text(364,658,'Row spacing',16,muted)+text(655,658,'1.0 m',18)+text(364,699,'Margin',16,muted)+text(655,699,'0.6 m',18);
  const button=running?'Running…':done?'Complete':'Start mission';
  s+=rect(834,586,342,140,'#0f1e24',12,'#20353c')+text(856,619,'Mission',17,'#eaf4f3',600);
  s+=rect(855,638,139,49,'#173138',8,'#345259')+text(867,669,'Generate path',16,cyan,600);
  s+=rect(1005,638,150,49,cyan,8)+text(1018,669,button,16,'#072326',600);
  // Pointer arrives, presses Preview, then Start; hides while robot moves.
  let pointer=null;
  if(t<2.4){const k=clamp((t-.4)/2)*(boundary.length-1),i=Math.min(boundary.length-2,Math.floor(k)),f=ease(k-i);pointer=[boundary[i][0]+(boundary[i+1][0]-boundary[i][0])*f,boundary[i][1]+(boundary[i+1][1]-boundary[i][1])*f,Math.abs(k-Math.round(k))<.1];}
  else if(t<3.4){const k=ease((t-2.4)/.6);pointer=[300+624*k,180+480*k,t>=3.05&&t<3.25];}
  else if(t<4.9){const k=ease((t-4)/.5);pointer=[924+150*k,660,t>=4.6&&t<4.85];}
  if(pointer){const [px,py,press]=pointer;if(press)s+=circle(px,py,18,'#ffffff33');s+=`<path d="M${px} ${py}l5 22 5-8 9-2Z" fill="white" stroke="#07161a" stroke-width="1.5"/>`;}
  s+='</g></svg>';
  return s;
}
async function renderVideo(name, draw, seconds, posterTime){
  await fs.mkdir(OUT,{recursive:true});
  await sharp(Buffer.from(draw(posterTime))).jpeg({quality:92}).toFile(path.join(OUT,`${name}.jpg`));
  const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',`${W}x${H}`,'-r',String(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',path.join(OUT,`${name}.mp4`)],{stdio:['pipe','inherit','inherit']});
  const finished=once(ff,'close');
  for(let i=0;i<FPS*seconds;i++){
    const data=await sharp(Buffer.from(draw(i/FPS))).removeAlpha().raw().toBuffer();
    if(!ff.stdin.write(data))await once(ff.stdin,'drain');
    if(i%FPS===0)process.stdout.write(`${name}: ${i/FPS}/${seconds}s\n`);
  }
  ff.stdin.end();const [code]=await finished;if(code!==0)throw new Error(`ffmpeg exit ${code}`);
}
module.exports={renderVideo,rect,text,circle,line,clamp,ease};
if(require.main===module)renderVideo('beachbot-coverage',frame,SECONDS,4.2).catch(e=>{console.error(e);process.exitCode=1;});
