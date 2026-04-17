/**
 * Directus CMS 数据模型类型定义
 * 基于修正后的Schema-First设计
 */

// ==================== 基础类型 ====================

/** ISO 639-1 语言代码 */
export type LanguageCode = 'en' | 'ar' | 'ru' | 'zh';

/** 货币代码 */
export type CurrencyCode = 'USD' | 'AED' | 'RUB' | 'CNY';

/** 文本方向 */
export type TextDirection = 'ltr' | 'rtl';

/** 询盘状态 */
export type InquiryStatus = 'new' | 'in_progress' | 'contacted' | 'closed';

/** 首选联系方式 */
export type ContactMethod = 'email' | 'phone' | 'whatsapp';

// ==================== 全局配置 ====================

export interface GlobalSettings {
  id: string;
  logo: string; // 图片ID或URL
  favicon: string;
  company_name: Record<LanguageCode, string>;
  contact_email: string;
  phone_numbers: Array<{
    country: string;
    code: string;
    number: string;
  }>;
  social_media_links: Record<string, string>;
  addresses: Array<{
    country: string;
    city: string;
    address: Record<LanguageCode, string>;
  }>;
  meta_tags: {
    default_title: string;
    default_description: string;
  };
  currency_settings: {
    primary: CurrencyCode;
    supported: CurrencyCode[];
  };
  language_settings: {
    default: LanguageCode;
    supported: LanguageCode[];
    rtl_languages: LanguageCode[];
  };
}

// ==================== 分类相关 ====================

/** 分类主表 - 仅非文本字段 */
export interface Category {
  id: string;
  slug: string;
  parent?: string | Category; // 自关联
  icon?: string;
  featured_image?: string;
  sort_order: number;
  is_active: boolean;
}

/** 分类翻译表 */
export interface CategoryTranslation {
  id: string;
  categories_id: string | Category;
  languages_code: LanguageCode;
  name: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
}

/** 包含翻译的完整分类类型 */
export interface CategoryWithTranslations extends Category {
  translations?: CategoryTranslation[];
}

// ==================== 产品相关 ====================

/** 产品主表 - 仅非文本字段 */
export interface Product {
  id: string;
  sku: string;
  slug: string;
  category: string | Category;
  main_image: string;
  gallery?: string[];
  dimensions: {
    length: number;
    width: number;
    thickness: number;
    unit: string;
  };
  technical_specifications: Record<string, string | boolean | number>;
  certifications?: string[];
  price_range: {
    currency: CurrencyCode;
    min: number;
    max: number;
    unit: string;
  };
  min_order_quantity: number;
  moq_unit: string;
  lead_time_days: number;
  packaging_details?: {
    pallet_size: string;
    pieces_per_pallet: number;
    weight_per_pallet: string;
  };
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  view_count: number;
  related_products?: string[] | Product[];
}

/** 产品翻译表 */
export interface ProductTranslation {
  id: string;
  products_id: string | Product;
  languages_code: LanguageCode;
  name: string;
  description?: string;
  material: string;
  features: string[];
  applications: string[];
  meta_title?: string;
  meta_description?: string;
}

/** 包含翻译的完整产品类型 */
export interface ProductWithTranslations extends Product {
  translations?: ProductTranslation[];
}

/** 产品列表项（简化版，用于列表展示） */
export interface ProductListItem {
  id: string;
  sku: string;
  slug: string;
  name: string;
  main_image: string;
  category_name: string;
  price_range: Product['price_range'];
  min_order_quantity: number;
  moq_unit: string;
  is_featured: boolean;
}

// ==================== 询盘相关 ====================

export interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  country: string;
  city?: string;
  product_id?: string | Product;
  product_sku?: string;
  quantity?: number;
  quantity_unit?: string;
  message: string;
  preferred_contact_method?: ContactMethod;
  language: LanguageCode;
  status: InquiryStatus;
  source_page?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

// ==================== 查询参数类型 ====================

/** 产品查询参数 */
export interface ProductQueryParams {
  limit?: number;
  offset?: number;
  sort?: string[];
  filter?: {
    category?: string;
    is_featured?: boolean;
    is_active?: boolean;
    search?: string;
    min_price?: number;
    max_price?: number;
  };
  language?: LanguageCode;
  fields?: string[];
}

/** 分类查询参数 */
export interface CategoryQueryParams {
  limit?: number;
  offset?: number;
  sort?: string[];
  filter?: {
    parent?: string | null;
    is_active?: boolean;
  };
  language?: LanguageCode;
  fields?: string[];
}

/** 询盘查询参数 */
export interface InquiryQueryParams {
  limit?: number;
  offset?: number;
  sort?: string[];
  filter?: {
    status?: InquiryStatus;
    product_id?: string;
    date_from?: string;
    date_to?: string;
  };
  fields?: string[];
}

// ==================== API响应类型 ====================

/** 分页响应 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total_count: number;
    filter_count: number;
  };
}

/** 单条数据响应 */
export interface SingleResponse<T> {
  data: T;
}

/** 错误响应 */
export interface ErrorResponse {
  errors: Array<{
    message: string;
    extensions?: {
      code: string;
    };
  }>;
}

// ==================== 表单数据类型 ====================

/** 询盘表单数据 */
export interface InquiryFormData {
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  country: string;
  city?: string;
  product_id?: string;
  product_sku?: string;
  quantity?: number;
  quantity_unit?: string;
  message: string;
  preferred_contact_method?: ContactMethod;
  language: LanguageCode;
}

// ==================== 工具类型 ====================

/** 获取指定语言的翻译 */
export type TranslationForLanguage<T extends { translations?: any[] }> = T & {
  translation?: T['translations'] extends Array<infer U> ? U : never;
};

/** 语言映射类型 */
export type LanguageMap<T> = Record<LanguageCode, T>;

/** 可选字段工具类型 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ==================== Directus集合类型映射 ====================

/**
 * Directus集合类型定义
 * 用于SDK的类型安全
 */
export interface DirectusCollections {
  global_settings: GlobalSettings;
  categories: Category;
  categories_translations: CategoryTranslation;
  products: Product;
  products_translations: ProductTranslation;
  inquiries: Inquiry;
}

// ==================== 导出所有类型 ====================

export type {
  LanguageCode,
  CurrencyCode,
  TextDirection,
  InquiryStatus,
  ContactMethod,
  GlobalSettings,
  Category,
  CategoryTranslation,
  CategoryWithTranslations,
  Product,
  ProductTranslation,
  ProductWithTranslations,
  ProductListItem,
  Inquiry,
  ProductQueryParams,
  CategoryQueryParams,
  InquiryQueryParams,
  PaginatedResponse,
  SingleResponse,
  ErrorResponse,
  InquiryFormData,
  TranslationForLanguage,
  LanguageMap,
  PartialBy,
  DirectusCollections,
};