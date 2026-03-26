export interface Tag {
  id: number,
  name: string,
  slug?: string,
}


export interface TagDetail extends Tag {
  slug: string;
  movieCount: number;
  viewCount: number;
  createdAt: string;
  updateAt?: string;
}

export interface TagStats {
  totalTags: number;
  mostPopularTag: {name: string; movieCount: number};
  hotTag: {name: string; movieCount: number};
  latestTag: {name: string; createdAt: string};
}

export type CreateTagRequest = Pick<TagDetail, 'name' | 'slug'>;
export type UpdateTagRequest = Partial<CreateTagRequest>;