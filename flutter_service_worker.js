'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "494b49b2b550f061d6ad461731fb7caa",
"assets/AssetManifest.bin.json": "8d759d68572e99d2fe52afb7de929e11",
"assets/AssetManifest.json": "c8b76c5374916c457da4ba28c5c8ceee",
"assets/assets/images/atla.jpg": "5b65b1115886e026df8745ce0fa17a2b",
"assets/assets/images/atla_title.png": "6155f51047594677982d4b6aa0c614d2",
"assets/assets/images/black_mirror.jpg": "bbf94b8f7e8cbdbf2c4e9a5b92ea0790",
"assets/assets/images/black_mirror_title.png": "f6ec0b792069f472d2e36634e35baa69",
"assets/assets/images/breaking_bad.jpeg": "7821e297df27197cdda67e13e82188b8",
"assets/assets/images/carole_and_tuesday.jpg": "e787073ccc9428249afe92313d00c6bc",
"assets/assets/images/carole_and_tuesday_title.png": "1f8f81cf47fccb05606f3df26b7695eb",
"assets/assets/images/crown.jpg": "47eaa139afb5abaf6dca5407f64080f7",
"assets/assets/images/crown_title.png": "02fa5258c38d51bbf902520255352dc2",
"assets/assets/images/dogs.jpg": "2b8484bf41be42ce95d42c193cec6a8a",
"assets/assets/images/explained.jpg": "431292d11962afefbfe2991fd3d01a67",
"assets/assets/images/htsdof.jpg": "c0f043e4ae001920e0f1bd10042d8549",
"assets/assets/images/kakegurui.jpg": "e53e90e841c33926c45deb4dae78442d",
"assets/assets/images/netflix_logo0.png": "90753a23d851213f214e1faccc4947cb",
"assets/assets/images/netflix_logo1.png": "451f1d563a05a249b69772cfbcc456e7",
"assets/assets/images/sintel.jpg": "5b4a20ec9a07e03add61dbfff0def608",
"assets/assets/images/sintel_title.png": "213547e6e216ec48180c091ff8c8f13d",
"assets/assets/images/stranger_things.jpg": "45da3c11ae3d50a599d5a91663664d82",
"assets/assets/images/teotfw.jpg": "b1ad8119028caab99a82ae253eb2a8e5",
"assets/assets/images/thirteen_reasons_why.jpg": "f3c6ba25dc548121333e15a5401b5bd2",
"assets/assets/images/tiger_king.jpg": "09f31639810f01424f9e13d47cfd7075",
"assets/assets/images/umbrella_academy.jpg": "694538108dad1b7bbf145065d438f0d3",
"assets/assets/images/umbrella_academy_title.png": "0fc8a66b919dbffb8cb464dc30939b22",
"assets/assets/images/violet_evergarden.jpg": "2d3095573a37672e6155447e371d6ea6",
"assets/assets/images/witcher.jpg": "36d8eee67f80feedbf05534e642247ae",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "bf61a682839ffb478cf7ebc72a8b2c98",
"assets/NOTICES": "9677f3c5e9362aa7e7ffba8dbcc8770c",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "64edb91684bdb3b879812ba2e48dd487",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "f87e541501c96012c252942b6b75d1ea",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "4124c42a73efa7eb886d3400a1ed7a06",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "59a12ab9d00ae8f8096fffc417b6e84f",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "25f95ff0cb16e9bcaa5a8a0bb64ef308",
"/": "25f95ff0cb16e9bcaa5a8a0bb64ef308",
"main.dart.js": "cf45b08e5cdc51bbd395131d46c66809",
"manifest.json": "6dea9178cc351f740aec010d07343856",
"test": "2d69837b179fffcb2eb2da41f10b988b",
"version.json": "9407956a9d23621a519282a3b4e6490e"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
