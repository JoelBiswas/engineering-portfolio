import React, {useCallback, useEffect, useRef} from 'react';

const behavior=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';

export default function ProjectSectionTabs({id,sections,section,onSelect}) {
 const row=useRef(null);
 const hoverEdge=useRef(0);
 const reveal=useCallback(button=>{
  if(!button || !row.current)return;
  const container=row.current.getBoundingClientRect();
  const tab=button.getBoundingClientRect();
  const offset=tab.width>container.width || tab.left<container.left+12
   ?tab.left-container.left-12:tab.right>container.right-12?tab.right-container.right+12:0;
  if(offset)row.current.scrollBy({left:offset,behavior:behavior()});
 },[]);
 useEffect(()=>{reveal(row.current?.children[section]);},[section,reveal]);
 const scrollAtEdge=event=>{
  const bounds=row.current.getBoundingClientRect();
  const edge=Math.min(48,bounds.width/4);
  const direction=event.clientX<bounds.left+edge?-1:event.clientX>bounds.right-edge?1:0;
  if(direction && direction!==hoverEdge.current){
   row.current.scrollBy({left:direction*row.current.clientWidth*.35,behavior:behavior()});
  }
  hoverEdge.current=direction;
 };
 const scroll=direction=>row.current.scrollBy({left:direction*row.current.clientWidth*.7,behavior:behavior()});
 return <div className="project-tab-navigation">
  <button type="button" className="section-scroll-arrow" aria-label="Scroll headings left" onClick={()=>scroll(-1)}>‹</button>
  <div ref={row} className="project-section-tabs" role="tablist" aria-label="Project sections" onMouseMove={scrollAtEdge} onMouseLeave={()=>{hoverEdge.current=0;}}>
   {sections.map((item,index)=><button type="button" key={item.heading} id={id+'-tab-'+index} role="tab" aria-selected={section===index} aria-controls={id+'-panel'} tabIndex={section===index?0:-1} onFocus={event=>reveal(event.currentTarget)} onMouseEnter={event=>reveal(event.currentTarget)} onClick={()=>onSelect(index)} onKeyDown={event=>{
    let next;
    if(event.key==='ArrowRight')next=(index+1)%sections.length;
    else if(event.key==='ArrowLeft')next=(index-1+sections.length)%sections.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=sections.length-1;
    else return;
    event.preventDefault();onSelect(next);row.current.children[next].focus();
   }}>{item.heading}</button>)}
  </div>
  <button type="button" className="section-scroll-arrow" aria-label="Scroll headings right" onClick={()=>scroll(1)}>›</button>
 </div>;
}
