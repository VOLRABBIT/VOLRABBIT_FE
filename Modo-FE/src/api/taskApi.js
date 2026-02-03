import api from './api';

/**
 * 날짜별 todo 목록 조회
 * @param {string} date - 날짜 (YYYY-MM-DD)
 * @returns {Promise} todo 목록
 */
export const getTasksByDate = async (date) => {
  // 날짜 형식 검증
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식이어야 합니다.');
  }
  
  const response = await api.get('/api/todos', {
    params: { 
      date: date
    },
  });
  return response?.data?.data || response?.data;
};

/**
 * 특정 todo 조회
 * @param {number} todoId - todo ID
 * @returns {Promise} todo 정보
 */
export const getTask = async (todoId) => {
  // Swagger: GET /api/todos/{todoId}
  const response = await api.get(`/api/todos/${todoId}`);
  return response?.data?.data || response?.data;
};

/**
 * Todo 생성
 * @param {Object} taskData
 * @param {string} taskData.content
 * @param {number} taskData.categoryId
 * @param {string} taskData.dueDate
 * @param {string} taskData.dueType
 * @param {string} taskData.repeatType
 * @param {string} taskData.segmentationType
 * @param {string} taskData.verificationType
 * @param {number} [taskData.tagId]
 * @param {string} [taskData.locationType]
 * @param {Array} [taskData.subtasks]
 * @returns {Promise}
 */
export const createTask = async (taskData) => {
  
  console.log('createTask 호출 - taskData:', taskData);
  
  // 필수 필드 검증
  if (!taskData.content) {
    throw new Error('content는 필수입니다.');
  }
  
  if (!taskData.dueType) {
    throw new Error('dueType은 필수입니다.');
  }

  if (!taskData.repeatType) {
    throw new Error('repeatType은 필수입니다.');
  }
  if (!taskData.segmentationType) {
    throw new Error('segmentationType은 필수입니다.');
  }
  if (!taskData.verificationType) {
    throw new Error('verificationType은 필수입니다.');
  }
  if (!taskData.categoryId && !taskData.category_id && !taskData.category) {
    console.error('카테고리 ID가 없습니다:', taskData);
    throw new Error('카테고리가 필요합니다.');
  }
  
  try {
    const response = await api.post('/api/todos', taskData);
    return response?.data?.data || response?.data;
  } catch (error) {
    console.error('createTask API 에러:', error);
    console.error('에러 응답 데이터:', error.response?.data);
    console.error('요청 데이터:', taskData);
    throw error;
  }
};

/**
 * Todo 수정
 * @param {number} todoId
 * @param {Object} taskData - 수정할 todo 데이터
 * @returns {Promise} 수정된 todo 정보
 */
export const updateTask = async (todoId, taskData) => {
  const response = await api.patch(`/api/todos/${todoId}`, taskData);
  return response?.data?.data || response?.data;
};

/**
 * Todo 삭제
 * @param {number} todoId
 * @returns {Promise} 삭제 응답
 */
export const deleteTask = async (todoId) => {
  const response = await api.delete(`/api/todos/${todoId}`);
  return response?.data;
};

/**
 * Todo 완료 처리
 * @param {number} todoId
 * @param {boolean} isCompleted
 * @returns {Promise} 업데이트된 todo 정보
 */
export const toggleTaskComplete = async (todoId, isCompleted = true) => {
  if (isCompleted) {
    const response = await api.patch(`/api/todos/${todoId}/complete`);
    return response?.data?.data || response?.data;
  } else {
    // 미완료 - 자가 체크 취소 사용
    const response = await api.delete(`/api/todos/${todoId}/check`);
    return response?.data?.data || response?.data;
  }
};

/**
 * Todo 포기 처리
 * @param {number} todoId
 * @returns {Promise} 업데이트된 todo 정보
 */
export const giveUpTodo = async (todoId) => {
  const response = await api.patch(`/api/todos/${todoId}/give-up`);
  return response?.data?.data || response?.data;
};

/**
 * Todo 실패 처리
 * @param {number} todoId
 * @returns {Promise} 업데이트된 todo 정보
 */
export const failTodo = async (todoId) => {
  const response = await api.patch(`/api/todos/${todoId}/fail`);
  return response?.data?.data || response?.data;
};

/**
 * 자가 체크 인증
 * @param {number} todoId
 * @returns {Promise} 인증 결과
 */
export const checkTodo = async (todoId) => {
  const response = await api.post(`/api/todos/${todoId}/check`);
  return response?.data?.data || response?.data;
};

/**
 * 자가 체크 취소
 * @param {number} todoId
 * @returns {Promise} 취소 결과
 */
export const uncheckTodo = async (todoId) => {
  const response = await api.delete(`/api/todos/${todoId}/check`);
  return response?.data?.data || response?.data;
};

/**
 * 사진 업로드 인증
 * @param {number} todoId
 * @param {FormData|File} photoData - 사진 데이터
 * @returns {Promise} 인증 결과
 */
export const uploadPhotoProof = async (todoId, photoData) => {
  const response = await api.post(`/api/todos/${todoId}/photo-proof`, photoData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response?.data?.data || response?.data;
};

/**
 * NFC 태깅 인증
 * @param {number} todoId
 * @param {Object} tagData - 태그 데이터
 * @returns {Promise} 인증 결과
 */
export const tagTodo = async (todoId, tagData) => {
  const response = await api.post(`/api/todos/${todoId}/tag`, tagData);
  return response?.data?.data || response?.data;
};

/**
 * 재도전 (상태 값 변화)
 * @param {number} todoId
 * @returns {Promise} 업데이트된 todo 정보
 */
export const retryTodo = async (todoId) => {
  const response = await api.post(`/api/todos/${todoId}/retry`);
  return response?.data?.data || response?.data;
};

/**
 * 재도전 투두 생성
 * @param {number} todoId
 * @returns {Promise} 생성된 재도전 todo 정보
 */
export const createRetryTodo = async (todoId) => {
  const response = await api.post(`/api/todos/${todoId}/give-up/retry`);
  return response?.data?.data || response?.data;
};

/**
 * Todo 제목 수정
 * @param {number} todoId
 * @param {string} title
 * @returns {Promise} 업데이트된 todo 정보
 */
export const updateTaskTitle = async (todoId, title) => {
  return updateTask(todoId, { title });
};

/**
 * Subtask 완료 처리
 * @param {number} todoId
 * @param {number} subtaskId
 * @param {boolean} isCompleted
 * @returns {Promise} 업데이트된 subtask 정보
 */
export const toggleSubtaskComplete = async (todoId, subtaskId, isCompleted) => {
  const response = await api.patch(
    `/api/todos/${todoId}/subtasks/${subtaskId}/complete`,
    { isCompleted },
  );
  return response?.data?.data || response?.data;
};
