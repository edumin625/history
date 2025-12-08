'use client';
import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/atoms';
import TailInput from '@/components/TailInput';
import TailButton from '@/components/TailButton';

export default function Home() {
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Listen for auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // If login is successful, session object exists
        setUser(session);
      }
    );

    // Cleanup function
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser]);

  // Redirect if user is logged in
  useEffect(() => {
    if (user) {
      router.push('/history');
    }
  }, [user, router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('로그인에 실패했습니다: ' + error.message);
      }
      // The onAuthStateChange listener will handle the successful login and redirection
    } catch (err) {
      console.log(err);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert('회원가입에 실패했습니다: ' + error.message);
      } else {
        alert('회원가입 성공! 이메일을 확인하여 인증을 완료해주세요.');
      }
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              로그인
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  이메일 주소
                </label>
                <TailInput
                  type="email"
                  name="email"
                  id="email"
                  placeholder="이메일 입력"
                  ref={emailRef}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  비밀번호
                </label>
                <TailInput
                  type="password"
                  name="password"
                  id="password"
                  placeholder="비밀번호 입력"
                  ref={passwordRef}
                />
              </div>
              <div className="flex gap-4">
                <TailButton
                  type="submit"
                  color="blue"
                  caption={loading ? '로그인 중...' : '로그인'}
                  onHandle={() => {}}
                />
                <TailButton
                  type="button"
                  color="orange"
                  caption="회원가입"
                  onHandle={handleSignUp}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}