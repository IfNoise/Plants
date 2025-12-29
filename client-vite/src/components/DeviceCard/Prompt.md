# Инструкция для Copilot-агента: React-компонент расчёта таблицы поливов

ЦЕЛЬ  
Создать React-компонент и чистую детерминированную функцию расчёта,
которая формирует суточное расписание поливов
для тупого таймера управления клапаном (ON / OFF).

Результат должен содержать ТОЛЬКО реальные поливные события.  
Никаких виртуальных фаз, сенсоров и предположений.

================================================================

ФОРМАТ ВЫХОДНЫХ ДАННЫХ (СТРОГО)

IrrigationEvent:
- start: number — секунды с полуночи (0–86400)
- stop: number  — секунды с полуночи (0–86400)

Возвращаемое значение:
IrrigationEvent[]

В массиве должны присутствовать только моменты,
когда клапан реально открыт.

================================================================

СИСТЕМНЫЕ ОГРАНИЧЕНИЯ

- Таймер тупой: только ON / OFF
- Никаких сенсоров (нет VWC, EC, измерения дренажа)
- Все расчёты строго детерминированы
- Никакого асинхронного кода
- Никаких side-effect

================================================================

КОНЦЕПТУАЛЬНАЯ МОДЕЛЬ

- Субстрат моделируется как резервуар воды
- Проценты используются для агрономической логики
  (просушка, пики, дренаж)
- Литры используются для точных вычислений
- Все проценты считаются от substrateWaterCapacityLiters
- Фазы отличаются ТОЛЬКО параметрами полива
- Поливное событие существует только если клапан реально открыт

================================================================

ОБЯЗАТЕЛЬНЫЕ ВХОДНЫЕ ДАННЫЕ (ФОРМА)

Время:
- lightsOnTimeSeconds
- lightsOffTimeSeconds

Горшок и оборудование:
- substrateWaterCapacityLiters
- dripperFlowRateLph
- emittersPerPot

Потери воды:
- waterLossRateLitersPerHour
- evaporationCoefficient (по умолчанию = 1)

Стратегия (проценты):
- initialDrybackPercent
- targetPeakPercent
- maintenanceMinPercent
- maintenanceMaxPercent

Параметры фаз:

Фаза P1 (насыщение, маленькие шоты):
- p1StartDelayMinutes
- p1ShotVolumePercent
- p1ShotIntervalMinutes

Фаза P2 (дневная, длинные поливы):
- p2IntervalMinutes
- p2ShotVolumePercent

================================================================

ПРОИЗВОДНЫЕ ВЕЛИЧИНЫ (ОБЯЗАТЕЛЬНО СЧИТАТЬ)

flowRatePerPotLph =
  dripperFlowRateLph * emittersPerPot

flowRatePerPotLps =
  flowRatePerPotLph / 3600

effectiveWaterLossLph =
  waterLossRateLitersPerHour * evaporationCoefficient

================================================================

НАЧАЛЬНОЕ СОСТОЯНИЕ

В 00:00:

currentWaterLiters =
  substrateWaterCapacityLiters *
  (1 - initialDrybackPercent / 100)

================================================================

НОЧНАЯ ФАЗА (БЕЗ ПОЛИВА)

С 00:00 до lightsOnTimeSeconds:

currentWaterLiters -=
  effectiveWaterLossLph / 3600 * secondsElapsed

Ограничить currentWaterLiters не ниже 0.

================================================================

ФАЗА P1 — НАСЫЩЕНИЕ (МАЛЕНЬКИЕ ШОТЫ)

Старт:
p1StartTime =
  lightsOnTimeSeconds + p1StartDelayMinutes * 60

Цель:
targetPeakLiters =
  substrateWaterCapacityLiters * (targetPeakPercent / 100)

Объём одного P1-шота:
p1ShotVolumeLiters =
  substrateWaterCapacityLiters *
  (p1ShotVolumePercent / 100)

Длительность P1-шота:
p1ShotDurationSeconds =
  p1ShotVolumeLiters / flowRatePerPotLps

Цикл:
- Пока currentWaterLiters < targetPeakLiters
- Создать поливное событие:
  - start = currentTime
  - stop = start + p1ShotDurationSeconds
- currentWaterLiters += p1ShotVolumeLiters
- currentTime += p1ShotIntervalMinutes * 60

================================================================

ФАЗА P2 — ДНЕВНОЕ ПОДДЕРЖАНИЕ (ДЛИННЫЕ ПОЛИВЫ)

Объём одного P2-шота:
p2ShotVolumeLiters =
  substrateWaterCapacityLiters *
  (p2ShotVolumePercent / 100)

Длительность P2-шота:
p2ShotDurationSeconds =
  p2ShotVolumeLiters / flowRatePerPotLps

Пока currentTime < lightsOffTimeSeconds:

1. Увеличить время на p2IntervalMinutes * 60
2. Вычесть потери воды за прошедшее время
3. Если currentWaterLiters <
   substrateWaterCapacityLiters * (maintenanceMinPercent / 100):
   - Создать ОДНО поливное событие (длинный шот)
4. После полива:
   - currentWaterLiters += p2ShotVolumeLiters
   - Если currentWaterLiters >
     substrateWaterCapacityLiters * (maintenanceMaxPercent / 100),
     ограничить до maintenanceMaxPercent

================================================================

ПРАВИЛА ПОЛИВНОГО СОБЫТИЯ

- start = текущее время
- stop = start + длительность шота
- События не должны пересекаться
- События должны быть отсортированы
- События должны быть в диапазоне 0–86400 секунд
- После lightsOffTimeSeconds полив запрещён

================================================================

ОТВЕТСТВЕННОСТЬ REACT-КОМПОНЕНТА

- Отрисовать форму для всех входных параметров
- Вызвать чистую функцию расчёта
- Передать IrrigationEvent[] в уже существующую визуализацию

Вся логика расчёта ОБЯЗАНА быть вынесена
в отдельную чистую функцию.

================================================================

СТРОГО ЗАПРЕЩЕНО

- Любая логика сенсоров
- Любые климатические предположения
- Адаптивное или обратносвязное поведение
- Рандомизация
- Любые неописанные параметры

Если параметр не передан явно,
он НЕ ДОЛЖЕН быть выдуман.

================================================================

ОЖИДАЕМЫЙ РЕЗУЛЬТАТ

Детерминированное суточное расписание поливов,
учитывающее разные типы полива
в фазе насыщения и в дневной фазе,
пригодное для управления тупым аппаратным таймером.
