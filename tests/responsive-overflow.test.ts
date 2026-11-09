import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import test from "node:test";
import puppeteer from "puppeteer-core";

const chrome = "/usr/local/bin/google-chrome";
const port = 3100 + Math.floor(Math.random() * 500);
const base = `http://127.0.0.1:${port}`;
const widths = [320, 360, 375, 390, 414, 768, 1280];
const paths = [
  "/",
  "/catalogo",
  "/catalogo/rellenos-acido-hialuronico",
  "/quienes-somos",
  "/apertura",
  "/contacto",
  "/privacidad",
  "/retirar-marketing",
];

test("el texto visible cabe en su caja en móvil, tablet y escritorio", async (t) => {
  if (!existsSync(chrome)) {
    t.skip("sin Chrome local");
    return;
  }

  const server = spawn(
    "npx",
    ["next", "start", "-H", "127.0.0.1", "-p", String(port)],
    {
      cwd: process.cwd(),
      stdio: "ignore",
      env: { ...process.env, DATABASE_URL: "", WAITLIST_SQLITE_PATH: "" },
    },
  );
  let serverExit = false;
  server.once("exit", () => {
    serverExit = true;
  });
  t.after(() => stop(server));
  await waitForServer(base);
  if (serverExit) throw new Error("el servidor de layout se cerró antes de la prueba");

  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  t.after(() => browser.close());
  const page = await browser.newPage();

  for (const width of widths) {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    for (const path of paths) {
      await page.goto(base + path, { waitUntil: "networkidle0" });
      await page.evaluate(() => document.fonts.ready);
      const result = await page.evaluate(measureOverflow);
      assert.equal(
        result.pageOverflow,
        0,
        `${width}px ${path} tiene scroll horizontal (${result.pageOverflow}px)`,
      );
      assert.deepEqual(
        result.outside,
        [],
        `${width}px ${path} texto fuera de su caja: ${result.outside.join(" | ")}`,
      );
    }
  }
});

function measureOverflow() {
  const pageWidth = document.documentElement.clientWidth;
  const pageOverflow = Math.max(0, document.documentElement.scrollWidth - pageWidth);
  const outside: string[] = [];
  const seen = new Set<string>();
  for (const el of document.querySelectorAll("h1,h2,h3,p,a,span,li,button,label")) {
    if (el.closest("[aria-hidden='true'], .sr-only")) continue;
    if (el.querySelector("*")) continue;
    const text = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (!text) continue;
    const range = document.createRange();
    range.selectNodeContents(el);
    const ink = range.getBoundingClientRect();
    if (ink.width < 1 || ink.height < 1) continue;
    const box = el.getBoundingClientRect();
    const pastBox = ink.right - box.right;
    const pastPage = ink.right - pageWidth;
    if (pastBox > 1 || pastPage > 1) {
      const sample = text.slice(0, 48);
      if (!seen.has(sample)) {
        seen.add(sample);
        outside.push(sample);
      }
    }
  }
  return { pageOverflow, outside };
}

async function waitForServer(url: string) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server is still booting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("el servidor de la prueba de layout no arrancó");
}

function stop(server: ChildProcess) {
  if (!server.killed) server.kill("SIGTERM");
}
