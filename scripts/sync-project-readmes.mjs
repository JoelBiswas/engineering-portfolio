import {readFile, writeFile, rename} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const defaultOutput=fileURLToPath(new URL('../src/components/projectReadmes.json',import.meta.url));

function plainText(text) {
 return text.replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1')
  .replace(/<[^>]+>/g,'').replace(/[*_`]/g,'').replace(/\s+/g,' ').trim();
}

export function parseReadme(source,previous) {
 const normalized=source.replace(/\r\n/g,'\n').replace(/<!--[^]*?-->/g,'');
 const titleMatch=normalized.match(/^#\s+(.+)$/m);
 if(!titleMatch || !/^##\s+\S/m.test(normalized))throw new Error('README needs a title and project section headings');
 const title=plainText(titleMatch[1]);
 const markdown=normalized.replace(titleMatch[0],'').trim();
 // Prefer the introductory paragraph; otherwise use the first section's prose.
 const prose=markdown.replace(/```[^]*?```/g,'\n\n').replace(/^#{1,6}\s+.*$/gm,'\n').replace(/^\s*(?:!\[[^]*?\]\([^\n]*\)|<img[^>]*>)\s*$/gm,'');
 const subtitle=prose.split(/\n\s*\n/).map(block=>block.trim()).filter(Boolean)
  .filter(block=>!/^\s*(?:#|!\[|<|\||```|[-*]\s|\d+\.\s)/.test(block))
  .map(plainText).find(Boolean);
 if(!title || !subtitle)throw new Error('README has no usable title or description');
 return {...previous,title,subtitle,markdown,readmeSource:previous.repository+'/blob/HEAD/README.md'};
}

export async function syncReadmes({output=defaultOutput,fetcher=globalThis.fetch,strict=false,log=console.log,warn=console.warn}={}) {
 const original=await readFile(output,'utf8');
 const cache=JSON.parse(original);
 const results=await Promise.allSettled(Object.entries(cache).map(async([id,project])=>{
  const match=project.repository.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/);
  if(!match)throw new Error(`${id}: invalid GitHub repository`);
  const url=`https://raw.githubusercontent.com/${match[1]}/${match[2]}/HEAD/README.md`;
  try {
   const response=await fetcher(url,{signal:AbortSignal.timeout(12000),headers:{'User-Agent':'engineering-portfolio-readme-sync'}});
   if(!response.ok)throw new Error(`HTTP ${response.status}`);
   return [id,parseReadme(await response.text(),project)];
  } catch(error){throw new Error(`${id}: ${error.message}`);}
 }));
 const failures=results.filter(result=>result.status==='rejected');
 failures.forEach(result=>warn(`README sync: ${result.reason.message}; retaining saved content.`));
 if(strict && failures.length)throw new Error(`README sync failed for ${failures.length} project(s); no content was written.`);
 for(const result of results)if(result.status==='fulfilled'){const [id,project]=result.value;cache[id]=project;}
 const updated=JSON.stringify(cache,null,2)+'\n';
 if(updated.trim()!==original.trim()){
  const temporary=output+'.tmp';
  await writeFile(temporary,updated);await rename(temporary,output);
 }
 log(`README sync: ${results.length-failures.length}/${results.length} refreshed. Layout filters and galleries are unchanged.`);
 return cache;
}

if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 if(process.env.README_SYNC_OFFLINE==='1')console.log('README sync: offline mode; using saved content.');
 else syncReadmes({strict:process.argv.includes('--strict') || process.env.README_SYNC_STRICT==='1'})
  .catch(error=>{console.error(error.message);process.exitCode=1;});
}
