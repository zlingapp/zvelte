# Zling Messaging App
![Made with Svelte](https://img.shields.io/badge/Made_with-Svelte-FF3C00)
![Build with Vite](https://img.shields.io/badge/Built_with-Vite-646CFF)
![Packaged with Bun](https://img.shields.io/badge/Packaged_with-Bun-F9F1E1)

### What is Zling?
Zling is a guild-channel based messaging application meant for everyone - from a small
friend group or gaming community to a large corporate messaging hive. Zling is
built on robust and emerging web technologies to remain usable and deployable
anywhere you want, with as much control over your data as you want. Controlling
bloat and tuning performance is as much a priority as security and privacy.

Zling puts an emphasis on being software before being a service. Anyone can run
Zling in the way they want and not have to associate themselves with our
branding. We're not here to tell you how you *should* run your chat platform.

### What is Zvelte?
**Zvelte** is the official web client for the Zling messaging application. You
can use Zvelte on any modern browser that supports JavaScript and WebRTC (for voice
& video chat).

Zvelte is written in [Svelte](https://svelte.dev/) (duh!), one of the most
admired and desired web frameworks of [StackOverflow's 2023 developer
survey](https://survey.stackoverflow.co/2023/#technology-admired-and-desired).
We chose Svelte because it is lightweight
([~6.7kB](https://bundlephobia.com/package/svelte@4.2.2)), performant and great
for developer experience.

Zvelte should maintain full API coverage of the [Zling API](https://github.com/zlingapp/server), and remain a first-class application when developing components of Zling. This is one of the main apps that users of Zling interact with.

### Feature Overview
- 🗨️ Responsive & powerful **text chat system**.
  - Send Text, Images, Videos, GIFs & Audio seamlessly and losslessly
  -  Support for math expressions in LaTeX
  -  Custom emojis for whatever you want
  -  Rich, highlighted code blocks
  -  Embeds for your daily driver websites (YouTube, Twitter, GitHub, etc.)

- 🎧 Robust & low-latency **voice chat** backed by field-tested [mediasoup](https://github.com/versatica/mediasoup-client/) library.
  - Secure & IP Leak Protected
  - No P2P instability - uses a central server
  - Low CPU usage - no transcoding, only forwarding
  - High quality & configurable bitrate
- 📚 Organize communities with servers, channels, roles and permissions.
  - Familiar design seen in other apps like Discord, Slack & Revolt
- 🔥 It's pretty quick
  - Nearly instant load time compared to competition
  - 95+ Lighthouse score
  - No unnecessary complexity
- 🌱 Bloat free SPA, powered by [Vite](https://vitejs.dev/),
  [Svelte](https://svelte.dev/) and [Bun](https://bun.sh/).
- 🔓 Open-source & user-first design approach
- 🏷️ Software before a service
  
  *Zling is developed by volunteers in their free time. Reach out to us if you'd
  like to help!*

### Quickstart
🚧 Zling and Zvelte are currently under development, and do not have a stable release out yet. You are free to self-host the [Zling API Server](https://github.com/zlingapp/server) and this app yourself.

Star and watch this repository if you want to stay updated!

#### Set up build environment
We prefer to use [Bun](https://bun.sh/) as a package manager because it's fast.
Linux is recommended for a development and building OS as it simplifies
installing a lot of dependencies.
##### 1. Install Bun
See Bun's [Installation Guide](https://bun.sh/docs/installation). You can also
use a different package manager like `npm` or `yarn`, but Bun is strongly
recommended.
```sh
# check if it works
$ bun --version
1.0.7
```

##### 2. Install Packages
This installs some needed JS development libraries. Should take about a second
to finish...
```sh
$ bun install
```

<details>
<summary>Output</summary>

```sh
bun install v1.0.7 (b0393fba)
 + @iconify/json@2.2.133
 + @sveltejs/vite-plugin-svelte@2.4.6
 + @tsconfig/svelte@3.0.0
 + @types/node@20.8.9
 + svelte@3.59.2
 + svelte-check@2.10.3
 + tslib@2.6.2
 + typescript@4.9.5
 + unplugin-icons@0.16.6
 + vite@4.5.0
 + vite-plugin-mkcert@1.16.0
 + dayjs@1.11.10
 + mediasoup-client@3.6.102
 + svelte-routing@1.11.0

 168 packages installed [1065.00ms]
```
</details>

##### 3. Build the app...
```sh
# Build static files if you're deploying
$ bun run build
```
<details>
<summary>Output</summary>

```sh
vite v4.5.0 building for production...
✓ 303 modules transformed.
dist/index.html                   1.96 kB │ gzip:  0.91 kB
dist/assets/index-121c99f0.css   31.38 kB │ gzip:  6.47 kB  # main css file
dist/assets/index-7ef777b8.js   215.70 kB │ gzip: 66.69 kB  # app including all icons & some css
dist/assets/index-a2f0e58a.js   281.96 kB │ gzip: 49.23 kB  # loaded during voice chat only
✓ built in 2.69s

# ✅ Your built files are in the dist/ folder ready to host.
```
</details>


```sh
# Open the built app in a browser (with HTTPS!)
$ bun run start
```
<details>
<summary>Output</summary>

```
  ➜  Local:   https://localhost:2000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```
</details>

##### 4. ...or develop it!
```sh
# Open a hot-reloaded HMR server in your browser with HTTPS.
$ bun run dev
```
<details>
<summary>Output</summary>

```
  VITE v4.5.0  ready in 325 ms

  ➜  Local:   https://localhost:2000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```
</details>

Happy hacking!