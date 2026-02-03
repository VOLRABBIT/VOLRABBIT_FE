import api from './api';

export function transformApiResponseToUi(apiList) {
  if (!Array.isArray(apiList) || apiList.length === 0) {
    return [];
  }

  const first = apiList[0];
  if (first.tasks && Array.isArray(first.tasks)) {
    return apiList.map((group) => ({
      id: group.id ?? `cat-${group.category}`,
      category: group.category ?? '',
      tasks: (group.tasks || []).map((t, i) => ({
        id: t.id ?? t.todoId ?? `task-${i}`,
        title: t.title ?? t.taskTitle ?? t.content ?? '',
        isCompleted: t.isCompleted ?? t.completed ?? false,
        subtasks: Array.isArray(t.subtasks)
          ? t.subtasks.map((s) => ({
              id: s.id,
              title: s.title ?? '',
              isCompleted: s.isCompleted ?? s.completed ?? false,
            }))
          : [],
        startTime: t.startTime ?? null,
        duration: t.duration ?? null,
      })),
    }));
  }

  const byCategory = {};
  apiList.forEach((item, index) => {
    const cat = item.category ?? item.categoryName ?? '기타';
    if (!byCategory[cat]) {
      byCategory[cat] = { id: item.categoryId ?? `cat-${cat}`, category: cat, tasks: [] };
    }
    byCategory[cat].tasks.push({
      id: item.id ?? item.todoId ?? `item-${index}`,
      title: item.title ?? item.taskTitle ?? item.content ?? '',
      isCompleted: item.isCompleted ?? item.completed ?? false,
      subtasks: Array.isArray(item.subtasks)
        ? item.subtasks.map((s) => ({
            id: s.id,
            title: s.title ?? '',
            isCompleted: s.isCompleted ?? s.completed ?? false,
          }))
        : [],
      startTime: item.startTime ?? null,
      duration: item.duration ?? null,
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
    return transformApiResponseToUi(list);
  }

  const isGrouped = Array.isArray(list) && list.length > 0 && list[0].tasks && Array.isArray(list[0].tasks);

  if (isGrouped) {
    list = list
      .map((group) => ({
        ...group,
        tasks: (group.tasks || []).filter((task) => getItemDateYmd(task) === dateStr),
      }))
      .filter((group) => (group.tasks || []).length > 0);
  } else {
    const hasDateField = list.some((i) => getItemDateYmd(i) != null);
    if (hasDateField) {
      list = list.filter((item) => getItemDateYmd(item) === dateStr);
    }
  }

  if (process.env.NODE_ENV === 'development' && list.length === 0 && (data && typeof data === 'object')) {
    console.debug('[getTodosByDate] date=', dateStr, 'filtered count=', list.length, 'raw response.data=', data);
  }
  return transformApiResponseToUi(list);
}

/**
 * 투두 생성 (POST /api/todos)
 * CreateRequest 스키마만 전송
 * @param {Object} payload - CreateRequest (content, dueType, categoryId, dueDate, repeatType, segmentationType, verificationType[, tagId])
 * @returns {Promise<Object>} 생성된 투두 응답
 */
export async function createTodo(payload) {
  if (process.env.NODE_ENV === 'development') {
    console.log("[5] createTodo 호출, POST body:", JSON.stringify(payload, null, 2));
  }
  const response = await api.post('/api/todos', payload);
  return response.data;
}

/**
 * Swagger CreateRequest 기준 매핑
 */ 
const DEADLINE_TO_DUE_TYPE = { '오늘': 'TODAY', '내일': 'TOMORROW', '직접 입력': 'CUSTOM' };
const REPEAT_TO_REPEAT_TYPE = { '없음': 'NONE', '매일': 'DAILY', '매주': 'WEEKLY', '매달': 'MONTHLY' };
const SUBDIVISION_TO_SEGMENTATION = { '없음': 'NONE', '2단계로 세분화': 'TWO', '3단계로 세분화': 'THREE', 'Auto': 'AUTO' };
const VERIFICATION_TO_TYPE = { '자가 체크': 'CHECK', '사진': 'PHOTO_PROOF', '태깅': 'TAG' };
/** 태깅 선택 시 백엔드 tagId 매핑 */
const TAG_NAME_TO_ID = { '전공책': 1, '세탁기': 2, '기숙사 테이블': 3 };

/**
 * @param {Object} form - 폼 필드 (taskName, categoryId, deadline, customDeadline, selectedDate, repeatCycle, subdivision, verification, selectedTag)
 * @returns {Object} CreateRequest 형태 payload
 */
export function buildCreateTodoPayload(form, targetDate) {
  const { taskName, categoryId, deadline, customDeadline, selectedDate, repeatCycle, subdivision, verification, selectedTag } = form;
  if (process.env.NODE_ENV === 'development') {
    console.log("[A] buildCreateTodoPayload 받은 form", { taskName, categoryId, deadline, customDeadline, selectedDate: !!selectedDate, repeatCycle, subdivision, verification, selectedTag });
  }
  const categoryIdValue =
    categoryId != null && categoryId !== '' && Number.isFinite(Number(categoryId))
      ? Number(categoryId)
      : undefined;
  if (process.env.NODE_ENV === 'development') {
    console.log("[B] categoryIdValue", categoryIdValue);
  }
  let dueDate = null;
  if (deadline === '직접 입력' && (customDeadline || selectedDate)) {
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      dueDate = `${y}-${m}-${d}`;
    } else if (typeof customDeadline === 'string' && customDeadline.includes('.')) {
      dueDate = customDeadline.replace(/\./g, '-');
    } else {
      dueDate = customDeadline;
    }
  } else if (deadline === '오늘' || deadline === '내일') {
    const d = new Date();
    if (deadline === '내일') d.setDate(d.getDate() + 1);
    dueDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  const dueType = deadline != null ? (DEADLINE_TO_DUE_TYPE[deadline] ?? 'CUSTOM') : 'CUSTOM';
  const repeatType = repeatCycle != null ? (REPEAT_TO_REPEAT_TYPE[repeatCycle] ?? 'NONE') : 'NONE';
  const segmentationTypeRaw = subdivision != null ? (SUBDIVISION_TO_SEGMENTATION[subdivision] ?? 'NONE') : 'NONE';
  const verificationType = verification != null ? (VERIFICATION_TO_TYPE[verification] ?? 'CHECK') : 'CHECK';
  // segmentationType NONE 전송 시 백엔드에서 500 발생으로 확인 필요
  // const segmentationType = segmentationTypeRaw !== 'NONE' ? 'NONE' : segmentationTypeRaw;
  const segmentationType = segmentationTypeRaw;
  if (process.env.NODE_ENV === 'development') {
    console.log("[C] dueDate(계산 직후)", dueDate, "| dueType", dueType, "| repeatType", repeatType, "| segmentationType", segmentationType, "| verificationType", verificationType);
  }
  const payload = {
    content: taskName ?? '',
    dueType,
    repeatType,
    segmentationType,
    verificationType,
  };
  if (dueDate != null && dueDate !== '') {
    payload.dueDate = dueDate;
  } else {
    const today = new Date();
    payload.dueDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }
  if (categoryIdValue !== undefined) {
    payload.categoryId = categoryIdValue;
  }
  if (verificationType === 'TAG' && selectedTag != null && selectedTag !== '') {
    const tagId = TAG_NAME_TO_ID[selectedTag];
    if (tagId !== undefined) {
      payload.tagId = tagId;
    }
  }
  if (process.env.NODE_ENV === 'development') {
    console.log("[D] payload (clean 전)", { ...payload });
  }
  const clean = {};
  Object.keys(payload).forEach((k) => {
    if (payload[k] !== undefined && payload[k] !== null) {
      clean[k] = payload[k];
    }
  });
  if (process.env.NODE_ENV === 'development') {
    console.log("[E] clean 최종 반환", { ...clean });
  }
  return clean;
}
