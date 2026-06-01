import api from './api';
import {
  assertTodoCreateRequest,
  normalizeTodoCreateResponse,
} from './todoTypes';
import { filterOutGuildQuests, filterOutGuildQuestGroups } from "../utils/taskSource";

function buildSegmentationSubtasks(item, mappedSubtasks) {
  if (Array.isArray(mappedSubtasks) && mappedSubtasks.length > 0) {
    return mappedSubtasks;
  }

  return [];
}

function normalizeVerificationType(value) {
  if (typeof value !== 'string') return 'PHOTO_PROOF';
  const code = value.toUpperCase();
  if (code === 'CHECK' || code === 'PHOTO_PROOF' || code === 'TAG') return code;
  return 'PHOTO_PROOF';
}

function normalizeTodoStatus(value) {
  if (typeof value !== 'string') return '';
  return value.toUpperCase();
}

function toCompleted(item) {
  if (typeof item?.isCompleted === 'boolean') return item.isCompleted;
  if (typeof item?.completed === 'boolean') return item.completed;
  const status = normalizeTodoStatus(item?.todoStatus ?? item?.todo_status ?? item?.status);
  return status === 'SUCCESS' || status === 'COMPLETE' || status === 'DONE';
}

function normalizeSegmentationType(value) {
  if (typeof value !== 'string') return 'NONE';
  const code = value.toUpperCase();
  return SEGMENTATION_CODES.includes(code) ? code : 'NONE';
}

function normalizeStep(step) {
  return {
    id: step?.stepId ?? step?.id,
    title: step?.content ?? step?.title ?? '',
    isCompleted: Boolean(step?.completed ?? step?.isCompleted),
    stepOrder: step?.stepOrder ?? step?.order ?? 0,
    sourceType: 'step',
  };
}

function getMappedSteps(item) {
  if (Array.isArray(item?.steps)) {
    return item.steps.map(normalizeStep).sort((a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0));
  }
  if (Array.isArray(item?.subtasks)) {
    return item.subtasks.map((subtask) => ({
      id: subtask.id,
      title: subtask.title ?? subtask.content ?? '',
      isCompleted: toCompleted(subtask),
      sourceType: subtask.sourceType ?? 'subtask',
    }));
  }
  return [];
}

export function transformApiResponseToUi(apiList) {
  if (!Array.isArray(apiList) || apiList.length === 0) {
    return [];
  }

  let normalizedList = [...apiList];
  const first = normalizedList[0];
  if (first.tasks && Array.isArray(first.tasks)) {
    normalizedList = filterOutGuildQuestGroups(normalizedList);
    return normalizedList.map((group) => ({
      id: group.id ?? `cat-${group.category}`,
      category: group.category ?? '',
      tasks: (group.tasks || []).map((t, i) => ({
        id: t.id ?? t.todoId ?? `task-${i}`,
        title: t.title ?? t.taskTitle ?? t.content ?? '',
        isCompleted: toCompleted(t),
        subtasks: buildSegmentationSubtasks(t, getMappedSteps(t)),
        startTime: t.startTime ?? null,
        duration: t.duration ?? null,
        segmentationType: normalizeSegmentationType(
          t.segmentationType ?? t.segmentation_type
        ),
        verificationType: normalizeVerificationType(
          t.verificationType ?? t.verification_type
        ),
      })),
    }));
  }

  normalizedList = filterOutGuildQuests(normalizedList);
  const byCategory = {};
  normalizedList.forEach((item, index) => {
    const cat = item.category ?? item.categoryName ?? '기타';
    if (!byCategory[cat]) {
      byCategory[cat] = { id: item.categoryId ?? `cat-${cat}`, category: cat, tasks: [] };
    }
    byCategory[cat].tasks.push({
      id: item.id ?? item.todoId ?? `item-${index}`,
      title: item.title ?? item.taskTitle ?? item.content ?? '',
      isCompleted: toCompleted(item),
      subtasks: buildSegmentationSubtasks(item, getMappedSteps(item)),
      startTime: item.startTime ?? null,
      duration: item.duration ?? null,
      segmentationType: normalizeSegmentationType(
        item.segmentationType ?? item.segmentation_type
      ),
      verificationType: normalizeVerificationType(
        item.verificationType ?? item.verification_type
      ),
    });
  });
  return Object.values(byCategory);
}

/**
 * 응답 객체에서 투두 배열 추출
 */
function extractTodoList(data) {
  if (!data || typeof data !== 'object') return [];
  if (Array.isArray(data)) return data;
  const raw =
    data.content ?? data.items ?? data.todos ?? data.data ?? data.result ?? data.list ?? [];
  if (Array.isArray(raw)) return raw;
  // Spring Page 등: { content: { content: [...] } }
  if (raw && typeof raw === 'object' && Array.isArray(raw.content)) return raw.content;
  return [];
}

/** API 항목에서 YYYY-MM-DD 추출 */
function getItemDateYmd(item) {
  if (!item || typeof item !== 'object') return null;
  const raw =
    item.date ?? item.scheduledDate ?? item.targetDate ?? item.todoDate ?? item.dueDate ?? item.scheduleDate
    ?? item.plannedDate ?? item.scheduledAt ?? item.dueDateStr;
  return parseYmd(raw);
}


function parseYmd(raw) {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
  }
  if (raw instanceof Date) {
    const y = raw.getFullYear();
    const m = String(raw.getMonth() + 1).padStart(2, '0');
    const d = String(raw.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (typeof raw === 'number') {
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  return null;
}

function toDate(ymd) {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const d = new Date(`${ymd}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getRepeatType(item) {
  const raw = item?.repeatType ?? item?.repeat_cycle ?? item?.repeat;
  return typeof raw === 'string' ? raw.toUpperCase() : 'NONE';
}

function getDueDateYmd(item) {
  return parseYmd(item?.dueDate ?? item?.dueDateStr ?? item?.endDate ?? item?.deadline);
}

function getStartDateYmd(item) {
  return parseYmd(
    item?.startDate ?? item?.createdDate ?? item?.createdAt ?? item?.beginDate ?? item?.startedAt
  );
}

function shouldIncludeByRepeatRule(item, dateStr) {
  const target = toDate(dateStr);
  if (!target) return true;

  const repeatType = getRepeatType(item);
  const explicitDate = getItemDateYmd(item);
  const dueDateYmd = getDueDateYmd(item);
  const startDateYmd = getStartDateYmd(item) ?? dueDateYmd ?? explicitDate;
  const startDate = toDate(startDateYmd);
  const dueDate = toDate(dueDateYmd);

  if (repeatType === 'NONE') {
    if (dueDateYmd) return dueDateYmd === dateStr;
    if (startDateYmd) return startDateYmd === dateStr;
    return explicitDate != null ? explicitDate === dateStr : true;
  }

  const rangeStart = startDate && dueDate && startDate > dueDate ? dueDate : (startDate ?? dueDate);
  const rangeEnd = startDate && dueDate && startDate > dueDate ? startDate : (dueDate ?? startDate);

  if (rangeStart && target < rangeStart) return false;
  if (rangeEnd && target > rangeEnd) return false;

  if (repeatType === 'DAILY') {
    return true;
  }

  if (repeatType === 'WEEKLY') {
    if (!startDate) return true;
    return target.getDay() === startDate.getDay();
  }

  if (repeatType === 'MONTHLY') {
    const singleDate = dueDateYmd ?? startDateYmd;
    return singleDate != null ? singleDate === dateStr : true;
  }

  return explicitDate != null ? explicitDate === dateStr : true;
}

async function attachStepsToUiGroups(groups) {
  const safeGroups = Array.isArray(groups) ? groups : [];
  const tasks = safeGroups.flatMap((group) => (Array.isArray(group?.tasks) ? group.tasks : []));
  const segmentedTasks = tasks.filter((task) => {
    const todoId = task?.id ?? task?.todoId;
    return Number.isFinite(Number(todoId)) && normalizeSegmentationType(task?.segmentationType) !== 'NONE';
  });

  await Promise.all(segmentedTasks.map(async (task) => {
    try {
      const steps = await getTodoSteps(task.id ?? task.todoId);
      task.subtasks = steps.map(normalizeStep).sort((a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0));
    } catch {
      task.subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
    }
  }));

  return safeGroups;
}

/**
 * 날짜별 투두 목록 조회 (GET /api/todos?date=YYYY-MM-DD).
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {Promise<Array>} 투두 목록
 */
export async function getTodosByDate(dateStr) {
  const response = await api.get('/api/todos', {
    params: { date: dateStr },
  });
  const data = response.data;
  let list = extractTodoList(data);
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return attachStepsToUiGroups(transformApiResponseToUi(list));
  }

  const isGrouped = Array.isArray(list) && list.length > 0 && list[0].tasks && Array.isArray(list[0].tasks);
  list = isGrouped ? filterOutGuildQuestGroups(list) : filterOutGuildQuests(list);

  if (isGrouped) {
    list = list
      .map((group) => ({
        ...group,
        tasks: (group.tasks || []).filter((task) => shouldIncludeByRepeatRule(task, dateStr)),
      }))
      .filter((group) => (group.tasks || []).length > 0);
  } else {
    list = list.filter((item) => shouldIncludeByRepeatRule(item, dateStr));
  }

  return attachStepsToUiGroups(transformApiResponseToUi(list));
}

/**
 * 투두 생성 (POST /api/todos)
 * CreateRequest 스키마만 전송
 * @param {Object} payload - CreateRequest (content, dueType, categoryId, dueDate, repeatType, segmentationType, verificationType[, tagId])
 * @returns {Promise<Object>} 생성된 투두 응답
 */
export async function createTodo(payload) {
  assertTodoCreateRequest(payload);
  const response = await api.post('/api/todos', payload);
  return normalizeTodoCreateResponse(response.data);
}

export async function getTodoSteps(todoId) {
  const response = await api.get(`/api/todos/${todoId}/steps`);
  const data = response?.data?.data ?? response?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.steps)) return data.steps;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export async function createTodoAiSteps(todoId, segmentationType) {
  const response = await api.post(`/api/todos/${todoId}/steps/ai`, {
    segmentationType,
  });
  return response?.data?.data ?? response?.data;
}

export async function toggleTodoStep(todoId, stepId) {
  const response = await api.patch(`/api/todos/${todoId}/steps/${stepId}/toggle`);
  return response?.data?.data ?? response?.data;
}

export async function updateTodoStepContent(todoId, stepId, content) {
  const response = await api.patch(`/api/todos/${todoId}/steps/${stepId}/content`, {
    content,
  });
  return response?.data?.data ?? response?.data;
}

function formatYmd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(base, days) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(base, months) {
  const d = new Date(base);
  const wantedDay = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() !== wantedDay) {
    d.setDate(0);
  }
  return d;
}

function buildOccurrenceDates({ repeatType, startDate, endDate }) {
  const start = toDate(startDate);
  const end = toDate(endDate ?? startDate);
  if (!start || !end) return [startDate];
  const from = start <= end ? start : end;
  const to = start <= end ? end : start;

  if (repeatType === 'NONE') {
    // 단건 생성은 사용자가 고른 dueDate(=endDate)를 그대로 사용해야 한다.
    return [formatYmd(end)];
  }

  const result = [];
  if (repeatType === 'DAILY') {
    let cursor = new Date(from);
    while (cursor <= to) {
      result.push(formatYmd(cursor));
      cursor = addDays(cursor, 1);
    }
    return result;
  }

  if (repeatType === 'WEEKLY') {
    let cursor = new Date(from);
    while (cursor <= to) {
      result.push(formatYmd(cursor));
      cursor = addDays(cursor, 7);
    }
    return result;
  }

  if (repeatType === 'MONTHLY') {
    let cursor = new Date(from);
    while (cursor <= to) {
      result.push(formatYmd(cursor));
      cursor = addMonths(cursor, 1);
    }
    return result;
  }

  return [formatYmd(from)];
}

/**
 * Swagger 기준 /api/todos CreateRequest에는 parentId/depth/order/groupId가 없습니다.
 * segmentationType은 todo 생성 요청에 그대로 전달하고, AUTO는 생성 후 step AI API를 호출합니다.
 * @param {Object} payload - CreateRequest
 * @param {{startDate?: string, endDate?: string}=} options
 */
export async function createTodoTree(payload, options = {}) {
  assertTodoCreateRequest(payload);

  if (payload.verificationType === 'TAG' && payload.segmentationType !== 'NONE') {
    throw new Error('TAG verification does not support segmentation');
  }

  const baseStart = options.startDate ?? payload.dueDate;
  const baseEnd = options.endDate ?? payload.dueDate;
  const occurrenceDates = buildOccurrenceDates({
    repeatType: payload.repeatType ?? 'NONE',
    startDate: baseStart,
    endDate: baseEnd,
  });

  const created = await createTodo(payload);
  const todoId = Number(created?.todoId);
  if (Number.isFinite(todoId) && payload.segmentationType === 'AUTO') {
    await createTodoAiSteps(todoId, payload.segmentationType);
  }

  return {
    ...created,
    todoIds: Number.isFinite(todoId) ? [todoId] : [],
    occurrenceDates,
  };
}

/**
 * Swagger CreateRequest 기준 매핑
 */ 
const DEADLINE_TO_DUE_TYPE = { '오늘': 'TODAY', '내일': 'TOMORROW', '직접 입력': 'CUSTOM' };
const REPEAT_TO_REPEAT_TYPE = { '없음': 'NONE', '매일': 'DAILY', '매주': 'WEEKLY', '매달': 'MONTHLY' };
const SUBDIVISION_TO_SEGMENTATION = { '없음': 'NONE', '2단계로 세분화': 'TWO', '3단계로 세분화': 'THREE', 'Auto': 'AUTO' };
const VERIFICATION_TO_TYPE = { '자가 체크': 'CHECK', '사진': 'PHOTO_PROOF', '태깅': 'TAG' };
const SEGMENTATION_CODES = ['NONE', 'TWO', 'THREE', 'AUTO'];
const VERIFICATION_CODES = ['CHECK', 'PHOTO_PROOF', 'TAG'];

function normalizeCustomDeadlineInput(raw) {
  if (typeof raw !== 'string') return raw;
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  // YYYY.MM.DD / YYYY-MM-DD / YYYY/MM/DD
  const full = trimmed.match(/^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})$/);
  if (full) {
    const y = full[1];
    const m = String(Number(full[2])).padStart(2, '0');
    const d = String(Number(full[3])).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // M.D / MM.DD / M-D / M/D 등은 현재 연도로 보정
  const md = trimmed.match(/^(\d{1,2})[.\-/](\d{1,2})$/);
  if (md) {
    const year = new Date().getFullYear();
    const m = String(Number(md[1])).padStart(2, '0');
    const d = String(Number(md[2])).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  return trimmed.replace(/\./g, '-');
}

/**
 * @param {Object} form - 폼 필드 (taskName, categoryId, deadline, customDeadline, selectedDate, repeatCycle, subdivision, verification, selectedTag)
 * @returns {Object} CreateRequest 형태 payload
 */
export function buildCreateTodoPayload(form, targetDate) {
  const { taskName, categoryId, deadline, customDeadline, selectedDate, repeatCycle, subdivision, verification } = form;
  const categoryIdValue =
    categoryId != null && categoryId !== '' && Number.isFinite(Number(categoryId))
      ? Number(categoryId)
      : undefined;
  let dueDate = null;
  if (deadline === '직접 입력' && (customDeadline || selectedDate)) {
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      dueDate = `${y}-${m}-${d}`;
    } else {
      dueDate = normalizeCustomDeadlineInput(customDeadline);
    }
  } else if (deadline === '오늘' || deadline === '내일') {
    const d = new Date();
    if (deadline === '내일') d.setDate(d.getDate() + 1);
    dueDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  const dueType = deadline != null ? (DEADLINE_TO_DUE_TYPE[deadline] ?? 'CUSTOM') : 'CUSTOM';
  const repeatType = repeatCycle != null ? (REPEAT_TO_REPEAT_TYPE[repeatCycle] ?? 'NONE') : 'NONE';
  const segmentationType = subdivision != null
    ? (SEGMENTATION_CODES.includes(subdivision) ? subdivision : (SUBDIVISION_TO_SEGMENTATION[subdivision] ?? 'NONE'))
    : 'NONE';
  const verificationType = verification != null
    ? (VERIFICATION_CODES.includes(verification) ? verification : (VERIFICATION_TO_TYPE[verification] ?? 'CHECK'))
    : 'CHECK';
  const payload = {
    content: taskName ?? '',
    dueType,
    repeatType,
    segmentationType,
    verificationType,
  };
  if (dueDate != null && dueDate !== '') {
    payload.dueDate = dueDate;
  } else if (typeof targetDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
    payload.dueDate = targetDate;
  } else {
    const today = new Date();
    payload.dueDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }
  if (categoryIdValue !== undefined) {
    payload.categoryId = categoryIdValue;
  }
  const clean = {};
  Object.keys(payload).forEach((k) => {
    if (payload[k] !== undefined && payload[k] !== null) {
      clean[k] = payload[k];
    }
  });
  return clean;
}
