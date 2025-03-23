export interface Character {
  id: string;
  storyId: string;
  name: string;
  gender: string;
  age: number;
  origin: string;
  education: string;
  career: string;
  personality: string;
  relationships: Relationship[];
}

interface Relationship {
  characterId: string;
  type: string;
}