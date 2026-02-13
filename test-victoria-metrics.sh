#!/bin/bash

# Скрипт для быстрого тестирования Victoria Metrics интеграции

# Настройки
VICTORIA_METRICS_HOST="${VICTORIA_METRICS_HOST:-ddweed.org}"
VICTORIA_METRICS_PORT="${VICTORIA_METRICS_PORT:-8428}"
BACKEND_HOST="${BACKEND_HOST:-localhost}"
BACKEND_PORT="${BACKEND_PORT:-5000}"

VICTORIA_URL="http://${VICTORIA_METRICS_HOST}:${VICTORIA_METRICS_PORT}"
BACKEND_URL="http://${BACKEND_HOST}:${BACKEND_PORT}"

echo "🔍 Тестирование Victoria Metrics интеграции..."
echo "   Victoria Metrics: $VICTORIA_URL"
echo "   Backend: $BACKEND_URL"
echo ""

# 1. Проверка доступности Victoria Metrics напрямую
echo "1️⃣ Проверка Victoria Metrics (прямое подключение)..."
if curl -s -o /dev/null -w "%{http_code}" ${VICTORIA_URL}/health | grep -q "200"; then
    echo "✅ Victoria Metrics доступен"
else
    echo "❌ Victoria Metrics недоступен на ${VICTORIA_URL}"
    echo "   Проверьте доступность хоста ${VICTORIA_METRICS_HOST}"
fi
echo ""

# 2. Проверка прокси через backend
echo "2️⃣ Проверка прокси через backend..."
if curl -s ${BACKEND_URL}/api/v1/health | jq -e '.status == "ok"' > /dev/null 2>&1; then
    echo "✅ Прокси работает"
    curl -s ${BACKEND_URL}/api/v1/health | jq '.'
else
    echo "❌ Прокси недоступен"
    echo "   Убедитесь что backend запущен: npm run server"
fi
echo ""

# 3. Тестовый запрос метрик
echo "3️⃣ Отправка тестовых метрик..."
CURRENT_TIME=$(date +%s)
cat << EOF | curl -s -X POST "${VICTORIA_URL}/api/v1/import/prometheus" --data-binary @-
# HELP esp32_A8A154_value Irrigator valve state
# TYPE esp32_A8A154_value gauge
esp32_A8A154_value{topic="esp32_A8A154/state/outputs/Valve[1]",tag="outputs"} 0 $((CURRENT_TIME * 1000))
esp32_A8A154_value{topic="esp32_A8A154/state/outputs/Valve[2]",tag="outputs"} 1 $((CURRENT_TIME * 1000))
esp32_A8A154_value{topic="esp32_A8A154/state/outputs/Valve[3]",tag="outputs"} 0 $((CURRENT_TIME * 1000))
EOF

if [ $? -eq 0 ]; then
    echo "✅ Тестовые метрики отправлены (timestamp: $CURRENT_TIME)"
    sleep 1  # Даём время на индексацию
else
    echo "❌ Не удалось отправить метрики"
fi
echo ""

# 4. Проверка всех метрик через instant query
echo "4️⃣ Проверка метрик через instant query..."
SIMPLE_QUERY='esp32_A8A154_value'
RESPONSE=$(curl -s "${BACKEND_URL}/api/v1/query?query=${SIMPLE_QUERY}")

if echo "$RESPONSE" | jq -e '.status == "success"' > /dev/null 2>&1; then
    RESULT_COUNT=$(echo "$RESPONSE" | jq '.data.result | length')
    echo "✅ Найдено метрик: $RESULT_COUNT"
    if [ "$RESULT_COUNT" -gt 0 ]; then
        echo "$RESPONSE" | jq '.data.result[]'
    fi
else
    echo "❌ Ошибка запроса метрик"
    echo "$RESPONSE" | jq '.'
fi
echo ""

# 4b. Проверка получения метрик через прокси (range query)
echo "4b️⃣ Получение метрик через прокси (range query)..."
START=$(date -d '1 hlabel names в Victoria Metrics..."
LABELS=$(curl -s ${VICTORIA_URL}/api/v1/labels)
echo "$LABELS" | jq '.data[]' 2>/dev/null | head -20

echo ""
echo "5b️⃣ Доступные metric names..."
METRICS=$(curl -s "${VICTORIA_URL}/api/v1/label/__name__/values")
echo "$METRICS" | jq '.data[]' 2>/dev/null | grep -i "esp32\|valve" || echo "Нет метрик esp32/valve"
echo ""

echo "5c️⃣ Все метрики (первые 10)..."
curl -s "${VICTORIA_URL}/api/v1/label/__name__/values" | jq '.data[:10]'
QUERY='esp32_A8A154_value{topic=~".*Valve.*"}'

echo "   Запрос: $QUERY"
echo "   Период: $(date -d @$START '+%Y-%m-%d %H:%M:%S' 2>/dev/null || date -r $START '+%Y-%m-%d %H:%M:%S') - $(date -d @$END '+%Y-%m-%d %H:%M:%S' 2>/dev/null || date -r $END '+%Y-%m-%d %H:%M:%S')"

RESPONSE=$(curl -s "${BACKEND_URL}/api/v1/query_range?query=${QUERY}&start=${START}&end=${END}&step=30s")

if echo "$RESPONSE" | jq -e '.status == "success"' > /dev/null 2>&1; then
    RESULT_COUNT=$(echo "$RESPONSE" | jq '.data.result | length')
    echo "✅ Получено серий данных: $RESULT_COUNT"
    if [ "$RESULT_COUNT" -gt 0 ]; then
        echo "$RESPONSE" | jq '.data.result[0] | {metric, values: .values[:3]}' 2>/dev/null
    fi
else
    echo "❌ Не удалось получить метрики"
    echo "Ответ:"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
fi
echo ""

# 5. Список доступных метрик
echo "5️⃣ Доступные метрики в Victoria Metrics..."
curl -s ${VICTORIA_URL}/api/v1/labels | jq '.data[]' | grep "esp32" || echo "Нет метрик esp32"
echo ""

echo "✅ Тестирование завершено!"
echo ""
echo "📊 Откройте frontend и нажмите на кнопку с графиком на карточке ирригатора"
echo "   URL: http://localhost:5173"

