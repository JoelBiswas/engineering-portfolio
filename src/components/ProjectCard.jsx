import React, {useRef, useState} from 'react';
import galleries from './projectGalleries.json';
import readmes from './projectReadmes.json';
import ReadmeContent, {readmeSections} from './ReadmeContent';
import ProjectTag from './ProjectTag';
import ProjectTechnology from './ProjectTechnology';
export default function ProjectCard({id,name,tags,technologies,description,links,images}){
 const dialog=useRef(null);
 const [active,setActive]=useState(0);
 const [section,setSection]=useState(0);
 const readme=readmes[id];
 const sections=readmeSections(readme.markdown);
 const media=images || [{file:id+'.svg',alt:name+' — placeholder image'}];
 const gallery=[...media,...(galleries[id] || [])];
 const imageUrl=item=>process.env.PUBLIC_URL+'/images/engineering/'+item.file;
 const openProject=()=>{setActive(0);setSection(0);dialog.current.showModal();};
 const advance=direction=>setActive(index=>(index+direction+gallery.length)%gallery.length);
 const renderImages=()=> <div className={'project-media'+(media.length>1?' project-media-pair':'')}>{media.map(item=><img key={item.file} src={process.env.PUBLIC_URL+'/images/engineering/'+item.file} alt={item.alt} loading="lazy"/>)}</div>;
 return <article className="project-card">
  <button type="button" className="project-image-button" onClick={openProject} aria-label={'Read about '+name}>
   {renderImages()}
   <span className="project-hover">CLICK TO VIEW PROJECT</span>
  </button>
  <div className="project-card-copy">
   <h2 className="text-[var(--light)] text-2xl underline"><button type="button" onClick={openProject}>{readme.title}</button></h2>
   <div className="flex gap-2 mb-3 flex-wrap">{tags.map(tag=><ProjectTag key={tag} name={tag}/>)}</div>
   <p className="project-description">{description}</p>
   <div className="flex gap-2 flex-wrap">{technologies.map(name=><ProjectTechnology key={name} name={name} image={process.env.PUBLIC_URL+'/images/engineering/'+name.toLowerCase().replaceAll(' ','-').replaceAll('+','p')+'.svg'}/>)}</div>
  </div>
  <dialog ref={dialog} className="project-dialog" aria-labelledby={id+'-title'} onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}>
   <div className="dialog-content"><form method="dialog"><button className="dialog-close" aria-label="Close project details">Close ×</button></form>
    <header className="project-detail-header"><h2 id={id+'-title'}>{readme.title}</h2><p className="project-subtitle">{readme.subtitle}</p></header>
    <section className="project-gallery" aria-label={readme.title+' photo gallery'} tabIndex={0} onKeyDown={event=>{if(event.key==='ArrowRight'){event.preventDefault();advance(1);}if(event.key==='ArrowLeft'){event.preventDefault();advance(-1);}}}>
     <figure>
      <div className="gallery-stage"><img className="gallery-main-image" src={imageUrl(gallery[active])} alt={gallery[active].alt}/>
       <button type="button" className="gallery-arrow gallery-prev" onClick={()=>advance(-1)} aria-label="Previous photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 12H4m7-7-7 7 7 7"/></svg></button>
       <button type="button" className="gallery-arrow gallery-next" onClick={()=>advance(1)} aria-label="Next photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-7-7 7 7-7 7"/></svg></button>
      </div>
      <div className="gallery-dots">{gallery.map((item,index)=><button type="button" key={item.file} aria-label={'Show '+item.alt} aria-pressed={active===index} onClick={()=>setActive(index)}/>)}</div>
      <figcaption aria-live="polite">{gallery[active].alt} <span>— {active+1}/{gallery.length}</span></figcaption>
     </figure>
    </section>
    <div className="project-section-tabs" role="tablist" aria-label="README sections">{sections.map((item,index)=><button type="button" key={item.heading} id={id+'-tab-'+index} role="tab" aria-selected={section===index} aria-controls={id+'-panel'} tabIndex={section===index?0:-1} onClick={()=>setSection(index)} onKeyDown={event=>{let next;if(event.key==='ArrowRight')next=(index+1)%sections.length;else if(event.key==='ArrowLeft')next=(index-1+sections.length)%sections.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=sections.length-1;else return;event.preventDefault();setSection(next);event.currentTarget.parentElement.children[next].focus();}}>{item.heading}</button>)}</div>
    <section className="readme-content" id={id+'-panel'} role="tabpanel" aria-labelledby={id+'-tab-'+section} tabIndex={0}><ReadmeContent body={sections[section].body} repository={readme.repository}/></section>
    <div className="project-links">{links.map(([label,url])=><a key={url} href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a>)}</div>
   </div>
  </dialog>
 </article>
}
