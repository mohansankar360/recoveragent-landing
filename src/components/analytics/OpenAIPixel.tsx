export function OpenAIPixelHead() {
  const pixelId = process.env.NEXT_PUBLIC_OPENAI_ADS_PIXEL_ID?.trim();
  if (!pixelId) return null;
  const id = JSON.stringify(pixelId).replace(/</g, "\\u003c");
  return <script dangerouslySetInnerHTML={{ __html: `
try {
  if (!window.oaiq) {
    (function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};
    q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=true;j.src=u;
    var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f);
    })(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");
    window.oaiq("init", {pixelId: ${id}});
  }
} catch (_) {}
` }} />;
}
