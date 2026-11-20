import React from 'react';
import ProjectCard from './ProjectCard';
import projectContent from './projectContent.json';
const projects = [
 {id:'risc-v-core',images:[{file:'risc-v-gallery-1.png',alt:'RISC-V core physical layout'}],tags:['Chip Design','SystemVerilog','RTL'],technologies:['SystemVerilog','RISC-V','Xcelium']},
 {id:'r2d2',images:[{file:'r2d2-photo.jpg',alt:'Photo of the assembled 3D-printed R2-D2 droid'}],tags:['Robotics','Embedded Systems'],technologies:['ESP32','KiCad','Onshape']},
 {id:'controller',images:[{file:'controller-cad.png',alt:'Custom Star Wars RF controller'}],tags:['PCB Design','Wireless','Embedded Systems'],technologies:['ESP32','KiCad','Onshape']},
 {id:'mouse-trap',images:[{file:'mouse-trap-2836.jpg',alt:'Assembled mouse trap with the servo, ESP32, and breadboard wiring'}],tags:['Embedded Systems','CAD','3D Printing'],technologies:['ESP32','KiCad','Onshape','C++']},
 {id:'axial-flux',images:[{file:'motor-cad.png',alt:'CAD render of the assembled axial-flux motor and housing'}],tags:['Motor Design','CAD','FEA'],technologies:['Onshape','Fusion 360','FEA']},
 {id:'ventilator',images:[{file:'ventilator-cad.png',alt:'CAD render of the ventilator compression linkage and AMBU bag'}],tags:['Electromechanical Design','Embedded Control','Prototyping'],technologies:['Onshape','ESP32','C++','Motor Control']}
];
export default function Projects(){return <div id="projects" className="mt-8">
 <h2 className="mt-3 mb-3 text-center text-[var(--primary)] text-4xl tracking-[1px]">Projects</h2>
 <div className="project-list">{projects.map(project=><ProjectCard key={project.id} {...project} name={projectContent[project.id].title} description={projectContent[project.id].subtitle.split(/(?<=\.)\s/)[0]} links={[["GitHub repository",projectContent[project.id].repository]]}/>)}</div>
</div>}
