for (const root of document.querySelectorAll<HTMLElement>('[data-case-index]')) {
  const inputs = Array.from(root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-filter]'));
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-case-card]'));
  const result = root.querySelector<HTMLElement>('[data-result-count]');
  const empty = root.querySelector<HTMLElement>('[data-empty-state]');
  const group = root.querySelector<HTMLElement>('[data-filters]');
  const params = new URLSearchParams(location.search);
  for (const input of inputs) {
    const value = params.get(input.dataset.filter!) || '';
    if (input instanceof HTMLSelectElement && !Array.from(input.options).some(o=>o.value===value)) continue;
    input.value = value;
  }
  const update = (persist = true) => {
    const values = Object.fromEntries(inputs.map(input=>[input.dataset.filter!,input.value.trim()]));
    const query = values.q.toLocaleLowerCase();
    let visible=0;
    for (const card of cards) {
      const d=card.dataset;
      const match=(!values.topic||d.topic===values.topic)&&(!query||(d.search||'').includes(query))&&(!values.taiwan||(values.taiwan==='direct'?d.direct==='yes':d.discussion==='yes'));
      card.hidden=!match; if(match)visible++;
    }
    const next = new URLSearchParams();
    for (const [key,value] of Object.entries(values)) if(value)next.set(key,value);
    if(persist)history.replaceState(null,'',location.pathname+(next.size?'?'+next.toString():''));
    root.querySelectorAll<HTMLAnchorElement>('[data-case-link]').forEach(link=>{
      const url=new URL(link.href); url.search=next.size?'?return='+encodeURIComponent(next.toString()):''; link.href=url.href;
    });
    if(result)result.textContent='找到 '+visible+' 篇';
    if(empty)empty.hidden=visible!==0;
  };
  inputs.forEach(input=>input.addEventListener(input instanceof HTMLInputElement?'input':'change',()=>update()));
  root.querySelector('[data-clear-filters]')?.addEventListener('click',()=>{inputs.forEach(i=>i.value='');update();});
  if(group)group.hidden=false;
  update(false);
}
