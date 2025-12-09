'use client'
import { useRef, useState, useTransition } from "react";
import { supabase } from "@/supabase/client";
import { useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/atoms';
import { useRouter } from 'next/navigation';
import TailInput from "@/components/TailInput";
import TailButton from "@/components/TailButton";
import { generateHistory } from "./actions";

import ReactMarkdown from 'react-markdown';

export default function HistoryPage() {
  const setUser = useSetAtom(userAtom);
  const [summary, setSummary] = useState('');
  const txt1Ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  }

  const handleSearch = async () => {
    const region = txt1Ref.current?.value;
    if (!region) {
      alert('검색할 지역명을 입력해주세요.');
      return;
    }

    startTransition(async () => {
      const result = await generateHistory(region);
      if (result.ok && result.data) {
        setSummary(result.data);
      } else {
        alert(result.error || 'An unexpected error occurred.');
        setSummary('');
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <div className="w-full flex flex-col justify-center items-center bg-blue-600">
        <div  className="w-40">
          <TailButton
            type="button"
            color="blue"
            caption="로그아웃"
            onHandle={handleLogout}
          />
        </div>
        <div className="w-full flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">
            역사로 떠나는 <span className="text-white">시간 여행</span>
          </h1>
          <p className="text-blue-200 text-sm mb-8 font-light max-w-2xl">
            도시의 이름을 입력하고 과거의 숨겨진 이야기와 역사적 순간들을 현대적인 시각으로 탐험해보세요.
          </p>
          <div className="w-full max-w-xl flex items-center gap-2">
            <div className="grow">
              <TailInput
                type="text"
                name="txt1"
                id="txt1"
                placeholder="예: 흰여울 마을, 40계단, 태종대 ..."
                ref={txt1Ref}
              />
            </div>
            <div className="w-28 shrink-0">
              <TailButton
                type="button"
                color="blue"
                caption={isPending ? '검색중...' : '검색'}
                onHandle={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
        {isPending && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        {summary && !isPending && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden my-4">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">검색 결과: {txt1Ref.current?.value}</h2>
              <div className="text-sm text-gray-600">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
