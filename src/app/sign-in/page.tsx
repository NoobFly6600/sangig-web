"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sendMagicLink, signInWithGoogle } = useAuth();

  const lang =
    typeof window !== "undefined" ? localStorage.getItem("language") : "en";

  const t = {
    title: lang === "zh" ? "闪职" : "SanGig",
    signInTitle:
      lang === "zh" ? "登录" : lang === "fr" ? "Se connecter" : "Sign in",
    tagline:
      lang === "zh"
        ? "找工作、找零工，直接联系雇主，或发布工作、雇佣人才"
        : lang === "fr"
        ? "Connectez-vous pour découvrir des emplois, contacter les employeurs ou publier des offres."
        : "Find jobs and gigs, message employers directly, or post jobs, hire talent.",
    emailPlaceholder:
      lang === "zh"
        ? "请输入电子邮箱"
        : lang === "fr"
        ? "Entrez votre e-mail"
        : "Enter your email",
    continue: lang === "zh" ? "继续" : lang === "fr" ? "Continuer" : "Continue",
    or: lang === "zh" ? "或" : lang === "fr" ? "ou" : "or",
    continueWithGoogle:
      lang === "zh"
        ? "使用 Google 登录"
        : lang === "fr"
        ? "Continuer avec Google"
        : "Continue with Google",
    terms:
      lang === "zh"
        ? "创建账户或登录，即表示您理解并同意 SanGig 的条款，并知晓我们的 Cookie 和隐私政策"
        : lang === "fr"
        ? "En créant un compte ou en vous connectant, vous acceptez les conditions de SanGig et reconnaissez nos politiques de cookies et de confidentialité."
        : "By creating an account or signing in, you understand and agree to SanGig's Terms. You also acknowledge our Cookie and Privacy policies.",
    checkYourEmail:
      lang === "zh"
        ? "请检查您的电子邮件"
        : lang === "fr"
        ? "Vérifiez votre e-mail"
        : "Check your email",
    linkSentMessage:
      lang === "zh"
        ? `我们已向 ${email} 发送登录链接，请点击链接登录`
        : lang === "fr"
        ? `Nous avons envoyé un lien de connexion à ${email}. Cliquez sur le lien dans votre boîte de réception pour vous connecter.`
        : `We've sent a login link to ${email}. Click the link in your inbox to sign in.`,
    invalidEmail:
      lang === "zh"
        ? "请输入有效的电子邮箱地址"
        : lang === "fr"
        ? "Veuillez entrer une adresse e-mail valide."
        : "Please enter a valid email address.",
    emailRateLimit:
      lang === "zh"
        ? "发送过多，请稍后再试"
        : lang === "fr"
        ? "Trop de demandes. Veuillez réessayer plus tard."
        : "Too many emails sent. Please wait before trying again.",
    emailNotConfirmed:
      lang === "zh"
        ? "请检查您的电子邮件并点击确认链接"
        : lang === "fr"
        ? "Veuillez vérifier votre e-mail et cliquer sur le lien de confirmation."
        : "Please check your email and click the confirmation link.",
    invalidCredentials:
      lang === "zh"
        ? "邮箱或密码错误，请重试"
        : lang === "fr"
        ? "Identifiants invalides. Veuillez réessayer."
        : "Invalid email or password. Please try again.",
  };

  const parseSupabaseAuthError = (error: any) => {
    if (!error) return null;

    switch (error.message) {
      case "Invalid email":
        return t.invalidEmail;
      case "Email rate limit exceeded":
        return t.emailRateLimit;
      case "Email not confirmed":
        return t.emailNotConfirmed;
      case "Invalid login credentials":
        return t.invalidCredentials;
      default:
        return error.message;
    }
  };

  const handleSendLink = async () => {
    if (!email) {
      setError(t.invalidEmail);
      return;
    }

    setLoading(true);
    try {
      await sendMagicLink(email);
      setLinkSent(true);
      setError(null);
    } catch (err: any) {
      console.error("Magic link error:", err);
      setError(parseSupabaseAuthError(err) || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      setError(null);
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(parseSupabaseAuthError(err) || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-5 flex flex-col items-center pt-20 sm:pt-24 md:pt-26 lg:pt-28 2xl:pt-40">
      {!linkSent ? (
        <>
          <h1 className="text-3xl font-bold mb-15 text-[#50C878]">{t.title}</h1>
          <p className="text-gray-500 w-full max-w-md text-center">
            {t.tagline}
          </p>
          <input
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-gray-300 rounded-lg px-3 py-2 w-full max-w-md my-2 focus:outline-none focus:border-[#50C878]"
            style={{ borderWidth: "1.5px" }}
          />
          {error && (
            <p className="text-base text-red-600 w-full max-w-md text-left">
              {error}
            </p>
          )}
          <button
            onClick={handleSendLink}
            className="w-full mt-2 max-w-md bg-[#50C878] text-white py-2 rounded-lg font-semibold hover:bg-[#3fa963] transition cursor-pointer"
          >
            {t.continue}
          </button>

          <div className="flex items-center w-full max-w-md my-2 text-gray-500 font-medium">
            <div className="flex-grow border border-gray-300" />
            <span className="mx-3">{t.or}</span>
            <div className="flex-grow border border-gray-300" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="relative flex items-center justify-center w-full max-w-md py-2 px-4 mb-4 border-gray-300 rounded-lg bg-white font-semibold transition hover:bg-[#e8f8f1] hover:border-[#50C878] cursor-pointer"
            style={{ borderWidth: "1.5px" }}
          >
            <div className="absolute left-4 w-5 h-5 min-w-[20px]">
              <svg
                viewBox="0 0 48 48"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Google Logo Paths */}
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
            </div>
            <span className="ml-8">{t.continueWithGoogle}</span>
          </button>

          <div className="w-full max-w-md text-sm text-gray-600 text-center">
            <p>{t.terms}</p>
          </div>
        </>
      ) : (
        <div className="w-full max-w-md text-center mt-10">
          <h2 className="text-2xl font-semibold mb-4">{t.checkYourEmail}</h2>
          <p className="text-gray-600">{t.linkSentMessage}</p>
        </div>
      )}
    </div>
  );
}
