if (typeof __DEV__ !== 'undefined' && __DEV__) {
  const HOST = 'localhost';
  const PORT = 8097;
  const BASE_RECONNECT_MS = 3000;
  const MAX_RECONNECT_MS = 30000;
  const MAX_QUEUE_SIZE = 200;

  let ws = null;
  let reconnectDelay = BASE_RECONNECT_MS;
  let reconnectTimer = null;
  let isConnected = false;
  let messageQueue = [];

  let appName = 'React Native App';
  let bundleId = '';
  let platform = '';

  try {
    const { Platform } = require('react-native');
    platform = Platform.OS;
  } catch (_) {}

  try {
    const Constants = require('expo-constants').default;
    appName  = Constants.expoConfig?.name ?? Constants.manifest?.name ?? appName;
    bundleId = Constants.expoConfig?.ios?.bundleIdentifier
            ?? Constants.manifest?.ios?.bundleIdentifier
            ?? '';
  } catch (_) {}

  function send(data) {
    try {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    } catch (_) {}
  }

  function enqueue(data) {
    if (isConnected) {
      send(data);
    } else if (messageQueue.length < MAX_QUEUE_SIZE) {
      messageQueue.push(data);
    }
  }

  function scheduleReconnect() {
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => {
      reconnectDelay = Math.min(reconnectDelay * 1.5, MAX_RECONNECT_MS);
      connect();
    }, reconnectDelay);
  }

  function handleMessage(msg) {
    if (msg.type === 'rni:hello') return;
  }

  function connect() {
    try {
      ws = new WebSocket(`ws://${HOST}:${PORT}`);
    } catch (_) {
      scheduleReconnect();
      return;
    }

    ws.onopen = () => {
      isConnected = true;
      reconnectDelay = BASE_RECONNECT_MS;
      send({ type: 'rni:app-info', payload: { appName, bundleId, platform, version: '1.0.0' } });
      messageQueue.forEach(send);
      messageQueue = [];
    };

    ws.onmessage = ({ data }) => {
      try { handleMessage(JSON.parse(data)); } catch (_) {}
    };

    ws.onerror = () => {};

    ws.onclose = () => {
      isConnected = false;
      ws = null;
      scheduleReconnect();
    };
  }

  function serializeArg(a) {
    if (a === null || a === undefined) return String(a);
    if (typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean') return a;
    try {
      return JSON.parse(JSON.stringify(a));
    } catch (_) {
      return String(a);
    }
  }

  const _console = {
    log:   console.log.bind(console),
    warn:  console.warn.bind(console),
    error: console.error.bind(console),
    info:  console.info.bind(console),
  };

  function patch(level, original) {
    return (...args) => {
      original(...args);
      enqueue({
        type: 'rni:log',
        payload: { level, args: args.map(serializeArg), timestamp: Date.now() },
      });
    };
  }

  console.log   = patch('log',   _console.log);
  console.warn  = patch('warn',  _console.warn);
  console.error = patch('error', _console.error);
  console.info  = patch('info',  _console.log);

  connect();

  _console.log(`[RNI] connected → ws://${HOST}:${PORT}`);
}