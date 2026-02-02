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