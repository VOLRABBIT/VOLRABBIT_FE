import api from './api';

// Onboarding API
/** 온보딩 질문 목록 조회 */
export const getOnboardingQuestions = async () => {
  const response = await api.get('/api/onboarding/questions');
  return response.data;
};

/** 온보딩 제출 (payload null이면 건너뛰기) */
export const submitOnboarding = async (payload) => {
  const hasBody = Array.isArray(payload) && payload.length > 0;
  const response = hasBody
    ? await api.post('/api/onboarding/submit', payload)
    : await api.post('/api/onboarding/submit');
  return response.data;
};

// Persona API
/** 특정 페르소나 조회 (id, 이름, 아이콘 URL) */
export const getPersona = async (personaId) => {
  const response = await api.get(`/api/personas/${personaId}`);
  return response.data;
};

/** 페르소나 상세 분석 조회 */
export const getPersonaAnalysis = async (personaId) => {
  const response = await api.get(`/api/personas/${personaId}/analysis`);
  return response.data;
};

/** 전체 페르소나 목록 조회 */
export const getPersonas = async () => {
  const response = await api.get('/api/personas');
  return response.data;
};

// User API
/** 내 정보 조회 (토큰 기반 로그인 유저 상세 정보) */
export const getMyInfo = async () => {
  const response = await api.get('/api/users/me');
  return response.data;
};

/** 닉네임 중복 확인 (true: 중복됨, false: 사용 가능) */
export const checkNickname = async (nickname) => {
  const response = await api.get('/api/users/nickname/check', {
    params: { nickname },
  });
  return response.data;
};

/** 닉네임 수정 (로그인 유저 닉네임 변경, 중복 불가) */
export const updateNickname = async (nickname) => {
  const response = await api.patch('/api/users/me/nickname', { nickname });
  return response.data;
};

/** 회원 탈퇴 (현재 로그인 유저 계정·토큰 정보 영구 삭제) */
export const deleteAccount = async () => {
  const response = await api.delete('/api/users/me');
  return response.data;
};

// Category API (마이페이지 카테고리 관리 연동)
/** 카테고리 목록 조회 (id, name) **/
export const getCategories = async () => {
  const response = await api.get('/api/categories');
  return response.data;
};

/** 카테고리 생성 (POST /api/categories) - body: { name } (Swagger에서 categoryName이면 api 수정) */
export const createCategory = async (payload) => {
  const name = typeof payload === 'string' ? payload : (payload?.name ?? payload?.categoryName ?? '');
  const response = await api.post('/api/categories', { name });
  return response.data;
};

/** 카테고리 삭제 (DELETE /api/categories/{id}) */
export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/api/categories/${categoryId}`);
  return response.data;
};
