import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getUserProfile, socialLoginCallback } from "../../api/authApi";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const initialError = searchParams.get("error");
  const initialErrorDescription = searchParams.get("error_description");
  const [message, setMessage] = useState(
    initialError
      ? `소셜 로그인에 실패했습니다: ${initialErrorDescription || initialError}`
      : "소셜 로그인 처리 중입니다..."
  );

  useEffect(() => {
    let cancelled = false;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (!provider) {
      setTimeout(() => navigate("/login", { replace: true }), 1200);
      return () => {
        cancelled = true;
      };
    }

    if (error) {
      setTimeout(() => navigate("/login", { replace: true }), 1800);
      return () => {
        cancelled = true;
      };
    }

    if (!code) {
      setTimeout(() => navigate("/login", { replace: true }), 1800);
      return () => {
        cancelled = true;
      };
    }

    const run = async () => {
      try {
        await socialLoginCallback(provider, code);
        const profile = await getUserProfile();
        if (cancelled) return;

        if (profile?.persona || profile?.personaId) {
          navigate("/map", { replace: true });
        } else {
          navigate("/onboarding", { replace: true });
        }
      } catch (err) {
        if (cancelled) return;
        const status = err?.response?.status;
        const msg =
          err?.response?.data?.message ??
          err?.response?.data?.error ??
          err?.message;

        if (status === 401) {
          setMessage("로그인 정보가 만료되었습니다. 다시 시도해주세요.");
        } else if (status >= 500) {
          setMessage("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setMessage(msg || "소셜 로그인 처리에 실패했습니다.");
        }
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [navigate, provider, searchParams]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <p>{message}</p>
    </div>
  );
}