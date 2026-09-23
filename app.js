const form = document.querySelector('#inquiry-form');
const hint = document.querySelector('#form-hint');
const result = document.querySelector('#result');
const summary = document.querySelector('#summary');
const copyStatus = document.querySelector('#copy-status');
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {form.elements.service.value = link.dataset.service; result.hidden=true;}));
function warning(){
  const notes=[];
  if(form.elements.people.value==='6位') notes.push('6位乘客请先确认行李尺寸和数量，建议5位更舒适。');
  if(form.elements.invoice.value==='需要') notes.push('目前暂不能开票；有发票要求时，需先解决实际承接与开票安排，不能直接确认订单。');
  if(form.elements.overnight.value==='需要过夜') notes.push('过夜请逐日列明起止时间，并确认司机餐宿、返程和休息安排。');
  hint.textContent=notes.join(' '); hint.hidden=!notes.length;
}
form.addEventListener('input',()=>{result.hidden=true;copyStatus.textContent='';warning();});
form.addEventListener('change',()=>{result.hidden=true;copyStatus.textContent='';warning();});
form.addEventListener('submit',event=>{
  event.preventDefault();
  result.hidden=true;
  const d=Object.fromEntries(new FormData(form));
  for (const name of ['origin','destination','stops','luggage']) {
    if (!d[name].trim()) {hint.hidden=false;hint.textContent='请完整填写地点、途经停留与行李信息，不能只填空格。';form.elements[name].focus();return;}
  }
  if(new Date(d.end)<=new Date(d.start)){hint.hidden=false;hint.textContent='预计结束时间必须晚于开始时间，可选择次日或更晚日期。';form.elements.end.focus();return;}
  warning();
  summary.value=['【王师傅尊享出行｜用车询价清单｜尚未确认预约】',`类型：${d.service}`,`开始：${d.start.replace('T',' ')}`,`结束：${d.end.replace('T',' ')}`,`路线：${d.origin.trim()} → ${d.destination.trim()}`,`途经与停留：${d.stops.trim()}`,`人数：${d.people}`,`行李：${d.luggage.trim()}`,`过夜：${d.overnight}`,`发票：${d.invoice}（目前暂不能开票）`,`其他：${d.notes.trim()||'无'}`,'请核实承接范围、档期及完整费用。双方确认行程、报价和预约规则后安排用车。'].join('\n');
  result.hidden=false;copyStatus.textContent='清单已生成，尚未发送。请复制到当前咨询聊天中发送。';
});
document.querySelector('#copy').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(summary.value);copyStatus.textContent='已复制。请粘贴到当前咨询聊天中发送；仍需人工确认。';}
  catch{summary.focus();summary.select();copyStatus.textContent='自动复制不可用，请长按或使用复制快捷键复制已选中的清单。';}
});

document.querySelector('#copy-wechat').addEventListener('click',async()=>{
  const status=document.querySelector('#wechat-status');
  try{await navigator.clipboard.writeText('wjj13588763992');status.textContent='微信号已复制，请在微信搜索添加，再发送询价清单。';}
  catch{status.textContent='自动复制不可用，请手动复制微信号：wjj13588763992';}
});

const routeExamples={
  tourism:{service:'周边游包车（一日 / 多日）',origin:'杭州',overnight:'需要过夜'},
  airport:{service:'接站＋半日接待',origin:'杭州萧山国际机场',stops:'公司会议（请补充地址与停留时间）→ 酒店（请补充地址）'},
  suzhou:{service:'跨城 / 多日商务',origin:'杭州',destination:'杭州（往返）',stops:'苏州客户公司 / 工厂（请补充地址与停留时间）'},
  overnight:{service:'跨城 / 多日商务',origin:'杭州',overnight:'需要过夜'}
};
document.querySelectorAll('[data-route]').forEach(link=>link.addEventListener('click',()=>{
  const example=routeExamples[link.dataset.route];
  form.elements.service.value=example.service;
  for(const name of ['origin','destination','stops']){
    if(example[name]&&(!form.elements[name].value.trim()||(name==='origin'&&form.elements[name].value==='杭州'))) form.elements[name].value=example[name];
  }
  if(example.overnight) form.elements.overnight.value=example.overnight;
  result.hidden=true;copyStatus.textContent='';warning();
  document.querySelector('#route-status').textContent='已选择示例；保留已填写地点，请在询价表核对路线并补充实际地址和时间。';
}));
