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

const placeholderCells = [
  '/cell_love_1777374680711.png',
  '/cell_anger_1777374698408.png',
  '/cell_hunger_1777374711546.png',
  '/cell_joy_1777374728744.png',
  '/cell_love_1777374680711.png', // reusing for the 5th
];

const stories = [
  '사랑 세포의 두근두근 첫 만남',
  '분노 세포의 폭발 1초 전',
  '출출 세포의 야식 타임',
  '기쁨 세포의 댄스 파티',
  '이성 세포의 냉철한 판단',
  '불안 세포의 떨리는 순간',
];

const generateCuts = (zoneId: string) => {
  return Array.from({ length: 5 }).map((_, i) => ({
    id: `${zoneId}-cut-${i + 1}`,
    videoUrl: '',
    title: `Cut ${i + 1}`,
  }));
};

const generateZones = (teamId: number, count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${teamId}-${i + 1}`,
    name: `${teamId}-${i + 1}구역`,
    story: stories[i % stories.length],
    cellImage: placeholderCells[i % placeholderCells.length],
    cuts: generateCuts(`${teamId}-${i + 1}`),
  }));
};

export const teamsData: Team[] = [
  { id: 1, name: '1팀', zones: generateZones(1, 6) },
  { id: 2, name: '2팀', zones: generateZones(2, 5) },
  { id: 3, name: '3팀', zones: generateZones(3, 5) },
  { id: 4, name: '4팀', zones: generateZones(4, 5) },
  { id: 5, name: '5팀', zones: generateZones(5, 5) },
];
