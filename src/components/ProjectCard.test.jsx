import {fireEvent, render, screen, within} from '@testing-library/react';
import Projects from './Projects';
import {readmeSections} from './ReadmeContent';

beforeAll(()=>{
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

test('README tables and image-only sections remain available',()=>{
 render(<Projects/>);
 const article=screen.getByRole('button',{name:'Read about RISC-V-Core'}).closest('article');
 fireEvent.click(within(article).getByRole('button',{name:'Read about RISC-V-Core'}));
 const dialog=within(article).getByRole('dialog');
 fireEvent.click(within(dialog).getByRole('tab',{name:'Results'}));
 expect(within(dialog).getByRole('table')).toHaveTextContent('Core dimensions');
 fireEvent.click(within(dialog).getByRole('tab',{name:'CPU Architecture'}));
 expect(within(dialog).getByRole('tabpanel').querySelectorAll('img')).toHaveLength(2);
});


test('section filtering removes repo guides and empty or placeholder sections but retains diagrams',()=>{
 const sections=readmeSections('## Repository Structure\nFolder list\n## Blank\n\n## Planned\nTODO\n## Diagram\n![Architecture](diagram.png)\n## About the Project\nWorking robot.');
 expect(sections.map(section=>section.heading)).toEqual(['Diagram','About the Project']);
});
