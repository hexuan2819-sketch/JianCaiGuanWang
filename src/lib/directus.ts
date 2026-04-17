import { createDirectus, rest, staticToken, authentication } from '@directus/sdk';
import type { DirectusCollections } from '../types/directus';

/**
 * Directus SDK 客户端配置
 * 使用我们定义的类型安全的集合类型
 */
export type DirectusClient = ReturnType<typeof createDirectusClient>;

/**
 * 创建Directus客户端实例
 * 根据环境变量配置URL和认证
 */
export function createDirectusClient() {
  // 从环境变量获取配置
  const directusUrl = import.meta.env.PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
  const staticTokenValue = import.meta.env.DIRECTUS_TOKEN;

  // 创建基础客户端
  const client = createDirectus<DirectusCollections>(directusUrl)
    .with(rest());

  // 如果有静态令牌，添加认证
  if (staticTokenValue) {
    return client.with(staticToken(staticTokenValue));
  }

  return client;
}

/**
 * 全局Directus客户端实例
 * 在服务端和客户端均可使用
 */
export const directus = createDirectusClient();

/**
 * 产品相关API函数
 */
export const productAPI = {
  /**
   * 获取产品列表
   */
  async getProducts(params?: {
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
    language?: string;
    fields?: string[];
  }) {
    const query: any = {};

    if (params?.limit) query.limit = params.limit;
    if (params?.offset) query.offset = params.offset;
    if (params?.sort) query.sort = params.sort;
    if (params?.fields) query.fields = params.fields;

    // 构建过滤器
    if (params?.filter) {
      const filter: any = {};
      if (params.filter.category) filter.category = { _eq: params.filter.category };
      if (params.filter.is_featured !== undefined) filter.is_featured = { _eq: params.filter.is_featured };
      if (params.filter.is_active !== undefined) filter.is_active = { _eq: params.filter.is_active };
      if (params.filter.search) {
        filter._or = [
          { sku: { _icontains: params.filter.search } },
          { 'translations.name': { _icontains: params.filter.search } },
          { 'translations.description': { _icontains: params.filter.search } },
        ];
      }
      if (params.filter.min_price !== undefined) filter.price_range = { ...filter.price_range, min: { _gte: params.filter.min_price } };
      if (params.filter.max_price !== undefined) filter.price_range = { ...filter.price_range, max: { _lte: params.filter.max_price } };
      
      if (Object.keys(filter).length > 0) {
        query.filter = filter;
      }
    }

    // 添加翻译关系
    query.deep = {
      translations: {
        _filter: params?.language ? { languages_code: { _eq: params.language } } : undefined
      }
    };

    return await directus.request<{
      data: any[];
      meta: { total_count: number; filter_count: number };
    }>({
      path: '/items/products',
      method: 'GET',
      params: query,
    });
  },

  /**
   * 获取单个产品详情
   */
  async getProduct(slugOrId: string, language?: string) {
    const query: any = {
      filter: {
        _or: [
          { id: { _eq: slugOrId } },
          { slug: { _eq: slugOrId } }
        ]
      },
      limit: 1,
      deep: {
        translations: {
          _filter: language ? { languages_code: { _eq: language } } : undefined
        },
        category: {
          deep: {
            translations: {
              _filter: language ? { languages_code: { _eq: language } } : undefined
            }
          }
        }
      }
    };

    const response = await directus.request<{
      data: any[];
    }>({
      path: '/items/products',
      method: 'GET',
      params: query,
    });

    return response.data[0] || null;
  },

  /**
   * 获取特色产品
   */
  async getFeaturedProducts(limit = 6, language?: string) {
    return productAPI.getProducts({
      limit,
      filter: { is_featured: true, is_active: true },
      language,
      sort: ['sort_order', '-created_at']
    });
  },
};

/**
 * 分类相关API函数
 */
export const categoryAPI = {
  /**
   * 获取分类列表
   */
  async getCategories(params?: {
    limit?: number;
    offset?: number;
    sort?: string[];
    filter?: {
      parent?: string | null;
      is_active?: boolean;
    };
    language?: string;
    fields?: string[];
  }) {
    const query: any = {};

    if (params?.limit) query.limit = params.limit;
    if (params?.offset) query.offset = params.offset;
    if (params?.sort) query.sort = params.sort;
    if (params?.fields) query.fields = params.fields;

    // 构建过滤器
    if (params?.filter) {
      const filter: any = {};
      if (params.filter.parent !== undefined) filter.parent = { _eq: params.filter.parent };
      if (params.filter.is_active !== undefined) filter.is_active = { _eq: params.filter.is_active };
      
      if (Object.keys(filter).length > 0) {
        query.filter = filter;
      }
    }

    // 添加翻译关系
    query.deep = {
      translations: {
        _filter: params?.language ? { languages_code: { _eq: params.language } } : undefined
      }
    };

    return await directus.request<{
      data: any[];
      meta: { total_count: number; filter_count: number };
    }>({
      path: '/items/categories',
      method: 'GET',
      params: query,
    });
  },

  /**
   * 获取单个分类详情
   */
  async getCategory(slugOrId: string, language?: string) {
    const query: any = {
      filter: {
        _or: [
          { id: { _eq: slugOrId } },
          { slug: { _eq: slugOrId } }
        ]
      },
      limit: 1,
      deep: {
        translations: {
          _filter: language ? { languages_code: { _eq: language } } : undefined
        }
      }
    };

    const response = await directus.request<{
      data: any[];
    }>({
      path: '/items/categories',
      method: 'GET',
      params: query,
    });

    return response.data[0] || null;
  },
};

/**
 * 全局配置API函数
 */
export const settingsAPI = {
  /**
   * 获取全局配置
   */
  async getGlobalSettings() {
    const response = await directus.request<{
      data: any[];
    }>({
      path: '/items/global_settings',
      method: 'GET',
      params: { limit: 1 },
    });

    return response.data[0] || null;
  },
};

/**
 * 询盘相关API函数
 */
export const inquiryAPI = {
  /**
   * 提交询盘
   */
  async submitInquiry(data: {
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
    preferred_contact_method?: string;
    language: string;
  }) {
    return await directus.request({
      path: '/items/inquiries',
      method: 'POST',
      body: data,
    });
  },
};

/**
 * 工具函数
 */
export const utils = {
  /**
   * 获取指定语言的翻译
   */
  getTranslation<T extends { translations?: Array<{ languages_code: string }> }>(
    item: T,
    language: string
  ): T['translations'] extends Array<infer U> ? U | undefined : undefined {
    if (!item.translations || !Array.isArray(item.translations)) {
      return undefined as any;
    }
    
    const translation = item.translations.find(t => t.languages_code === language);
    return translation as any;
  },

  /**
   * 获取所有语言的翻译映射
   */
  getTranslationsMap<T extends { translations?: Array<{ languages_code: string }> }>(
    item: T
  ): Record<string, T['translations'] extends Array<infer U> ? U : never> {
    if (!item.translations || !Array.isArray(item.translations)) {
      return {} as any;
    }
    
    const map: Record<string, any> = {};
    item.translations.forEach(translation => {
      map[translation.languages_code] = translation;
    });
    
    return map;
  },

  /**
   * 格式化价格显示
   */
  formatPrice(price: number, currency: string): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    
    return formatter.format(price);
  },
};

export default directus;