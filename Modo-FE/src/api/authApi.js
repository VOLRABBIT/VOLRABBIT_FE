import api from './api';

// 디바이스 ID 관리 (회원가입/소셜 로그인에서 사용)
const DEVICE_ID_KEY = 'deviceId';

const generateDeviceId = () => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getOrCreateDeviceId = () => {
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;

    const created = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, created);
    return created;
  } catch {
    return generateDeviceId();
  }
};

const resolvePublicOrigin = () => {
  if (import.meta.env.VITE_PUBLIC_ORIGIN) {
    return import.meta.env.VITE_PUBLIC_ORIGIN;
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://localhost:5173';
};

const buildOAuthCallbackUrl = (provider) => {
  const origin = resolvePublicOrigin().replace(/\/$/, '');
  return `${origin}/oauth/callback/${encodeURIComponent(provider)}`;
};

export const clearClientSession = () => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('deviceId');
    localStorage.removeItem('personaType');
    localStorage.removeItem('selectedMap');
  } catch {
    console.error('clearClientSession 에러:', error);
  }
};

/**
 * 일반 로그인
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 * @returns {Promise} accessToken을 포함한 응답
 */
export const login = async (email, password) => {
  const response = await api.post('/api/users/login', {
    email,
    password,
  });

  const tokenData = response?.data?.data;

  if (tokenData?.accessToken) {
    localStorage.setItem('accessToken', tokenData.accessToken);
  }

  return tokenData;
};

/**
 * 일반 회원가입
 * @param {string} nickname - 닉네임
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 * @returns {Promise} 회원가입 응답
 */
export const signup = async (nickname, email, password) => {
  const deviceId = getOrCreateDeviceId();

  const response = await api.post('/api/users/signup', {
    email,
    password,
    nickname,
    deviceId,
  });
  return response.data;
};

/**
 * 소셜 로그인 시도 (OAuth 인증 URL 요청)
 * @param {string} provider - 소셜 로그인 제공자 ('kakao', 'google', 'apple')
 * @returns {void} - 브라우저가 해당 URL로 리다이렉트됨
 */
export const socialLogin = (provider) => {
  const deviceId = getOrCreateDeviceId();
  const callbackUrl = buildOAuthCallbackUrl(provider);
  const startPath = `/api/auth/oauth/${provider}`;
  const startUrl = `${api.defaults.baseURL}${startPath}?deviceId=${encodeURIComponent(deviceId)}&redirectUri=${encodeURIComponent(callbackUrl)}`;

  api
    .get(startPath, {
      params: {
        deviceId,
        redirectUri: callbackUrl,
      },
      withCredentials: true,
    })
    .then((res) => {
      const redirectUrl =
        res?.data?.data?.url ??
        res?.data?.url ??
        res?.data?.data?.redirectUrl ??
        res?.data?.redirectUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
      window.location.href = startUrl;
    })
    .catch(() => {
      window.location.href = startUrl;
    });
};

/**
 * 소셜 로그인 콜백 코드 교환
 * @param {string} provider - 소셜 로그인 제공자
 * @param {string} code - OAuth 인가 코드
 * @returns {Promise<Object>} 토큰 정보
 */
export const socialLoginCallback = async (provider, code) => {
  const response = await api.get(`/api/auth/oauth/callback/${provider}`, {
    params: { code },
    withCredentials: true,
  });
  const tokenData = response?.data?.data;
  if (tokenData?.accessToken) {
    localStorage.setItem('accessToken', tokenData.accessToken);
  }
  return tokenData;
};

/**
 * 로그아웃
 * @returns {Promise} 로그아웃 응답
 */
export const logout = async () => {
  const response = await api.post('/api/users/logout');

  clearClientSession();

  return response.data;
};

/**
 * 토큰 재발급
 * @returns {Promise} 새로운 accessToken을 포함한 응답
 */
export const reissueToken = async () => {
  const response = await api.post('/api/users/reissue');

  const tokenData = response?.data?.data;

  if (tokenData?.accessToken) {
    localStorage.setItem('accessToken', tokenData.accessToken);
  }

  return tokenData;
};

/**
 * 유저 프로필 조회
 * @returns {Promise} 유저 프로필 정보
 */
export const getUserProfile = async () => {
  const response = await api.get('/api/users/me');
  return response?.data?.data;
};