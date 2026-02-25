import { useCallback, useState } from "react";
import { checkTodo, registerNfcTag, uploadPhotoProof, verifyNfcTag } from "../api/taskApi";

function buildVerificationErrorMessage(error, fallback) {
  const status = error?.response?.status;
  const serverMessage =
    error?.response?.data?.message ??
    error?.response?.data?.error ??
    error?.message;

  if (status === 401 || status === 403) {
    return "로그인 정보가 만료되었습니다. 다시 로그인해주세요.";
  }
  if (status === 404) {
    return "대상이 존재하지 않습니다.";
  }
  if (status === 409) {
    return "이미 인증 처리된 항목입니다.";
  }
  if (status >= 500) {
    return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  return serverMessage || fallback;
}

export function useTodoVerification() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeTodoByCheck = useCallback(async (todoId) => {
    setIsSubmitting(true);
    try {
      return await checkTodo(todoId);
    } catch (error) {
      if (error?.response?.status === 409) {
        return { todoId, todoStatus: "SUCCESS" };
      }
      throw new Error(buildVerificationErrorMessage(error, "자가 체크 인증에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const completeTodoByPhoto = useCallback(async (todoId, photoPayload) => {
    setIsSubmitting(true);
    try {
      return await uploadPhotoProof(todoId, photoPayload);
    } catch (error) {
      if (error?.response?.status === 409) {
        return { todoId, todoStatus: "SUCCESS" };
      }
      throw new Error(buildVerificationErrorMessage(error, "사진 인증에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const completeTodoByTag = useCallback(async (todoId) => {
    setIsSubmitting(true);
    try {
      const registered = await registerNfcTag(todoId);
      const tagCode = registered?.tagCode;
      if (!tagCode) {
        throw new Error("태그 등록 응답에 tagCode가 없습니다.");
      }

      try {
        await verifyNfcTag(tagCode);
      } catch (error) {
        if (error?.response?.status !== 409) {
          throw error;
        }
      }
      return registered;
    } catch (error) {
      throw new Error(buildVerificationErrorMessage(error, "태깅 인증에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const getVerificationErrorMessage = useCallback(
    (error, fallback) => buildVerificationErrorMessage(error, fallback),
    []
  );

  return {
    isSubmitting,
    completeTodoByCheck,
    completeTodoByPhoto,
    completeTodoByTag,
    getVerificationErrorMessage,
  };
}