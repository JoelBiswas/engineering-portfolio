import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {parseReadme,syncReadmes} from './sync-project-readmes.mjs';

const previous={title:'Old',subtitle:'Old subtitle',markdown:'## Old\nOld copy',repository:'https://github.com/example/project'};
const source='# New title\n\n![Photo](photo.png)\n\nNew **project** summary.\n\n## New heading\nNew information.';
test('derives the title, subtitle, and headings from new README text',()=>{
 const result=parseReadme(source,previous);
 assert.equal(result.title,'New title');assert.equal(result.subtitle,'New project summary.');
 assert.match(result.markdown,/## New heading/);assert.equal(result.repository,previous.repository);
 assert.equal(parseReadme('# Ventilator\n## The Concept\nA low-cost design.',previous).subtitle,'A low-cost design.');
 assert.throws(()=>parseReadme('404: Not Found',previous));
});
test('fetches the default-branch README and updates the saved content',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'readme-sync-'));const output=join(directory,'readmes.json');
 try {
  await writeFile(output,JSON.stringify({project:previous}));
  await syncReadmes({output,log:()=>{},fetcher:async url=>{
   assert.equal(url,'https://raw.githubusercontent.com/example/project/HEAD/README.md');
   return {ok:true,text:async()=>source};
  }});
  assert.equal(JSON.parse(await readFile(output,'utf8')).project.title,'New title');
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('keeps cached projects on network failure and fails strict sync without writing',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'readme-sync-'));const output=join(directory,'readmes.json');
 const original=JSON.stringify({project:previous});
 try {
  await writeFile(output,original);
  const options={output,log:()=>{},warn:()=>{},fetcher:async()=>{throw new Error('Network unavailable');}};
  const cached=await syncReadmes(options);assert.deepEqual(cached.project,previous);
  const before=await readFile(output,'utf8');
  await assert.rejects(syncReadmes({...options,strict:true}),/no content was written/);
  assert.equal(await readFile(output,'utf8'),before);
 }finally{await rm(directory,{recursive:true,force:true});}
});
