import React from 'react';

export default function SkillCard({name,image,fallback}) {
 return <div className="skill-card w-1/6 flex-shrink-0 hover:scale-110 transition-transform duration-300 ease-in-out">
  <div className="skill-logo"><img src={image} alt={name} loading="lazy" onError={event=>{if(fallback && event.currentTarget.getAttribute('src')!==fallback)event.currentTarget.src=fallback;}}/></div>
  <h2 className="text-[var(--dark)] text-center text-[16px]">{name}</h2>
 </div>;
}
