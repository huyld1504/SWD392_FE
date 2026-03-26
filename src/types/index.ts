// ==================== USER ====================
export type UserRole = 'STUDENT' | 'LECTURE' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED';

export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
}

// ==================== SUBJECT ====================
export interface Subject {
  subjectId: number;
  subjectCode: string;
  name: string;
  description?: string;
  deleted?: boolean;
}

// ==================== TOPIC ====================
export interface Topic {
   topicId: number;
  name: string;
  description?: string;
  subjectId: number;
  subjectName: string;
}

// ==================== ARTICLE ====================
export type ArticleStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Article {
  articleId: number;
  title: string;
  contentBody: string;
  status: ArticleStatus;
  author: {
    userId: number;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
  };
  approvedBy?: {
    userId: number;
    name: string;
  };
  topicId: number;
  topicName: string;
  subjectId?: number;
  subjectName?: string;
  createdAt: string;
  updatedAt?: string;
  approvedAt?: string;
  diagrams: Diagram[];
  comments?: Comment[];
  bookmarked?: boolean;
}

// ==================== DIAGRAM ====================
export interface Diagram {
  diagramId: number;
  imageUrl: string;
  caption?: string;
  sortOrder?: number;
}

// ==================== COMMENT ====================
export interface CommentUserInfo {
  userId: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface Comment {
  commentId: number;
  user: CommentUserInfo;
  content: string;
  ratingStar: number | null;
  isPinned: boolean;
  createdAt: string;
  replies: Comment[] | null;
}

export interface CommentParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

// ==================== WALLET ====================
export type WalletType = 'MAIN' | 'EARNED' | 'SYSTEM';
export type WalletStatus = 'ACTIVE' | 'LOCKED';

export interface Wallet {
  walletId: number;
  walletType: WalletType;
  balance: number;
  currency: string;
  status: WalletStatus;
  userId: number;
  createdAt: string;
}

// ==================== TRANSACTION ====================
export type TransactionType =
  | 'FEEDING'
  | 'DONATE'
  | 'RECEIVE_DONATE'
  | 'CREDIT'
  | 'DEBIT';

export interface Transaction {
  transactionId: number;
  transactionType: TransactionType;
  direction: 'IN' | 'OUT';
  amount: number;
  currency: string;
  sender?: {
      userId: number;
      name: string;
      email: string;
      avatarUrl?: string | null;
  };
  receiver?: {
      userId: number;
      name: string;
      email: string;
      avatarUrl?: string | null;
  };
  createdAt: string;
}

// ==================== FEEDING ====================
export type FeedingStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface FeedingPeriod {
  periodId: number;
  semesterCode: string;
  grantAmount: number;
  status: FeedingStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface FeedingPeriodDetail extends FeedingPeriod {
  semesterName: string;
  startDate: string;
  endDate: string;
  createdBy: {
    userId: number;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  totalUsersFed: number;
  totalCoinsFed: number;
  stats: {
    totalUsersFed: number;
    totalCoinsFed: number;
    pendingUsers: number;
    estimatedCoinsNeeded: number;
    systemWalletBalance: number;
    deficit: number;
  };
  users: Array<{
    feedingId: number;
    user: {
      userId: number;
      name: string;
      email: string;
      avatarUrl: string | null;
    };
    amountReceived: number;
    fedAt: string;
  }>;
}

  // ==================== DONATION ====================
export interface Donation {
  donationId: number;
  amount: number;
  message?: string;
  donor: User;
  receiver: User;
  article: Article;
  createdAt: string;
}

// ==================== BOOKMARK ====================
export interface Bookmark {
  bookmarkId: number;
  article: Article;
  createdAt: string;
}

// ==================== API RESPONSE ====================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  requestId: string;
  timestamp: string;
}

export interface PaginationResponse<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

// ==================== API PARAMS ====================
export interface PaginationParams {
  page?: number;     // 1-based on frontend, converted to 0-based before API call
  pageSize?: number; // maps to 'size' query param
  keyword?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface ArticleParams extends PaginationParams {
  status?: ArticleStatus;
  topicId?: number;
}

export interface SubjectParams extends PaginationParams {
  // no extra fields
}

export interface TopicParams extends PaginationParams {
  subjectId?: number;
}

export interface DonationParams {
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export interface WalletAdminParams {
  walletType?: WalletType;
  status?: WalletStatus;
  minBalance?: number;
  maxBalance?: number;
  page?: number;
  size?: number;
}

export interface WalletTransactionParams {
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export interface FeedingParams {
  semesterCode?: string;
  status?: FeedingStatus;
  page?: number;
  size?: number;
}

// ==================== SEMESTER ====================
export interface Semester {
  semesterCode: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
}

export interface SemesterParams extends PaginationParams {
  status?: string;
}

export interface SemesterLeaderboardEntry {
  userId: number;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  totalReceived: number;
  rank: number;
  donationCount?: number;
  approvedArticleCount?: number;
}

export interface BookmarkParams {
  keyword?: string;
  page?: number;    // 1-based on frontend
  pageSize?: number;
}
