type PlainObject<T = any> = {
  [k in string]: T;
};

/**
 * Проверяет, является ли значение простым объектом.
 * @param {*} value - Значение для проверки.
 * @return {boolean} true, если значение является простым объектом, иначе false.
 */
function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Проверяет, является ли значение массивом.
 * @param {*} value - Значение для проверки.
 * @return {boolean} true, если значение является массивом, иначе false.
 */
function isArray(value: unknown): value is [] {
  return Array.isArray(value);
}

/**
 * Проверяет, является ли значение массивом или простым объектом.
 * @param {*} value - Значение для проверки.
 * @return {boolean} true, если значение является массивом или простым объектом, иначе false.
 */
function isArrayOrObject(value: unknown): value is [] | PlainObject {
  return isPlainObject(value) || isArray(value);
}

/**
 * Сравнивает два простых объекта на равенство.
 * @param {PlainObject} lhs - Первый объект для сравнения.
 * @param {PlainObject} rhs - Второй объект для сравнения.
 * @return {boolean} true, если объекты равны, иначе false.
 */
function isEqual(lhs: PlainObject, rhs: PlainObject) {
  if (Object.keys(lhs).length !== Object.keys(rhs).length) {
    return false;
  }

  for (const [key, value] of Object.entries(lhs)) {
    const rightValue = rhs[key];
    if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
      if (isEqual(value, rightValue)) {
        continue;
      }
      return false;
    }

    if (value !== rightValue) {
      return false;
    }
  }

  return true;
}

export default isEqual;
