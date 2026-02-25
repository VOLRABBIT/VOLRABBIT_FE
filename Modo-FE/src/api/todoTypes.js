export const TODO_DUE_TYPES = /** @type {const} */ (['TODAY', 'TOMORROW', 'CUSTOM']);
export const TODO_REPEAT_TYPES = /** @type {const} */ (['NONE', 'DAILY', 'WEEKLY', 'MONTHLY']);
export const TODO_SEGMENTATION_TYPES = /** @type {const} */ (['NONE', 'TWO', 'THREE', 'AUTO']);
export const TODO_VERIFICATION_TYPES = /** @type {const} */ (['CHECK', 'PHOTO_PROOF', 'TAG']);

/**
 * @typedef {'TODAY'|'TOMORROW'|'CUSTOM'} TodoDueType
 * @typedef {'NONE'|'DAILY'|'WEEKLY'|'MONTHLY'} TodoRepeatType
 * @typedef {'NONE'|'TWO'|'THREE'|'AUTO'} TodoSegmentationType
 * @typedef {'CHECK'|'PHOTO_PROOF'|'TAG'} TodoVerificationType
 *
 * @typedef {Object} TodoCreateRequest
 * @property {number} categoryId
 * @property {string} content
 * @property {TodoDueType} dueType
 * @property {string} dueDate
 * @property {TodoRepeatType} repeatType
 * @property {TodoSegmentationType} segmentationType
 * @property {TodoVerificationType} verificationType
 * @property {number=} tagId
 *
 * @typedef {Object} TodoCreateResponse
 * @property {number} todoId
 * @property {string | null} repeatGroupId
 * @property {number} createdCount
 *
 * @typedef {Object} ApiErrorResponse
 * @property {string=} status
 * @property {string=} message
 * @property {unknown=} data
 */

/**
 * @param {TodoCreateRequest} payload
 */
export function assertTodoCreateRequest(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Invalid CreateRequest payload');
  if (!Number.isFinite(Number(payload.categoryId))) throw new Error('CreateRequest.categoryId is required');
  if (typeof payload.content !== 'string' || payload.content.length === 0) throw new Error('CreateRequest.content is required');
  if (!TODO_DUE_TYPES.includes(payload.dueType)) throw new Error('CreateRequest.dueType is invalid');
  if (typeof payload.dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(payload.dueDate)) throw new Error('CreateRequest.dueDate is invalid');
  if (!TODO_REPEAT_TYPES.includes(payload.repeatType)) throw new Error('CreateRequest.repeatType is invalid');
  if (!TODO_SEGMENTATION_TYPES.includes(payload.segmentationType)) throw new Error('CreateRequest.segmentationType is invalid');
  if (!TODO_VERIFICATION_TYPES.includes(payload.verificationType)) throw new Error('CreateRequest.verificationType is invalid');
  if (payload.tagId != null && !Number.isFinite(Number(payload.tagId))) throw new Error('CreateRequest.tagId is invalid');
}

/**
 * @param {unknown} data
 * @returns {TodoCreateResponse}
 */
export function normalizeTodoCreateResponse(data) {
  const raw = (data && typeof data === 'object' && 'data' in data && data.data && typeof data.data === 'object')
    ? data.data
    : data;
  const todoId = Number(raw?.todoId);
  const createdCount = Number(raw?.createdCount);
  if (!Number.isFinite(todoId) || !Number.isFinite(createdCount)) {
    throw new Error('Invalid CreateResponse shape');
  }
  return {
    todoId,
    createdCount,
    repeatGroupId: raw?.repeatGroupId ?? null,
  };
}