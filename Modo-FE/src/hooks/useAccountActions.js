import { useCallback, useState } from "react";
import { logout, clearClientSession } from "../api/authApi";
import { deleteAccount } from "../api/apiStore";

function resolveAccountErrorMessage(error, fallback) {
  const status = error?.response?.status;
  const serverMessage =
    error?.response?.data?.message ??
    error?.response?.data?.error ??
    error?.message;

  if (status === 401 || status === 403) {
    return "로그인 정보가 만료되었습니다. 다시 로그인해주세요.";
  }
  if (status === 404) {
    return "계정을 찾을 수 없습니다.";
  }
  if (status === 409) {
    return "이미 처리된 요청입니다.";
  }
  if (status >= 500) {
    return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  return serverMessage || fallback;
}

export function useAccountActions() {
  const [isProcessing, setIsProcessing] = useState(false);

  const performLogout = useCallback(async () => {
    setIsProcessing(true);
    try {
      await logout();
    } catch (error) {
      const status = error?.response?.status;
      if (status !== 401 && status !== 403 && status !== 404) {
        throw error;
      }
    } finally {
      clearClientSession();
      setIsProcessing(false);
    }
  }, []);

  const performWithdraw = useCallback(async () => {
    setIsProcessing(true);
    try {
      await deleteAccount();
      clearClientSession();
    } catch (error) {
      throw new Error(resolveAccountErrorMessage(error, "회원 탈퇴에 실패했습니다."));
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isProcessing,
    performLogout,
    performWithdraw,
  };
}