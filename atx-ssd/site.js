(() => {
  const channel='nvmespec-workbench';
  const targetOrigin=location.protocol==='file:'?'*':location.origin;
  const views = {
    atx:{frame:document.querySelector('#atx-frame'), url:'host-platform/view.html', start:'board/power/ac-in'},
    ssd:{frame:document.querySelector('#ssd-frame'), url:'../ssd-model/view.html', start:'mounted'},
  };
  const loading=document.querySelector('#site-loading');
  const nav=document.querySelector('.site-nav');
  const safePath=path=>typeof path==='string'&&/^[a-z0-9_-]+(?:\/[a-z0-9_-]+){0,5}$/i.test(path);
  let active=null;

  function address() {
    const [section,...parts]=location.hash.slice(1).split('/');
    const path=parts.join('/');
    return Object.hasOwn(views,section)?[section,safePath(path)?path:null]:['atx',null];
  }

  function updateAddress(section,path,addHistory=false) {
    const fragment='#'+section+'/'+path;
    if(fragment!==location.hash){
      if(addHistory)history.pushState(null,'',fragment);
      else history.replaceState(null,'',fragment);
    }
    for(const link of nav.querySelectorAll('.site-shortcuts a')){
      if(link.getAttribute('href')===fragment)link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    }
  }

  function send(record,type,value) {
    record.frame.contentWindow.postMessage({channel,type,value},targetOrigin);
  }

  function show(section,requested,addHistory=false) {
    const record=views[section],path=requested||record.path||record.start;
    const previous=active;
    active=section;
    if(previous!==section){
      for(const [key,view] of Object.entries(views)){
        const selected=key===section;
        view.frame.setAttribute('aria-hidden',String(!selected));
        view.frame.inert=!selected;
        const link=nav.querySelector('[data-section="'+key+'"]');
        if(selected)link.setAttribute('aria-current','page');
        else link.removeAttribute('aria-current');
        if(view.ready)send(view,'visibility',selected);
      }
    }
    if(!record.frame.getAttribute('src')){
      record.path=path;
      record.frame.src=record.url+'?site=1#'+path;
    }else if(requested&&path!==record.path){
      record.path=path;
      if(record.ready)send(record,'navigate',path);
      else record.pending=path;
    }
    loading.hidden=!!record.ready;
    updateAddress(section,path,addHistory);
  }

  nav.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(!link||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const [key,...parts]=link.hash.slice(1).split('/');
    if(!Object.hasOwn(views,key))return;
    event.preventDefault();
    show(key,parts.join('/')||null,true);
  });

  window.addEventListener('message',event=>{
    if(targetOrigin!=='*'&&event.origin!==targetOrigin)return;
    const message=event.data;
    if(message?.channel!==channel)return;
    const section=Object.keys(views).find(key=>views[key].frame.contentWindow===event.source);
    if(!section)return;
    const record=views[section];
    if(message.type==='ready'){
      record.ready=true;
      if(record.pending){
        send(record,'navigate',record.pending);
        record.pending=null;
      }
      send(record,'visibility',active===section);
      if(active===section)loading.hidden=true;
    }else if(message.type==='route'&&!record.pending&&safePath(message.value)){
      record.path=message.value;
      if(active===section)updateAddress(section,record.path);
    }else if(message.type==='open'&&section===active&&Object.hasOwn(views,message.section)&&
      (message.value===null||safePath(message.value))){
      show(message.section,message.value,true);
    }
  });

  const restore=()=>show(...address());
  window.addEventListener('hashchange',restore);
  window.addEventListener('popstate',restore);
  restore();
})();
