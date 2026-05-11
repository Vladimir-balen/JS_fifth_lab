/**
 * @fileoverview Модуль для работы с DOM.
 * Отвечает за отрисовку строк таблицы, отображение деталей транзакции,
 * обновление общей суммы и управление пустым состоянием таблицы.
 */

/**
 * Добавляет новую строку транзакции в тело таблицы.
 *
 * Цвет строки определяется знаком суммы:
 *   - положительная (доход) → зелёный фон (CSS-класс "income"),
 *   - отрицательная (расход) → красный фон (CSS-класс "expense").
 *
 * В колонке "Краткое описание" отображаются только первые 4 слова
 * полного описания транзакции (см. shortDescription в utils.js).
 *
 * @param {Transaction} transaction - Объект транзакции.
 * @returns {void}
 */
function renderTransactionRow(transaction) {
  var tbody = document.getElementById('table-body');

  // Убрать строку-заглушку "нет транзакций", если она есть
  removeEmptyRow();

  // Шаг 4: создаём строку через createElement и добавляем в DOM
  var tr = document.createElement('tr');
  tr.dataset.id = transaction.id;

  // Шаг 4: зелёный цвет для дохода, красный для расхода
  tr.classList.add(transaction.amount >= 0 ? 'income' : 'expense');

  // Шаг 3: колонка — Дата и Время
  var tdDate = document.createElement('td');
  tdDate.textContent = transaction.date;

  // Шаг 3: колонка — Категория
  var tdCategory = document.createElement('td');
  tdCategory.textContent = transaction.category;

  // Шаг 3 + Шаг 4: колонка — Краткое описание (первые 4 слова)
  var tdDesc = document.createElement('td');
  tdDesc.textContent = shortDescription(transaction.description);

  // Шаг 3 + Шаг 5: колонка — Действие (кнопка удаления)
  var tdAction = document.createElement('td');
  var btnDelete = document.createElement('button');
  btnDelete.className = 'btn-delete';
  btnDelete.dataset.id = transaction.id;
  btnDelete.textContent = 'Удалить';
  tdAction.appendChild(btnDelete);

  tr.appendChild(tdDate);
  tr.appendChild(tdCategory);
  tr.appendChild(tdDesc);
  tr.appendChild(tdAction);

  tbody.appendChild(tr);
}

/**
 * Удаляет строку из таблицы по ID транзакции.
 * Если после удаления строк не осталось — показывает строку-заглушку.
 *
 * @param {string} id - ID транзакции, строку которой нужно удалить.
 * @returns {void}
 */
function removeTransactionRow(id) {
  var tbody = document.getElementById('table-body');
  var row = tbody.querySelector('tr[data-id="' + id + '"]');
  if (row) row.remove();

  // Если реальных строк не осталось — показать заглушку
  if (tbody.querySelectorAll('tr:not(.empty-row)').length === 0) {
    showEmptyRow();
  }
}

/**
 * Обновляет отображение общей суммы транзакций на странице (Шаг 6).
 * Если сумма отрицательная — добавляет CSS-класс "negative" (красный цвет).
 *
 * @param {number} total - Итоговый баланс всех транзакций.
 * @returns {void}
 *
 * @example
 * renderTotal(1500);  // "+1500.00 ₴"
 * renderTotal(-200);  // "-200.00 ₴" красным
 */
function renderTotal(total) {
  var el = document.getElementById('total-balance');
  var sign = total >= 0 ? '+' : '';
  el.textContent = sign + total.toFixed(2) + ' \u20B4';
  if (total < 0) {
    el.classList.add('negative');
  } else {
    el.classList.remove('negative');
  }
}

/**
 * Отображает полную информацию о транзакции в блоке деталей (Шаг 7).
 * Показывает скрытую секцию и заполняет все поля данными транзакции.
 * Подсвечивает выбранную строку в таблице CSS-классом "selected".
 *
 * @param {Transaction} transaction - Объект транзакции для отображения.
 * @returns {void}
 */
function renderDetail(transaction) {
  var section = document.getElementById('detail-section');
  section.style.display = 'block';

  document.getElementById('detail-id').textContent       = transaction.id;
  document.getElementById('detail-date').textContent     = transaction.date;
  document.getElementById('detail-category').textContent = transaction.category;
  document.getElementById('detail-amount').textContent   =
    (transaction.amount >= 0 ? '+' : '') + transaction.amount.toFixed(2) + ' \u20B4';

  // Шаг 7: полное описание (не сокращённое)
  document.getElementById('detail-description').textContent = transaction.description;

  // Снять выделение со всех строк, выделить нужную
  document.querySelectorAll('#table-body tr').forEach(function(r) {
    r.classList.remove('selected');
  });
  var activeRow = document.querySelector('#table-body tr[data-id="' + transaction.id + '"]');
  if (activeRow) activeRow.classList.add('selected');
}

/**
 * Скрывает блок с деталями транзакции и снимает выделение со строк.
 *
 * @returns {void}
 */
function hideDetail() {
  document.getElementById('detail-section').style.display = 'none';
  document.querySelectorAll('#table-body tr').forEach(function(r) {
    r.classList.remove('selected');
  });
}

// ── ПРИВАТНЫЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ───────────────────────

/**
 * Убирает строку-заглушку "Транзакций пока нет" из тела таблицы.
 * Вызывается перед добавлением первой реальной строки.
 *
 * @private
 * @returns {void}
 */
function removeEmptyRow() {
  var empty = document.querySelector('#table-body .empty-row');
  if (empty) empty.remove();
}

/**
 * Добавляет строку-заглушку в пустое тело таблицы.
 * colspan равен 4 (по числу колонок таблицы).
 *
 * @private
 * @returns {void}
 */
function showEmptyRow() {
  var tbody = document.getElementById('table-body');
  var tr = document.createElement('tr');
  tr.className = 'empty-row';
  var td = document.createElement('td');
  td.colSpan = 4;
  td.textContent = 'Транзакций пока нет. Добавьте первую!';
  tr.appendChild(td);
  tbody.appendChild(tr);
}
