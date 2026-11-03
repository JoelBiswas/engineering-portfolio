import React from 'react';
import galleries from './projectGalleries.json';

function Inline({text, repository}) {
 const parts=text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g);
 return parts.map((part,i)=>{
  const link=part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if(link){const href=/^https?:/.test(link[2])?link[2]:repository+'/blob/HEAD/'+link[2];return <a key={i} href={href} target="_blank" rel="noopener noreferrer">{link[1]}</a>;}
  if(part.startsWith('**'))return <strong key={i}>{part.slice(2,-2)}</strong>;
  if(part.startsWith('`'))return <code key={i}>{part.slice(1,-1)}</code>;
  return part;
 });
}
export function readmeSections(markdown) {
 const sections=[];let current={heading:'',body:[]};let fenced=false;
 markdown.split('\n').forEach(line=>{
  if(line.startsWith('```'))fenced=!fenced;
  if(!fenced && /^## /.test(line)){if(current.heading || current.body.join('').trim())sections.push(current);current={heading:line.slice(3),body:[]};}
  else current.body.push(line);
 });
 if(current.heading || current.body.join('').trim())sections.push(current);
 // The opening paragraph is the subtitle; tabs retain the README's actual headings.
 return sections.filter(section=>section.heading);
}
export default function ReadmeContent({body,repository}) {
 const blocks=[];let i=0;
 const inline=text=><Inline text={text} repository={repository}/>;
 while(i<body.length){
  const line=body[i];
  if(!line.trim()){i++;continue;}
  const image=line.match(/^!\[([^\]]*)\]\((?:<([^>]+)>|([^)]+))\)/);
  const htmlImage=line.match(/^<img.*?src="([^"]+)"/);
  if(image || htmlImage){
   const path=image?(image[2]||image[3]):htmlImage[1];
   const local=Object.values(galleries).flat().find(item=>item.source && decodeURI(item.source).endsWith('/'+path));
   const src=local?process.env.PUBLIC_URL+'/images/engineering/'+local.file:/^https?:/.test(path)?path:repository.replace('github.com','raw.githubusercontent.com')+'/HEAD/'+path;
   blocks.push(<img key={blocks.length} className="readme-image" src={src} alt={image?image[1]:'Project documentation'}/>);i++;continue;
  }
  if(line.startsWith('```')){const lines=[];i++;while(i<body.length&&!body[i].startsWith('```'))lines.push(body[i++]);i++;blocks.push(<pre key={blocks.length}><code>{lines.join('\n')}</code></pre>);continue;}
  if(/^###/.test(line)){blocks.push(<h3 key={blocks.length}>{line.replace(/^#+ /,'')}</h3>);i++;continue;}
  if(line.startsWith('|')){const rows=[];while(i<body.length&&body[i].startsWith('|'))rows.push(body[i++].split('|').slice(1,-1).map(x=>x.trim()));const content=rows.filter(row=>!row.every(cell=>/^:?-+:?$/.test(cell)));blocks.push(<div className="readme-table" key={blocks.length}><table><thead><tr>{content[0].map((cell,j)=><th key={j}>{inline(cell)}</th>)}</tr></thead><tbody>{content.slice(1).map((row,j)=><tr key={j}>{row.map((cell,k)=><td key={k}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>);continue;}
  if(/^[-*] |^\d+\. /.test(line)){const ordered=/^\d/.test(line);const rows=[];while(i<body.length&&/^[-*] |^\d+\. /.test(body[i]))rows.push(body[i++].replace(/^([-*]|\d+\.) /,''));const Tag=ordered?'ol':'ul';blocks.push(<Tag key={blocks.length}>{rows.map((text,j)=><li key={j}>{inline(text)}</li>)}</Tag>);continue;}
  const lines=[];while(i<body.length&&body[i].trim()&&!/^(#+ |```|\||[-*] |\d+\. |!\[|<img)/.test(body[i]))lines.push(body[i++].replace(/<br\s*\/?>/g,''));
  if(lines.length)blocks.push(<p key={blocks.length}>{inline(lines.join(' '))}</p>);else i++;
 }
 return blocks;
}
