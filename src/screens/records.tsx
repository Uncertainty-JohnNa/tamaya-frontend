import { useState } from 'react';
import { StatusBar, TabBar } from '../components/primitives';
import { useNav } from '../lib/router';
import { useStore } from '../lib/store';

// 14-17 · Calendar / Diary detail / Stats / Insights

export const S14_Calendar = () => {
  const nav = useNav();
  const { state } = useStore();
  const [picker, setPicker] = useState<number | null>(null);
  const [localMoods, setLocalMoods] = useState<Record<number, string>>({});
  return (
  <div className="phone-inner">
    <StatusBar mode="day" time="11:08 AM" />
    <div style={{ padding: '46px 18px 88px' }}>
      <div className="h-title">달력</div>
      <div className="tiny">감정의 흐름을 한 눈에</div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 14,
        }}
      >
        <span style={{ fontFamily: 'Caveat', fontSize: 22 }}>‹</span>
        <div className="h-section">2026 · 5월</div>
        <span style={{ fontFamily: 'Caveat', fontSize: 22 }}>›</span>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginTop: 8, gap: 2 }}
      >
        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
          <div
            key={i}
            className="tiny"
            style={{
              textAlign: 'center',
              color: i === 0 ? '#8c4a1f' : i === 6 ? '#5a3a22' : '#7a5634',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="hbox r-l" style={{ padding: 10, marginTop: 6 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 4;
            if (day < 1 || day > 31)
              return (
                <div key={i} className="cal-cell off">
                  ·
                </div>
              );
            const moodMap: Record<number, string> = {
              2: '😌',
              3: '😊',
              5: '😣',
              7: '😊',
              9: '😌',
              10: '😢',
              12: '😊',
              13: '😌',
              15: '😡',
              16: '😣',
              18: '😌',
              19: '😊',
              20: '😊',
              21: '😌',
              22: '😣',
              23: '😊',
              24: '😌',
              25: '😣',
              26: '😣',
            };
            // local in-session moods overlay on top of the default map
            const mood = localMoods[day] ?? moodMap[day];
            const today = day === 27;
            return (
              <div
                key={i}
                onClick={() => (mood ? nav.go('diary-detail') : setPicker(day))}
                style={{
                  aspectRatio: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                {mood ? (
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      border: today ? '2px solid #8c4a1f' : '1.5px solid #3a2414',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: today ? '#ead0a6' : '#fff',
                      fontSize: 14,
                    }}
                  >
                    {mood}
                  </div>
                ) : (
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      border: '1px dashed #c9a877',
                      borderRadius: '50%',
                    }}
                  />
                )}
                <span
                  className="tiny"
                  style={{ fontSize: 9, marginTop: 1, fontWeight: today ? 700 : 400 }}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          marginTop: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {(
          [
            ['😌', '평온', 8],
            ['😊', '기쁨', 6],
            ['😣', '피곤', 4],
            ['😢', '슬픔', 1],
            ['😡', '짜증', 1],
          ] as [string, string, number][]
        ).map(([e, n, c], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>{e}</span>
            <span className="tiny">
              {n} ×{c}
            </span>
          </div>
        ))}
      </div>

      <div
        className="hbox r-r"
        onClick={() => nav.go('diary-detail')}
        style={{ padding: 12, marginTop: 12, cursor: 'pointer' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div className="h-section">5월 26일</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 20 }}>😣</span>
              <span style={{ fontFamily: 'Patrick Hand', fontWeight: 700 }}>
                피곤 · 차분 · 뿌듯
              </span>
            </div>
          </div>
          <span style={{ fontFamily: 'Caveat', fontSize: 22 }}>›</span>
        </div>
        <div className="tiny" style={{ marginTop: 6 }}>
          "긴 회의로 피곤했고, 끝난 뒤에 숨 돌릴 5분이..."
        </div>
      </div>

      <div className="tiny" style={{ marginTop: 8, textAlign: 'center', color: '#7a5634' }}>
        ※ 점선 동그라미 = 기록 없음 — 탭해서 빠르게 감정 추가
      </div>

      {state.diaries.length > 0 && (
        <div className="tiny" style={{ marginTop: 4, textAlign: 'center', color: '#8c4a1f' }}>
          이번 세션 저장된 일기 {state.diaries.length}건 (Lv.{state.level} · 🔥 {state.streak}일)
        </div>
      )}
    </div>

    {picker !== null && (
      <div
        onClick={() => setPicker(null)}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(26,26,26,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#f5e6cf',
            border: '2px solid #3a2414',
            borderRadius: 16,
            padding: 18,
            width: '78%',
            textAlign: 'center',
            boxShadow: '4px 6px 0 rgba(0,0,0,0.25)',
          }}
        >
          <div className="h-section">5월 {picker}일 감정</div>
          <div className="h-title" style={{ fontSize: 18, marginTop: 2 }}>한 단어로 표현하면?</div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginTop: 14,
              fontSize: 28,
            }}
          >
            {['😌', '😊', '😣', '😢', '😡'].map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => {
                  setLocalMoods((m) => ({ ...m, [picker]: e }));
                  setPicker(null);
                }}
                style={{
                  width: 48,
                  height: 48,
                  border: '1.5px solid #3a2414',
                  borderRadius: '50%',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: 22,
                  fontFamily: 'inherit',
                }}
              >
                {e}
              </button>
            ))}
          </div>
          <div
            className="tiny"
            style={{ marginTop: 14, cursor: 'pointer', color: '#7a5634' }}
            onClick={() => setPicker(null)}
          >
            닫기
          </div>
        </div>
      </div>
    )}

    <TabBar active="cal" onHome={() => nav.go('home-night')} />
  </div>
  );
};

export const S15_DiaryDetail = () => {
  const nav = useNav();
  return (
  <div className="phone-inner">
    <StatusBar mode="day" time="11:12 AM" />
    <div style={{ padding: '46px 18px 24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{ fontFamily: 'Caveat', fontSize: 22, cursor: 'pointer' }}
            onClick={() => nav.back()}
          >
            ‹
          </span>
          <div className="h-section">달력 / 5월 26일</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="tiny">✎</span>
          <span className="tiny">⋮</span>
        </div>
      </div>

      <div className="h-display" style={{ marginTop: 8, fontSize: 32 }}>
        화요일 — 긴 하루
      </div>

      <div className="hbox r-l" style={{ padding: 12, marginTop: 14 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 22 }}>😣</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Patrick Hand', fontWeight: 700 }}>
              피곤 · 차분 · 뿌듯
            </div>
            <div className="tiny">5턴 대화로 작성 · 22:31</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          <div
            style={{
              flex: 45,
              height: 8,
              background: '#ead0a6',
              border: '1.5px solid #3a2414',
            }}
          />
          <div
            style={{
              flex: 30,
              height: 8,
              background: '#d8a777',
              border: '1.5px solid #3a2414',
            }}
          />
          <div
            style={{
              flex: 25,
              height: 8,
              background: '#fff',
              border: '1.5px solid #3a2414',
            }}
          />
        </div>
      </div>

      <div
        className="hbox r-r"
        style={{ padding: 16, marginTop: 12, background: '#fff5e1' }}
      >
        <div className="handwriting" style={{ fontSize: 18, lineHeight: 1.6 }}>
          5월 26일. 점심으로 우동 한 그릇이 위로였다.
          <br />
          긴 회의로 피곤했고, 끝난 뒤에 숨 돌릴 5분이
          <br />
          없었던 게 가장 무거웠다.
          <br />
          <br />
          내일은 일정 사이에 3분의 틈을 만들어보기로 했다.
        </div>
      </div>

      <div className="h-label" style={{ marginTop: 14, marginBottom: 6 }}>
        키워드
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['긴 회의', '우동', '피곤', '5분이 없음', '3분 호흡'].map((t, i) => (
          <span key={i} className="chip dashed">
            #{t}
          </span>
        ))}
      </div>

      <div className="hbox r-l" style={{ padding: 12, marginTop: 14 }}>
        <div className="h-section">그날의 체크</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 6,
            marginTop: 8,
          }}
        >
          {(
            [
              ['🍚', true],
              ['💧', true],
              ['😴', false],
              ['🚶', false],
              ['☼', true],
            ] as [string, boolean][]
          ).map(([ic, on], i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div
                className="ph-square"
                style={{
                  width: 38,
                  height: 38,
                  margin: '0 auto',
                  background: on ? '#3a2414' : '#f5e6cf',
                  color: on ? '#f5e6cf' : '#3a2414',
                }}
              >
                {ic}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="hbox dashed"
        style={{
          padding: 10,
          marginTop: 10,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <div className="check on">✓</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Patrick Hand', fontWeight: 700 }}>
            내일 한 가지 — 3분 호흡
          </div>
          <div className="tiny">5월 27일에 알람으로 추가됨</div>
        </div>
      </div>
    </div>
  </div>
  );
};

export const S16_Stats = () => {
  const nav = useNav();
  return (
  <div className="phone-inner">
    <StatusBar mode="day" time="11:18 AM" />
    <div style={{ padding: '46px 18px 88px' }}>
      <div className="h-title">통계</div>
      <div className="tiny">기록의 모양을 봐요</div>

      <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
        <span className="chip solid">주</span>
        <span className="chip">월</span>
        <span className="chip">전체</span>
      </div>

      <div className="hbox r-l" style={{ padding: 14, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <div className="h-display" style={{ fontSize: 56 }}>
            5
          </div>
          <div>
            <div style={{ fontFamily: 'Patrick Hand', fontWeight: 700 }}>/ 7 일</div>
            <div className="tiny squiggle">D30 목표 60% 진행중</div>
          </div>
        </div>
        <div className="bar" style={{ marginTop: 10 }}>
          <i style={{ width: '71%' }} />
        </div>
      </div>

      <div className="hbox r-r" style={{ padding: 14, marginTop: 12 }}>
        <div className="h-section">요일별 작성</div>
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-end',
            height: 110,
            marginTop: 10,
          }}
        >
          {(
            [
              ['일', 20],
              ['월', 60],
              ['화', 80],
              ['수', 40],
              ['목', 70],
              ['금', 55],
              ['토', 0],
            ] as [string, number][]
          ).map(([d, h], i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  height: h,
                  width: 22,
                  background: h > 0 ? '#8c4a1f' : '#f5e6cf',
                  border: '1.5px solid #3a2414',
                  borderRadius: 4,
                }}
              />
              <span className="tiny">{d}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hbox r-l" style={{ padding: 14, marginTop: 12 }}>
        <div className="h-section">감정 분포</div>
        <div
          style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          {(
            [
              ['😌 평온', 45, '#ead0a6'],
              ['😊 기쁨', 25, '#c9a266'],
              ['😣 피곤', 20, '#d8a777'],
              ['😢 슬픔', 7, '#fff'],
              ['😡 짜증', 3, '#fff5e1'],
            ] as [string, number, string][]
          ).map(([n, p, c], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'Patrick Hand', fontSize: 13, width: 64 }}>{n}</span>
              <div className="bar" style={{ flex: 1 }}>
                <i style={{ width: p + '%', background: c }} />
              </div>
              <span className="tiny" style={{ width: 30, textAlign: 'right' }}>
                {p}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="hbox r-r" style={{ padding: 14, marginTop: 12 }}>
        <div className="h-section">라이프스타일</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            marginTop: 8,
          }}
        >
          {(
            [
              ['🍚 식사', '17/21', '정시 ↑'],
              ['😴 수면', '6.4h', '부족 ↓'],
              ['🚶 운동', '3/7', '보통'],
            ] as [string, string, string][]
          ).map(([t, v, s], i) => (
            <div
              key={i}
              className="hbox dashed"
              style={{ padding: 8, textAlign: 'center' }}
            >
              <div className="tiny">{t}</div>
              <div
                style={{
                  fontFamily: 'Caveat',
                  fontWeight: 700,
                  fontSize: 20,
                  marginTop: 2,
                }}
              >
                {v}
              </div>
              <div className="tiny">{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <TabBar active="stat" onHome={() => nav.go('home-night')} />
  </div>
  );
};

export const S17_Insights = () => {
  const nav = useNav();
  return (
  <div className="phone-inner">
    <StatusBar mode="day" time="11:22 AM" />
    <div style={{ padding: '46px 18px 88px' }}>
      <div className="h-title">인사이트</div>
      <div className="tiny">이음이가 정리해준 이번 주</div>

      <div className="hbox night r-l" style={{ padding: 16, marginTop: 14 }}>
        <div className="h-section" style={{ color: '#d8a777' }}>
          이번 주 메인 패턴
        </div>
        <div
          className="h-title"
          style={{ color: '#f5e6cf', fontSize: 22, marginTop: 4 }}
        >
          "5분의 틈"이 있던 날엔
          <br />
          피곤이 절반이었어 ⌇
        </div>
        <div
          className="handwriting"
          style={{ color: '#d8a777', fontSize: 16, marginTop: 8 }}
        >
          회의 사이 짧은 호흡을 한 화·목요일에는 평온함이
          <br />두 배 많았어요. 같은 패턴, 다음 주에도 ?
        </div>
      </div>

      <div className="h-label" style={{ marginTop: 14, marginBottom: 6 }}>
        이번 주 발견
      </div>
      {(
        [
          ['☼', '햇볕 쐰 날 = 잠 더 푹', '3일 중 3일 "푹잠"으로 기록'],
          ['🍜', '따뜻한 점심 → 오후 평온', '우동·죽 먹은 날 피곤 ↓'],
          ['😴', '수면 6h 미만 = 짜증 ↑', '지난 7일 중 2번 발생'],
        ] as [string, string, string][]
      ).map(([ic, t, s], i) => (
        <div
          key={i}
          className={'hbox ' + (i % 2 ? 'r-l' : 'r-r')}
          style={{
            padding: 12,
            marginTop: 8,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <div className="ph-circle" style={{ width: 36, height: 36, flex: 'none' }}>
            {ic}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Patrick Hand', fontWeight: 700 }}>{t}</div>
            <div className="tiny">{s}</div>
          </div>
          <span className="tiny" style={{ color: '#8c4a1f' }}>
            ✦
          </span>
        </div>
      ))}

      <div className="hbox accent r-l" style={{ padding: 14, marginTop: 14 }}>
        <div className="h-section">이번 주 추천 루틴</div>
        <div className="h-title" style={{ fontSize: 18, marginTop: 4 }}>
          회의 끝 · 3분 호흡 알람
        </div>
        <div className="tiny" style={{ marginTop: 4 }}>
          패턴 기반 추천 · 알람으로 추가하기
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <span className="chip" style={{ background: '#f5e6cf' }}>
            나중에
          </span>
          <span className="chip ink">✓ 추가</span>
        </div>
      </div>

      <div className="sticky" style={{ marginTop: 14, transform: 'rotate(-1.5deg)' }}>
        ※ D7+에 더 깊은 패턴 — 꾸준히 모일수록 정확해져요
      </div>
    </div>
    <TabBar active="ins" onHome={() => nav.go('home-night')} />
  </div>
  );
};
