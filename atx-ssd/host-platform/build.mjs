import { readFile, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { build } from 'esbuild';

const here = new URL('.',import.meta.url);
const read = (name, encoding) => readFile(new URL(name,here),encoding);

function compactSSD(original) {
  if (original.subarray(0,4).toString()!=='glTF' || original.readUInt32LE(4)!==2) throw new Error('Expected glTF 2.0 GLB');
  const jsonSize=original.readUInt32LE(12);
  const source=JSON.parse(original.subarray(20,20+jsonSize));
  const binary=original.subarray(28+jsonSize);
  const output={
    asset:{version:'2.0',generator:'Host model / registered SSD subset'},
    scene:0, scenes:[], nodes:[], meshes:[], accessors:[], bufferViews:[],
    materials:source.materials,
  };
  const arr=[], copied=Object.fromEntries(['nodes','meshes','accessors','bufferViews'].map(k=>[k,new Map()]));
  let byteLength=0;
  const copy = (kind,i,transform) => {
    if(copied[kind].has(i)) return copied[kind].get(i);
    const record=transform(structuredClone(source[kind][i]));
    const id=output[kind].push(record)-1;
    copied[kind].set(i,id);
    return id;
  };
  const accessor = i => copy('accessors',i,access=>{
    access.bufferView=copy('bufferViews',access.bufferView,v=>{
      const offset=v.byteOffset||0;
      const pad=(4-byteLength%4)%4;
      if(pad) arr.push(Buffer.alloc(pad));
      arr.push(binary.subarray(offset,offset+v.byteLength));
      v.byteOffset=byteLength+pad;
      byteLength=v.byteOffset+v.byteLength;
      return v;
    });
    return access;
  });
  const node = i => copy('nodes',i,n=>{
    n.mesh=copy('meshes',n.mesh,m=>{
      for(const p of m.primitives){
        for(const attr of Object.keys(p.attributes)) p.attributes[attr]=accessor(p.attributes[attr]);
        p.indices=accessor(p.indices);
      }
      return m;
    });
    return n;
  });
  const physical=source.scenes.find(s=>s.name.endsWith('physical assembly'));
  const installed=source.scenes.find(s=>s.name.endsWith('reference M-key host socket'));
  const stack=source.scenes.find(s=>s.name.endsWith('registered six-copper-layer study'));
  const groups=['host_socket','host_lid','host_spring','host_pads'];
  const cutaway=stack.nodes.filter(i=>{
    const {role,site,net}=source.nodes[i].extras.stack;
    if(role==='logic'||role==='chip_detail')return site==='ctrl'||net==='nand_a';
    return (net==='nand_a'||/^pcie_[0-3]_(up|down)$/.test(net))&&['trace','via','ball'].includes(role);
  });
  output.scenes=[
    {name:'Samsung 990 PRO 2 TB',nodes:physical.nodes.map(node)},
    {name:'Reference M-key socket',nodes:installed.nodes.filter(i=>groups.includes(source.nodes[i].extras.group)).map(node)},
    {name:'Pascal and NAND A registered cutaways',nodes:cutaway.map(node)},
  ];
  if(output.scenes[0].nodes.length<100 || output.scenes[1].nodes.length<67 || cutaway.length<100)
    throw new Error('Asset selection is incomplete');
  const pad=(4-byteLength%4)%4;
  if(pad) arr.push(Buffer.alloc(pad));
  byteLength+=pad;
  output.buffers=[{byteLength}];
  const json=Buffer.from(JSON.stringify(output),'utf8');
  const jsonPad=(4-json.length%4)%4;
  const header=Buffer.alloc(20), binHeader=Buffer.alloc(8);
  header.write('glTF');
  header.writeUInt32LE(2,4);
  header.writeUInt32LE(28+json.length+jsonPad+byteLength,8);
  header.writeUInt32LE(json.length+jsonPad,12);
  header.write('JSON',16);
  binHeader.writeUInt32LE(byteLength);
  binHeader.write('BIN\0',4);
  return Buffer.concat([header,json,Buffer.alloc(jsonPad,32),binHeader,...arr]);
}

const [html,ssd,donorLicense,ramulatorLicense,threeLicense,bundle]=await Promise.all([
  read('view.template.html','utf8'),
  read('../../ssd-model/990-pro-2tb.glb'),
  read('vendor/pc-anatomy/LICENSE.txt','utf8'),
  read('vendor/ramulator/LICENSE.txt','utf8'),
  read('node_modules/three/LICENSE','utf8'),
  build({entryPoints:[fileURLToPath(new URL('./viewer.mjs',here))],
    bundle:true,write:false,format:'iife',minify:true,target:'es2022',legalComments:'none',loader:{'.txt':'text'}}),
]);
const packed=gzipSync(compactSSD(ssd),{level:6});
const result=html
  .replace('__SSD_GZIP__',()=>packed.toString('base64'))
  .replace('/*__THIRD_PARTY_LICENSES__*/',()=> '/* PC Anatomy\n'+donorLicense+'\nRamulator 2\n'+ramulatorLicense+'\nThree.js\n'+threeLicense+'\n*/')
  .replace('/*__APP__*/',()=>bundle.outputFiles[0].text.replace(/<\/script/gi,'<\\/script'));
const temp=new URL('./view.html.tmp',here);
await writeFile(temp,result,'utf8');
await rename(temp,new URL('./view.html',here));
console.log('Offline viewer ready · '+Buffer.byteLength(result).toLocaleString()+' bytes');
