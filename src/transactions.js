/**
 * @fileoverview Модуль для хранения и управления массивом транзакций.
 * Предоставляет функции добавления, удаления, поиска и подсчёта суммы.
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id          - Уникальный идентификатор транзакции.
 * @property {string} date        - Отформатированная дата и время добавления.
 * @property {number} amount      - Сумма транзакции (отрицательная = расход).
 * @property {string} category    - Категория (например, "Еда", "Зарплата").
 * @property {string} description - Полное описание транзакции.
 */

/** @type {Transaction[]} Массив всех транзакций */
var transactions = [];

/**
 * Добавляет новую транзакцию в конец массива.
 *
 * @param {Transaction} transaction - Объект транзакции для добавления.
 * @returns {void}
 *
 * @example
 * addTransaction({ id: "tx_1", date: "06.05.2025 10:00",
 *   amount: 500, category: "Зарплата", description: "Аванс за апрель" });
 */
function addTransaction(transaction) {
  transactions.push(transaction);
}

/**
 * Удаляет транзакцию из массива по её идентификатору.
 * Если транзакция с указанным ID не найдена — массив не изменяется.
 *
 * @param {string} id - Уникальный ID транзакции для удаления.
 * @returns {void}
 *
 * @example
 * removeTransaction("tx_1715000000000_a3f7");
 */
function removeTransaction(id) {
  var idx = transactions.findIndex(function(t) { return t.id === id; });
  if (idx !== -1) transactions.splice(idx, 1);
}

/**
 * Возвращает транзакцию по её идентификатору.
 *
 * @param {string} id - Уникальный ID искомой транзакции.
 * @returns {Transaction|undefined} Найденный объект транзакции или undefined.
 *
 * @example
 * var tx = getTransactionById("tx_1715000000000_a3f7");
 */
function getTransactionById(id) {
  return transactions.find(function(t) { return t.id === id; });
}

/**
 * Подсчитывает и возвращает сумму всех транзакций (общий баланс).
 * Вызывается после каждого добавления или удаления транзакции.
 *
 * @returns {number} Общая сумма транзакций (может быть отрицательной).
 *
 * @example
 * calculateTotal(); // 1700 (если были транзакции +2000 и -300)
 */
function calculateTotal() {
  return transactions.reduce(function(sum, t) { return sum + t.amount; }, 0);
}
