const { Router } = require("express");
const router = Router();
const config = require("config");

// Получаем URL Victoria Metrics из конфига или используем дефолтный
const VICTORIA_METRICS_URL =
  process.env.VICTORIA_METRICS_URL ||
  config.get("victoriaMetricsUrl") ||
  "http://localhost:8428";

/**
 * Прокси для Victoria Metrics API
 * Прокисирует запросы к Victoria Metrics, чтобы избежать CORS проблем
 */
router.get("/query_range", async (req, res) => {
  try {
    const { query, start, end, step } = req.query;

    if (!query) {
      return res.status(400).json({
        status: "error",
        error: "Query parameter is required",
      });
    }

    // Формируем URL для Victoria Metrics, используя исходные параметры
    const params = new URLSearchParams();
    params.append("query", query);
    params.append("start", start || Math.floor(Date.now() / 1000) - 3600);
    params.append("end", end || Math.floor(Date.now() / 1000));
    params.append("step", step || "30s");

    const victoriaUrl = `${VICTORIA_METRICS_URL}/api/v1/query_range?${params.toString()}`;

    console.log(`[Victoria Metrics] Query: ${query}`);
    console.log(`[Victoria Metrics] URL: ${victoriaUrl}`);

    // Делаем запрос к Victoria Metrics
    const response = await fetch(victoriaUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[Victoria Metrics] Error ${response.status}: ${errorText}`,
      );
      return res.status(response.status).json({
        status: "error",
        error: `Victoria Metrics returned ${response.status}: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();

    // Возвращаем данные клиенту
    res.json(data);
  } catch (error) {
    console.error("[Victoria Metrics] Proxy error:", error);
    res.status(500).json({
      status: "error",
      error: error.message || "Failed to fetch metrics",
      details:
        "Проверьте что Victoria Metrics запущен и доступен по адресу: " +
        VICTORIA_METRICS_URL,
    });
  }
});

/**
 * Прокси для instant queries (не временные ряды)
 */
router.get("/query", async (req, res) => {
  try {
    const { query, time } = req.query;

    if (!query) {
      return res.status(400).json({
        status: "error",
        error: "Query parameter is required",
      });
    }

    const params = new URLSearchParams();
    params.append("query", query);
    params.append("time", time || Math.floor(Date.now() / 1000));

    const victoriaUrl = `${VICTORIA_METRICS_URL}/api/v1/query?${params.toString()}`;

    console.log(`[Victoria Metrics] Instant query: ${query}`);

    const response = await fetch(victoriaUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[Victoria Metrics] Error ${response.status}: ${errorText}`,
      );
      return res.status(response.status).json({
        status: "error",
        error: `Victoria Metrics returned ${response.status}: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("[Victoria Metrics] Proxy error:", error);
    res.status(500).json({
      status: "error",
      error: error.message || "Failed to fetch metrics",
    });
  }
});

/**
 * Проверка доступности Victoria Metrics
 */
router.get("/health", async (req, res) => {
  try {
    const response = await fetch(`${VICTORIA_METRICS_URL}/health`);

    if (response.ok) {
      res.json({
        status: "ok",
        victoriaMetricsUrl: VICTORIA_METRICS_URL,
        message: "Victoria Metrics is accessible",
      });
    } else {
      res.status(503).json({
        status: "error",
        victoriaMetricsUrl: VICTORIA_METRICS_URL,
        message: "Victoria Metrics is not responding properly",
      });
    }
  } catch (error) {
    res.status(503).json({
      status: "error",
      victoriaMetricsUrl: VICTORIA_METRICS_URL,
      error: error.message,
      message: "Cannot connect to Victoria Metrics",
    });
  }
});

module.exports = router;
