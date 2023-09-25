# Zling-Svelte Web Client: Zvelte

### What is Zvelte?
**Zvelte is the official web client for the Zling chat application.**
It should maintain full API coverage of the [Zling API](https://github.com/zlingapp/server), and remain a first-class application when developing components of Zling. This is one of the main apps that users of Zling interact with.

### Features
- 🗨️ Responsive & powerful **text chat system**.
- 🎧 Robust & low-latency **voice chat** backed by field-tested [mediasoup](https://github.com/versatica/mediasoup-client/) library.
- 📚 Organize communities with servers, channels, roles and permissions.
  - Familiar design seen in other apps like Discord, Slack & Revolt
- 🔥 Blazingly fast™️
  - Nearly instant load time compared to competition
  - 95+ Lighthouse score
- 🌱 Bloat free SPA, powered by [Vite](https://vitejs.dev/), [Svelte](https://svelte.dev/).
  
    ```
    dist/index.html                   0.45 kB
    dist/assets/index-cb592dbf.css   15.70 kB │ gzip:  3.86 kB
    dist/assets/index-66999ad3.js   117.53 kB │ gzip: 37.65 kB   <--- 99% of the app
    dist/assets/index-b3a4b5e4.js   286.99 kB │ gzip: 46.81 kB   <--- only loaded when using voice chat
    ✓ built in 1.87s
    ✨  Done in 2.15s.
    ```
- 🔓 Open-source & user-first design approach
  
  *Zling is developed by volunteers in their free time. It does not aim to be a business, but rather remains open to all for contribution and user-centric.*

### Quickstart
🚧 Zling and Zvelte are currently under development, and do not have a stable release out yet. You are free to self-host the [Zling API Server](https://github.com/zlingapp/server) and this app yourself.

Star and watch this repository if you want to stay updated!
