/**
 * Чистая функция расчёта суточного расписания поливов
 * @param {Object} params - Параметры расчёта
 * @returns {Array<{start: number, stop: number}>} - Массив событий полива (секунды с полуночи)
 */
export const calculateIrrigationSchedule = (params) => {
  const {
    // Время
    lightsOnTimeSeconds,
    lightsOffTimeSeconds,
    // ...existing code...
    substrateWaterCapacityLiters,
    dripperFlowRateLph,
    emittersPerPot,
    waterLossRateLitersPerHour,
    evaporationCoefficient = 1,
    initialDrybackPercent,
    targetPeakPercent,
    maintenanceMinPercent,
    p1StartDelayMinutes,
    p1ShotVolumePercent,
    p1ShotIntervalMinutes,
    p2TargetDrainagePercent,
    p3DrybackMinutes = 60,
  } = params;

  // Производные величины
  const flowRatePerPotLph = dripperFlowRateLph * emittersPerPot;
  const flowRatePerPotLps = flowRatePerPotLph / 3600;
  const effectiveWaterLossLph = waterLossRateLitersPerHour * evaporationCoefficient;
  const effectiveWaterLossLps = effectiveWaterLossLph / 3600;

  // Вспомогательные функции для диапазонов светового дня
  const SECONDS_IN_DAY = 86400;
  // true если t попадает в световой день
  function isInLight(t) {
    if (lightsOnTimeSeconds < lightsOffTimeSeconds) {
      return t >= lightsOnTimeSeconds && t < lightsOffTimeSeconds;
    } else {
      // ночной режим: свет с вечера до утра
      return t >= lightsOnTimeSeconds || t < lightsOffTimeSeconds;
    }
  }
  // Получить массив диапазонов светового дня
  function getLightRanges() {
    if (lightsOnTimeSeconds < lightsOffTimeSeconds) {
      return [[lightsOnTimeSeconds, lightsOffTimeSeconds]];
    } else {
      return [
        [lightsOnTimeSeconds, SECONDS_IN_DAY],
        [0, lightsOffTimeSeconds],
      ];
    }
  }

  // Начальное состояние в 00:00
  let currentWaterLiters = substrateWaterCapacityLiters * (1 - initialDrybackPercent / 100);
  let currentTime = 0;
  const events = [];

  // ===================== НОЧНАЯ ФАЗА =====================
  // Считаем потери до первого включения света
  if (lightsOnTimeSeconds >= lightsOffTimeSeconds) {
    // если свет включается сразу после полуночи, потерь нет
    if (lightsOnTimeSeconds !== 0) {
      currentWaterLiters -= effectiveWaterLossLps * lightsOnTimeSeconds;
      currentWaterLiters = Math.max(0, currentWaterLiters);
    }
    currentTime = 0;
  } else {
    // обычный режим
    currentWaterLiters -= effectiveWaterLossLps * lightsOnTimeSeconds;
    currentWaterLiters = Math.max(0, currentWaterLiters);
    currentTime = lightsOnTimeSeconds;
  }

  // ===================== ФАЗЫ В СВЕТОВОЙ ДЕНЬ =====================

  // --- Новый алгоритм: единый диапазон для ночного режима ---
  let lightStart, lightEnd;
  let virtualDay = false;
  if (lightsOnTimeSeconds < lightsOffTimeSeconds) {
    // обычный режим
    lightStart = lightsOnTimeSeconds;
    lightEnd = lightsOffTimeSeconds;
  } else {
    // ночной режим: свет с вечера до утра (через полночь)
    lightStart = lightsOnTimeSeconds;
    lightEnd = lightsOffTimeSeconds + SECONDS_IN_DAY;
    virtualDay = true;
  }

  // Начинаем с lightStart
  currentTime = Math.max(currentTime, lightStart);
  const targetPeakLiters = substrateWaterCapacityLiters * (targetPeakPercent / 100);
  const p1ShotVolumeLiters = substrateWaterCapacityLiters * (p1ShotVolumePercent / 100);
  const p1ShotDurationSeconds = p1ShotVolumeLiters / flowRatePerPotLps;
  const maintenanceMinLiters = substrateWaterCapacityLiters * (maintenanceMinPercent / 100);
  let drybackZoneStart = lightEnd - p3DrybackMinutes * 60;

  // P1: насыщение
  let p1StartTime = lightStart + p1StartDelayMinutes * 60;
  currentTime = Math.max(currentTime, p1StartTime);
  while (currentTime < lightEnd) {
    if (currentWaterLiters >= targetPeakLiters) break;
    const eventStart = currentTime;
    const eventStop = eventStart + p1ShotDurationSeconds;
    if (eventStop > lightEnd) break;
    if (eventStop > drybackZoneStart) break;
    events.push({ start: Math.round(eventStart), stop: Math.round(eventStop) });
    currentWaterLiters += p1ShotVolumeLiters;
    currentTime = eventStop;
    if (currentWaterLiters >= targetPeakLiters) break;
    currentTime += p1ShotIntervalMinutes * 60;
  }

  // P2: поддержание
  while (currentTime < lightEnd) {
    const waterAboveMin = currentWaterLiters - maintenanceMinLiters;
    let nextIrrigationStop = null;
    if (waterAboveMin <= 0) {
      const deficit = substrateWaterCapacityLiters - currentWaterLiters;
      const p2ShotVolumeLiters = deficit / (1 - p2TargetDrainagePercent / 100);
      const p2ShotDurationSeconds = p2ShotVolumeLiters / flowRatePerPotLps;
      nextIrrigationStop = currentTime + p2ShotDurationSeconds;
      if (nextIrrigationStop > drybackZoneStart) break;
      if (nextIrrigationStop > lightEnd) break;
      events.push({ start: Math.round(currentTime), stop: Math.round(nextIrrigationStop) });
      const waterRetained = p2ShotVolumeLiters * (1 - p2TargetDrainagePercent / 100);
      currentWaterLiters += waterRetained;
      if (currentWaterLiters > substrateWaterCapacityLiters) currentWaterLiters = substrateWaterCapacityLiters;
      currentTime = nextIrrigationStop;
    } else {
      const timeToMinSeconds = waterAboveMin / effectiveWaterLossLps;
      let nextIrrigationTime = currentTime + timeToMinSeconds;
      if (nextIrrigationTime > drybackZoneStart) break;
      if (nextIrrigationTime > lightEnd) break;
      currentWaterLiters -= effectiveWaterLossLps * timeToMinSeconds;
      currentWaterLiters = Math.max(maintenanceMinLiters, currentWaterLiters);
      currentTime = nextIrrigationTime;
    }
  }

  // --- Конец светового дня: потери до следующего дня ---
  if (lightEnd < SECONDS_IN_DAY) {
    // обычный режим
    const darkDuration = SECONDS_IN_DAY - lightEnd;
    currentWaterLiters -= effectiveWaterLossLps * darkDuration;
    currentWaterLiters = Math.max(0, currentWaterLiters);
  } else if (virtualDay) {
    // ночной режим: остаток до следующего вечера
    const darkDuration = lightsOnTimeSeconds;
    currentWaterLiters -= effectiveWaterLossLps * darkDuration;
    currentWaterLiters = Math.max(0, currentWaterLiters);
  }

  // Корректная фильтрация событий для ночного режима
  let filteredEvents;
  if (!virtualDay) {
    // обычный режим: просто события в пределах суток
    filteredEvents = events
      .filter(e => e.start < SECONDS_IN_DAY)
      .map(e => ({
        start: e.start % SECONDS_IN_DAY,
        stop: Math.min(e.stop, SECONDS_IN_DAY) % SECONDS_IN_DAY
      }));
  } else {
    // ночной режим: включаем события, которые попадают в световой день (через полночь)
    filteredEvents = events
      .map(e => ({
        start: e.start % SECONDS_IN_DAY,
        stop: e.stop % SECONDS_IN_DAY
      }))
      .filter(e =>
        (e.start >= lightsOnTimeSeconds || e.start < lightsOffTimeSeconds)
      );
  }

  filteredEvents.sort((a, b) => a.start - b.start);
  return filteredEvents;

};


/**
 * Параметры по умолчанию для расчёта
 */
export const defaultIrrigationParams = {
  // Время (8:00 - 20:00)
  lightsOnTimeSeconds: 8 * 3600,
  lightsOffTimeSeconds: 20 * 3600,
  
  // Горшок и оборудование
  substrateWaterCapacityLiters: 2.5,
  dripperFlowRateLph: 2.0,
  emittersPerPot: 2,
  
  // Потери воды
  waterLossRateLitersPerHour: 0.15,
  evaporationCoefficient: 1.0,
  
  // Стратегия (проценты)
  initialDrybackPercent: 30,
  targetPeakPercent: 80,      // P1 поднимает до максимума диапазона P2
  maintenanceMinPercent: 70,  // P2 поддерживает 70-80% (узкий диапазон = короткие поливы)
  maintenanceMaxPercent: 80,
  
  // Фаза P1 (насыщение) - короткие частые шоты
  p1StartDelayMinutes: 30,
  p1ShotVolumePercent: 5,  // Маленькие шоты 5% от ёмкости
  p1ShotIntervalMinutes: 30, // Каждые 30 минут
  
  // Фаза P2 (дневная) - длинные редкие поливы (интервал рассчитывается автоматически)
    p2TargetDrainagePercent: 15, // 15% дренаж

    // Фаза P3 (конечный dryback)
    p3DrybackMinutes: 60, // 60 минут до выключения света — сухой период
};
