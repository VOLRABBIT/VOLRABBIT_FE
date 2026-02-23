const TASK_REBUILD_ORDER_STORAGE_PREFIX = "task-rebuild-order:v1:";

export function getTaskRebuildOrderKey(todoId) {
  return `${TASK_REBUILD_ORDER_STORAGE_PREFIX}${todoId}`;
}

export function readTaskRebuildOrder(todoId) {
  if (todoId == null) return null;
  try {
    const raw = localStorage.getItem(getTaskRebuildOrderKey(todoId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((id) => String(id)) : null;
  } catch {
    return null;
  }
}

export function writeTaskRebuildOrder(todoId, orderedIds) {
  if (todoId == null) return;
  try {
    const normalized = (orderedIds || []).map((id) => String(id));
    localStorage.setItem(getTaskRebuildOrderKey(todoId), JSON.stringify(normalized));
  } catch {
    // ignore storage failure
  }
}

export function mergeOrderedIdsWithCurrent(currentIds, savedOrderedIds) {
  const normalizedCurrent = Array.isArray(currentIds) ? currentIds.map((id) => String(id)) : [];
  const currentSet = new Set(normalizedCurrent);
  const normalizedSaved = Array.isArray(savedOrderedIds) ? savedOrderedIds.map((id) => String(id)) : [];
  const filteredSaved = normalizedSaved.filter((id) => currentSet.has(id));
  const filteredSet = new Set(filteredSaved);
  const appended = normalizedCurrent.filter((id) => !filteredSet.has(id));
  return [...filteredSaved, ...appended];
}

export function mergeTasksByOrder(tasks, savedOrderedIds, getId = (task) => task?.todoId ?? task?.id) {
  const list = Array.isArray(tasks) ? tasks : [];
  const currentIds = list.map((task) => String(getId(task)));
  const mergedOrderIds = mergeOrderedIdsWithCurrent(currentIds, savedOrderedIds);
  const indexMap = new Map(mergedOrderIds.map((id, index) => [id, index]));
  const mergedTasks = [...list].sort((a, b) => {
    const aId = String(getId(a));
    const bId = String(getId(b));
    const aIndex = indexMap.has(aId) ? indexMap.get(aId) : Number.MAX_SAFE_INTEGER;
    const bIndex = indexMap.has(bId) ? indexMap.get(bId) : Number.MAX_SAFE_INTEGER;
    if (aIndex !== bIndex) return aIndex - bIndex;
    return 0;
  });
  return { mergedTasks, mergedOrderIds };
}

export function syncTaskRebuildOrder(scopeTodoId, orderedIds) {
  if (scopeTodoId == null) return;
  const normalized = (orderedIds || []).map((id) => String(id));
  const uniqueTargets = Array.from(new Set([String(scopeTodoId), ...normalized]));
  uniqueTargets.forEach((todoId) => {
    writeTaskRebuildOrder(todoId, normalized);
  });
}