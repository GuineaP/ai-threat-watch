import { readFileSync } from 'node:fs';
const presentation=JSON.parse(readFileSync(new URL('./reading-presentation.json',import.meta.url),'utf8'));
const text=n=>n.type==='text'?n.value:(n.children||[]).map(text).join('');
const normalize=s=>s.replace(/\s+/g,' ').trim();
const profiles=new Map(presentation.entries.map(e=>[normalize(e.lead),e]));
const element=(tagName,properties,children)=>({type:'element',tagName,properties,children});
const label=value=>({type:'text',value});
const isHeading=n=>n.type==='element'&&n.tagName==='h2';
function markHighlights(node){
  if(node.type==='element'&&node.tagName==='strong'){
    node.properties||={};node.properties.className=['reading-highlight'];
  }
  for(const child of node.children||[])markHighlights(child);
}

export default function readingLayout(){
  return tree=>{
    const children=tree.children||[];
    const first=children.find(n=>n.type==='element'&&n.tagName==='p');
    if(!first)return;
    const profile=profiles.get(normalize(text(first)));
    if(!profile)return;
    const groups=[];
    let group;
    for(const node of children){
      if(isHeading(node)){group={heading:node,body:[]};groups.push(group);}
      else if(!group){group={body:[]};groups.push(group);group.body.push(node);}
      else group.body.push(node);
    }
    let editorial;
    if(profile.editorial){
      const config=profile.editorial;
      const parent=groups.find(g=>g.heading&&text(g.heading)===config.heading);
      if(!parent)throw new Error('Missing approved editorial heading: '+profile.id);
      groups.splice(groups.indexOf(parent),1);
      editorial=parent;
      // The reviewed edition already contains a standalone editorial section.
      // Presentation may wrap it, but must not replace or delete authored text.
      const sourceIndex=groups.findIndex(g=>g.heading&&text(g.heading)==='查證與來源');
      groups.splice(sourceIndex<0?groups.length:sourceIndex,0,editorial);
    }
    const headings=groups.filter(g=>g.heading).map(g=>g.heading);
    headings.forEach((h,i)=>{h.properties||={};h.properties.id||='reading-section-'+(i+1);});
    const result=[];
    for(const group of groups){
      const nodes=group.heading?[group.heading,...group.body]:group.body;
      if(group===editorial){
        const config=profile.editorial;
        const caption=element('p',{className:['editorial-label']},[label('編者觀點 · '+config.mode)]);
        const subtitle=config.subtitle?element('h3',{className:['editorial-subtitle']},[label(config.subtitle)]):null;
        result.push(element('section',{className:['editor-observation'],'aria-labelledby':group.heading.properties.id},[caption,group.heading,...(subtitle?[subtitle]:[]),...group.body]));
      }else if(group.heading&&text(group.heading)==='查證與來源')result.push(element('section',{className:['article-sources']},nodes));
      else result.push(...nodes);
    }
    for(const node of result)markHighlights(node);
    if(profile.kind==='case'){
      first.properties||={};first.properties.className=['case-lead'];
      const list=element('ol',{},headings.map(h=>element('li',{},[element('a',{href:'#'+h.properties.id},[label(text(h))])])));
      const toc=element('details',{className:['reading-toc']},[element('summary',{},[label('本篇重點')]),element('nav',{'aria-label':'本篇閱讀目錄'},[list])]);
      const keyText=profile.keypoint_count>0
        ?(profile.editorial?'粗體標示本篇重點與重要提醒；「編者觀點」區塊是本站的延伸分析。':'粗體標示本篇重點與重要提醒。')
        :(profile.editorial?'「編者觀點」區塊是本站的延伸分析。':'');
      const key=keyText?element('p',{className:['reading-key']},[label(keyText)]):null;
      result.splice(result.indexOf(first)+1,0,toc,...(key?[key]:[]));
    }
    tree.children=result;
  };
}
