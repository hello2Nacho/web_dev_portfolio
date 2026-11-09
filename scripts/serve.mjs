// Tiny static server for local previews (pattern sheet etc.)
import http from "node:http"; import { readFile } from "node:fs/promises"; import { extname, join } from "node:path";
const root = new URL("..", import.meta.url).pathname;
const types = { ".html": "text/html", ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };
http.createServer(async (q, r) => {
  let p = decodeURIComponent(q.url.split("?")[0]);
  if (p === "/") p = "/preview/pattern-sheet.html";
  try { const body = await readFile(join(root, p)); r.writeHead(200, { "content-type": types[extname(p)] ?? "application/octet-stream" }); r.end(body); }
  catch { r.writeHead(404); r.end(); }
}).listen(Number(process.env.PORT) || 4173);
