import { camelCase } from "camel-case";
import { Client, Model, Operation, Service } from "../@types";

export type GenerateClientOptions = {
  additionalImports?: Array<{ imports: string[]; name: string }>;
  additionalData?: Record<string, string | number>;
};

export function generateFromClient(
  client: Client,
  options?: GenerateClientOptions,
): Map<string, string> {
  const files = new Map<string, string>();

  const modelCode = generateClientModels(client.models);

  files.set("@types.ts", modelCode);

  const servicesCode = generateClientServices(client.services, options);

  for (const [name, code] of servicesCode) {
    files.set(`${name}.ts`, code);
  }

  const indexCode = generateClientIndex(servicesCode);

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

  const modelCode = generateClientModels(models);

  const operationCode = generateOperation(operation);

  return `${modelCode}\n\n${operationCode}`;
}

function generateClientIndex(servicesCode: ReturnType<typeof generateClientServices>): string {
  const imports = servicesCode
    .map(([name]) => `import * as ${camelCase(name)} from "./${name}";`)
    .join("\n");

  const exports = `export { ${servicesCode.map(([name]) => camelCase(name)).join(", ")} };`;

  return `${imports}\n\n${exports}\n\nexport * from "./@types";`;
}

function generateClientServices(
  services: Client["services"],
  options?: GenerateClientOptions,
): Array<[string, string]> {
  return services.map((service) => generateClientService(service, options));
}

function generateClientService(
  service: Service,
  options?: GenerateClientOptions,
): [string, string] {
  const serviceCode = generateClientServiceCode(service, options);

  return [service.name, serviceCode];
}

function generateClientServiceCode(service: Service, options?: GenerateClientOptions): string {
  const imports = generateServiceImports(service, options?.additionalImports);

  return `${imports}\n\n${service.operations
    .map((operation) => generateOperation(operation, options?.additionalData))
    .join("\n\n")}`;
}

function generateServiceImports(
  service: Service,
  additionalImports?: GenerateClientOptions["additionalImports"],
): string {
  const additionalImportsCode = (additionalImports ?? [])
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

function generateOperation(
  operation: Operation,
  additionalData?: GenerateClientOptions["additionalData"],
): string {
  return `${generateOperationDocs(operation)}\n${generateOperationExport(
    operation,
    additionalData,
  )}`;
}

function generateOperationExport(
  operation: Operation,
  additionalData?: GenerateClientOptions["additionalData"],
): string {
  const parameters = generateOperationParameters(operation);
  const result = generateOperationResult(operation);
  const headers = generateOperationHeaders(operation);

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

function generateOperationResult(operation: Operation): string {
  if (!operation.results) {
    return "void";
  }

  return operation.results.map((result) => generateType(result)).join(" | ");
}

function generateOperationHeaders(operation: Operation): string | undefined {
  const allHeaders = operation.results.flatMap((result) => result.headers);

  if (allHeaders.length === 0) {
    return;
  }

  return operation.results
    .flatMap((result) => {
      return `{ ${result.headers
        .map((header) => `"${header.name}": ${generateType(header)}; `)
        .join(" ")} }`;
    })
    .join(" | ");
}

function generateOperationParameters(operation: Operation): string {
  if (!operation.parameters || operation.parameters.length === 0) {
    return "never";
  }

  return `{ ${operation.parameters.map(generateOperationParameter).join("; ")} }`;
}

function generateOperationParameter(parameter: Operation["parameters"][0]): string {
  return `${parameter.name}${parameter.isRequired ? "" : "?"}: ${generateType(parameter)}`;
}

function generateOperationDocs(operation: Operation): string {
  const summeryAndDescriptionEqual = operation.summary === operation.description;

  if (summeryAndDescriptionEqual) {
    return `/** ${operation.deprecated ? "* @deprecated\n" : "\n"}${
      operation.summary ? " * " + escapeComment(operation.summary) + "\n" : ""
    } */`;
  }

  return `/** ${operation.deprecated ? "* @deprecated\n" : "\n"}${
    operation.summary ? " * " + escapeComment(operation.summary) + "\n" : ""
  }${operation.description ? " * " + escapeComment(operation.description) + "\n" : ""} */`;
}

const escapeComment = (value: string): string => {
  return value
    .replace(/\*\//g, "*")
    .replace(/\/\*/g, "*")
    .replace(/\r?\n(.*)/g, (_, w) => `\n * ${w.trim()}`);
};

function generateClientModels(models: Client["models"]): string {
  const endpointGenericCode = `export type ApiHeroEndpoint<Params, ResponseBody, Headers = unknown> = \n{ id: string;\n[key: string]: string | number;\n };`;

  const modelsCode = models.map(generateClientModel).join("\n\n");

  return `${endpointGenericCode}\n\n${modelsCode}`;
}

export function generateClientModel(model: Model): string {
  if (model.export === "interface") {
    return generateClientModelInterface(model);
  }

  return generateClientModelGeneric(model);
}

function generateClientModelGeneric(model: Model): string {
  return `${generateModelComments(model)}\nexport type ${model.name} = ${generateType(model)}`;
}

function generateClientModelInterface(model: Model): string {
  return `${generateModelComments(model)}\nexport type ${model.name} = { ${generateModelProperties(
    model,
  )}}`;
}

function generateModelComments(m: Model) {
  if (!m.description && !m.deprecated) {
    return "";
  }

  return (
    "\n\n/** " +
    (m.description ? `\n* ${m.description}` : "") +
    (m.deprecated ? `\n* @deprecated` : "") +
    "\n*/"
  );
}

function generateType(property: Model, parent?: Model) {
  switch (property.export) {
    case "interface":
      return generateTypeInterface(property, parent);
    case "generic":
      return generateTypeGeneric(property, parent);
    case "enum":
      return generateTypeEnum(property, parent);
    case "array":
      return generateTypeArray(property, parent);
    case "reference":
      return generateTypeReference(property, parent);
    case "dictionary":
      return generateTypeDictionary(property, parent);
    case "one-of":
    case "any-of":
      return generateCompositeType(property, "|", parent);
    case "all-of":
      return generateCompositeType(property, "&", parent);
    default:
      throw new Error(`Unknown export type: ${property.export}`);
  }
}

function generateCompositeType(model: Model, compositeType: "|" | "&", parent?: Model): string {
  const unique = <T>(val: T, index: number, arr: T[]): boolean => {
    return arr.indexOf(val) === index;
  };

  const types = model.properties.map((property) => generateType(property, parent));
  const uniqueTypes = types.filter(unique);
  let uniqueTypesString = uniqueTypes.join(` ${compositeType} `);
  if (uniqueTypes.length > 1) {
    uniqueTypesString = `(${uniqueTypesString})`;
  }
  return uniqueTypesString;
}

function generateTypeDictionary(property: Model, parent?: Model): string {
  if (property.link) {
    return `Record<string, ${generateType(property.link)}>${generateIsNullable(property)}`;
  } else {
    return `Record<string, ${property.base}>${generateIsNullable(property)}`;
  }
}

function generateTypeReference(property: Model, parent?: Model): string {
  return `${property.base}${generateIsNullable(property)}`;
}

function generateTypeArray(property: Model, parent?: Model): string {
  if (property.link) {
    return `Array<${generateType(property.link)}>${generateIsNullable(property)}`;
  } else {
    return `Array<${property.base}>${generateIsNullable(property)}`;
  }
}

function generateTypeEnum(property: Model, parent?: Model): string {
  return `${property.enum.map((e) => e.value).join(" | ")}${generateIsNullable(property)}`;
}

function generateTypeGeneric(property: Model, parent?: Model): string {
  return `${generateGenericBase(property.base)}${generateIsNullable(property)}`;
}

function generateGenericBase(base: string): string {
  return base === "binary" ? "ReadableStream" : base;
}

function generateTypeInterface(property: Model, parent?: Model): string {
  if (!property.properties) {
    return "any";
  } else {
    return `{
${property.properties.map((p) => generateModelProperty(p, parent)).join("\n")}
}${generateIsNullable(property)}`;
  }
}

function generateModelProperty(property: Model, parent?: Model): string {
  return `${generateModelComments(property)}\n${property.isReadOnly ? "readonly " : ""}${
    property.name
  }${!property.isRequired && !property.default ? "?" : ""}: ${generateType(property, parent)};`;
}

function generateModelProperties(model: Model) {
  return model.properties.map((p) => generateModelProperty(p, model)).join("");
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
