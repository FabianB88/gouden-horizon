import assert from 'node:assert/strict';
import {ControllerInput,stickVector,controllerTarget,focusMenu,confirmMenu,menuControls} from '../src/gamepad.js';
import {normalizeSettings} from '../src/settings.js';
let n=0;function test(name,fn){fn();n++;console.log('PASS '+name);}
function pad(){return {index:0,mapping:'standard',connected:true,axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};}
function harness(){const p=pad(),c=new ControllerInput(),nav={getGamepads:()=>[null,p]};let time=0;const read=(options={})=>c.poll(nav,{controls:'controller',context:'game',...options},time+=17);read();return {p,c,nav,read};}
test('Radial dead zones remove drift, preserve analogue speed and bound invalid axes',()=>{
 assert.deepEqual(stickVector(.08,-.09),{x:0,y:0});const a=stickVector(.5,0),b=stickVector(1,1);assert(a.x>0&&a.x<.5);assert.equal(a.y,0);assert(Math.abs(Math.hypot(b.x,b.y)-1)<1e-10);assert.deepEqual(stickVector(NaN,Infinity),{x:0,y:0});assert.equal(normalizeSettings({deadzone:99,controls:'invalid'}).deadzone,.35);
});
test('Both triggers hold independent attacks; all six assigned slots work with the modifier',()=>{
 const {p,read}=harness();p.axes=[.8,-.6,-1,0];p.buttons[6].pressed=p.buttons[7].pressed=true;const r=read();assert(r.shoot&&r.right);assert(r.move.x>0&&r.move.y<0);assert.equal(r.aim.x,-1);assert(read().shoot);
 p.buttons[6].pressed=p.buttons[7].pressed=false;for(const [button,slot]of [[12,0],[15,1],[13,2],[14,3]]){p.buttons[button].pressed=true;assert.deepEqual(read().slots,[slot]);p.buttons[button].pressed=false;read();}
 p.buttons[4].pressed=p.buttons[12].pressed=true;assert.deepEqual(read().slots,[4]);p.buttons[12].pressed=false;p.buttons[15].pressed=true;assert.deepEqual(read().slots,[5]);
});
test('Consumables, interaction and dash use one edge; Xbox menu fallback does not consume an antidote',()=>{
 const {p,read}=harness();for(const [button,action]of [[0,'interact'],[1,'dash'],[2,'heal'],[3,'ultimate'],[5,'antidote'],[10,'equipment'],[11,'skills']]){p.buttons[button].pressed=true;assert(read().actions.includes(action));assert(!read().actions.includes(action));p.buttons[button].pressed=false;read();}
 p.buttons[4].pressed=p.buttons[5].pressed=true;const r=read();assert(r.pause);assert(!r.actions.includes('antidote'));
});
test('Modal transitions, focus loss and reconnect require button release before gameplay resumes',()=>{
 const {p,c,read}=harness();p.buttons[7].pressed=true;assert(read().shoot);assert(!read({context:'menu'}).shoot);assert(!read({context:'game'}).shoot);p.buttons[7].pressed=false;read();p.buttons[7].pressed=true;assert(read().shoot);
 c.suspend();assert(!read().shoot);c.resume();assert(!read().shoot);p.buttons[7].pressed=false;read();p.buttons[7].pressed=true;assert(read().shoot);p.connected=false;assert(read().lost);assert(!read().lost);p.connected=true;assert(!read().shoot);
});
test('Auto mode follows the last input; unsupported mapping and blocked APIs fall back safely',()=>{
 const {p,c,read}=harness();c.mouse();assert(!read({controls:'auto'}).active);p.axes[0]=1;assert(read({controls:'auto'}).active);assert(!read({controls:'keyboard'}).active);p.mapping='';assert(!read().connected);const r=c.poll({getGamepads(){throw Error('policy');}},{controls:'controller'});assert(!r.active);assert(r.reason.includes('Browser'));
});
test('Menu direction repeats at a controlled pace and A/B remain edge-triggered',()=>{
 const {p,c,nav,read}=harness();read({context:'menu'});p.buttons[13].pressed=true;assert.equal(read({context:'menu'}).nav,'down');assert.equal(read({context:'menu'}).nav,null);assert.equal(c.poll(nav,{context:'menu',controls:'controller'},500).nav,'down');p.buttons[0].pressed=true;assert(read({context:'menu'}).accept);assert(!read({context:'menu'}).accept);
});
test('Reticle uses directional aim with adjustable reach and retains the last direction',()=>{
 const p={x:800,y:700,aim:{x:0,y:-1}};assert.deepEqual(controllerTarget(p,{x:1,y:0}),{x:1320,y:700});const near=controllerTarget(p,{x:.2,y:0});assert(near.x<1320&&near.x>800);assert(controllerTarget(p,null).y<700);
});
test('Menu focus skips hidden/disabled controls, edits selectors and confirms the focused purchase',()=>{
 const doc={activeElement:null};const make=(tag,value='')=>({tagName:tag,value,parent:null,hidden:false,disabled:false,events:[],getAttribute(){return null;},focus(){doc.activeElement=this;},click(){this.clicked=true;},dispatchEvent(e){this.events.push(e.type);},querySelectorAll(){return this.options||[];}});
 const a=make('BUTTON'),hidden=make('BUTTON'),disabled=make('BUTTON'),select=make('SELECT','auto'),buy=make('BUTTON');hidden.hidden=true;disabled.disabled=true;select.options=[make('OPTION','auto'),make('OPTION','keyboard'),make('OPTION','controller')];const root={querySelectorAll:()=>[a,hidden,disabled,select,buy]};assert.equal(menuControls(root).length,3);focusMenu(root,doc,'down');assert.equal(doc.activeElement,a);focusMenu(root,doc,'down');assert.equal(doc.activeElement,select);focusMenu(root,doc,'right');assert.equal(select.value,'keyboard');assert.deepEqual(select.events,['change']);focusMenu(root,doc,'down');confirmMenu(root,doc);assert(buy.clicked);focusMenu(root,doc,'down');assert.equal(doc.activeElement,a);
});
console.log(`\n${n} controller input, aim, focus and menu checks passed.`);
