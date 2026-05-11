/**
 * @fileoverview Вспомогательные утилиты для приложения учёта финансов.
 * Содержит функции генерации ID, форматирования дат и сокращения текста.
 */

/**
 * Генерирует уникальный строковый идентификатор на основе текущего времени
 * и случайного числа.
 *
 * @returns {string} Уникальный ID вида "tx_<timestamp>_<random>".
 *
 * @example
 * const id = generateId();
 * // "tx_1715000000000_a3f7"
 */
function generateId() {
  return 'tx_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
}

/**
 * Форматирует объект Date в читаемую строку формата ДД.ММ.ГГГГ ЧЧ:ММ.
 *
 * @param {Date} date - Объект даты для форматирования.
 * @returns {string} Строка с датой и временем, например: "06.05.2025 14:32".
 *
 * @example
 * formatDate(new Date());
 * // "06.05.2025 14:32"
 */
function formatDate(date) {
  var pad = function(n) { return String(n).padStart(2, '0'); };
  var d   = pad(date.getDate());
  var m   = pad(date.getMonth() + 1);
  var y   = date.getFullYear();
  var h   = pad(date.getHours());
  var min = pad(date.getMinutes());
  return d + '.' + m + '.' + y + ' ' + h + ':' + min;
}

/**
 * Возвращает первые N слов из переданной строки.
 * Если слов меньше N — возвращает всю строку без изменений.
 *
 * @param {string} text  - Исходная строка.
 * @param {number} [n=4] - Максимальное количество возвращаемых слов.
 * @returns {string} Строка из первых N слов (с «…», если текст был обрезан).
 *
 * @example
 * shortDescription("Купил продукты в магазине сегодня утром");
 * // "Купил продукты в магазине…"
 */
function shortDescription(text, n) {
  if (n === undefined) n = 4;
  var words = text.trim().split(/\s+/);
  if (words.length <= n) return text;
  return words.slice(0, n).join(' ') + '…';
}
