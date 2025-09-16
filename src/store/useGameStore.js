import { create } from "zustand";

const STORAGE_KEY = "clearedPieces";

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (arr) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch {}
};

const useGameStore = create((set, get) => ({
  // 1~7 (1-based)로 저장
  clearedPieces: load(),

  clearGame: (pieceId) =>
    set((state) => {
      const id = Number(pieceId); // 방어
      if (state.clearedPieces.includes(id)) return state;
      const next = [...state.clearedPieces, id];
      save(next);
      return { clearedPieces: next };
    }),

  resetGame: () => {
    save([]);
    set({ clearedPieces: [] });
  },
}));

export default useGameStore;
