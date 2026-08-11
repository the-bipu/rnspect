```
██████╗ ███╗   ██╗███████╗██████╗ ███████╗ ██████╗████████╗
██╔══██╗████╗  ██║██╔════╝██╔══██╗██╔════╝██╔════╝╚══██╔══╝
██████╔╝██╔██╗ ██║███████╗██████╔╝█████╗  ██║        ██║   
██╔══██╗██║╚██╗██║╚════██║██╔═══╝ ██╔══╝  ██║        ██║   
██║  ██║██║ ╚████║███████║██║     ███████╗╚██████╗   ██║   
╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝     ╚══════╝ ╚═════╝   ╚═╝   
```

# rnspect

**Lightweight remote logger & inspector SDK for React Native**

Stream your app's logs to the [RN Inspector](https://github.com/the-bipu/react-native-inspector) desktop app in real time — zero config, zero overhead in production.

</div>

---

## What is this?

`rnspect` is a small SDK that intercepts your React Native `console` calls and forwards them over WebSocket to the [RN Inspector desktop app](https://github.com/the-bipu/react-native-inspector). Instead of digging through Metro's terminal output, you get a clean, dedicated interface for your logs — live, as they happen.

It only runs in `__DEV__` mode. In production builds, the entire SDK is a no-op.

---

## Requirements

You need two things to use this:

**1. The npm package** — installed in your React Native project (this repo).

**2. The desktop app** — [react-native-inspector](https://github.com/the-bipu/react-native-inspector), which receives and displays the logs. Download the latest release for your platform from the [Releases page](https://github.com/the-bipu/react-native-inspector/releases).

The desktop app needs to be running before (or while) your React Native app starts for logs to come through.

---

## Installation

```sh
npm install rnspect
```

```sh
yarn add rnspect
```

---

## Usage

Import once at the top of your entry file (`index.js` or `App.js`):

```js
import 'rnspect';
```

That's it. In development mode, all `console.log`, `console.warn`, `console.error`, and `console.info` calls are automatically forwarded to the RN Inspector desktop app running on your machine.

---

## How it works

```
React Native App  →  rnspect patches console  →  WebSocket (ws://localhost:8097)  →  RN Inspector Desktop
```

1. On app start, `rnspect` opens a WebSocket connection to `localhost:8097`
2. It patches `console.log/warn/error/info` to forward logs over the socket
3. If the connection drops, logs are queued and flushed automatically on reconnect
4. In production (`__DEV__ === false`), nothing runs

---

## Configuration

No configuration is required. The SDK connects to `localhost:8097` by default.

| Setting | Default | Description |
|---|---|---|
| Host | `localhost` | Desktop app host |
| Port | `8097` | Desktop app WebSocket port |
| Reconnect delay | `3000ms` | Initial reconnect wait |
| Max reconnect delay | `30000ms` | Reconnect backoff ceiling |
| Queue size | `200` | Max logs buffered while offline |

Custom configuration support is planned for a future release.

---

## Expo

`rnspect` automatically reads your app name and bundle ID from `expo-constants` if it's installed. No extra setup needed.

---

## Peer dependencies

| Package | Version |
|---|---|
| `react-native` | `>= 0.70.0` |
| `expo-constants` | optional |

---

## Contributing

PRs and issues are welcome. Please open an issue first for major changes.

```sh
git clone https://github.com/the-bipu/rnspect
cd rnspect
```

---

## License

MIT © [Bipanshu Kumar](https://github.com/the-bipu)