/**
 * @fileoverview Главный модуль приложения «Личные Финансы».
 * Инициализирует обработчики событий и связывает UI с логикой транзакций.
 * Все зависимые модули (utils.js, transactions.js, ui.js) подключены
 * отдельными тегами <script> в index.html до этого файла.
 */

// ── ИНИЦИАЛИЗАЦИЯ ────────────────────────────────────────────

/**
 * Точка входа приложения.
 * Регистрирует обработчик отправки формы и делегированный обработчик
 * кликов на таблице. Вызывается сразу при загрузке скрипта.
 *
 * @returns {void}
 */
function init() {
  var form  = document.getElementById('transaction-form');
  var table = document.getElementById('transactions-table');

  // Шаг 8: обработчик формы
  form.addEventListener('submit', handleFormSubmit);

  // Шаг 5: делегирование событий — один обработчик на всю таблицу
  table.addEventListener('click', handleTableClick);
}

// ── ОБРАБОТЧИКИ ──────────────────────────────────────────────

/**
 * Обрабатывает отправку формы добавления транзакции (Шаг 4, Шаг 8).
 * Валидирует поля, создаёт объект транзакции, сохраняет его в массив,
 * добавляет строку в таблицу и обновляет баланс.
 *
 * @param {SubmitEvent} event - Событие отправки формы.
 * @returns {void}
 */
function handleFormSubmit(event) {
  event.preventDefault();

  var amountInput      = document.getElementById('amount');
  var categoryInput    = document.getElementById('category');
  var descriptionInput = document.getElementById('description');

  var amount      = parseFloat(amountInput.value);
  var category    = categoryInput.value.trim();
  var description = descriptionInput.value.trim();

  // Шаг 8: валидация формы
  if (!validateForm(amount, category, description)) return;

  // Шаг 4: создаём объект транзакции
  var transaction = {
    id:          generateId(),
    date:        formatDate(new Date()),
    amount:      amount,
    category:    category,
    description: description
  };

  // Шаг 4: добавляем в массив и отрисовываем строку
  addTransaction(transaction);
  renderTransactionRow(transaction);

  // Шаг 6: пересчитываем и отображаем общую сумму
  renderTotal(calculateTotal());

  resetForm();
}

/**
 * Обрабатывает клики внутри таблицы (делегирование событий, Шаг 5).
 *
 * - Клик по кнопке «Удалить» → удаляет транзакцию.
 * - Клик по строке → показывает детали транзакции (Шаг 7).
 *
 * @param {MouseEvent} event - Событие клика мышью.
 * @returns {void}
 */
function handleTableClick(event) {
  // Шаг 5: проверяем, была ли нажата кнопка удаления
  var deleteBtn = event.target.closest('.btn-delete');
  var row       = event.target.closest('tr[data-id]');

  if (deleteBtn) {
    event.stopPropagation(); // не запускать обработчик строки
    handleDeleteTransaction(deleteBtn.dataset.id);
    return;
  }

  // Шаг 7: клик по строке — показываем полное описание
  if (row) {
    handleShowDetail(row.dataset.id);
  }
}

// ── ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ──────────────────────────────────

/**
 * Удаляет транзакцию из массива и из DOM, обновляет баланс (Шаг 5, Шаг 6).
 * Если удалённая транзакция была открыта в блоке деталей — скрывает его.
 *
 * @param {string} id - ID транзакции для удаления.
 * @returns {void}
 */
function handleDeleteTransaction(id) {
  removeTransaction(id);
  removeTransactionRow(id);

  // Шаг 6: пересчитать баланс после удаления
  renderTotal(calculateTotal());

  // Скрыть детали, если показывали удалённую транзакцию
  var detailId = document.getElementById('detail-id').textContent;
  if (detailId === id) hideDetail();
}

/**
 * Отображает полную информацию о транзакции в блоке деталей (Шаг 7).
 *
 * @param {string} id - ID транзакции для отображения.
 * @returns {void}
 */
function handleShowDetail(id) {
  var transaction = getTransactionById(id);
  if (transaction) renderDetail(transaction);
}

/**
 * Валидирует данные формы и показывает сообщения об ошибках (Шаг 8).
 *
 * @param {number} amount      - Сумма транзакции (может быть NaN).
 * @param {string} category    - Выбранная категория.
 * @param {string} description - Текст описания.
 * @returns {boolean} true — если все поля корректны, false — при ошибках.
 */
function validateForm(amount, category, description) {
  var valid = true;
  clearErrors();

  if (document.getElementById('amount').value === '' || isNaN(amount) || amount === 0) {
    showError('amount', 'Введите сумму (не равную 0)');
    valid = false;
  }

  if (!category) {
    showError('category', 'Выберите категорию');
    valid = false;
  }

  if (!description) {
    showError('description', 'Введите описание транзакции');
    valid = false;
  }

  return valid;
}

/**
 * Показывает сообщение об ошибке под полем формы и помечает поле красной рамкой.
 *
 * @param {string} fieldId - ID поля ввода (без суффикса "-error").
 * @param {string} message - Текст сообщения об ошибке.
 * @returns {void}
 */
function showError(fieldId, message) {
  document.getElementById(fieldId + '-error').textContent = message;
  document.getElementById(fieldId).classList.add('error');
}

/**
 * Убирает все сообщения об ошибках и красные рамки с полей формы.
 *
 * @returns {void}
 */
function clearErrors() {
  ['amount', 'category', 'description'].forEach(function(id) {
    document.getElementById(id + '-error').textContent = '';
    document.getElementById(id).classList.remove('error');
  });
}

/**
 * Сбрасывает поля формы к начальному состоянию после успешного добавления.
 *
 * @returns {void}
 */
function resetForm() {
  document.getElementById('transaction-form').reset();
  clearErrors();
}

// ── ЗАПУСК ───────────────────────────────────────────────────
init();
