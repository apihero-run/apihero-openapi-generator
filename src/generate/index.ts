import { camelCase } from "camel-case";
import { singular } from "pluralize";
import { Client, Model, Operation, OperationParameter, Service } from "../@types";

export type GenerationOptions = {
  noParamsType?: string;
  bodyParamName?: string;
  inferRequestBodyParamName?: boolean;
};

export type GenerateClientOptions = {
  additionalImports?: Array<{ imports: string[]; name: string }>;
  additionalData?: Record<string, string | number>;
  generation?: GenerationOptions;
  baseUrl?: string;
};

export type RequestBodyParameterMapping = {
  type: "requestBody";
  mappedName: string;
};

export type OperationParameterMapping = {
  type: "parameter";
  name: string;
  mappedName: string;
};

export type Mapping = RequestBodyParameterMapping | OperationParameterMapping;

export type GenerateClientCodeResult = {
  files: Record<string, string>;
  mappings: Record<string, Array<Mapping>>;
};

export function generateFromClient(
  client: Client,
  identifier: string,
  options?: GenerateClientOptions,
): GenerateClientCodeResult {
  const files: Record<string, string> = {};

  const clientGenerator = new ClientGenerator(identifier, client, options);

  const modelCode = clientGenerator.generateModels();

  files["@types.ts"] = modelCode;

  const servicesCode = clientGenerator.generateServices();

  for (const [name, code] of servicesCode) {
    files[`${name}.ts`] = code;
  }

  const indexCode = clientGenerator.generateIndex();

  files["index.ts"] = indexCode;

  return { files, mappings: clientGenerator.mappings() };
}

class ClientGenerator {
  constructor(
    private readonly identifier: string,
    private readonly client: Client,
    private readonly options?: GenerateClientOptions,
  ) {
    this.identifier = identifier;
    this.options = options;
    this.client = client;
  }

  generateModels(): string {
    const endpointGenericCode = `export type ApiHeroEndpoint<Params, ResponseBody, Headers = unknown> = \n{ id: string;\n[key: string]: string | number;\n };`;

    const modelsCode = this.client.models.map((model) => this.generateModel(model)).join("\n\n");

    return `${endpointGenericCode}\n\n${modelsCode}`;
  }

  generateServices(): Array<[string, string]> {
    return this.client.services.map((service) => this.generateService(service));
  }

  generateIndex(): string {
    const servicesCode = this.generateServices();

    const imports = servicesCode
      .map(([name]) => `import * as ${camelCase(name)} from "./${name}";`)
      .join("\n");

    const exports = `export { ${servicesCode.map(([name]) => camelCase(name)).join(", ")} };`;

    return `${imports}\n\n${exports}\n\nexport * from "./@types";`;
  }

  mappings(): Record<string, Array<Mapping>> {
    const result: Record<string, Array<Mapping>> = {};

    for (const [, service] of Object.entries(this.client.services)) {
      for (const operation of service.operations) {
        const mappings = this.generateOperationMappings(operation);

        if (mappings.length > 0) {
          result[operation.id] = mappings;
        }
      }
    }

    return result;
  }

  private generateOperationMappings(operation: Operation): Array<Mapping> {
    const mappings: Array<Mapping> = [];

    if (operation.parameters) {
      for (const parameter of operation.parameters) {
        if (parameter.in === "body") {
          const mappedName = this.generateRequestBodyParameterName(operation, parameter);

          if (mappedName && mappedName !== parameter.name) {
            mappings.push({
              type: "requestBody",
              mappedName,
            });
          }
        } else {
          if (parameter.originalName && parameter.originalName !== parameter.name) {
            mappings.push({
              type: "parameter",
              name: parameter.originalName,
              mappedName: parameter.name,
            });
          }
        }
      }
    }

    return mappings;
  }

  private generateService(service: Service): [string, string] {
    const serviceCode = this.generateServiceCode(service);

    return [service.name, serviceCode];
  }

  private generateServiceCode(service: Service): string {
    const imports = this.generateServiceImports(service);

    return `${imports}\n\n${service.operations
      .map((operation) => this.generateOperation(operation))
      .join("\n\n")}`;
  }

  private generateServiceImports(service: Service): string {
    const additionalImports = this.options?.additionalImports ?? [];
    const additionalImportsCode = additionalImports
      .map((additionalImport) => {
        return `import { ${additionalImport.imports.join(", ")} } from "${additionalImport.name}";`;
      })
      .join("\n");

    const serviceImportsCode =
      service.imports.length > 0
        ? `import { ${service.imports.join(", ")}, ApiHeroEndpoint } from "./@types";`
        : "";

    return `${additionalImportsCode}\n${serviceImportsCode}`;
  }

  generateOperation(operation: Operation): string {
    return `${this.generateOperationDocs(operation)}\n${this.generateOperationExport(operation)}`;
  }

  private generateOperationExport(operation: Operation): string {
    const parameters = this.generateOperationParameters(operation);
    const result = this.generateOperationResult(operation);
    const headers = this.generateOperationHeaders(operation);

    const additionalData = this.options?.additionalData;

    return `export const ${operation.name}: ApiHeroEndpoint<${parameters}, ${result}${
      headers ? `, ${headers}` : ``
    }> = {
    id: '${operation.id}',
    ${
      additionalData
        ? `${Object.entries(additionalData)
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(",\n")},\n`
        : ""
    }
  }`;
  }

  private generateOperationResult(operation: Operation): string {
    if (!operation.results) {
      return "void";
    }

    return operation.results.map((result) => this.generateType(result)).join(" | ");
  }

  private generateOperationHeaders(operation: Operation): string | undefined {
    const allHeaders = operation.results.flatMap((result) => result.headers);

    if (allHeaders.length === 0) {
      return;
    }

    return operation.results
      .flatMap((result) => {
        return `{ ${result.headers
          .map((header) => `"${header.name}": ${this.generateType(header)}; `)
          .join(" ")} }`;
      })
      .join(" | ");
  }

  private generateOperationParameters(operation: Operation): string {
    if (!operation.parameters || operation.parameters.length === 0) {
      return this.options?.generation?.noParamsType ?? "never";
    }

    return `{ ${operation.parameters
      .map((param) => this.generateOperationParameter(operation, param))
      .join("; ")} }`;
  }

  private generateOperationParameter(
    operation: Operation,
    parameter: Operation["parameters"][0],
  ): string {
    return `${this.generateOperationParameterName(operation, parameter)}${
      parameter.isRequired ? "" : "?"
    }: ${this.generateType(parameter)}`;
  }

  private generateOperationParameterName(
    operation: Operation,
    parameter: Operation["parameters"][0],
  ): string {
    if (parameter.in === "body") {
      return this.generateRequestBodyParameterName(operation, parameter);
    }

    return parameter.name;
  }

  private generateRequestBodyParameterName(
    operation: Operation,
    parameter: Operation["parameters"][0],
  ): string {
    if (this.options?.generation?.inferRequestBodyParamName) {
      switch (operation.method) {
        case "POST":
        case "DELETE": {
          let resourceName = operation.path.split("/").pop();

          if (resourceName?.includes("{")) {
            resourceName = operation.path.split("/")[operation.path.split("/").length - 2];
          }

          if (resourceName) {
            return this.ensureUniqueNameWithFallbacks(
              operation,
              camelCase(singular(resourceName)),
              ["payload", "data", "body", "request"],
            );
          }

          break;
        }
        case "PATCH":
        case "PUT": {
          // Get the second to last path segment
          const resourceName = operation.path.split("/")[operation.path.split("/").length - 2];

          if (resourceName) {
            return this.ensureUniqueNameWithFallbacks(
              operation,
              camelCase(singular(resourceName)),
              ["payload", "data", "body", "request"],
            );
          }

          break;
        }
      }
    }

    return this.options?.generation?.bodyParamName ?? parameter.name;
  }

  private ensureUniqueNameWithFallbacks(
    operation: Operation,
    name: string,
    fallbacks: string[],
  ): string {
    const otherParamNames = operation.parameters.filter((p) => p.in !== "body").map((p) => p.name);

    if (otherParamNames.includes(name)) {
      const fallback = fallbacks.find((f) => !otherParamNames.includes(f));

      if (fallback) {
        return fallback;
      }
    }

    return name;
  }

  private generateOperationParameterComments(
    parameters: OperationParameter[],
    path: string[] = [],
  ): string {
    if (!parameters || parameters.length === 0) {
      return "";
    }

    const supportedParameters = parameters
      .filter((p) => p.export !== "one-of")
      .filter((p) => p.in !== "body");

    if (supportedParameters.length === 0) {
      return "";
    }

    return `\n${supportedParameters
      .map((parameter) => this.generateOperationParameterComment(parameter, path))
      .join("\n")}`;
  }

  private generateOperationParameterComment(parameter: Model, path: string[] = []): string {
    return `* @param ${this.generateJSDocParamName(parameter, path)} ${
      parameter.description ? `- ${parameter.description}` : ""
    }${parameter.properties
      .map((prop) => this.generateOperationParameterComment(prop, [parameter.name]))
      .join("\n")}`;
  }

  private generateJSDocParamName(parameter: Model, path: string[] = []): string {
    if (parameter.isRequired) {
      return [...path, parameter.name].join(".");
    }

    return `[${[...path, parameter.name].join(".")}${
      parameter.default ? `=${parameter.default}` : ""
    }]`;
  }

  private generateOperationDocs(operation: Operation): string {
    const summeryAndDescriptionEqual = operation.summary === operation.description;

    if (summeryAndDescriptionEqual) {
      return `/** ${operation.externalDocs ? `\n* @see ${operation.externalDocs}\n` : "\n"}${
        operation.deprecated ? "\n* @deprecated\n" : "\n"
      }${
        operation.summary ? "\n* " + escapeComment(operation.summary) : ""
      }${this.generateOperationParameterComments(operation.parameters)} \n*/`;
    }

    return `/** ${operation.externalDocs ? `\n* @see ${operation.externalDocs}\n` : "\n"}${
      operation.deprecated ? "\n* @deprecated\n" : "\n"
    }${operation.summary ? "\n* " + escapeComment(operation.summary) : ""}${
      operation.description ? "\n* " + escapeComment(operation.description) : ""
    }${this.generateOperationParameterComments(operation.parameters)} \n*/`;
  }

  private generateModel(model: Model): string {
    if (model.export === "interface") {
      return this.generateModelInterface(model);
    }

    return this.generateModelGeneric(model);
  }

  private generateModelInterface(model: Model): string {
    return `${this.generateModelComments(model)}\nexport type ${
      model.name
    } = { ${this.generateModelProperties(model)}}`;
  }

  private generateModelGeneric(model: Model): string {
    return `${this.generateModelComments(model)}\nexport type ${model.name} = ${this.generateType(
      model,
    )}`;
  }

  private generateModelComments(m: Model) {
    switch (m.export) {
      case "array": {
        return this.generateArrayModelComments(m);
      }
      default: {
        return this.generateGenericModelComments(m);
      }
    }
  }

  private generateArrayModelComments(m: Model): string {
    if (!m.description && !m.deprecated && (!m.examples || m.examples.length === 0)) {
      return m.link ? this.generateModelComments(m.link) : "";
    }

    let modelExamples = this.generateModelExamples(m);

    if (modelExamples.length === 0) {
      modelExamples = m.link ? this.generateModelExamples({ ...m.link, export: "array" }) : "";
    }

    return (
      "\n\n/** " +
      (m.description ? `\n* ${m.description}` : "") +
      (m.link?.description ? `\n* ${m.link.description}` : "") +
      (m.deprecated ? `\n* @deprecated` : "") +
      modelExamples +
      "\n*/"
    );
  }

  private generateGenericModelComments(m: Model) {
    if (!m.description && !m.deprecated && (!m.examples || m.examples.length === 0)) {
      return "";
    }

    return (
      "\n\n/** " +
      (m.description ? `\n* ${m.description}` : "") +
      (m.deprecated ? `\n* @deprecated` : "") +
      this.generateModelExamples(m) +
      "\n*/"
    );
  }

  private generateModelExamples(m: Model) {
    if (!m.example && (!m.examples || m.examples.length === 0)) {
      return "";
    }

    if (m.example) {
      return this.generateModelExample(m, m.example);
    }

    if (m.examples) {
      return `\n* ${m.examples
        .map((example) => this.generateModelExample(m, example))
        .join("\n* ")}`;
    }

    return "";
  }

  private baseUrl(): string {
    return this.options?.baseUrl || "https://apihero.run";
  }

  private generateModelExample(model: Model, example: unknown): string {
    if (model.identifier) {
      return `\n* @example @see ${this.baseUrl()}/integrations/${this.identifier}/examples/${
        model.identifier
      }`;
    }

    return `\n* @example\n* ${this.generateModelExampleContent(model, example)}`;
  }

  private generateModelExampleContent(model: Model, example: unknown): string {
    if (model.export === "array" && !Array.isArray(example)) {
      return `[${prettyPrintJSONInComment(JSON.stringify(example, null, 2))}]`;
    }

    return prettyPrintJSONInComment(JSON.stringify(example, null, 2));
  }

  private generateType(property: Model, parent?: Model) {
    switch (property.export) {
      case "interface":
        return this.generateTypeInterface(property, parent);
      case "generic":
        return this.generateTypeGeneric(property, parent);
      case "enum":
        return this.generateTypeEnum(property, parent);
      case "array":
        return this.generateTypeArray(property, parent);
      case "reference":
        return this.generateTypeReference(property, parent);
      case "dictionary":
        return this.generateTypeDictionary(property, parent);
      case "one-of":
      case "any-of":
        return this.generateCompositeType(property, "|", parent);
      case "all-of":
        return this.generateCompositeType(property, "&", parent);
      default:
        throw new Error(`Unknown export type: ${property.export}`);
    }
  }

  private generateCompositeType(model: Model, compositeType: "|" | "&", parent?: Model): string {
    const unique = <T>(val: T, index: number, arr: T[]): boolean => {
      return arr.indexOf(val) === index;
    };

    const sortNullLast = (a: string, b: string): number => {
      if (a === "null") {
        return 1;
      }

      if (b === "null") {
        return -1;
      }

      return 0;
    };

    const types = model.properties.map((property) => this.generateType(property, parent));
    const uniqueTypes = types.sort(sortNullLast).filter(unique);
    let uniqueTypesString = uniqueTypes.join(` ${compositeType} `);
    if (uniqueTypes.length > 1) {
      uniqueTypesString = `(${uniqueTypesString})`;
    }
    return uniqueTypesString;
  }

  private generateTypeDictionary(property: Model, parent?: Model): string {
    if (property.link) {
      return `Record<string, ${this.generateType(property.link)}>${generateIsNullable(property)}`;
    } else {
      return `Record<string, ${property.base}>${generateIsNullable(property)}`;
    }
  }

  private generateTypeReference(property: Model, parent?: Model): string {
    return `${property.base}${generateIsNullable(property)}`;
  }

  private generateTypeArray(property: Model, parent?: Model): string {
    if (property.link) {
      return `Array<${this.generateType(property.link)}>${generateIsNullable(property)}`;
    } else {
      return `Array<${property.base}>${generateIsNullable(property)}`;
    }
  }

  private generateTypeEnum(property: Model, parent?: Model): string {
    return `${property.enum.map((e) => e.value).join(" | ")}${generateIsNullable(property)}`;
  }

  private generateTypeGeneric(property: Model, parent?: Model): string {
    return `${this.generateGenericBase(property.base)}${generateIsNullable(property)}`;
  }

  private generateGenericBase(base: string): string {
    return base === "binary" ? "ReadableStream" : base;
  }

  private generateTypeInterface(model: Model, parent?: Model): string {
    if (!model.properties) {
      return "any";
    } else {
      return `{
${model.properties.map((p) => this.generateModelProperty(p, parent)).join("")}
${model.additionalProperties ? this.generateAdditionalProperties(model.additionalProperties) : ""}
}${generateIsNullable(model)}`;
    }
  }

  private generateAdditionalProperties(model: Model): string {
    return `\n  [key: string]: ${this.generateType(model)} | undefined;`;
  }

  private generateModelProperty(property: Model, parent?: Model): string {
    return `${this.generateModelComments(property)}\n${property.isReadOnly ? "readonly " : ""}${
      property.name
    }${!property.isRequired && !property.default ? "?" : ""}: ${this.generateType(
      property,
      parent,
    )};`;
  }

  private generateModelProperties(model: Model) {
    return model.properties.map((p) => this.generateModelProperty(p, model)).join("");
  }
}

function prettyPrintJSONInComment(json: string): string {
  return `${json.replace(/\r?\n/g, "\n* ")}`;
}

function generateIsNullable(property: Model): string {
  return property.isNullable ? " | null" : "";
}

function getAllImportsRecursive(
  imports: string[],
  allModels: Model[],
  models: Model[] = [],
): Model[] {
  const newModels = imports
    .map((i) => allModels.find((model) => model.name === i))
    .filter((m) => m !== undefined) as Model[];

  if (newModels.length === 0) {
    return models;
  }

  const newImports = newModels
    .flatMap((m) => m.imports)
    .filter(unique)
    .filter((i) => !imports.includes(i))
    .filter((i) => !models.find((m) => m.name === i))
    .filter((i) => !newModels.find((m) => m.name === i))
    .sort(sort);

  return getAllImportsRecursive(newImports, allModels, models.concat(newModels));
}

const unique = <T>(val: T, index: number, arr: T[]): boolean => {
  return arr.indexOf(val) === index;
};

const sort = (a: string, b: string): number => {
  const nameA = a.toLowerCase();
  const nameB = b.toLowerCase();
  return nameA.localeCompare(nameB, "en");
};

const escapeComment = (value: string): string => {
  return value
    .replace(/\*\//g, "*")
    .replace(/\/\*/g, "*")
    .replace(/\r?\n(.*)/g, (_, w) => `\n * ${w.trim()}`);
};
