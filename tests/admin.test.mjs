import {test,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const nodeRequire=createRequire(import.meta.url);
const dirname=path.dirname(fileURLToPath(import.meta.url));
const cache=new Map();
function load(name){const file=path.resolve(dirname,'../src/lib/admin',name+'.ts');if(cache.has(file))return cache.get(file).exports;const record={exports:{}};cache.set(file,record);const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('require','module','exports',js)(name=>name.startsWith('.')?load(name.slice(2)):nodeRequire(name),record,record.exports);return record.exports;}
const {createSeed}=load('seed'),{aggregate,filterEvents,defaultFilters,progress}=load('analytics'),{store,handleApi,ApiError}=load('server'),{workbookBytes}=load('export');
beforeEach(()=>{store.data=createSeed();store.files.clear();});
function request(route,method='GET',body,cookie){return new Request('http://localhost/api/admin/'+route,{method,headers:{...(cookie?{cookie}:{}),...(body&&!(body instanceof FormData)?{'Content-Type':'application/json'}:{})},body:body instanceof FormData?body:body?JSON.stringify(body):undefined});}
async function login(email='admin@funlands.ir'){const response=await handleApi(request('login','POST',{email,password:'Funlands123!'}),['login']);assert.match(response.headers.get('set-cookie'),/HttpOnly/);return response.headers.get('set-cookie').split(';')[0];}
const call=(route,method,body,cookie)=>handleApi(request(route,method,body,cookie),route.split('/'));
test('seed keeps anonymous users, assigned games, event IDs and timestamps consistent',()=>{const d=createSeed();assert.equal(d.users.length,49);assert.equal(new Set(d.events.map(e=>e.id)).size,d.events.length);for(const e of d.events){const u=d.users.find(u=>u.id===e.userId),g=d.games.find(g=>g.id===e.gameId);assert.equal(e.skinId,u.skinId);assert.equal(e.skinId,g.skinId);assert.ok(u.assignedGames.includes(g.id));assert.ok(e.timestamp>=u.joinedAt);}assert.ok(d.games.filter(g=>g.skinId==='funlands').every(g=>d.events.some(e=>e.gameId===g.id)));assert.ok(d.events.some(e=>e.type==='crash'));assert.ok(d.events.some(e=>e.type==='run'&&!e.success));});
test('date and game filters drive real event counts, with independent Run and Start',()=>{const d=createSeed(),events=filterEvents(d,defaultFilters),a=aggregate(events);assert.ok(a.runs>a.starts);assert.ok(a.starts>0);assert.ok(a.completion>=0&&a.completion<=100);assert.ok(events.every(e=>e.timestamp.slice(0,10)>=defaultFilters.from));const game=filterEvents(d,{...defaultFilters,gameId:d.games[0].id});assert.ok(game.every(e=>e.gameId===d.games[0].id));assert.ok(game.length<events.length);assert.equal(aggregate([...events,...events]).runs,a.runs);});
test('session duration excludes missing boundaries, repeats and invalid durations',()=>{const base={id:'1',skinId:'funlands',gameId:'g',userId:'u',sessionId:'s',type:'start',timestamp:'2026-10-26T10:00:00Z',success:true,version:'1',resolution:'open'};const end={...base,id:'2',type:'exit',timestamp:'2026-10-26T10:02:00Z'};assert.equal(aggregate([base,end,base,end]).totalSeconds,120);assert.equal(aggregate([base]).validSessions,0);assert.equal(aggregate([base,{...end,timestamp:'2026-10-26T09:00:00Z'}]).totalSeconds,0);assert.equal(progress([{...base,type:'level_complete',level:20}],6).percent,0);});
test('authentication and API-level skin ownership are enforced',async()=>{await assert.rejects(()=>call('bootstrap','GET'),e=>e instanceof ApiError&&e.status===401);const cookie=await login(),snapshot=await (await call('bootstrap','GET',null,cookie)).json();assert.ok(snapshot.games.every(g=>g.skinId==='funlands'));assert.ok(!snapshot.users.some(u=>u.id==='other_user'));await assert.rejects(()=>call('games/other_game','GET',null,cookie),e=>e.status===404);await assert.rejects(()=>call('users/other_user','PATCH',{active:true,assignedGames:[]},cookie),e=>e.status===404);});
test('viewer cannot mutate and content manager cannot delete or access users',async()=>{const viewer=await login('viewer@funlands.ir');await assert.rejects(()=>call('users','POST',{active:true,assignedGames:[]},viewer),e=>e.status===403);const content=await login('content@funlands.ir');const snapshot=await (await call('bootstrap','GET',null,content)).json();assert.equal(snapshot.users.length,0);assert.equal(snapshot.events.length,0);await assert.rejects(()=>call('contents/content_1','DELETE',null,content),e=>e.status===403);});
test('content upload, file access, replacement policy and soft deletion work',async()=>{const cookie=await login(),form=new FormData();for(const [k,v]of Object.entries({title:'Test PDF',description:'Sample',type:'book',category:'story',active:'true'}))form.set(k,v);form.set('file',new File(['%PDF-1.4\n'], 'sample.pdf',{type:'application/pdf'}));const item=await (await call('contents','POST',form,cookie)).json();assert.ok(item.fileId);const file=await call('files/'+item.fileId,'GET',null,cookie);assert.equal(await file.text(),'%PDF-1.4\n');const change=new FormData();for(const [k,v]of Object.entries({title:'Changed',description:'Sample',type:'audio',category:'music',active:'true'}))change.set(k,v);await assert.rejects(()=>call('contents/'+item.id,'PATCH',change,cookie),e=>e.message==='FILE_REQUIRED');await call('contents/'+item.id,'DELETE',null,cookie);await assert.rejects(()=>call('files/'+item.fileId,'GET',null,cookie),e=>e.status===404);});
test('uploads reject disallowed files and role updates preserve administrator access',async()=>{const cookie=await login(),form=new FormData();for(const[k,v]of Object.entries({title:'Bad',description:'x',category:'story',type:'book',active:'true'}))form.set(k,v);form.set('file',new File(['x'],'bad.exe'));await assert.rejects(()=>call('contents','POST',form,cookie),e=>e.message==='FILE_TYPE_NOT_ALLOWED');await assert.rejects(()=>call('roles/role_admin','PATCH',{nameFa:'مدیر',nameEn:'Admin',permissions:[]},cookie),e=>e.message==='KEEP_ADMIN_ACCESS');});
test('event ingestion is idempotent and refuses cross-skin references',async()=>{const cookie=await login(),g=store.data.games.find(g=>g.active),u=store.data.users.find(u=>u.active&&u.assignedGames.includes(g.id));const body={id:'evt_retry',gameId:g.id,userId:u.id,type:'run',sessionId:'test-session',timestamp:'2026-10-26T12:00:00Z',success:true};const before=store.data.events.length;await call('events','POST',body,cookie);await call('events','POST',body,cookie);assert.equal(store.data.events.length,before+1);await assert.rejects(()=>call('events','POST',{...body,id:'bad_scope',gameId:'other_game'},cookie),e=>e.status===404);});
test('Excel export is an actual OOXML ZIP with safe inline strings',()=>{const bytes=workbookBytes([['شناسه','count'],['=SUM(A1)',3]]);assert.equal(new DataView(bytes.buffer).getUint32(0,true),0x04034b50);let offset=0,worksheet='';const dec=new TextDecoder();while(new DataView(bytes.buffer).getUint32(offset,true)===0x04034b50){const v=new DataView(bytes.buffer,offset),size=v.getUint32(18,true),nameLength=v.getUint16(26,true),extra=v.getUint16(28,true),name=dec.decode(bytes.slice(offset+30,offset+30+nameLength)),start=offset+30+nameLength+extra;if(name==='xl/worksheets/sheet1.xml')worksheet=dec.decode(bytes.slice(start,start+size));offset=start+size;}assert.match(worksheet,/t="inlineStr"/);assert.ok(worksheet.includes('=SUM(A1)'));assert.ok(!worksheet.includes('<f>'));fs.writeFileSync('/tmp/funlands-export-check.xlsx',bytes);});

const {persianParts,persianToDate,persianMonthDays}=load('../../components/ui/date-picker/persian-calendar');
test('Persian calendar converts filter dates and handles Nowruz and leap Esfand',()=>{assert.deepEqual(persianParts(new Date('2026-10-26T00:00:00Z')),{year:1405,month:8,day:4});assert.equal(persianToDate(1405,8,4).toISOString().slice(0,10),'2026-10-26');assert.equal(persianToDate(1404,1,1).toISOString().slice(0,10),'2025-03-21');assert.equal(persianMonthDays(1403,12),30);assert.equal(persianMonthDays(1404,12),29);assert.throws(()=>persianToDate(1404,12,30));for(let month=1;month<=12;month++){const day=persianMonthDays(1405,month);assert.deepEqual(persianParts(persianToDate(1405,month,day)),{year:1405,month,day});}});

test('studio demo covers every section with valid same-skin references',()=>{
 const {studioKinds,studioSections}=load('studio'),d=createSeed();
 for(const kind of studioKinds){const rows=d.studio.filter(r=>r.kind===kind);assert.ok(rows.length>0,kind);for(const row of rows){assert.ok(studioSections[kind].statuses.includes(row.status));for(const field of studioSections[kind].fields){const value=row.fields[field.key];if(!value)continue;if(field.options)assert.ok(field.options.includes(value),`${kind}.${field.key}`);if(['user','game','games','content','category'].includes(field.type)){const list=field.type==='user'?d.users:field.type==='content'?d.contents:field.type==='category'?d.studio:d.games;for(const id of field.type==='games'?value.split(','):[value])assert.ok(list.some(item=>item.id===id&&item.skinId===row.skinId),`${kind}.${field.key}: ${id}`);}}}}
});
function studioBody(record,patch={}){return {titleFa:record.title.fa,titleEn:record.title.en,status:record.status,image:record.image,position:record.position,fields:{...record.fields},...patch};}
test('studio CRUD persists updates, validates references and writes audit records',async()=>{
 const cookie=await login(),sample=store.data.studio.find(r=>r.kind==='landing');
 const created=await (await call('studio/landing','POST',studioBody(sample,{titleFa:'سکشن تازه',titleEn:'New section',position:10}),cookie)).json();
 assert.ok(store.data.studio.some(r=>r.id===created.id));
 const edited=await (await call(`studio/landing/${created.id}`,'PATCH',studioBody(created,{position:1,status:'published'}),cookie)).json();assert.equal(edited.position,1);
 await assert.rejects(()=>call(`studio/landing/${created.id}`,'PATCH',studioBody(created,{fields:{...created.fields,games:'other_game'}}),cookie),e=>e.status===400);
 await call(`studio/landing/${created.id}`,'DELETE',undefined,cookie);assert.ok(!store.data.studio.some(r=>r.id===created.id));assert.ok(store.data.audit.some(r=>r.action==='landing.delete'));
});
test('studio enforces read/write permissions and does not leak another skin',async()=>{
 const viewer=await login('viewer@funlands.ir'),content=await login('content@funlands.ir'),row=store.data.studio.find(r=>r.kind==='avatars');
 await assert.rejects(()=>call(`studio/avatars/${row.id}`,'PATCH',studioBody(row),viewer),e=>e.status===403);
 await assert.rejects(()=>call('studio/landing','GET',undefined,content),e=>e.status===403);
 const bootstrap=await (await call('bootstrap','GET',undefined,content)).json();assert.ok(bootstrap.studio.every(r=>['categories','avatars','moderation'].includes(r.kind)));
 store.data.studio.push({...row,id:'other_avatar',skinId:'other-skin'});
 const rows=await (await call('studio/avatars','GET',undefined,viewer)).json();assert.ok(!rows.some(r=>r.id==='other_avatar'));
 await assert.rejects(()=>call('studio/avatars/other_avatar','PATCH',studioBody(row),content),e=>e.status===404);
 await assert.rejects(()=>call(`studio/avatars/${row.id}`,'DELETE',undefined,content),e=>e.status===403);
});
test('moderation requires a reason and linked avatar categories cannot be deleted',async()=>{
 const cookie=await login(),review=store.data.studio.find(r=>r.kind==='moderation');
 await assert.rejects(()=>call(`studio/moderation/${review.id}`,'PATCH',studioBody(review,{status:'rejected',fields:{...review.fields,reason:''}}),cookie),e=>e.message==='REASON_REQUIRED');
 const rejected=await (await call(`studio/moderation/${review.id}`,'PATCH',studioBody(review,{status:'rejected',fields:{...review.fields,reason:'Needs review'}}),cookie)).json();assert.equal(rejected.status,'rejected');
 await assert.rejects(()=>call('studio/categories/categories_6','DELETE',undefined,cookie),e=>e.status===409);
});
test('game runtime settings and gallery are saved and unsafe paths are rejected',async()=>{
 const cookie=await login(),game=store.data.games[0];const body={titleFa:game.title.fa,titleEn:game.title.en,descriptionFa:game.description.fa,descriptionEn:game.description.en,version:game.version,levels:game.levels,active:game.active,publication:game.publication,category:game.category,cover:game.cover,webGameUri:'/games/demo/index.html',isLandscape:true,adminOnly:true,images:['/images/mock/game1.webp'],trailer:''};
 const updated=await (await call(`games/${game.id}`,'PATCH',body,cookie)).json();assert.equal(updated.webGameUri,body.webGameUri);assert.equal(updated.adminOnly,true);assert.deepEqual(updated.images,body.images);
 await assert.rejects(()=>call(`games/${game.id}`,'PATCH',{...body,webGameUri:'javascript:alert(1)'},cookie),e=>e.message==='INVALID_GAME_PATH');
});

test('startup session lookup rejects stale cookies and disabled accounts before loading the workspace', async () => {
  const {adminFromSession} = load('server');
  assert.throws(() => adminFromSession(undefined), e => e.status === 401);
  assert.throws(() => adminFromSession('cookie-from-a-previous-server-run'), e => e.status === 401);
  const cookie = await login();
  const token = cookie.slice(cookie.indexOf('=') + 1);
  const admin = adminFromSession(token);
  assert.equal(admin.email, 'admin@funlands.ir');
  const {createSessionToken} = load("session");
  assert.throws(() => adminFromSession(createSessionToken(admin.id, Date.now() - 1)), e => e.status === 401);
  admin.active = false;
  assert.throws(() => adminFromSession(token), e => e.status === 401);
});

test('signed demo sessions survive independent server instances and reject tampering', async () => {
  const cookie = await login(), token = cookie.slice(cookie.indexOf('=') + 1);
  cache.clear();
  const independentServer = load('server');
  assert.equal(independentServer.adminFromSession(token).email, 'admin@funlands.ir');
  const [payload, signature] = token.split('.');
  const forged = Buffer.from(JSON.stringify({...JSON.parse(Buffer.from(payload, 'base64url')),adminId:'other_admin'})).toString('base64url');
  assert.throws(() => independentServer.adminFromSession(forged+'.'+signature), e => e.status === 401);
  assert.throws(() => independentServer.adminFromSession(payload+'.bad-signature'), e => e.status === 401);
});
