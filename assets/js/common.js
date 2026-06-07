const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = (v) => '$' + Number(v || 0).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
const nowPL = () => new Date().toLocaleString('pl-PL');
function toast(text){ const el = $('#toast') || Object.assign(document.body.appendChild(document.createElement('div')), {id:'toast', className:'toast'}); el.textContent=text; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'), 2300); }
async function copyElementAsImage(selector, button){
  const el = $(selector); if(!el) return;
  const original = button?.textContent;
  if(button) button.textContent = 'Generowanie...';
  try{
    const canvas = await html2canvas(el, {backgroundColor:'#ffffff', scale:3, logging:false});
    canvas.toBlob(async blob => {
      try{ await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]); toast('Skopiowano obraz do schowka'); if(button) button.textContent = 'Skopiowano'; }
      catch{ const a=document.createElement('a'); a.href=canvas.toDataURL('image/png'); a.download='medwest-document.png'; a.click(); toast('Pobrano obraz, bo przeglądarka nie pozwoliła skopiować'); }
      setTimeout(()=>{ if(button) button.textContent = original; }, 1800);
    });
  }catch(e){ toast('Nie udało się wygenerować obrazu'); if(button) button.textContent = original; }
}
function updateClock(){ const el=$('#clock'); if(el) el.textContent = nowPL(); }
setInterval(updateClock,1000); window.addEventListener('DOMContentLoaded',updateClock);
