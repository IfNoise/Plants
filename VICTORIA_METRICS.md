# Victoria Metrics Configuration

## Environment Variables

```bash
# URL Victoria Metrics сервера
VICTORIA_METRICS_URL=http://localhost:8428
```

## Docker Compose Example

Добавьте в ваш `docker-compose.yml`:

```yaml
services:
  victoria-metrics:
    image: victoriametrics/victoria-metrics:latest
    container_name: victoria-metrics
    ports:
      - "8428:8428"
    volumes:
      - victoria-data:/victoria-metrics-data
    command:
      - "--storageDataPath=/victoria-metrics-data"
      - "--httpListenAddr=:8428"
      - "--retentionPeriod=90d"
    restart: unless-stopped
    networks:
      - app-network

  # Ваше приложение
  plants-app:
    # ...
    environment:
      - VICTORIA_METRICS_URL=http://victoria-metrics:8428
    depends_on:
      - victoria-metrics
    networks:
      - app-network

volumes:
  victoria-data:

networks:
  app-network:
```

## Standalone Installation

### macOS

```bash
brew install victoriametrics
victoria-metrics
```

### Linux

```bash
# Download
wget https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.93.0/victoria-metrics-linux-amd64-v1.93.0.tar.gz
tar xvzf victoria-metrics-linux-amd64-v1.93.0.tar.gz
./victoria-metrics-prod
```

### Windows

```bash
# Download executable from https://github.com/VictoriaMetrics/VictoriaMetrics/releases
victoria-metrics-windows-amd64.exe
```

По умолчанию Victoria Metrics запускается на порту **8428**.

## API Endpoints

После настройки доступны следующие эндпоинты:

- `GET /api/v1/query_range` - Получение временных рядов метрик
- `GET /api/v1/query` - Мгновенные запросы метрик
- `GET /api/v1/health` - Проверка доступности Victoria Metrics

## Отправка метрик в Victoria Metrics

### С использованием prom-client (Node.js)

```javascript
const client = require("prom-client");

// Создание Registry
const register = new client.Registry();

// Метрики для ирригаторов
const valveState = new client.Gauge({
  name: "esp32_A8A154_value",
  help: "Irrigator valve state",
  labelNames: ["topic", "tag"],
  registers: [register],
});

// Обновление метрики
valveState.set(
  { topic: "esp32_A8A154/state/outputs/Valve[2]", tag: "outputs" },
  1,
);

// Эндпоинт для экспорта метрик
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
```

### Настройка сбора метрик

Можно использовать vmagent или отправлять метрики напрямую:

```javascript
const axios = require("axios");

async function pushMetrics() {
  const metrics = `
# HELP esp32_A8A154_value Irrigator valve state
# TYPE esp32_A8A154_value gauge
esp32_A8A154_value{topic="esp32_A8A154/state/outputs/Valve[2]",tag="outputs"} 1
`;

  await axios.post("http://localhost:8428/api/v1/import/prometheus", metrics);
}
```

## Queries Examples

### Для ирригаторов

```promql
# Средное значение состояния клапана
avg by (topic)(esp32_A8A154_value{topic=~"esp32_A8A154/state/outputs/Valve[2]", tag="outputs"})

# Количество переключений за последний час
changes(esp32_A8A154_value{topic=~"esp32_A8A154/state/outputs/Valve.*"}[1h])

# Время работы в секундах за последние 24 часа
sum_over_time(esp32_A8A154_value{topic=~"esp32_A8A154/state/outputs/Valve.*"}[24h]) * 30
```

## Troubleshooting

### Victoria Metrics не запускается

1. Проверьте порт: `lsof -i :8428`
2. Проверьте логи: `docker logs victoria-metrics`
3. Проверьте права на папку данных

### Нет данных в графиках

1. Проверьте что метрики отправляются: `curl http://localhost:8428/api/v1/labels`
2. Проверьте запрос: `curl "http://localhost:8428/api/v1/query?query=up"`
3. Проверьте логи backend: должны быть сообщения `[Victoria Metrics] Proxying request`

### CORS ошибки

Используйте прокси через backend (уже настроено в `/api/v1/query_range`)

## Links

- [Victoria Metrics Docs](https://docs.victoriametrics.com/)
- [PromQL Tutorial](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana Integration](https://docs.victoriametrics.com/guides/grafana-datasource.html)
