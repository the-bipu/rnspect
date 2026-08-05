<div align="center">

<img src="https://img.shields.io/npm/v/rnspect?style=for-the-badge&color=61dafb&labelColor=20232a&label=rnspect" alt="npm version" />
<img src="https://img.shields.io/npm/l/rnspect?style=for-the-badge&color=61dafb&labelColor=20232a" alt="license" />
<img src="https://img.shields.io/npm/dm/rnspect?style=for-the-badge&color=61dafb&labelColor=20232a" alt="downloads" />
<img src="https://img.shields.io/badge/platform-ios%20%7C%20android-61dafb?style=for-the-badge&labelColor=20232a" alt="platform" />

<br />
<br />

```
██████╗ ███╗   ██╗███████╗██████╗ ███████╗ ██████╗████████╗
██╔══██╗████╗  ██║██╔════╝██╔══██╗██╔════╝██╔════╝╚══██╔══╝
██████╔╝██╔██╗ ██║███████╗██████╔╝█████╗  ██║        ██║   
██╔══██╗██║╚██╗██║╚════██║██╔═══╝ ██╔══╝  ██║        ██║   
██║  ██║██║ ╚████║███████║██║     ███████╗╚██████╗   ██║   
╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝     ╚══════╝ ╚═════╝   ╚═╝   
```

**Lightweight remote logger & inspector SDK for React Native**

*Stream your app's logs to the [RN Inspector](https://github.com/yourusername/rn-inspector) desktop app in real time — zero config, zero overhead in production.*

</div>

---

## ✨ Features

- 🔌 **Auto-connects** via WebSocket — no setup beyond one import
- 📦 **Zero production overhead** — entire SDK is gated behind `__DEV__`
- 🔄 **Auto-reconnects** with exponential backoff
- 📬 **Message queuing** — logs are buffered while disconnected, then flushed on reconnect
- 🧩 **Expo-compatible** — detects `expo-constants` automatically, no config needed
- 🪶 **Tiny** — single file, no dependencies

---

## 📦 Installation

```sh
npm install @the-order/rnspect
```

```sh
yarn add @the-order/rnspect
```

---

## 🚀 Usage

Import once at the top of your entry file (e.g. `index.js` or `App.js`):

```js
import '@the-order/rnspect';
```

That's it. In `__DEV__` mode, all `console.log`, `console.warn`, `console.error`, and `console.info` calls are automatically forwarded to the [RN Inspector desktop app](https://github.com/yourusername/rn-inspector) running on your machine.

---

## ⚙️ How It Works

```
┌─────────────────────┐        WebSocket (ws://localhost:8097)       ┌───────────────────────┐
│   React Native App  │  ──────────────────────────────────────────► │  RN Inspector Desktop │
│                     │                                              │                       │
│  console.log(...)   │  →  rnspect patches console  →  enqueues  →  │  Displays live logs   │
└─────────────────────┘                                              └───────────────────────┘
```

1. On app start, `rnspect` opens a WebSocket connection to `localhost:8097`
2. It patches `console.log/warn/error/info` to forward logs over the socket
3. Logs are queued if the connection drops and flushed when it recovers
4. In production (`__DEV__ === false`), nothing runs — zero impact

---

## 🔧 Configuration

No configuration required for default usage. The SDK connects to `localhost:8097` automatically.

| Setting | Default | Description |
|---|---|---|
| Host | `localhost` | Desktop app host |
| Port | `8097` | Desktop app WebSocket port |
| Reconnect delay | `3000ms` | Initial reconnect wait |
| Max reconnect delay | `30000ms` | Reconnect backoff ceiling |
| Queue size | `200` | Max logs buffered while offline |

> Custom configuration support is coming in v2.

---

## 🧩 Expo Support

`rnspect` automatically reads your app name and bundle ID from `expo-constants` if available. No extra setup needed — just install and import.

---

## 📋 Requirements

| Peer dependency | Version |
|---|---|
| `react-native` | `>= 0.70.0` |
| `expo-constants` | optional |

---

## 🗺️ Roadmap

- [ ] Custom host/port configuration
- [ ] Log filtering by level
- [ ] Network request inspection
- [ ] Redux / Zustand state streaming
- [ ] VS Code extension

---

## 🤝 Contributing

PRs and issues are welcome. Please open an issue first for major changes.

```sh
git clone https://github.com/the-bipu/rnspect
cd rnspect
```

---

## 📄 License

MIT © [Bipanshu Kumar](https://github.com/the-bipu)