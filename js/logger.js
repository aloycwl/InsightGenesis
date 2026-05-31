import axios from "axios";

const {
  DD_API_KEY,
  DD_SITE = "datadoghq.com",
  DD_SERVICE = "insightgenesis-api",
  DD_ENV = process.env.NODE_ENV || "development",
  DD_VERSION = "1.0.0",
} = process.env;

const DATADOG_URL = `https://http-intake.logs.${DD_SITE}/api/v2/logs`;

const queue = [];
let timer = null;
const BATCH_SIZE = 20;
const FLUSH_MS = 1500;

function baseLog(level, message, attrs = {}) {
  return {
    message,
    level,
    service: DD_SERVICE,
    env: DD_ENV,
    version: DD_VERSION,
    timestamp: new Date().toISOString(),
    ...attrs,
  };
}

async function sendBatch(batch) {
  if (!DD_API_KEY) {
    for (const entry of batch) {
      if (entry.level === "error") console.error(entry);
      else console.log(entry);
    }
    return;
  }

  try {
    await axios.post(DATADOG_URL, batch, {
      headers: {
        "Content-Type": "application/json",
        "DD-API-KEY": DD_API_KEY,
      },
      timeout: 5000,
    });
  } catch (err) {
    console.error("Datadog log upload failed", err?.message || err);
    for (const entry of batch) {
      if (entry.level === "error") console.error(entry);
      else console.log(entry);
    }
  }
}

async function flush() {
  if (!queue.length) return;
  const batch = queue.splice(0, queue.length);
  await sendBatch(batch);
}

function scheduleFlush() {
  if (timer) return;
  timer = setTimeout(async () => {
    timer = null;
    await flush();
  }, FLUSH_MS);
}

function enqueue(entry) {
  queue.push(entry);
  if (queue.length >= BATCH_SIZE) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    void flush();
    return;
  }
  scheduleFlush();
}

export function info(message, attrs = {}) {
  enqueue(baseLog("info", message, attrs));
}

export function warn(message, attrs = {}) {
  enqueue(baseLog("warn", message, attrs));
}

export function error(message, attrs = {}) {
  enqueue(baseLog("error", message, attrs));
}

export function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    info("request_completed", {
      method: req.method,
      endpoint: req.path,
      status_code: res.statusCode,
      duration_ms: Date.now() - start,
      ip: (req.ip || req.connection?.remoteAddress || "").replace(/^::ffff:/, "") || null,
      key_id: req.keyId || null,
    });
  });
  next();
}

process.on("beforeExit", async () => {
  await flush();
});

async function flushAndExit(code) {
  try {
    await flush();
  } finally {
    process.exit(code);
  }
}

process.on("SIGINT", () => {
  void flushAndExit(0);
});

process.on("SIGTERM", () => {
  void flushAndExit(0);
});
