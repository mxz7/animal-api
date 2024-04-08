// api/types
export type Types = {
  type: string;
  count: number;
}[];

// api/[type]/random api/[type]/[id]
export type Image = {
  id: string;
  name: string | null;
  type: string;
  likes: number;
  reports: number;
  url: string;
  image: string;
};

// api/[type]/count
export type Count = {
  count: number;
  type: string;
};

// api/[type]/all
export type All = {
  id: string;
  type: string;
  name: string | null;
  likes: number;
  reports: number;
  url: string;
  image: string;
}[];
