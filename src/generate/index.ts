import { camelCase } from "camel-case";
import { Client, Model, Operation, Service } from "../@types";

export type GenerateClientOptions = {
  additionalImports?: Array<{ imports: string[]; name: string }>;
  additionalData?: Record<string, string | number>;
  baseUrl?: string;
};

export function generateFromClient(
  client: Client,
  identifier: string,
  options?: GenerateClientOptions,
): Map<string, string> {
  const files = new Map<string, string>();

  const clientGenerator = new ClientGenerator(identifier, client, options);

  const modelCode = clientGenerator.generateModels();

  files.set("@types.ts", modelCode);

  const servicesCode = clientGenerator.generateServices();

  for (const [name, code] of servicesCode) {
    files.set(`${name}.ts`, code);
  }

  const indexCode = clientGenerator.generateIndex();

  files.set("index.ts", indexCode);

  return files;
}

export function generateOperationCodeFromClient(client: Client, operationId: string): string {
  let operation: Operation | undefined;

  for (const service of client.services) {
    for (const op of service.operations) {
      if (op.id === operationId) {
        operation = op;
        break;
      }
    }
  }

  if (!operation) {
    throw new Error(`Operation with id ${operationId} not found`);
  }

  const models = getAllImportsRecursive(operation.imports, client.models);

  const clientGenerator = new ClientGenerator(operationId, client);

  const modelCode = clientGenerator.generateModelSelection(models);

  const operationCode = clientGenerator.generateOperation(operation);

  return `${modelCode}\n\n${operationCode}`;
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

  generateModelSelection(models: Array<Model>): string {
    const endpointGenericCode = `export type ApiHeroEndpoint<Params, ResponseBody, Headers = unknown> = \n{ id: string;\n[key: string]: string | number;\n };`;

    const modelsCode = models.map((model) => this.generateModel(model)).join("\n\n");

    return `${endpointGenericCode}\n\n${modelsCode}`;
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
      return "never";
    }

    return `{ ${operation.parameters
      .map((param) => this.generateOperationParameter(param))
      .join("; ")} }`;
  }

  private generateOperationParameter(parameter: Operation["parameters"][0]): string {
    return `${parameter.name}${parameter.isRequired ? "" : "?"}: ${this.generateType(parameter)}`;
  }

  private generateOperationParameterComments(parameters: Model[], path: string[] = []): string {
    if (!parameters || parameters.length === 0) {
      return "";
    }

    return `\n\n${parameters
      .map((parameter) => this.generateOperationParameterComment(parameter, path))
      .join("\n")}`;
  }

  private generateOperationParameterComment(parameter: Model, path: string[] = []): string {
    return `* @param ${[...path, parameter.name].join(".")} ${
      parameter.description ? `- ${parameter.description}` : ""
    }${this.generateOperationParameterComments(parameter.properties, [parameter.name])}`;
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

    return `\n* @example\n* ${prettyPrintJSONInComment(JSON.stringify(example, null, 2))}`;
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

  private generateTypeInterface(property: Model, parent?: Model): string {
    if (!property.properties) {
      return "any";
    } else {
      return `{
${property.properties.map((p) => this.generateModelProperty(p, parent)).join("")}
}${generateIsNullable(property)}`;
    }
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
