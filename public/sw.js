if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,n)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const r=e=>c(e,i),o={module:{uri:i},exports:t,require:r};s[i]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(n(...e),t)))}}define(["./workbox-f1770938"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/bre6Kvwd0oD75cAS_7LTo/_buildManifest.js",revision:"3556b0ce537a72b47c29bb8f85ff4411"},{url:"/_next/static/bre6Kvwd0oD75cAS_7LTo/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/150.5185bbd9ca0988af.js",revision:"5185bbd9ca0988af"},{url:"/_next/static/chunks/173.7c89c1c5d666a48d.js",revision:"7c89c1c5d666a48d"},{url:"/_next/static/chunks/235.476a5a975967c1e9.js",revision:"476a5a975967c1e9"},{url:"/_next/static/chunks/309-363e31190bfcb54a.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/311-88d1986a3a52aaa3.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/409.06d79a80bd1351c8.js",revision:"06d79a80bd1351c8"},{url:"/_next/static/chunks/5056baca-7f2b93ef839f43fc.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/557.86f09b1add029225.js",revision:"86f09b1add029225"},{url:"/_next/static/chunks/5c0b189e-d7eb95f770d84fd8.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/664-ca2b1f842a431311.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/675-d2abcde844a97fa2.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/746-13859128d12c25af.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/778-aae0b89ca46c6023.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/796.7908393ffa5387fc.js",revision:"7908393ffa5387fc"},{url:"/_next/static/chunks/799.6d1997ef976d9250.js",revision:"6d1997ef976d9250"},{url:"/_next/static/chunks/837.452660aa1b24e071.js",revision:"452660aa1b24e071"},{url:"/_next/static/chunks/838.ee31651e7745ce2d.js",revision:"ee31651e7745ce2d"},{url:"/_next/static/chunks/892.67b3e5ac3d7b2d94.js",revision:"67b3e5ac3d7b2d94"},{url:"/_next/static/chunks/900.2a52cb24c495de8a.js",revision:"2a52cb24c495de8a"},{url:"/_next/static/chunks/929.2024ccdbdb511c85.js",revision:"2024ccdbdb511c85"},{url:"/_next/static/chunks/fd9d1056-2821b0f0cabcd8bd.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/framework-93510a6cc14519c3.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/main-app-623b80217ed6abc2.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/main-e6eca6638ee9d9c0.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/pages/_app-e9841eb3d8c9e0cc.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/pages/_error-1be831200e60c5c0.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/pages/category/%5Bid%5D-f48ec0057d2f2488.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/pages/category/%5Bid%5D/episode-af237bc5348cf183.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/pages/footer-4dec4c16009dc5e1.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/pages/header-e0a2cbdcf8025ad2.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/pages/home-02d2787f5c06572e.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/pages/index-c6284e50b587897e.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/pages/results-271b630ac92ba2e5.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-d1b27697946da80c.js",revision:"bre6Kvwd0oD75cAS_7LTo"},{url:"/_next/static/css/5a03c1b090995157.css",revision:"5a03c1b090995157"},{url:"/_next/static/css/813592488e7491e2.css",revision:"813592488e7491e2"},{url:"/_next/static/css/a9ab0cd9ea8703fb.css",revision:"a9ab0cd9ea8703fb"},{url:"/_next/static/css/abc3b9f2039343b4.css",revision:"abc3b9f2039343b4"},{url:"/_next/static/css/c335ecb8a660fc88.css",revision:"c335ecb8a660fc88"},{url:"/android-chrome-192x192.png",revision:"1e78188397952823f3388114c09615e1"},{url:"/android-chrome-512x512.png",revision:"615714d3a17a0d608b97b84724ff2cbf"},{url:"/apple-touch-icon.png",revision:"e2bc5d0738a1eeedf1d366fe86297e78"},{url:"/dino.jpg",revision:"a7ea1c420a7e1aa7c1fbc02b675b451d"},{url:"/favicon-16x16.png",revision:"6446c9960314a13b81f41b87e602d864"},{url:"/favicon-32x32.png",revision:"1e824999b210775c9472593835381c97"},{url:"/favicon.ico",revision:"eb8911b2e8ae72e1236a8f4b66c0be13"},{url:"/logo.png",revision:"227bafa54ee61d6a638e407faa4a8e2e"},{url:"/manifest.json",revision:"31e70f908e71d16c7d04a11bc56c3b26"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/site.webmanifest",revision:"053100cb84a50d2ae7f5492f7dd7f25e"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:s}})=>!(!e||s.startsWith("/api/auth/callback")||!s.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:c})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&c&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:c})=>"1"===e.headers.get("RSC")&&c&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:s})=>s&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
