import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import {
  INDEXNOW_ENDPOINT,
  INDEXNOW_HOST,
  indexNowPayload,
  readIndexNowKey,
  sitemapUrls,
} from "../scripts/indexnow.mjs";
import { searchEngineVerification } from "../src/lib/search-verification.ts";

test("sin tokens no hay metadatos de verificación", () => {
  assert.equal(searchEngineVerification({}), undefined);
  assert.equal(
    searchEngineVerification({
      NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: "   ",
      NEXT_PUBLIC_BING_SITE_VERIFICATION: "",
    }),
    undefined,
  );
});

test("google y bing usan el nombre de meta de cada buscador", () => {
  assert.deepEqual(
    searchEngineVerification({ NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: " token-g " }),
    { google: "token-g" },
  );
  assert.deepEqual(
    searchEngineVerification({ NEXT_PUBLIC_BING_SITE_VERIFICATION: "token-b" }),
    { other: { "msvalidate.01": "token-b" } },
  );
});

test("la clave IndexNow del repo coincide con su archivo", () => {
  const key = readIndexNowKey(path.join(process.cwd(), "public"));
  assert.match(key, /^[a-f0-9]{32,128}$/);
});

test("IndexNow manda solo las URLs https del sitemap de dermica.lat", () => {
  const urls = sitemapUrls(
    "<urlset><url><loc>https://dermica.lat</loc></url><url><loc>https://dermica.lat/preguntas-frecuentes</loc></url></urlset>",
  );
  assert.deepEqual(urls, ["https://dermica.lat", "https://dermica.lat/preguntas-frecuentes"]);
  const key = "a".repeat(16);
  assert.deepEqual(indexNowPayload(key, urls), {
    host: INDEXNOW_HOST,
    key,
    keyLocation: `https://dermica.lat/${key}.txt`,
    urlList: urls,
  });
  assert.equal(INDEXNOW_HOST, "dermica.lat");
  assert.equal(INDEXNOW_ENDPOINT, "https://api.indexnow.org/indexnow");
  assert.throws(() =>
    sitemapUrls("<urlset><url><loc>https://www.dermica.lat/</loc></url></urlset>"),
  );
});
