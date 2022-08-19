export type Enum = {
  name: string;
  value: string;
  type: string;
  description: string | null;
};

export type Model = Schema & {
  name: string;
  export:
    | "reference"
    | "generic"
    | "enum"
    | "array"
    | "dictionary"
    | "interface"
    | "one-of"
    | "any-of"
    | "all-of";
  type: string;
  base: string;
  template: string | null;
  link: Model | null;
  description: string | null;
  deprecated?: boolean;
  default?: string;
  imports: string[];
  enum: Enum[];
  enums: Model[];
  properties: Model[];
};

export type Example = {
  summary?: string;
  description?: string;
  value?: unknown;
  externalValue?: string;
};

export type ModelComposition = {
  type: "one-of" | "any-of" | "all-of";
  imports: string[];
  enums: Model[];
  properties: Model[];
};

export type Schema = {
  isDefinition: boolean;
  isReadOnly: boolean;
  isRequired: boolean;
  isNullable: boolean;
  format?: string;
  maximum?: number;
  exclusiveMaximum?: boolean | number;
  minimum?: number;
  exclusiveMinimum?: boolean | number;
  multipleOf?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  example?: unknown;
  examples?: Array<unknown>;
};

export type OperationParameter = Model & {
  originalName?: string;
  in: "path" | "query" | "header" | "formData" | "body" | "cookie";
  prop: string;
  mediaType: string | null;
};

export type OperationParameters = {
  imports: string[];
  parameters: OperationParameter[];
  parametersPath: OperationParameter[];
  parametersQuery: OperationParameter[];
  parametersForm: OperationParameter[];
  parametersCookie: OperationParameter[];
  parametersHeader: OperationParameter[];
  parametersBody: OperationParameter | null;
};

export type OperationError = {
  code: number;
  description: string;
};

export type OperationResponse = Model & {
  in: "response" | "header";
  code: number;
  headers: Model[];
};

export type Operation = OperationParameters & {
  id: string;
  name: string;
  summary: string | null;
  description: string | null;
  deprecated: boolean;
  method: string;
  path: string;
  errors: OperationError[];
  results: OperationResponse[];
  responseHeader: string | null;
  externalDocs?: string;
};

export type Service = {
  name: string;
  operations: Operation[];
  imports: string[];
  description?: string;
};

export type Client = {
  version: string;
  models: Model[];
  services: Service[];
};

export type Type = {
  type: string;
  base: string;
  template: string | null;
  imports: string[];
  isNullable: boolean;
};

export interface IFileWriter {
  writeFile(path: string, data: string): Promise<void>;
}
