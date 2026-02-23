import api from "./api";

function unwrap(payload) {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data;
  }
  return payload;
}

export async function createTodoTimeLog(todoId, durationSeconds) {
  const response = await api.post(`/api/todos/${todoId}/time-logs`, {
    durationSeconds,
  });
  return unwrap(response?.data);
}

export async function getTodoTimeLogSummary(todoId) {
  const response = await api.get(`/api/todos/${todoId}/time-logs/summary`);
  return unwrap(response?.data);
}

export async function getDailyTimeLogSummary(date) {
  const response = await api.get("/api/todos/time-logs/daily", {
    params: { date },
  });
  return unwrap(response?.data);
}