'use client'

import Link from 'next/link'

export default function BackNav() {
  return (
    <div className="fixed top-0 left-0 z-50 pointer-events-none">
      {/* 좌상단만 부드럽게 눌러주는 장막.
          스크롤로 본문이 지나가거나 밝은 배경(종이·달·수증기)이 깔려도
          '← 적바림'이 항상 그 위에서 읽히도록 한다. 경계 없이 사라지는 radial이라
          어두운 씬에서는 존재가 드러나지 않는다. */}
      <div
        aria-hidden
        className="absolute top-0 left-0 w-[220px] h-[130px]"
        style={{
          background:
            'radial-gradient(110px 68px at 50px 38px, rgba(10,9,8,0.9) 0%, rgba(10,9,8,0.62) 40%, rgba(10,9,8,0.22) 64%, rgba(10,9,8,0) 82%)',
        }}
      />

      <Link
        href="/"
        aria-label="목록으로 돌아가기"
        className="group pointer-events-auto absolute top-4 left-4 md:top-6 md:left-6 inline-flex items-center gap-2 p-2 rounded text-[11px] tracking-[0.35em] text-[#f0ede8] opacity-70 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f0ede8]/40 transition-opacity duration-300"
        style={{ textShadow: '0 1px 8px rgba(10,9,8,0.95), 0 0 22px rgba(10,9,8,0.85)' }}
      >
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
        >
          ←
        </span>
        적바림
      </Link>
    </div>
  )
}
