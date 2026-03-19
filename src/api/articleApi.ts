import axiosInstance from './axiosInstance';
import type { ApiResponse, Article, ArticleParams, PaginationResponse } from '@/types';

// ==================== REQUEST TYPES ====================

export interface DiagramDetail {
  caption?: string;
  sortOrder?: number;
}

/** Used for Create Article (POST /articles) and Save Draft (POST /articles/draft) */
export interface CreateArticleRequest {
  title: string;
  contentBody: string;
  topicId: number;
  diagrams?: File[] | Blob[];
  diagramDetails?: DiagramDetail[];
}

/** Used for Update Article (PUT /articles/:id) */
export interface ExistingDiagramUpdate {
  diagramId: number;
  caption?: string;
  sortOrder?: number;
}

export interface UpdateArticleRequest {
  title?: string;
  contentBody?: string;
  /** Update caption/sortOrder of diagrams that already belong to the article */
  existingDiagrams?: ExistingDiagramUpdate[];
  /** IDs of diagrams to delete from Cloudinary + DB */
  deleteDiagramIds?: number[];
  /** New image files to upload */
  newDiagrams?: File[];
}

// ==================== HELPERS ====================

/** Build FormData for Create / Save-Draft */
const buildCreateFormData = (data: CreateArticleRequest): FormData => {
  const fd = new FormData();
  fd.append('title', data.title);
  fd.append('contentBody', data.contentBody);
  fd.append('topicId', data.topicId.toString());

  if (data.diagrams) {
    data.diagrams.forEach((file) => fd.append('diagrams', file));
  }
  if (data.diagramDetails) {
    data.diagramDetails.forEach((detail, i) => {
      if (detail.caption !== undefined)
        fd.append(`diagramDetails[${i}].caption`, detail.caption);
      if (detail.sortOrder !== undefined)
        fd.append(`diagramDetails[${i}].sortOrder`, detail.sortOrder.toString());
    });
  }
  return fd;
};

/** Build FormData for Update Article */
const buildUpdateFormData = (data: UpdateArticleRequest): FormData => {
  const fd = new FormData();
  if (data.title !== undefined) fd.append('title', data.title);
  if (data.contentBody !== undefined) fd.append('contentBody', data.contentBody);

  if (data.existingDiagrams) {
    data.existingDiagrams.forEach((d, i) => {
      fd.append(`existingDiagrams[${i}].diagramId`, d.diagramId.toString());
      if (d.caption !== undefined)
        fd.append(`existingDiagrams[${i}].caption`, d.caption);
      if (d.sortOrder !== undefined)
        fd.append(`existingDiagrams[${i}].sortOrder`, d.sortOrder.toString());
    });
  }

  if (data.deleteDiagramIds) {
    data.deleteDiagramIds.forEach((id, i) =>
      fd.append(`deleteDiagramIds[${i}]`, id.toString()),
    );
  }

  if (data.newDiagrams) {
    data.newDiagrams.forEach((file) => fd.append('newDiagrams', file));
  }

  return fd;
};

const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } };

// ==================== API CALLS ====================
export const articleApi = {
  // GET all articles (public / student sees only APPROVED)
  getAll: async (params: ArticleParams): Promise<PaginationResponse<Article>> => {
    const { page = 1, pageSize, keyword, sort, direction, ...rest } = params;
    const res = await axiosInstance.get<ApiResponse<PaginationResponse<Article>>>(
      '/api/v1/articles',
      {
        params: {
          ...rest,
          page: page - 1,
          size: pageSize,
          keyword,
          sort,
          direction,
        },
      },
    );
    return res.data.data;
  },

  // GET article by ID
  getById: async (id: number): Promise<Article> => {
    const res = await axiosInstance.get<ApiResponse<Article>>(`/api/v1/articles/${id}`);
    return res.data.data;
  },

  // GET my articles (lecture / student)
  getMyArticles: async (params: ArticleParams): Promise<PaginationResponse<Article>> => {
    const { page = 1, pageSize, keyword, sort, direction, ...rest } = params;
    const res = await axiosInstance.get<ApiResponse<PaginationResponse<Article>>>(
      '/api/v1/articles/my',
      { params: { ...rest, page: page - 1, size: pageSize, keyword, sort, direction } },
    );
    return res.data.data;
  },

  // POST create article (status → PENDING)
  create: async (data: CreateArticleRequest): Promise<Article> => {
    const res = await axiosInstance.post<ApiResponse<Article>>(
      '/api/v1/articles',
      buildCreateFormData(data),
      MULTIPART,
    );
    return res.data.data;
  },

  // POST save draft (status → DRAFT)
  saveDraft: async (data: CreateArticleRequest): Promise<Article> => {
    const res = await axiosInstance.post<ApiResponse<Article>>(
      '/api/v1/articles/draft',
      buildCreateFormData(data),
      MULTIPART,
    );
    return res.data.data;
  },

  // PUT update article (PENDING or REJECTED → PENDING)
  update: async (id: number, data: UpdateArticleRequest): Promise<Article> => {
    const res = await axiosInstance.put<ApiResponse<Article>>(
      `/api/v1/articles/${id}`,
      buildUpdateFormData(data),
      MULTIPART,
    );
    return res.data.data;
  },

  // PUT submit draft for review (DRAFT → PENDING)
  submitArticle: async (id: number): Promise<Article> => {
    const res = await axiosInstance.put<ApiResponse<Article>>(
      `/api/v1/articles/${id}/submit`,
    );
    return res.data.data;
  },

  // DELETE article
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/v1/articles/${id}`);
  },

  // PUT restore article (admin)
  restore: async (id: number): Promise<Article> => {
    const res = await axiosInstance.put<ApiResponse<Article>>(
      `/api/v1/articles/${id}/restore`,
    );
    return res.data.data;
  },

  // PUT approve article (admin/lecture)
  approve: async (id: number): Promise<Article> => {
    const res = await axiosInstance.put<ApiResponse<Article>>(
      `/api/v1/articles/${id}/approve`,
    );
    return res.data.data;
  },

  // PUT reject article (admin/lecture)
  reject: async (id: number, reason?: string): Promise<Article> => {
    const res = await axiosInstance.put<ApiResponse<Article>>(
      `/api/v1/articles/${id}/reject`,
      reason ? { reason } : undefined,
    );
    return res.data.data;
  },
};
