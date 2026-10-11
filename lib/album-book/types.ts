export interface BoardMember {
  id: string;
  full_name: string;
  birth_year: number | null;
  death_year: number | null;
  rarity: "common" | "rare" | "epic" | "legendary";
  imageUrl: string;
  page_id: string | null;
  slot: number | null;
}

export interface BoardPage {
  id: string;
  page_number: number;
  title: string | null;
  slots: number;
}

export type BookStatus = "idle" | "dragging" | "turning";
export type BookMode = "edit" | "readonly";

export interface BookState {
  position: number;
  status: BookStatus;
}

export type BookAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GOTO"; position: number }
  | { type: "DRAG_START" }
  | { type: "DRAG_END"; position: number }
  | { type: "SETTLED" };

export interface FaceLayout {
  cols: number;
  rows: number;
  slots: number[];
}

export interface AlbumBookProps {
  title: string;
  pages: BoardPage[];
  members: BoardMember[];
  mode?: BookMode;
  isPublic?: boolean;
  shareUrl?: string;
  albumId?: string;
  initialPosition?: number;
}
