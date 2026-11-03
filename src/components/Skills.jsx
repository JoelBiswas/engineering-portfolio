import React from 'react';
import SkillCard from './SkillCard';
import pythonLogo from '../images/skills/python.png';
import gitLogo from '../images/skills/git.png';
const logos={
 'Python':pythonLogo,
 'Git':gitLogo,
 'C++':'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/cplusplus/cplusplus-original.svg',
 'KiCad':'https://cdn.simpleicons.org/kicad/314CB0',
 'ESP32':'https://cdn.simpleicons.org/espressif/E7352C',
 'Onshape':'https://cdn.simpleicons.org/onshape/1B8600',
 'Fusion 360':'https://cdn.simpleicons.org/autodesk/ED7427'
};
const localIcon=name=>process.env.PUBLIC_URL+'/images/engineering/'+name.toLowerCase().replaceAll(' ','-').replaceAll('+','p')+'.svg';
const rows = [['SystemVerilog','RISC-V','RTL Design','Xcelium','Digital Logic','Verification'],['Onshape','KiCad','ESP32','C++','Fusion 360','3D Printing'],['Motor Control','Wireless','FEA','Python','Soldering','Git']];
export default function Skills() {
 return <div id="skills" className="mt-8">
  <h2 className="text-[var(--primary)] tracking-[1px] text-center text-4xl">Skills</h2>
  <div className="mx-4">{rows.map((row,index)=><div key={index} className="overflow-hidden w-full">
   <div className={'flex space-x-4 '+(index % 2 ? 'animate-slideLeft':'animate-slideRight')}>
    {[...row,...row].map((name,i)=><SkillCard key={i} name={name} image={logos[name] || localIcon(name)} fallback={localIcon(name)} />)}
   </div>
  </div>)}</div>
 </div>;
}
