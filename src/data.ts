export interface Cut {
  id: string;
  videoUrl?: string;
  title: string;
}

export interface Zone {
  id: string;
  name: string;
  story: string;
  cellImage: string;
  cuts: Cut[];
}

export interface Team {
  id: number;
  name: string;
  zones: Zone[];
}

export const cellCharacters = [
  { id: 1, name: '친화력세포', story: '먼저 다가가고 친해지는 걸 좋아해요!', mission: '다른 팀원 3명과 하이파이브 영상 찍기!', img: '/characters/cell_1.png' },
  { id: 2, name: '낯가림세포', story: '낯선 사람 앞엔 숨고 싶지만 마음은 착해요!', mission: '조용히 구석에서 손가락 하트 영상 찍기!', img: '/characters/cell_2.png' },
  { id: 3, name: '열정세포', story: '시간이 지날수록 파워가 폭발해요!', mission: '구역원 다같이 파이팅 외치는 영상 찍기!', img: '/characters/cell_3.png' },
  { id: 4, name: '웃음세포', story: '분위기를 즐겁게 만들어요!', mission: '가장 환하게 웃는 5컷 릴레이 영상 찍기!', img: '/characters/cell_4.png' },
  { id: 5, name: '단합세포', story: '사람들이 모이면 더 강해져요!', mission: '구역원 전원이 한 프레임에 모여 하트 만들기!', img: '/characters/cell_5.png' },
  { id: 6, name: '눈치세포', story: '지금 이 타이밍 놓치지 않아!', mission: '타이밍 맞춰서 동시에 점프하는 영상 찍기!', img: '/characters/cell_6.png' },
  { id: 7, name: '귀차니즘세포', story: '움직이기 싫어... 중요한 순간엔 일어나요!', mission: '누워있다가 갑자기 벌떡 일어나는 반전 영상 찍기!', img: '/characters/cell_7.png' },
  { id: 8, name: '셋로그세포', story: '사진 각도에 진심! 기록을 예쁘게 남겨요!', mission: '제일 독특한 각도로 구역원 촬영하기!', img: '/characters/cell_8.png' },
  { id: 9, name: '배려세포', story: '누구보다 먼저 챙기는 따뜻한 마음!', mission: '옆 사람 안마해주는 훈훈한 영상 찍기!', img: '/characters/cell_9.png' },
  { id: 10, name: '승부욕세포', story: '1등만 보여요! 끝까지 포기하지 않아요!', mission: '가위바위보 이길 때까지 도전하는 영상 찍기!', img: '/characters/cell_10.png' },
];

const generateCuts = (zoneId: string) => {
  return Array.from({ length: 5 }).map((_, i) => ({
    id: `${zoneId}-cut-${i + 1}`,
    videoUrl: '',
    title: `Cut ${i + 1}`,
  }));
};

const generateZones = (teamId: number, count: number) => {
  return Array.from({ length: count }).map((_, i) => {
    const character = cellCharacters[i % cellCharacters.length];
    return {
      id: `${teamId}-${i + 1}`,
      name: `${teamId}-${i + 1}구역 (${character.name})`,
      story: character.story,
      cellImage: character.img,
      cuts: generateCuts(`${teamId}-${i + 1}`),
    };
  });
};

export const teamsData: Team[] = [
  { id: 1, name: '1팀', zones: generateZones(1, 6) },
  { id: 2, name: '2팀', zones: generateZones(2, 5) },
  { id: 3, name: '3팀', zones: generateZones(3, 5) },
  { id: 4, name: '4팀', zones: generateZones(4, 5) },
  { id: 5, name: '5팀', zones: generateZones(5, 5) },
];
