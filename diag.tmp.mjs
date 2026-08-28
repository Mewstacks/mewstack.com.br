import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
await p.goto("http://localhost:4173/",{waitUntil:"load"});
await p.waitForTimeout(1200);
await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,45));}});
const snap = async (label) => {
  const r = await p.evaluate(()=>({
    presos:[...document.querySelectorAll("[data-reveal],[data-reveal-title]")]
      .filter(e=>{const s=getComputedStyle(e);return +s.opacity<0.95})
      .map(e=>({tag:e.tagName, op:+getComputedStyle(e).opacity.slice(0,5),
                txt:(e.textContent||"").trim().slice(0,42),
                sec:e.closest("section")?.id||"?"})),
    linhas:[...document.querySelectorAll("[data-reveal-title] div div")]
      .filter(d=>Math.abs(new DOMMatrix(getComputedStyle(d).transform).m42)>0.5)
      .map(d=>({txt:d.textContent.trim().slice(0,30), y:+new DOMMatrix(getComputedStyle(d).transform).m42.toFixed(1)})),
  }));
  console.log(`\n--- ${label} ---`);
  console.log("reveals com opacity<0.95:", r.presos.length);
  r.presos.forEach(x=>console.log(`   [${x.sec}] ${x.tag} op=${x.op} "${x.txt}"`));
  console.log("linhas deslocadas:", r.linhas.length);
  r.linhas.forEach(x=>console.log(`   y=${x.y} "${x.txt}"`));
};
await snap("logo após a varredura");
await p.waitForTimeout(4000);
await snap("4s depois (parado no fim da página)");
