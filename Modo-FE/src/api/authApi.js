import api from './api';

/**
 * 일반 로그인
 * @param {string} id - 사용자 아이디
 * @param {string} password - 비밀번호
 * @returns {Promise} accessToken을 포함한 응답
 */
export const login = async (id, password) => {
  const response = await api.post('/api/users/login', {
    id,
    password,
  });
  
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  
  return response.data;
};

/**
 * 일반 회원가입
 * @param {string} nickname - 닉네임
 * @param {string} id - 사용자 아이디
 * @param {string} password - 비밀번호
 * @returns {Promise} 회원가입 응답
 */
export const signup = async (nickname, id, password) => {
  const response = await api.post('/api/users/signup', {
    nickname,
    id,
    password,
  });
  
  return response.data;
};

/**
 * 소셜 로그인 시도 (OAuth 인증 URL 요청)
 * @param {string} provider - 소셜 로그인 제공자 ('kakao', 'google', 'apple')
 * @returns {void} - 브라우저가 해당 URL로 리다이렉트됨
 */
export const socialLogin = (provider) => {
  // OAuth 인증 URL로 리다이렉트
  window.location.href = `${api.defaults.baseURL}/api/auth/oauth/${provider}`;
};

/**
 * 로그아웃
 * @returns {Promise} 로그아웃 응답
 */
export const logout = async () => {
  const response = await api.post('/api/users/logout');
  
  // 로컬 스토리지에서 토큰 제거
  localStorage.removeItem('accessToken');
  
  return response.data;
};

/**
 * 토큰 재발급
 * @returns {Promise} 새로운 accessToken을 포함한 응답
 */
export const reissueToken = async () => {
  const response = await api.post('/api/users/reissue');
  
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  
  return response.data;
};

/**
 * 유저 프로필 조회
 * @returns {Promise} 유저 프로필 정보
 */
export const getUserProfile = async () => {
  const response = await api.get('/api/users/me');
  return response.data;
};
