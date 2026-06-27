<template>
  <section class="sec" id="apid" style="background:var(--bgm)">
    <div>
      <div class="sl2">Developers</div>
      <h2 class="sh2">Integrate in<br>Minutes</h2>
      <p class="sp" style="margin-bottom:28px">A simple REST API to notarize and verify from any language. One endpoint, one hash, permanent proof.</p>
      <a href="#" class="btn-p" style="display:inline-flex">View Full Docs →</a>
    </div>
    <div class="cb">
      <div class="cbh">
        <div class="dots"><span></span><span></span><span></span></div>
        provena-api.js
      </div>
      <pre class="cp"><span class="cm">// Notarize a document hash</span>
<span class="kw">const</span> response = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'https://api.provena.io/v1/notarize'</span>, {
  method: <span class="str">'POST'</span>,
  headers: { <span class="str">'Authorization'</span>: <span class="str">`Bearer ${apiKey}`</span> },
  body: <span class="fn">JSON.stringify</span>({
    hash: <span class="str">'sha256:a3f4b2...'</span>,
    chain: <span class="str">'bch'</span>
  })
});

<span class="kw">const</span> { txid, timestamp } = <span class="kw">await</span> response.<span class="fn">json</span>();
<span class="cm">// txid → your permanent blockchain anchor</span></pre>
    </div>
  </section>
</template>

<style scoped>
section { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.cb { background: rgba(10, 21, 16, 0.4); backdrop-filter: blur(20px); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05); }
.cbh { display: flex; align-items: center; justify-content: space-between; padding: 13px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-family: var(--fd); font-size: .7rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #7A9A80; }
.dots { display: flex; gap: 5px; }
.dots span { width: 10px; height: 10px; border-radius: 50%; }
.dots span:nth-child(1) { background: #FF5F57; }
.dots span:nth-child(2) { background: #FEBC2E; }
.dots span:nth-child(3) { background: #28C840; }
pre.cp { padding: 22px; font-family: 'Courier New',monospace; font-size: .78rem; line-height: 1.85; color: #B0C8B4; overflow-x: auto; }
pre.cp :deep(.kw) { color: #C792EA; }
pre.cp :deep(.str) { color: var(--gl); }
pre.cp :deep(.fn) { color: #82AAFF; }
pre.cp :deep(.cm) { color: #5A7A62; }
@media(max-width:960px) { section { grid-template-columns: 1fr; gap: 40px; } }
</style>
