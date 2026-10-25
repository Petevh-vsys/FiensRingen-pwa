// Sieradenbeheer 4.0 - persoonlijke vormgeving, lokaal opgeslagen.
'use strict';
(() => {
  const KEY='sieradenbeheer-thema-v4';
  const DEFAULT={bg:'#eef3f7',surface:'#ffffff',header:'#17324a',accent:'#176b83',text:'#1b3042',muted:'#5b7080',buttonText:'#ffffff',font:'system',size:100};
  const PRESETS={
    'Klassiek':DEFAULT,
    'Roze':{...DEFAULT,bg:'#fff0f6',surface:'#ffffff',header:'#703b58',accent:'#ad4f7a',text:'#41263b',muted:'#765569'},
    'Goud':{...DEFAULT,bg:'#f9f3e8',surface:'#fffdf8',header:'#59421c',accent:'#977023',text:'#392c1c',muted:'#73644b'},
    'Donker':{...DEFAULT,bg:'#151b24',surface:'#242d39',header:'#0b111b',accent:'#356f95',text:'#f1f5fa',muted:'#b5c4d2'}
  };
  const fonts={system:'Systeemlettertype',arial:'Arial',georgia:'Georgia',verdana:'Verdana',trebuchet:'Trebuchet MS',times:'Times New Roman'};
  const fontCss={system:'system-ui,-apple-system,Segoe UI,sans-serif',arial:'Arial,sans-serif',georgia:'Georgia,serif',verdana:'Verdana,sans-serif',trebuchet:'"Trebuchet MS",sans-serif',times:'"Times New Roman",serif'};
  function safeHex(v,fallback){return typeof v==='string'&&/^#[0-9a-fA-F]{6}$/.test(v)?v:fallback}
  function normalize(value){const v=value&&typeof value==='object'?value:{};return {
    bg:safeHex(v.bg,DEFAULT.bg),surface:safeHex(v.surface,DEFAULT.surface),header:safeHex(v.header,DEFAULT.header),
    accent:safeHex(v.accent,DEFAULT.accent),text:safeHex(v.text,DEFAULT.text),muted:safeHex(v.muted,DEFAULT.muted),
    buttonText:safeHex(v.buttonText,DEFAULT.buttonText),font:fontCss[v.font]?v.font:'system',
    size:Number.isFinite(Number(v.size))?Math.min(150,Math.max(80,Math.round(Number(v.size)))):100
  }}
  function stored(){try{return normalize(JSON.parse(localStorage.getItem(KEY)))}catch{return {...DEFAULT}}}
  let saved=stored();
  function apply(t){const r=document.documentElement.style;
    for(const [key,css] of Object.entries({bg:'--ui-bg',surface:'--ui-surface',header:'--ui-header',accent:'--ui-accent',text:'--ui-text',muted:'--ui-muted',buttonText:'--ui-btn-text'}))r.setProperty(css,t[key]);
    r.setProperty('--ui-font',fontCss[t.font]);r.setProperty('--ui-scale',String(t.size/100));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',t.header);
  }
  apply(saved);
  const fields=[['bg','Achtergrond'],['surface','Kaarten en invoervelden'],['header','Bovenbalk'],['accent','Knoppen en accenten'],['buttonText','Tekst op knoppen'],['text','Hoofdtekst'],['muted','Secundaire tekst']];
  function openSettings(){
    for(const id of ['home','list','editor'])document.getElementById(id)?.classList.add('hidden');
    const section=document.getElementById('settings');section.classList.remove('hidden');
    const original={...saved};let draft={...saved};
    section.innerHTML=`<div class="card"><div class="row between"><h2>⚙️ Instellingen</h2><button type="button" class="secondary" id="settingsBack">← Terug</button></div>
      <p class="muted">Pas de vormgeving van de app aan. Je sieraden en foto's veranderen niet.</p>
      <h2>Kleurenthema</h2><div class="preset-row">${Object.keys(PRESETS).map((p,i)=>`<button type="button" data-preset="${i}">${p}</button>`).join('')}</div>
      <div class="setting-grid">${fields.map(([id,label])=>`<div><label for="theme-${id}">${label}</label><input id="theme-${id}" type="color" value="${draft[id]}"></div>`).join('')}</div>
      <h2 style="margin-top:24px">Lettertype en grootte</h2><label for="theme-font">Lettertype</label><select id="theme-font">${Object.entries(fonts).map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select>
      <label for="theme-size">Tekstgrootte: <span id="theme-size-label"></span></label><input type="range" id="theme-size" min="80" max="150" step="5"><p class="muted">80% = kleiner, 100% = standaard, 150% = groter.</p>
      <h2 style="margin-top:20px">Voorbeeld</h2><div class="sample"><strong>💍 Voorbeeld sieraad</strong><span class="muted">Gouden ring • 18 karaat • 8,500 g</span><p>Indicatieve metaalwaarde: € 540,00</p><button type="button" id="theme-example">Voorbeeldknop</button></div>
      <div class="toolbar" style="margin-top:18px"><button type="button" id="theme-save">Instellingen bewaren</button><button type="button" class="secondary" id="theme-cancel">Annuleren</button><button type="button" class="danger" id="theme-reset">Standaard herstellen</button></div>
      <p class="muted">Deze voorkeuren worden op dit toestel bewaard en staan los van je sieradenback-up.</p></div>`;
    const get=id=>document.getElementById('theme-'+id);
    function sync(){for(const [id] of fields)get(id).value=draft[id];get('font').value=draft.font;get('size').value=draft.size;document.getElementById('theme-size-label').textContent=draft.size+'%';apply(draft)}
    function exit(revert){if(revert)apply(original);section.classList.add('hidden');renderHome()}
    fields.forEach(([id])=>get(id).addEventListener('input',e=>{draft[id]=e.target.value;apply(draft)}));
    get('font').addEventListener('change',e=>{draft.font=e.target.value;apply(draft)});
    get('size').addEventListener('input',e=>{draft.size=Number(e.target.value);document.getElementById('theme-size-label').textContent=draft.size+'%';apply(draft)});
    section.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{draft=normalize(Object.values(PRESETS)[Number(b.dataset.preset)]);sync()});
    document.getElementById('settingsBack').onclick=()=>exit(true);
    document.getElementById('theme-cancel').onclick=()=>exit(true);
    document.getElementById('theme-example').onclick=()=>{};
    document.getElementById('theme-save').onclick=()=>{try{localStorage.setItem(KEY,JSON.stringify(draft));saved={...draft};exit(false);toast('Vormgeving opgeslagen.')}catch(e){toast('Instellingen niet opgeslagen: '+e.message)}};
    document.getElementById('theme-reset').onclick=()=>{if(!confirm('Alle kleuren en lettertype-instellingen herstellen?'))return;draft={...DEFAULT};sync()};
    sync();window.scrollTo(0,0);
  }
  // De originele app blijft ongewijzigd; alleen een instellingenknop op het startscherm.
  const originalRenderHome=renderHome;
  renderHome=function(){originalRenderHome();const home=document.getElementById('home');if(home&&!document.getElementById('openThemeSettings')){
    const wrap=document.createElement('div');wrap.className='card';wrap.innerHTML='<div class="row between"><div><h2>⚙️ Vormgeving</h2><p class="muted">Kies je kleuren, lettertype en tekstgrootte.</p></div><button type="button" id="openThemeSettings">Instellingen</button></div>';
    home.insertBefore(wrap,home.firstChild);document.getElementById('openThemeSettings').onclick=openSettings;
  }};
})();
