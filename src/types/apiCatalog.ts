export type ApiParameter = {
  in: 'header' | 'query' | 'path' | 'cookie' | 'body';
  name: string;
  required: boolean;
  description: string;
  type: string;
  example?: string | number | boolean | null;
};

export type ApiResponse = {
  code: string;
  name: string;
  description: string;
};

export type ApiVariant = {
  summary: string;
  label: string;
  description: string;
  requestExample: string | null;
  modelName?: string | null;
};

export type ApiEndpoint = {
  id: string;
  method: string;
  path: string;
  summary: string;
  description: string;
  parameters: ApiParameter[];
  responses: ApiResponse[];
  requestExample: string | null;
  modelName?: string | null;
  docHref: string;
  variants?: ApiVariant[];
  variantCount?: number;
};

export type ApiSection = {
  id: string;
  label: string;
  description: string;
  endpoints: ApiEndpoint[];
};

export type ApiCategoryGroup = {
  slug: string;
  label: string;
  description: string;
  docHref: string;
  sections: ApiSection[];
};

export type ApiCatalog = {
  version: number;
  baseUrl: string;
  categories: ApiCategoryGroup[];
};

export type FlatEndpoint = ApiEndpoint & {
  categorySlug: string;
  categoryLabel: string;
  sectionId: string;
  sectionLabel: string;
};

export function endpointWithExample(
  endpoint: ApiEndpoint,
  requestExample: string | null | undefined,
): ApiEndpoint {
  return {...endpoint, requestExample: requestExample ?? endpoint.requestExample};
}
