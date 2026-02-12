/**
 * Общие переиспользуемые стили для приложения
 */

/**
 * Стиль тонкого контейнера с минимальным фоном и границей
 * Используйте в sx как: sx={(theme) => subtleContainer(theme)}
 * Или добавьте дополнительные стили: sx={(theme) => ({ ...subtleContainer(theme), p: 2 })}
 */
export const subtleContainer = (theme) => ({
  border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.06)"}`,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.02)"
      : "rgba(15,23,42,0.01)",
  borderRadius: theme.spacing(1.5),
});

/**
 * Возвращает стиль тонкого контейнера с возможностью объединения с другими стилями
 * @param {object} additionalStyles - дополнительные стили для объединения
 */
export const getSubtleContainer = (theme, additionalStyles = {}) => ({
  ...subtleContainer(theme),
  ...additionalStyles,
});
