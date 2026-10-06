import {ENGLISH} from './english.js?v=46';

// Translate presentation only. World data, item identifiers and saves stay stable.
let language='nl';
const normalized=text=>String(text).replace(/\s+/gu,' ').trim();
const escaped=text=>text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const folded=new Map(Object.entries(ENGLISH).map(([nl,en])=>[nl.toLocaleLowerCase('nl'),nl===nl.toLocaleUpperCase('nl')?en.toLocaleLowerCase('en'):en]));
const fragments=Object.keys(ENGLISH).filter(key=>key.length>1).sort((a,b)=>b.length-a.length);
const fragmentPattern=new RegExp('(?<![\\p{L}\\p{N}_])(?:'+fragments.map(escaped).join('|')+')(?![\\p{L}\\p{N}_])','giu');
const cache=new Map(),textSources=new WeakMap(),attributeSources=new WeakMap(),namedSources=new WeakMap();
const attributes=['title','aria-label','placeholder','alt'];
const excluded='script,style,textarea,code,[data-no-translate]';
let documentRoot=null,observer=null;

export function getLanguage(){return language;}
function matchingCase(source,target){return source===source.toLocaleUpperCase('nl')&&/\p{L}/u.test(source)?target.toLocaleUpperCase('en'):target;}
function dynamicTranslation(text){
 const assignment=text.match(/^Aanval voor (.+) kiezen$/u);if(assignment)return `Choose attack for ${translate(assignment[1])}`;
 const learning=text.match(/^Vanaf niveau (\d+) kun je (.+) leren\. (.+)$/u);
 if(learning)return `From level ${learning[1]}, you can learn ${translate(learning[2])}. ${translate(learning[3])}`;
 const remaining=text.match(/^NOG (\d+) LEVELS$/u);if(remaining)return `${remaining[1]} MORE LEVELS`;
 const dose=text.match(/^(\d+) doses$/u);if(dose)return `${dose[1]} ${Number(dose[1])===1?'dose':'doses'}`;
 return null;
}
export function translate(value){
 const source=String(value);if(language!=='en'||!source||!/\p{L}/u.test(source))return source;
 if(cache.has(source))return cache.get(source);
 const key=normalized(source);if(!key)return source;const exact=ENGLISH[key]??folded.get(key.toLocaleLowerCase('nl'));
 const translated=exact!==undefined?matchingCase(key,exact):dynamicTranslation(key)??key.replace(fragmentPattern,part=>matchingCase(part,ENGLISH[part]??folded.get(part.toLocaleLowerCase('nl'))??part));
 const result=source.match(/^\s*/u)[0]+translated+source.match(/\s*$/u)[0];
 if(cache.size>=4096)cache.clear();cache.set(source,result);return result;
}

function updateText(node){
 if(!node.parentElement||node.parentElement.closest(excluded))return;
 const current=node.data,previous=textSources.get(node),source=previous&&current===previous.rendered?previous.source:current;
 const rendered=translate(source);textSources.set(node,{source,rendered});if(current!==rendered)node.data=rendered;
}
function updateAttribute(element,name){
 if(element.closest(excluded)||!element.hasAttribute(name))return;
 let records=attributeSources.get(element);if(!records){records=new Map();attributeSources.set(element,records);}
 const current=element.getAttribute(name),previous=records.get(name),source=previous&&current===previous.rendered?previous.source:current;
 const rendered=translate(source);records.set(name,{source,rendered});if(current!==rendered)element.setAttribute(name,rendered);
}
export function localizeTree(root=documentRoot){
 if(!root)return;
 if(root.nodeType===3){updateText(root);return;}
 if(root.nodeType===1&&root.closest(excluded))return;
 const doc=root.ownerDocument??root;
 const walker=doc.createTreeWalker(root,5);let node=root;
 do{if(node.nodeType===3)updateText(node);else if(node.nodeType===1)for(const name of attributes)updateAttribute(node,name);}while((node=walker.nextNode()));
}
export function initializeLocalization(root=document.body){
 if(observer)return;documentRoot=root;root.ownerDocument.documentElement.lang=language;localizeTree(root);
 observer=new MutationObserver(records=>{
  const added=new Set();
  for(const record of records){
   if(record.type==='characterData')updateText(record.target);
   else if(record.type==='attributes')updateAttribute(record.target,record.attributeName);
   else for(const node of record.addedNodes)added.add(node);
  }
  for(const node of added)if(node.isConnected)localizeTree(node);
 });
 observer.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes});
}
export function setLanguage(value){
 const next=value==='en'?'en':'nl';if(language===next)return;
 language=next;cache.clear();if(documentRoot){documentRoot.ownerDocument.documentElement.lang=next;localizeTree(documentRoot);}
}
export function setTranslatedText(element,value){
 namedSources.delete(element);
 const source=String(value),rendered=translate(source);if(element.textContent!==rendered)element.textContent=rendered;
 if(element.childNodes.length===1&&element.firstChild.nodeType===3)textSources.set(element.firstChild,{source,rendered});
}
export function setNamedText(element,parts){
 const signature=JSON.stringify(parts);if(namedSources.get(element)===signature)return;
 const nodes=parts.map(part=>{
  if(typeof part==='object'){const span=element.ownerDocument.createElement('span');span.dataset.noTranslate='';span.textContent=part.name;return span;}
  const source=String(part),rendered=translate(source),node=element.ownerDocument.createTextNode(rendered);textSources.set(node,{source,rendered});return node;
 });
 element.replaceChildren(...nodes);namedSources.set(element,signature);
}
export function setTranslatedAttribute(element,name,value){
 const source=String(value),rendered=translate(source);if(element.getAttribute(name)!==rendered)element.setAttribute(name,rendered);
 let records=attributeSources.get(element);if(!records){records=new Map();attributeSources.set(element,records);}records.set(name,{source,rendered});
}
