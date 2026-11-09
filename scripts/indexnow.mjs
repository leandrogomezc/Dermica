import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const INDEXNOW_HOST = "dermica.lat";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

const KEY_FILE = /^[a-zA-Z0-9-]{8,128}\.txt$/;

export function readIndexNowKey(publicDir) {
  const keys = readdirSync(publicDir).flatMap((name) => {
    if (!KEY_FILE.test(name)) return [];
    const key = name.slice(0, -4);
    const content = readFileSync(path.join(publicDir, name), "utf8").trim();
    return content === key ? [key] : [];
  });
  if (keys.length !== 1) {
    throw new Error(
      `Se esperaba un solo archivo public/<clave>.txt de IndexNow y hay ${keys.length}.`,
    );
  }
  return keys[0];
}

export function sitemapUrls(xml, host = INDEXNOW_HOST) {
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
  const foreign = urls.filter((url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol !== "https:" || parsed.hostname !== host;
    } catch {
      return true;
    }
  });
  if (urls.length === 0 || foreign.length > 0) {
    throw new Error(`El sitemap tiene que listar solo URLs https de ${host}.`);
  }
  return urls;
}

export function indexNowPayload(key, urls, host = INDEXNOW_HOST) {
  return {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  };
}

async function main() {
  const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
  const key = readIndexNowKey(publicDir);
  const keyLocation = `https://${INDEXNOW_HOST}/${key}.txt`;
  const keyResponse = await fetch(keyLocation);
  const published = (await keyResponse.text()).trim();
  if (!keyResponse.ok || published !== key) {
    throw new Error(
      `La clave IndexNow todavía no está en ${keyLocation} (HTTP ${keyResponse.status}). Corré este comando cuando el deploy ya esté en producción.`,
    );
  }

  const sitemapResponse = await fetch(`https://${INDEXNOW_HOST}/sitemap.xml`);
  if (!sitemapResponse.ok) {
    throw new Error(`No se pudo leer el sitemap (HTTP ${sitemapResponse.status}).`);
  }
  const urls = sitemapUrls(await sitemapResponse.text());
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(indexNowPayload(key, urls)),
  });
  if (response.status !== 200 && response.status !== 202) {
    const detail = (await response.text()).trim();
    throw new Error(
      `IndexNow respondió HTTP ${response.status}${detail ? `: ${detail}` : ""}.`,
    );
  }
  console.log(`IndexNow aceptó ${urls.length} URLs (HTTP ${response.status}).`);
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
