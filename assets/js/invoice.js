function renderInvoice(){
 const d=JSON.parse(localStorage.getItem('medwest_last_invoice_v3')||'null');
 if(!d){ $('#invoiceDoc').innerHTML='<div class="empty">Brak rachunku. Wróć do taryfikatora i wygeneruj dokument.</div>'; return; }
 $('#docRef').textContent=d.ref; $('#docDate').textContent=d.date; $('#docPatient').textContent=d.patient; $('#docDoctor').textContent=d.ems; $('#docInsurance').textContent=d.insuranceName; $('#docPolicy').textContent=d.insuranceId;
 $('#docItems').innerHTML=d.items.map(i=>`<tr><td>${i.name}</td><td style="text-align:center">${i.qty}</td><td style="text-align:right">${money(i.price)}</td></tr>`).join('');
 $('#docSubtotal').textContent=money(d.subtotal); $('#docDiscount').textContent='-' + money(d.discount); $('#docTotal').textContent=money(d.total);
}
window.addEventListener('DOMContentLoaded',renderInvoice);
