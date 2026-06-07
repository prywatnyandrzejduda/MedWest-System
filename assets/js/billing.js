const PRICE_KEY = 'medwest_prices_v3';
const INVOICE_KEY = 'medwest_last_invoice_v3';
let services = [];
let savedPrices = {};
function loadPrices(){ try{ savedPrices = JSON.parse(localStorage.getItem(PRICE_KEY)) || {}; }catch{ savedPrices = {}; } }
function getPrice(item){ return Number(savedPrices[item.id] ?? item.price); }
function renderServices(){
  loadPrices(); services = window.MEDWEST_SERVICES || [];
  const list = $('#categoryList'); if(!list) return;
  list.innerHTML = services.map((cat,idx)=>`<details class="category" ${idx<2?'open':''}><summary><span>${cat.title}</span><small>${cat.items.length} usług</small></summary>${cat.items.map(item=>`
    <div class="service" data-id="${item.id}" data-name="${item.name}" data-price="${getPrice(item)}" data-base-price="${item.price}">
      <div><strong>${item.label}</strong><br><small>${item.name}</small></div>
      <div class="price">${money(getPrice(item))}</div>
      <div class="control">${item.type==='qty'?`<input class="qty calc-qty" type="number" min="0" value="0" aria-label="Ilość">`:`<input class="check calc-check" type="checkbox" aria-label="Wybierz">`}</div>
    </div>`).join('')}</details>`).join('');
  $$('.calc-check,.calc-qty').forEach(el=>el.addEventListener('input', calculate));
  $('#serviceSearch')?.addEventListener('input', filterServices);
  calculate(); renderAdmin();
}
function selectedItems(){
  const items=[]; let subtotal=0;
  $$('.service').forEach(row=>{
    const price=Number(row.dataset.price); let qty=0;
    const check=$('.calc-check',row), num=$('.calc-qty',row);
    if(check?.checked) qty=1; if(num) qty=Number(num.value||0);
    if(qty>0){ const total=price*qty; subtotal+=total; items.push({id:row.dataset.id,name:row.dataset.name,qty,unit:price,price:total}); }
  });
  return {items, subtotal};
}
function insuranceRate(){ return Number($('#insuranceType')?.selectedOptions[0]?.dataset.rate || 0); }
function calculate(){
  const {items, subtotal}=selectedItems(); const discount=subtotal*insuranceRate(); const total=Math.max(0,subtotal-discount);
  $('#subtotal').textContent=money(subtotal); $('#discount').textContent='-' + money(discount); $('#final').textContent=money(total); $('#selectedCount').textContent=items.length;
  const list=$('#selectedList'); if(list) list.innerHTML=items.length?items.map(i=>`<div><span>${i.name} x${i.qty}</span><strong>${money(i.price)}</strong></div>`).join(''):'<div class="empty">Brak wybranych usług</div>';
}
function filterServices(){ const q=$('#serviceSearch').value.toLowerCase().trim(); $$('.service').forEach(row=>{ row.style.display = !q || (row.dataset.name + ' ' + row.textContent).toLowerCase().includes(q) ? 'grid':'none'; }); }
function generateInvoice(){
  const {items, subtotal}=selectedItems(); if(!items.length){ toast('Wybierz minimum jedną usługę'); return; }
  const rate=insuranceRate(), discount=subtotal*rate, total=Math.max(0, subtotal-discount);
  const data={
    patient: $('#patientName').value.trim() || 'NIEZNANY PACJENT', ems: $('#doctorName').value.trim() || 'LEKARZ DYŻURNY',
    insuranceType: $('#insuranceType').value, insuranceName: $('#insuranceType').selectedOptions[0].textContent, insuranceId: $('#policyNumber').value.trim() || 'BRAK',
    subtotal: subtotal.toFixed(2), discount: discount.toFixed(2), total: total.toFixed(2), items, date: nowPL(), ref: 'MW-' + new Date().getFullYear() + '-' + Math.floor(Math.random()*900000+100000)
  };
  localStorage.setItem(INVOICE_KEY, JSON.stringify(data)); location.href='rachunek.html';
}
function renderAdmin(){ const box=$('#adminGrid'); if(!box) return; box.innerHTML=$$('.service').map(row=>`<label class="field"><span>${row.dataset.name}</span><input type="number" data-price-id="${row.dataset.id}" value="${row.dataset.price}"></label>`).join(''); }
function openAdmin(){ const pass=prompt('Podaj hasło admina:'); if(pass==='kcandrzej' || pass==='admin'){ $('#adminPanel').classList.add('show'); toast('Panel cen odblokowany'); } else toast('Błędne hasło'); }
function savePrices(){ const data={}; $$('[data-price-id]').forEach(i=>data[i.dataset.priceId]=Number(i.value||0)); localStorage.setItem(PRICE_KEY, JSON.stringify(data)); toast('Ceny zapisane'); setTimeout(()=>location.reload(),650); }
function resetPrices(){ if(confirm('Przywrócić ceny fabryczne?')){ localStorage.removeItem(PRICE_KEY); location.reload(); } }
window.addEventListener('DOMContentLoaded', renderServices);
