# MetricsChart

Компонент для визуализации метрик из Victoria Metrics, аналогичный графикам Grafana.

## Возможности

- 📊 Визуализация временных рядов из Victoria Metrics
- ⏱️ Гибкая настройка временных диапазонов (от 5 минут до 30 дней)
- 🔄 Автоматическое обновление графиков
- 📏 Автоматическое и ручное масштабирование осей
- 🎨 Поддержка множественных серий данных
- 📱 Адаптивный дизайн
- 🇷🇺 Полная локализация на русском языке

## Установка

Компонент использует библиотеки, которые уже установлены в проекте:

- `@mui/material`
- `@mui/x-charts`
- `@mui/x-date-pickers`
- `dayjs`

## Использование

### Базовый пример

```jsx
import MetricsChart from "./components/MetricsChart";

function App() {
  return (
    <MetricsChart
      title="Длительность таймера"
      query='timer_duration_seconds{job="plants-app"}'
      victoriaMetricsUrl="http://localhost:8428/api/v1/query_range"
      defaultTimeRange="1h"
      yAxisLabel="Секунды"
    />
  );
}
```

### С автообновлением

```jsx
<MetricsChart
  title="Метрики в реальном времени"
  query="rate(http_requests_total[5m])"
  victoriaMetricsUrl="http://localhost:8428/api/v1/query_range"
  defaultTimeRange="15m"
  autoRefresh={true}
  refreshInterval="30s"
/>
```

### Без панели управления (только график)

```jsx
<MetricsChart
  title="Компактный график"
  query="process_cpu_usage"
  victoriaMetricsUrl="http://localhost:8428/api/v1/query_range"
  showControls={false}
  height={300}
/>
```

### Дискретные значения (вкл/выкл, импульсы)

Для данных с короткими импульсами (например, клапаны, реле) используйте режим `discrete`:

```jsx
<MetricsChart
  title="Состояние клапана полива"
  query='esp32_A8A154_value{topic="esp32_A8A154/state/outputs/Valve2"}'
  victoriaMetricsUrl="/api/v1/query_range"
  defaultTimeRange="12h"
  height={250}
  autoRefresh={true}
  refreshInterval="30s"
  yAxisLabel="Вкл/Выкл"
  discrete={true}
/>
```

Особенности режима `discrete`:

- Ось Y зафиксирована от 0 до 1
- График отображается ступенчато (stepAfter)
- Уменьшенный step для детализации коротких импульсов
- Компактное отображение

## Props

| Prop                 | Тип     | По умолчанию            | Описание                                              |
| -------------------- | ------- | ----------------------- | ----------------------------------------------------- |
| `title`              | string  | `'Метрики'`             | Заголовок графика                                     |
| `query`              | string  | `''`                    | Victoria Metrics запрос (PromQL)                      |
| `victoriaMetricsUrl` | string  | `'/api/v1/query_range'` | URL API Victoria Metrics                              |
| `defaultTimeRange`   | string  | `'1h'`                  | Временной диапазон по умолчанию                       |
| `height`             | number  | `400`                   | Высота графика в пикселях                             |
| `autoRefresh`        | boolean | `false`                 | Включить автообновление                               |
| `refreshInterval`    | string  | `'30s'`                 | Интервал автообновления                               |
| `showControls`       | boolean | `true`                  | Показывать панель управления                          |
| `yAxisLabel`         | string  | `''`                    | Подпись оси Y                                         |
| `xAxisLabel`         | string  | `'Время'`               | Подпись оси X                                         |
| `discrete`           | boolean | `false`                 | Режим дискретных значений (0/1) для импульсных данных |

## Временные диапазоны

Доступные значения для `defaultTimeRange`:

- `'5m'` - 5 минут
- `'15m'` - 15 минут
- `'30m'` - 30 минут
- `'1h'` - 1 час (по умолчанию)
- `'3h'` - 3 часа
- `'6h'` - 6 часов
- `'12h'` - 12 часов
- `'24h'` - 24 часа
- `'7d'` - 7 дней
- `'30d'` - 30 дней
- `'custom'` - Произвольный (с выбором дат)

## Интервалы автообновления

Доступные значения для `refreshInterval`:

- `'5s'` - 5 секунд
- `'10s'` - 10 секунд
- `'30s'` - 30 секунд (по умолчанию)
- `'1m'` - 1 минута
- `'5m'` - 5 минут
- `'off'` - Выключено

## Примеры запросов

### Мониторинг таймеров

```promql
# Средняя длительность выполнения
avg(timer_duration_seconds) by (timer_name)

# P95 процентиль
histogram_quantile(0.95, rate(timer_duration_seconds_bucket[5m]))

# Количество срабатываний в секунду
rate(timer_executions_total[5m])

# Процент успешных выполнений
(timer_success_total / timer_total) * 100
```

### Мониторинг системы

```promql
# CPU Usage
rate(process_cpu_seconds_total[5m]) * 100

# Memory Usage (в MB)
process_resident_memory_bytes / 1024 / 1024

# HTTP запросы по статусам
sum(rate(http_requests_total[5m])) by (status)
```

### Мониторинг приложения

```promql
# Latency P99
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))

# Error rate
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])

# Throughput
sum(rate(http_requests_total[5m]))
```

## Интеграция с бэкендом

Если Victoria Metrics находится на другом хосте, нужно настроить прокси в backend:

```javascript
// В вашем Express приложении
app.use("/api/v1/query_range", async (req, res) => {
  try {
    const victoriaMetricsUrl = "http://victoria-metrics-server:8428";
    const response = await fetch(
      `${victoriaMetricsUrl}/api/v1/query_range?${new URLSearchParams(req.query)}`,
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Настройка Victoria Metrics

### Docker Compose

```yaml
services:
  victoria-metrics:
    image: victoriametrics/victoria-metrics:latest
    ports:
      - "8428:8428"
    volumes:
      - victoria-data:/victoria-metrics-data
    command:
      - "--storageDataPath=/victoria-metrics-data"
      - "--httpListenAddr=:8428"
      - "--retentionPeriod=30d"

volumes:
  victoria-data:
```

### Отправка метрик в Victoria Metrics

```javascript
// Пример отправки метрик с использованием промклиента
const client = require("prom-client");

// Создание метрики таймера
const timerDuration = new client.Histogram({
  name: "timer_duration_seconds",
  help: "Duration of timer execution",
  labelNames: ["timer_name", "status"],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

// Использование
const end = timerDuration.startTimer({ timer_name: "plant_watering" });
// ... выполнение операции
end({ status: "success" });

// Отправка метрик в Victoria Metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});
```

## Troubleshooting

### CORS ошибки

Если получаете CORS ошибки при подключении к Victoria Metrics:

1. Используйте прокси через backend (рекомендуется)
2. Или добавьте CORS заголовки в Victoria Metrics:
   ```
   --http.cors.allowOrigin=http://localhost:5173
   ```

### Нет данных

1. Проверьте что запрос возвращает данные через curl:
   ```bash
   curl "http://localhost:8428/api/v1/query_range?query=up&start=1234567890&end=1234567900&step=30s"
   ```
2. Проверьте что метрики действительно записываются в Victoria Metrics
3. Убедитесь что временной диапазон корректный

### Медленная загрузка

1. Уменьшите временной диапазон
2. Используйте агрегирующие функции (`avg`, `sum`, `rate`)
3. Увеличьте `step` для больших периодов

## Лицензия

MIT
