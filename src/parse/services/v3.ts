import { OpenAPIV3 } from "openapi-types";
import {
  Model,
  Operation,
  OperationError,
  OperationParameter,
  OperationParameters,
  OperationResponse,
  Service,
} from "../../@types";
import { getRef } from "../common/v3";
import { getModel, getModelDefault, getPattern, getType } from "../models/v3";
import camelCase from "camelcase";
import { singular } from "pluralize";
import pluralize from "pluralize";

export function getServices(doc: OpenAPIV3.Document): Service[] {
  return (doc.tags || []).map((tag) => getService(doc, tag));
}

export function getService(doc: OpenAPIV3.Document, tag: OpenAPIV3.TagObject): Service {
  const service: Service = {
    name: tag.name,
    description: tag.description,
    operations: [],
    imports: [],
  };

  for (const [path, pathObject] of Object.entries(doc.paths)) {
    if (!pathObject) {
      continue;
    }

    const pathParams = getOperationParameters(doc, pathObject.parameters || []);

    const operations = {
      get: pathObject.get,
      post: pathObject.post,
      put: pathObject.put,
      delete: pathObject.delete,
      patch: pathObject.patch,
      options: pathObject.options,
      head: pathObject.head,
    };

    for (const [method, op] of Object.entries(operations)) {
      if (!op || !op.tags || !op.tags.includes(service.name)) {
        continue;
      }

      const operation = getOperation(doc, path, method, op, pathParams);

      // Push the operation in the service
      service.operations.push(operation);
      service.imports.push(...operation.imports);
    }
  }

  return service;
}

const getOperation = (
  openApi: OpenAPIV3.Document,
  url: string,
  method: string,
  op: OpenAPIV3.OperationObject,
  pathParams: OperationParameters,
): Operation => {
  const operationName = getOperationName(url, method, op.operationId);

  // Create a new operation object for this method.
  const operation: Operation = {
    id: getOperationId(url, method, op.operationId),
    name: operationName,
    summary: op.summary || null,
    description: op.description || null,
    deprecated: op.deprecated === true,
    method: method.toUpperCase(),
    path: url,
    parameters: [...pathParams.parameters],
    parametersPath: [...pathParams.parametersPath],
    parametersQuery: [...pathParams.parametersQuery],
    parametersForm: [...pathParams.parametersForm],
    parametersHeader: [...pathParams.parametersHeader],
    parametersCookie: [...pathParams.parametersCookie],
    parametersBody: pathParams.parametersBody,
    imports: [],
    errors: [],
    results: [],
    responseHeader: null,
    externalDocs: op.externalDocs?.url || undefined,
  };

  // Parse the operation parameters (path, query, body, etc).
  if (op.parameters) {
    const parameters = getOperationParameters(openApi, op.parameters);
    operation.imports.push(...parameters.imports);
    operation.parameters.push(...parameters.parameters);
    operation.parametersPath.push(...parameters.parametersPath);
    operation.parametersQuery.push(...parameters.parametersQuery);
    operation.parametersForm.push(...parameters.parametersForm);
    operation.parametersHeader.push(...parameters.parametersHeader);
    operation.parametersCookie.push(...parameters.parametersCookie);
    operation.parametersBody = parameters.parametersBody;
  }

  if (op.requestBody) {
    const requestBodyDef = getRef<OpenAPIV3.RequestBodyObject>(
      openApi,
      op.requestBody as OpenAPIV3.RequestBodyObject & OpenAPIV3.ReferenceObject,
    );
    const requestBody = getOperationRequestBody(openApi, requestBodyDef);
    operation.imports.push(...requestBody.imports);
    operation.parameters.push(requestBody);
    operation.parametersBody = requestBody;
  }

  // Parse the operation responses.
  if (op.responses) {
    const operationResponses = getOperationResponses(openApi, op.responses);
    const operationResults = getOperationResults(operationResponses);
    operation.errors = getOperationErrors(operationResponses);
    operation.responseHeader = getOperationResponseHeader(operationResults);

    operationResults.forEach((operationResult) => {
      operation.results.push(operationResult);
      operation.imports.push(...operationResult.imports);
    });
  }

  operation.parameters = operation.parameters.sort(sortByRequired);

  return operation;
};

const getOperationId = (url: string, method: string, operationId?: string): string => {
  if (operationId) {
    return operationId;
  }

  return `${method}:${url}`;
};

const sortByRequired = (a: OperationParameter, b: OperationParameter): number => {
  const aNeedsValue = a.isRequired && a.default === undefined;
  const bNeedsValue = b.isRequired && b.default === undefined;
  if (aNeedsValue && !bNeedsValue) return -1;
  if (bNeedsValue && !aNeedsValue) return 1;
  return 0;
};

const getOperationResponseHeader = (operationResponses: OperationResponse[]): string | null => {
  const header = operationResponses.find((operationResponses) => {
    return operationResponses.in === "header";
  });
  if (header) {
    return header.name;
  }
  return null;
};

const getOperationErrors = (operationResponses: OperationResponse[]): OperationError[] => {
  return operationResponses
    .filter((operationResponse) => {
      return operationResponse.code >= 300 && operationResponse.description;
    })
    .map((response) => ({
      code: response.code,
      description: response.description || "",
    }));
};

const areEqual = (a: Model, b: Model): boolean => {
  const equal = a.type === b.type && a.base === b.base && a.template === b.template;
  if (equal && a.link && b.link) {
    return areEqual(a.link, b.link);
  }
  return equal;
};

export const getOperationResults = (
  operationResponses: OperationResponse[],
): OperationResponse[] => {
  const operationResults: OperationResponse[] = [];

  // Filter out success response codes, but skip "204 No Content"
  operationResponses.forEach((operationResponse) => {
    const { code } = operationResponse;
    if (code && code !== 204 && code >= 200 && code < 300) {
      operationResults.push(operationResponse);
    }
  });

  if (!operationResults.length) {
    operationResults.push({
      in: "response",
      name: "",
      code: 200,
      description: "",
      export: "generic",
      type: "void",
      base: "void",
      template: null,
      link: null,
      isDefinition: false,
      isReadOnly: false,
      isRequired: false,
      isNullable: false,
      imports: [],
      enum: [],
      enums: [],
      properties: [],
      headers: [],
    });
  }

  return operationResults.filter((operationResult, index, arr) => {
    return (
      arr.findIndex((item) => {
        return areEqual(item, operationResult);
      }) === index
    );
  });
};

const getOperationResponses = (
  openApi: OpenAPIV3.Document,
  responses: OpenAPIV3.ResponsesObject,
): OperationResponse[] => {
  const operationResponses: OperationResponse[] = [];

  // Iterate over each response code and get the
  // status code and response message (if any).
  for (const [code, responseOrReference] of Object.entries(responses)) {
    const response = getRef<OpenAPIV3.ResponseObject>(
      openApi,
      responseOrReference as OpenAPIV3.ResponseObject & OpenAPIV3.ReferenceObject,
    );

    const responseCode = getOperationResponseCode(code);

    if (responseCode) {
      const operationResponse = getOperationResponse(openApi, response, responseCode);
      operationResponses.push(operationResponse);
    }
  }

  // Sort the responses to 2XX success codes come before 4XX and 5XX error codes.
  return operationResponses.sort((a, b): number => {
    return a.code < b.code ? -1 : a.code > b.code ? 1 : 0;
  });
};

const getOperationResponse = (
  openApi: OpenAPIV3.Document,
  response: OpenAPIV3.ResponseObject,
  responseCode: number,
): OperationResponse => {
  const operationResponse: OperationResponse = {
    in: "response",
    name: "",
    code: responseCode,
    description: response.description || null,
    export: "generic",
    type: "any",
    base: "any",
    template: null,
    link: null,
    isDefinition: false,
    isReadOnly: false,
    isRequired: false,
    isNullable: false,
    imports: [],
    enum: [],
    enums: [],
    properties: [],
    headers: [],
  };

  if (response.headers) {
    for (const [name, headerOrRef] of Object.entries(response.headers)) {
      const header: Model = {
        name,
        description: null,
        export: "generic",
        type: "any",
        base: "any",
        template: null,
        link: null,
        isDefinition: false,
        isReadOnly: false,
        isRequired: false,
        isNullable: false,
        imports: [],
        enum: [],
        enums: [],
        properties: [],
      };

      const resolvedHeader = getRef<OpenAPIV3.HeaderObject>(
        openApi,
        headerOrRef as OpenAPIV3.HeaderObject & OpenAPIV3.ReferenceObject,
      );

      header.description = resolvedHeader.description ?? null;
      header.isRequired = resolvedHeader.required ?? false;
      header.deprecated = resolvedHeader.deprecated ?? false;

      if (!resolvedHeader.schema) {
        continue;
      }

      if ("$ref" in headerOrRef) {
        const model = getType(headerOrRef.$ref);

        header.export = "reference";
        header.type = model.type;
        header.base = model.base;
        header.template = model.template;
        header.imports.push(...model.imports);
      } else {
        const model = getModel(openApi, "", resolvedHeader.schema);

        header.export = model.export;
        header.type = model.type;
        header.base = model.base;
        header.template = model.template;
        header.link = model.link;
        header.isReadOnly = model.isReadOnly;
        header.isRequired = model.isRequired;
        header.isNullable = model.isNullable;
        header.format = model.format;
        header.maximum = model.maximum;
        header.exclusiveMaximum = model.exclusiveMaximum;
        header.minimum = model.minimum;
        header.exclusiveMinimum = model.exclusiveMinimum;
        header.multipleOf = model.multipleOf;
        header.maxLength = model.maxLength;
        header.minLength = model.minLength;
        header.maxItems = model.maxItems;
        header.minItems = model.minItems;
        header.uniqueItems = model.uniqueItems;
        header.maxProperties = model.maxProperties;
        header.minProperties = model.minProperties;
        header.pattern = getPattern(model.pattern);
        header.imports.push(...model.imports);
        header.enum.push(...model.enum);
        header.enums.push(...model.enums);
        header.properties.push(...model.properties);
      }

      operationResponse.headers.push(header);
      operationResponse.imports.push(...header.imports);
    }
  }

  if (response.content) {
    const content = getContent(response.content);
    if (content) {
      if (content.schema.$ref?.startsWith("#/components/responses/")) {
        content.schema = getRef<OpenAPIV3.SchemaObject>(
          openApi,
          content.schema,
        ) as typeof content.schema;
      }
      if (content.schema.$ref) {
        const model = getType(content.schema.$ref);
        operationResponse.export = "reference";
        operationResponse.type = model.type;
        operationResponse.base = model.base;
        operationResponse.template = model.template;
        operationResponse.imports.push(...model.imports);
        return operationResponse;
      } else {
        const model = getModel(openApi, "", content.schema);
        operationResponse.export = model.export;
        operationResponse.type = model.type;
        operationResponse.base = model.base;
        operationResponse.template = model.template;
        operationResponse.link = model.link;
        operationResponse.isReadOnly = model.isReadOnly;
        operationResponse.isRequired = model.isRequired;
        operationResponse.isNullable = model.isNullable;
        operationResponse.format = model.format;
        operationResponse.maximum = model.maximum;
        operationResponse.exclusiveMaximum = model.exclusiveMaximum;
        operationResponse.minimum = model.minimum;
        operationResponse.exclusiveMinimum = model.exclusiveMinimum;
        operationResponse.multipleOf = model.multipleOf;
        operationResponse.maxLength = model.maxLength;
        operationResponse.minLength = model.minLength;
        operationResponse.maxItems = model.maxItems;
        operationResponse.minItems = model.minItems;
        operationResponse.uniqueItems = model.uniqueItems;
        operationResponse.maxProperties = model.maxProperties;
        operationResponse.minProperties = model.minProperties;
        operationResponse.pattern = getPattern(model.pattern);
        operationResponse.imports.push(...model.imports);
        operationResponse.enum.push(...model.enum);
        operationResponse.enums.push(...model.enums);
        operationResponse.properties.push(...model.properties);
        return operationResponse;
      }
    }
  }

  // We support basic properties from response headers, since both
  // fetch and XHR client just support string types.
  if (response.headers) {
    for (const name in response.headers) {
      // eslint-disable-next-line no-prototype-builtins
      if (response.headers.hasOwnProperty(name)) {
        operationResponse.in = "header";
        operationResponse.name = name;
        operationResponse.type = "string";
        operationResponse.base = "string";
        return operationResponse;
      }
    }
  }

  return operationResponse;
};

const getOperationResponseCode = (value: string | "default"): number | null => {
  // You can specify a "default" response, this is treated as HTTP code 200
  if (value === "default") {
    return 200;
  }

  // Check if we can parse the code and return of successful.
  if (/[0-9]+/g.test(value)) {
    const code = parseInt(value);
    if (Number.isInteger(code)) {
      return Math.abs(code);
    }
  }

  return null;
};

const getOperationRequestBody = (
  openApi: OpenAPIV3.Document,
  body: OpenAPIV3.RequestBodyObject,
): OperationParameter => {
  const requestBody: OperationParameter = {
    in: "body",
    export: "interface",
    prop: "body",
    name: "body",
    type: "any",
    base: "any",
    template: null,
    link: null,
    description: body.description || null,
    default: undefined,
    isDefinition: false,
    isReadOnly: false,
    isRequired: body.required === true,
    isNullable: false,
    imports: [],
    enum: [],
    enums: [],
    properties: [],
    mediaType: null,
  };

  if (body.content) {
    const content = getContent(body.content);
    if (content) {
      requestBody.mediaType = content.mediaType;
      switch (requestBody.mediaType) {
        case "application/octet-stream": {
          requestBody.in = "body";
          requestBody.name = "file";
          requestBody.prop = "file";
          requestBody.type = "ReadableStream";
          break;
        }
        case "application/x-www-form-urlencoded":
        case "multipart/form-data":
          requestBody.in = "formData";
          requestBody.name = "formData";
          requestBody.prop = "formData";
          break;
      }
      if (content.schema.$ref) {
        const model = getType(content.schema.$ref);
        requestBody.export = "reference";
        requestBody.type = model.type;
        requestBody.base = model.base;
        requestBody.template = model.template;
        requestBody.imports.push(...model.imports);
        return requestBody;
      } else {
        const model = getModel(openApi, "", content.schema);
        requestBody.export = model.export;
        requestBody.type = model.type;
        requestBody.base = model.base;
        requestBody.template = model.template;
        requestBody.link = model.link;
        requestBody.isReadOnly = model.isReadOnly;
        requestBody.isRequired = requestBody.isRequired || model.isRequired;
        requestBody.isNullable = requestBody.isNullable || model.isNullable;
        requestBody.format = model.format;
        requestBody.maximum = model.maximum;
        requestBody.exclusiveMaximum = model.exclusiveMaximum;
        requestBody.minimum = model.minimum;
        requestBody.exclusiveMinimum = model.exclusiveMinimum;
        requestBody.multipleOf = model.multipleOf;
        requestBody.maxLength = model.maxLength;
        requestBody.minLength = model.minLength;
        requestBody.maxItems = model.maxItems;
        requestBody.minItems = model.minItems;
        requestBody.uniqueItems = model.uniqueItems;
        requestBody.maxProperties = model.maxProperties;
        requestBody.minProperties = model.minProperties;
        requestBody.pattern = getPattern(model.pattern);
        requestBody.imports.push(...model.imports);
        requestBody.enum.push(...model.enum);
        requestBody.enums.push(...model.enums);
        requestBody.properties.push(...model.properties);
        return requestBody;
      }
    }
  }

  return requestBody;
};

type Content = {
  mediaType: string;
  schema: OpenAPIV3.SchemaObject & OpenAPIV3.ReferenceObject;
};

const BASIC_MEDIA_TYPES = [
  "application/json-patch+json",
  "application/json",
  "application/x-www-form-urlencoded",
  "text/json",
  "text/plain",
  "multipart/form-data",
  "multipart/mixed",
  "multipart/related",
  "multipart/batch",
];

export const getContent = (content: OpenAPIV3.RequestBodyObject["content"]): Content | null => {
  const basicMediaTypeWithSchema = Object.keys(content)
    .filter((mediaType) => {
      const cleanMediaType = mediaType.split(";")[0].trim();
      return BASIC_MEDIA_TYPES.includes(cleanMediaType);
    })
    .find((mediaType) => isDefined(content[mediaType]?.schema));
  if (basicMediaTypeWithSchema) {
    return {
      mediaType: basicMediaTypeWithSchema,
      schema: content[basicMediaTypeWithSchema].schema as Content["schema"],
    };
  }

  const firstMediaTypeWithSchema = Object.keys(content).find((mediaType) =>
    isDefined(content[mediaType]?.schema),
  );
  if (firstMediaTypeWithSchema) {
    return {
      mediaType: firstMediaTypeWithSchema,
      schema: content[firstMediaTypeWithSchema].schema as Content["schema"],
    };
  }
  return null;
};

const getOperationName = (url: string, method: string, operationId?: string): string => {
  if (operationId) {
    let name = operationId;

    const operationIdSplit = operationId.split("/");

    if (operationIdSplit.length > 1) {
      name = operationIdSplit[operationIdSplit.length - 1];
    }

    const result = camelCase(
      name
        .replace(/^[^a-zA-Z]+/g, "")
        .replace(/[^\w-]+/g, "-")
        .trim(),
    );

    // Check result against javascript reserved words
    if (isReservedWord(result)) {
      const operationIdSplit = operationId.split("/");

      if (operationIdSplit.length > 1) {
        const suffix = operationIdSplit[0];

        return camelCase(`${result}-${correctCaseBasedOnUrl(url, suffix)}`);
      } else {
        return camelCase(`${method}-${correctCaseBasedOnUrl(url, result)}`);
      }
    } else {
      return result;
    }
  }

  const urlWithoutPlaceholders = url
    .replace(/[^/]*?{api-version}.*?\//g, "")
    .replace(/{(.*?)}/g, "")
    .replace(/\//g, "-");

  return camelCase(`${method}-${urlWithoutPlaceholders}`);
};

// If the last url segment is a variable, then we should singularize the name
// if the last url segment is NOT a variable, then we should pluralize the name
const correctCaseBasedOnUrl = (url: string, name: string): string => {
  const lastSegment = url.split("/").pop();

  if (lastSegment && lastSegment.startsWith("{")) {
    return singular(name);
  } else {
    return pluralize(name);
  }
};

const javascriptReservedWords = [
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "null",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
  "let",
  "await",
  "enum",
  "implements",
  "interface",
  "package",
  "private",
  "protected",
  "public",
  "static",
  "abstract",
  "boolean",
  "byte",
  "char",
  "double",
  "final",
  "float",
  "goto",
  "int",
  "long",
  "native",
  "short",
  "synchronized",
  "throws",
  "transient",
  "volatile",
  "arguments",
  "async",
  "eval",
  "get",
  "set",
  "null",
  "true",
  "false",
  "any",
  "boolean",
  "constructor",
  "declare",
  "module",
  "require",
  "number",
  "string",
  "of",
];

// Make sure value is not a javascript reserved word
function isReservedWord(value: string): boolean {
  return javascriptReservedWords.includes(value);
}

export const getOperationParameters = (
  doc: OpenAPIV3.Document,
  parameters: Array<OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject>,
): OperationParameters => {
  const operationParameters: OperationParameters = {
    imports: [],
    parameters: [],
    parametersPath: [],
    parametersQuery: [],
    parametersForm: [],
    parametersCookie: [],
    parametersHeader: [],
    parametersBody: null, // Not used in V3 -> @see requestBody
  };

  // Iterate over the parameters
  parameters.forEach((parameterOrReference) => {
    const parameterDef = getRef<OpenAPIV3.ParameterObject>(
      doc,
      parameterOrReference as OpenAPIV3.ParameterObject & OpenAPIV3.ReferenceObject,
    );
    const parameter = getOperationParameter(
      doc,
      parameterDef as OpenAPIV3.ParameterObject & OpenAPIV3.ReferenceObject,
    );

    // We ignore the "api-version" param, since we do not want to add this
    // as the first / default parameter for each of the service calls.
    if (parameter.prop !== "api-version") {
      switch (parameterDef.in) {
        case "path":
          operationParameters.parametersPath.push(parameter);
          operationParameters.parameters.push(parameter);
          operationParameters.imports.push(...parameter.imports);
          break;

        case "query":
          operationParameters.parametersQuery.push(parameter);
          operationParameters.parameters.push(parameter);
          operationParameters.imports.push(...parameter.imports);
          break;

        case "formData":
          operationParameters.parametersForm.push(parameter);
          operationParameters.parameters.push(parameter);
          operationParameters.imports.push(...parameter.imports);
          break;

        case "cookie":
          operationParameters.parametersCookie.push(parameter);
          operationParameters.parameters.push(parameter);
          operationParameters.imports.push(...parameter.imports);
          break;

        case "header":
          operationParameters.parametersHeader.push(parameter);
          operationParameters.parameters.push(parameter);
          operationParameters.imports.push(...parameter.imports);
          break;
      }
    }
  });
  return operationParameters;
};

export const getOperationParameter = (
  openApi: OpenAPIV3.Document,
  parameter: OpenAPIV3.ParameterObject & OpenAPIV3.ReferenceObject,
): OperationParameter => {
  const operationParameter: OperationParameter = {
    in: parameter.in as OperationParameter["in"],
    prop: parameter.name,
    export: "interface",
    name: getOperationParameterName(parameter.name),
    originalName: parameter.name,
    type: "any",
    base: "any",
    template: null,
    link: null,
    description: parameter.description || null,
    deprecated: parameter.deprecated === true,
    isDefinition: false,
    isReadOnly: false,
    isRequired: parameter.required === true,
    isNullable: false,
    imports: [],
    enum: [],
    enums: [],
    properties: [],
    mediaType: null,
  };

  if (parameter.$ref) {
    const definitionRef = getType(parameter.$ref);
    operationParameter.export = "reference";
    operationParameter.type = definitionRef.type;
    operationParameter.base = definitionRef.base;
    operationParameter.template = definitionRef.template;
    operationParameter.imports.push(...definitionRef.imports);
    return operationParameter;
  }

  let schema = parameter.schema;

  if (schema) {
    if ("$ref" in schema && schema.$ref?.startsWith("#/components/parameters/")) {
      schema = getRef<OpenAPIV3.SchemaObject>(openApi, schema);
    }
    if ("$ref" in schema) {
      const model = getType(schema.$ref);
      operationParameter.export = "reference";
      operationParameter.type = model.type;
      operationParameter.base = model.base;
      operationParameter.template = model.template;
      operationParameter.imports.push(...model.imports);
      operationParameter.default = getModelDefault(schema as OpenAPIV3.NonArraySchemaObject);
      return operationParameter;
    } else {
      const model = getModel(openApi, "", schema);
      operationParameter.export = model.export;
      operationParameter.type = model.type;
      operationParameter.base = model.base;
      operationParameter.template = model.template;
      operationParameter.link = model.link;
      operationParameter.isReadOnly = model.isReadOnly;
      operationParameter.isRequired = operationParameter.isRequired || model.isRequired;
      operationParameter.isNullable = operationParameter.isNullable || model.isNullable;
      operationParameter.format = model.format;
      operationParameter.maximum = model.maximum;
      operationParameter.exclusiveMaximum = model.exclusiveMaximum;
      operationParameter.minimum = model.minimum;
      operationParameter.exclusiveMinimum = model.exclusiveMinimum;
      operationParameter.multipleOf = model.multipleOf;
      operationParameter.maxLength = model.maxLength;
      operationParameter.minLength = model.minLength;
      operationParameter.maxItems = model.maxItems;
      operationParameter.minItems = model.minItems;
      operationParameter.uniqueItems = model.uniqueItems;
      operationParameter.maxProperties = model.maxProperties;
      operationParameter.minProperties = model.minProperties;
      operationParameter.pattern = getPattern(model.pattern);
      operationParameter.default = model.default;
      operationParameter.imports.push(...model.imports);
      operationParameter.enum.push(...model.enum);
      operationParameter.enums.push(...model.enums);
      operationParameter.properties.push(...model.properties);
      return operationParameter;
    }
  }

  return operationParameter;
};

const reservedWords =
  /^(arguments|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|eval|export|extends|false|finally|for|function|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)$/g;

/**
 * Replaces any invalid characters from a parameter name.
 * For example: 'filter.someProperty' becomes 'filterSomeProperty'.
 */
const getOperationParameterName = (value: string): string => {
  const clean = value
    .replace(/^[^a-zA-Z]+/g, "")
    .replace(/[^\w-]+/g, "-")
    .trim();
  return camelCase(clean).replace(reservedWords, "_$1");
};

/**
 * Check if a value is defined
 * @param value
 */
const isDefined = <T>(
  value: T | undefined | null | "",
): value is Exclude<T, undefined | null | ""> => {
  return value !== undefined && value !== null && value !== "";
};
