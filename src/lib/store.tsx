import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';

// In-memory app state with localStorage persistence. No backend — every
// "AI reply" is local simulation. Resets to defaults on first load.

export type Personality = '차분한' | '수다쟁이' | '시크' | '다정한' | '장난꾸러기';
export type CatColor = '#f5e6cf' | '#d8a777' | '#a66838' | '#6b3e1f' | '#3a2414';
export type Mood = '😌' | '😊' | '😣' | '😢' | '😡';

export type ChatMsg = {
  role: 'bot' | 'user';
  text: string;
  hint?: string;
  chips?: string[];
};

export type DiaryEntry = {
  day: number;            // 1..31 of current month for the prototype
  moods: Mood[];           // primary + secondary feelings
  keywords: string[];
  body: string;            // generated diary
  check: Partial<Record<DailyKey, boolean>>;
  tomorrow?: string;
  createdAt: number;
};

export type DailyKey = 'food' | 'water' | 'sleep' | 'movement' | 'sun';

export type State = {
  character: { name: string; color: CatColor; personalities: Personality[] };
  daily: {
    food: { done: boolean; picks: string[] };       // 아침/점심/저녁/간식
    water: number;                                   // 0..8
    sleep: { done: boolean; quality: string | null };
    movement: { done: boolean; bucket: string | null };
    sun: { done: boolean; level: string | null };
  };
  aiChat: ChatMsg[];
  chatDiary: ChatMsg[];
  diaries: DiaryEntry[];
  points: number;
  streak: number;
  level: number;
  unlockedItems: string[];
  equippedItem: string | null;
};

const today = new Date();

const DEFAULT_STATE: State = {
  character: { name: '이음이', color: '#a66838', personalities: ['다정한'] },
  daily: {
    food: { done: false, picks: [] },
    water: 0,
    sleep: { done: false, quality: null },
    movement: { done: false, bucket: null },
    sun: { done: false, level: null },
  },
  aiChat: [
    { role: 'bot', text: '안녕! 낮엔 내가 도와줄게.\n오늘 뭐 도와줄까?' },
  ],
  chatDiary: [],
  diaries: [],
  points: 240,
  streak: 12,
  level: 3,
  unlockedItems: ['🧣 스카프', '👕 줄무늬'],
  equippedItem: '👕 줄무늬',
};

type Action =
  | { type: 'character/set'; patch: Partial<State['character']> }
  | { type: 'daily/toggle-food'; pick: string }
  | { type: 'daily/water-set'; value: number }
  | { type: 'daily/sleep'; quality: string }
  | { type: 'daily/movement'; bucket: string }
  | { type: 'daily/sun'; level: string }
  | { type: 'ai-chat/append'; msg: ChatMsg }
  | { type: 'chat-diary/append'; msg: ChatMsg }
  | { type: 'chat-diary/reset' }
  | { type: 'diary/save'; entry: DiaryEntry }
  | { type: 'points/add'; delta: number }
  | { type: 'streak/inc' }
  | { type: 'item/equip'; item: string }
  | { type: 'item/unlock'; item: string }
  | { type: 'state/replace'; state: State };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'character/set':
      return { ...state, character: { ...state.character, ...action.patch } };
    case 'daily/toggle-food': {
      const has = state.daily.food.picks.includes(action.pick);
      const picks = has
        ? state.daily.food.picks.filter((p) => p !== action.pick)
        : [...state.daily.food.picks, action.pick];
      return {
        ...state,
        daily: {
          ...state.daily,
          food: { done: picks.length > 0, picks },
        },
      };
    }
    case 'daily/water-set':
      return {
        ...state,
        daily: { ...state.daily, water: Math.max(0, Math.min(8, action.value)) },
      };
    case 'daily/sleep':
      return {
        ...state,
        daily: {
          ...state.daily,
          sleep: { done: true, quality: action.quality },
        },
      };
    case 'daily/movement':
      return {
        ...state,
        daily: {
          ...state.daily,
          movement: { done: true, bucket: action.bucket },
        },
      };
    case 'daily/sun':
      return {
        ...state,
        daily: { ...state.daily, sun: { done: true, level: action.level } },
      };
    case 'ai-chat/append':
      return { ...state, aiChat: [...state.aiChat, action.msg] };
    case 'chat-diary/append':
      return { ...state, chatDiary: [...state.chatDiary, action.msg] };
    case 'chat-diary/reset':
      return { ...state, chatDiary: [] };
    case 'diary/save':
      return { ...state, diaries: [...state.diaries, action.entry] };
    case 'points/add':
      return { ...state, points: state.points + action.delta };
    case 'streak/inc':
      return { ...state, streak: state.streak + 1 };
    case 'item/equip':
      return { ...state, equippedItem: action.item };
    case 'item/unlock':
      return {
        ...state,
        unlockedItems: state.unlockedItems.includes(action.item)
          ? state.unlockedItems
          : [...state.unlockedItems, action.item],
      };
    case 'state/replace':
      return action.state;
    default:
      return state;
  }
}

const LS_KEY = 'tamaya-state-v1';

const StoreContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: DEFAULT_STATE, dispatch: () => undefined });

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE, (init) => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return { ...init, ...(JSON.parse(raw) as State) };
    } catch {
      // ignore parse errors
    }
    return init;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      // ignore quota
    }
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

// ── 봇 응답 시뮬레이션 helpers ─────────────────────────────────────────────

const AI_CHAT_REPLIES: { keywords: string[]; replies: string[] }[] = [
  {
    keywords: ['점심', '먹', '입맛', '배고'],
    replies: [
      '속이 편한 게 좋겠다.\n죽 한 그릇 어때? 따뜻한 우동도 좋고.',
      '오늘 같은 날엔 김밥+계란국 조합도 좋아.\n어떤 게 끌려?',
    ],
  },
  {
    keywords: ['잠', '졸려', '피곤', '수면'],
    replies: [
      '오늘 너무 무리한 거 아니야?\n10분만 눈 감고 천천히 숨 쉬어볼래?',
      '잠이 안 올 땐 따뜻한 물 한 잔이 도움돼.\n자기 전 화면도 잠깐 멀리해보자.',
    ],
  },
  {
    keywords: ['외로', '심심', '혼자'],
    replies: [
      '나 여기 있어 :)\n오늘 가장 좋았던 순간이 뭐였어?',
      '집이 너무 조용할 땐 작은 백색소음도 좋아.\n뭐가 듣고 싶어?',
    ],
  },
  {
    keywords: ['루틴', '추천', '뭐 할'],
    replies: [
      '딱 3분 호흡 알람 어때?\n회의 끝나고 강제로 쉬는 시간을 만들어보자.',
      '저녁에 10분 산책 추천 — 햇볕보다 더 잘 와닿을 거야.',
    ],
  },
];

const FALLBACK_AI_REPLIES = [
  '음… 그렇구나. 그래서 어떤 기분이야?',
  '천천히 말해줘. 내가 듣고 있어.',
  '오늘 점심 뭐 먹었어?\n이건 회고에 미리 적어둘게 ✎',
  '그 얘기, 밤 회고 시간에 한 번 더 꺼내볼까?',
];

export const simulateAiReply = (userText: string): ChatMsg => {
  const lower = userText.toLowerCase();
  for (const group of AI_CHAT_REPLIES) {
    if (group.keywords.some((k) => lower.includes(k))) {
      const text = group.replies[Math.floor(Math.random() * group.replies.length)];
      return { role: 'bot', text };
    }
  }
  const text =
    FALLBACK_AI_REPLIES[Math.floor(Math.random() * FALLBACK_AI_REPLIES.length)];
  return { role: 'bot', text };
};

// ── ChatDiary 5턴 시퀀스 ─────────────────────────────────────────────────

export const CHAT_DIARY_TURNS: { question: string; hint?: string }[] = [
  {
    question: '오늘 하루 어땠어? 한 단어로 표현하면?',
    hint: '↳ 가장 강하게 남은 감정 한 단어',
  },
  {
    question: '그 감정이 가장 컸던 순간은 언제였어?',
    hint: '↳ 시간·장소·상황을 떠올려봐',
  },
  {
    question: '그때 누구랑 있었어? 아니면 혼자였어?',
  },
  {
    question: '오늘 가장 다행이었던 일은?',
    hint: '↳ 작아도 좋아 — 우동 한 그릇 같은 것도',
  },
  {
    question: '내일은 어떤 한 가지를 해보고 싶어?',
    hint: '↳ 알람으로 추가할 수 있어',
  },
];

export const CHAT_DIARY_INTRO: ChatMsg = {
  role: 'bot',
  text: '오늘도 고생했어.\n천천히 같이 정리해볼까?',
};

export const todayDayNum = () => today.getDate();
