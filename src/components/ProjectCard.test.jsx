import {fireEvent, render, screen, within} from '@testing-library/react';
import Projects from './Projects';
import {readmeSections} from './ReadmeContent';

beforeAll(()=>{
 HTMLElement.prototype.scrollBy=jest.fn();
 HTMLDialogElement.prototype.showModal=function(){this.open=true;};
 HTMLDialogElement.prototype.close=function(){this.open=false;};
});

test('R2-D2 and the controller have separate cards, READMEs, and galleries',()=>{
 render(<Projects/>);
 const droid=screen.getByRole('button',{name:'Read about R2-D2 - A Robotics Journey'}).closest('article');
 const controller=screen.getByRole('button',{name:'Read about Custom Star Wars RF Controller'}).closest('article');
 expect(droid).not.toBe(controller);
 fireEvent.click(within(droid).getByRole('button',{name:'Read about R2-D2 - A Robotics Journey'}));
 const dialog=within(droid).getByRole('dialog');
 expect(within(dialog).getAllByRole('button',{name:/^Show /})).toHaveLength(4);
 expect(within(dialog).queryByRole('button',{name:/Show Controller/})).not.toBeInTheDocument();
 fireEvent.click(within(dialog).getByRole('tab',{name:'About R2-D2'}));
 expect(within(dialog).getByRole('tabpanel')).toHaveTextContent('PS3 controller');
 fireEvent.click(within(dialog).getByRole('button',{name:'Previous photo'}));
 expect(within(dialog).getByText('— 4/4')).toBeInTheDocument();
 fireEvent.keyDown(within(dialog).getByRole('tab',{name:'About R2-D2'}),{key:'ArrowRight'});
 expect(within(dialog).getByRole('tab',{name:'Designing the Robot'})).toHaveAttribute('aria-selected','true');
});

test('README tables remain available and information panels contain no images',()=>{
 render(<Projects/>);
 const article=screen.getByRole('button',{name:'Read about RISC-V-Core'}).closest('article');
 fireEvent.click(within(article).getByRole('button',{name:'Read about RISC-V-Core'}));
 const dialog=within(article).getByRole('dialog');
 fireEvent.click(within(dialog).getByRole('tab',{name:'Results'}));
 expect(within(dialog).getByRole('table')).toHaveTextContent('Core dimensions');
 expect(within(dialog).getByRole('tabpanel').querySelectorAll('img')).toHaveLength(0);
 expect(within(dialog).queryByRole('tab',{name:'CPU Architecture'})).not.toBeInTheDocument();
 fireEvent.click(within(dialog).getByRole('tab',{name:'Overview'}));
 expect(within(dialog).getByRole('tabpanel').querySelectorAll('img')).toHaveLength(0);
});


test('section filtering removes repo guides and empty or placeholder sections and image-only sections',()=>{
 const sections=readmeSections('## Repository Structure\nFolder list\n## Blank\n\n## Planned\nTODO\n## Diagram\n![Architecture](diagram.png)\n## About the Project\nWorking robot.');
 expect(sections.map(section=>section.heading)).toEqual(['About the Project']);
});


test('heading arrows scroll the row and clipped headings automatically come into view',()=>{
 const scrollBy=jest.fn();
 render(<Projects/>);
 const article=screen.getByRole('button',{name:'Read about RISC-V-Core'}).closest('article');
 fireEvent.click(within(article).getByRole('button',{name:'Read about RISC-V-Core'}));
 const dialog=within(article).getByRole('dialog');
 const row=within(dialog).getByRole('tablist');
 row.scrollBy=scrollBy;
 Object.defineProperty(row,'clientWidth',{value:400});
 row.getBoundingClientRect=()=>({left:0,right:400,width:400});
 fireEvent.click(within(dialog).getByRole('button',{name:'Scroll headings right'}));
 expect(scrollBy).toHaveBeenLastCalledWith({left:280,behavior:'smooth'});
 fireEvent.click(within(dialog).getByRole('button',{name:'Scroll headings left'}));
 expect(scrollBy).toHaveBeenLastCalledWith({left:-280,behavior:'smooth'});
 const results=within(dialog).getByRole('tab',{name:'Results'});
 results.getBoundingClientRect=()=>({left:450,right:530,width:80});
 fireEvent.mouseEnter(results);
 expect(scrollBy).toHaveBeenLastCalledWith({left:142,behavior:'smooth'});
});
