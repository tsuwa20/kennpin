const CACHE_NAME = "qr-check-V11";

const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./tenyuryoku.html",   // ← 手入力検品
  "./scan.html",         // ← 海外ラベル
  "./gennpin.html",      // ← 現品票読み取り

  "./js/jsQR.js",
  "./js/zxing.min.js",

  "./sounds/yomitori.mp3",
  "./sounds/seikou.mp3",
  "./sounds/keikoku.mp3",

  "./icon/favicon.png",
  "./icon/icon-180.png"
];

// インストール時：キャッシュ
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

// 古いキャッシュ削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});

// fetch：キャッシュ優先 + ナビゲーション対策
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      if (res) return res;
      return fetch(event.request).catch(() => {
        // HTML遷移時のフォールバック（Android対策）
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});

