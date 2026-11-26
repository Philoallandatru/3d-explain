(() => {
  const channel='nvmespec-workbench';
  const key=document.documentElement.dataset.siteView;
  const siteRoot=new URL('.',document.currentScript.src);
  const targetOrigin=location.protocol==='file:'?'*':location.origin;
  const peers={
    atx:new URL('host-platform/view.html',siteRoot),
    ssd:new URL('../ssd-model/view.html',siteRoot),
  };
  const safePath=path=>typeof path==='string'&&/^[a-z0-9_-]+(?:\/[a-z0-9_-]+){0,5}$/i.test(path);
  const send=(type,value,section)=>window.parent.postMessage({channel,type,value,section},targetOrigin);
  let latest=location.hash.slice(1),sent='';

  const style=document.createElement('link');
  style.rel='stylesheet';style.href=new URL('site-embed.css',siteRoot).href;document.head.append(style);

  function report(path) {
    if(!safePath(path)||sent===path)return;
    latest=path;sent=path;send('route',path);
  }

  function observeSsd() {
    const data=document.body.dataset;
    if(data.ready!=='true')return;
    const view=data.view, [mode,flow]=latest.split('/');
    if(data.stackIo&&['stack','system'].includes(view)){
      const scope=[view,data.stackIo,data.stackIoTransaction,data.stackIoSection].filter(Boolean);
      report(scope.join('/'));
    }else if(view==='stack'){
      const position=data.stackStep||(data.stackMode==='explode'?'explode':Number(data.stackLayer)>1?data.stackLayer:'');
      report(position?'stack/'+position:'stack');
    }else if(data.story){
      const lane=document.getElementById('trace-lane').value;
      report([data.story,Number(data.storyIndex)+1,...(lane==='-1'?[]:[lane])].join('/'));
    }else if(
      (mode===view&&!(['stack','system'].includes(mode)&&['read','write'].includes(flow)))||
      ({mount:'installed',zone:'mounted',thermal:'physical'}[mode]===view)
    )report(latest);
    else report(view);
  }

  window.addEventListener('message',event=>{
    if(event.source!==window.parent||(targetOrigin!=='*'&&event.origin!==targetOrigin))return;
    const {channel:id,type,value}=event.data??{};
    if(id!==channel)return;
    if(type==='navigate'&&safePath(value)){
      latest=value;sent='';
      history.replaceState(history.state,'','#'+value);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }else if(type==='visibility'&&typeof value==='boolean'){
      window.dispatchEvent(new CustomEvent('nvmespec:visibility',{detail:value}));
    }
  });
  window.addEventListener('nvmespec:route',event=>report(event.detail));

  document.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const link=event.target.closest('a[href]');
    if(!link||link.hasAttribute('download'))return;
    const url=new URL(link.href,location.href);
    const peer=Object.keys(peers).find(name=>url.origin===peers[name].origin&&url.pathname===peers[name].pathname);
    if(peer){
      const path=url.hash.slice(1);
      event.preventDefault();
      send('open',safePath(path)?path:null,peer);
    }else if(!link.target&&url.pathname!==location.pathname)link.target='_blank';
  });

  function connect() {
    send('ready');
    if(key==='ssd'){
      const observer=new MutationObserver(observeSsd);
      observer.observe(document.body,{attributes:true,attributeFilter:[
        'data-ready','data-view','data-stack-io','data-stack-io-transaction','data-stack-io-section',
        'data-stack-step','data-stack-mode','data-stack-layer','data-story','data-story-index',
      ]});
      observeSsd();
    }else report(location.hash.slice(1));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',connect,{once:true});
  else connect();
})();
