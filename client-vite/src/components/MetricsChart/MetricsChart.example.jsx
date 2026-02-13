import { Stack, Container, Typography, Divider } from "@mui/material";
import MetricsChart from "./MetricsChart";

/**
 * Примеры использования компонента MetricsChart
 * для визуализации метрик из Victoria Metrics
 */
export default function MetricsChartExamples() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Примеры использования MetricsChart
      </Typography>

      <Stack spacing={4} sx={{ mt: 3 }}>
        {/* Пример 1: Базовое использование */}
        <div>
          <Typography variant="h6" gutterBottom>
            1. Базовая визуализация таймера
          </Typography>
          <MetricsChart
            title="Длительность выполнения таймера"
            query='timer_duration_seconds{job="plants-app"}'
            victoriaMetricsUrl="http://your-victoria-metrics:8428/api/v1/query_range"
            defaultTimeRange="1h"
            yAxisLabel="Секунды"
          />
        </div>

        <Divider />

        {/* Пример 2: С автообновлением */}
        <div>
          <Typography variant="h6" gutterBottom>
            2. С автоматическим обновлением каждые 30 секунд
          </Typography>
          <MetricsChart
            title="CPU Usage в реальном времени"
            query="rate(process_cpu_seconds_total[5m])"
            victoriaMetricsUrl="http://your-victoria-metrics:8428/api/v1/query_range"
            defaultTimeRange="15m"
            autoRefresh={true}
            refreshInterval="30s"
            yAxisLabel="CPU %"
          />
        </div>

        <Divider />

        {/* Пример 3: Фиксированный масштаб */}
        <div>
          <Typography variant="h6" gutterBottom>
            3. С фиксированными границами по Y
          </Typography>
          <MetricsChart
            title="Использование памяти"
            query="process_resident_memory_bytes / 1024 / 1024"
            victoriaMetricsUrl="http://your-victoria-metrics:8428/api/v1/query_range"
            defaultTimeRange="6h"
            height={500}
            yAxisLabel="MB"
          />
        </div>

        <Divider />

        {/* Пример 4: Множественные метрики */}
        <div>
          <Typography variant="h6" gutterBottom>
            4. Несколько метрик на одном графике
          </Typography>
          <MetricsChart
            title="HTTP запросы по методам"
            query="rate(http_requests_total[5m])"
            victoriaMetricsUrl="http://your-victoria-metrics:8428/api/v1/query_range"
            defaultTimeRange="3h"
            yAxisLabel="Запросов/сек"
          />
        </div>

        <Divider />

        {/* Пример 5: Длительный период */}
        <div>
          <Typography variant="h6" gutterBottom>
            5. Анализ за длительный период (7 дней)
          </Typography>
          <MetricsChart
            title="Тренд использования ресурсов"
            query="avg(rate(container_cpu_usage_seconds_total[5m]))"
            victoriaMetricsUrl="http://your-victoria-metrics:8428/api/v1/query_range"
            defaultTimeRange="7d"
            height={600}
            yAxisLabel="CPU Usage"
          />
        </div>

        <Divider />

        {/* Пример 6: Продвинутый запрос для таймеров */}
        <div>
          <Typography variant="h6" gutterBottom>
            6. Анализ таймеров растений (P95, P99)
          </Typography>
          <MetricsChart
            title="Перцентили времени обработки"
            query="histogram_quantile(0.95, rate(plant_timer_duration_seconds_bucket[5m]))"
            victoriaMetricsUrl="http://your-victoria-metrics:8428/api/v1/query_range"
            defaultTimeRange="1h"
            autoRefresh={true}
            refreshInterval="1m"
            yAxisLabel="Секунды (P95)"
          />
        </div>
      </Stack>

      <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
        Примеры запросов для мониторинга таймеров
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        <div>
          <Typography
            variant="body2"
            component="pre"
            sx={{
              bgcolor: "grey.100",
              p: 2,
              borderRadius: 1,
              overflow: "auto",
            }}
          >
            {`// Средняя длительность выполнения таймера
avg(timer_duration_seconds) by (timer_name)

// Максимальная длительность за последние 5 минут
max_over_time(timer_duration_seconds[5m])

// Количество срабатываний таймера в секунду
rate(timer_executions_total[5m])

// P95 процентиль длительности
histogram_quantile(0.95, rate(timer_duration_seconds_bucket[5m]))

// Сравнение разных таймеров
sum(rate(timer_duration_seconds_sum[5m])) by (timer_name) /
sum(rate(timer_duration_seconds_count[5m])) by (timer_name)

// Количество таймаутов
increase(timer_timeout_total[1h])

// Процент успешных выполнений
(timer_success_total / timer_total) * 100`}
          </Typography>
        </div>
      </Stack>
    </Container>
  );
}
