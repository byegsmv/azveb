export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "CLIENT" | "ADMIN" | "EDITOR";
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | "CANCELLED";
  clientId: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  isActive: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  tags: string[];
  imageUrl: string | null;
  published: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
