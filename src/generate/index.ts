import { camelCase } from "camel-case";
import { Client, Model, Operation, Service } from "../@types";

export function generateFromClient(client: Client): Map<string, string> {
  const files = new Map<string, string>();

  const modelCode = generateClientModels(client.models);

  files.set("models.ts", modelCode);

  const servicesCode = generateClientServices(client.services);

  for (const [name, code] of servicesCode) {
    files.set(`${name}.ts`, code);
  }

  const indexCode = generateClientIndex(servicesCode);

  files.set("index.ts", indexCode);

  return files;
}

function generateClientIndex(servicesCode: ReturnType<typeof generateClientServices>): string {
  const imports = servicesCode
    .map(([name]) => `import * as ${camelCase(name)} from "./${name}";`)
    .join("\n");

  const exports = `export { ${servicesCode.map(([name]) => camelCase(name)).join(", ")} };`;

  return `${imports}\n\n${exports}\n\nexport * from "./models";`;
}

function generateClientServices(services: Client["services"]): Array<[string, string]> {
  return services.map(generateClientService);
}

function generateClientService(service: Service): [string, string] {
  const serviceCode = generateClientServiceCode(service);

  return [service.name, serviceCode];
}

function generateClientServiceCode(service: Service): string {
  const imports = generateServiceImports(service);

  return `${imports}\n\n${service.operations
    .map((operation) => generateOperation(service, operation))
    .join("\n\n")}`;
}

function generateServiceImports(service: Service): string {
  return `import { ${service.imports.join(", ")} } from "./models";`;
}

function generateOperation(service: Service, operation: Operation): string {
  return `${generateOperationDocs(operation)}\n${generateOperationExport(operation)}`;
}

function generateOperationExport(operation: Operation): string {
  const parameters = generateOperationParameters(operation);
  const result = generateOperationResult(operation);

  return `export const ${operation.name}: ApiHeroEndpoint<${parameters}, ${result}> = {
    id: '${operation.id}',
  }`;
}

function generateOperationResult(operation: Operation): string {
  if (!operation.results) {
    return "void";
  }

  return operation.results.map((result) => generateType(result)).join(" | ");
}

function generateOperationParameters(operation: Operation): string {
  return `{ ${operation.parameters.map(generateOperationParameter)} }`;
}

function generateOperationParameter(parameter: Operation["parameters"][0]): string {
  return `${parameter.name}: ${generateType(parameter)}`;
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
  return models.map(generateClientModel).join("\n\n");
}

function generateClientModel(model: Model): string {
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
  return `${property.base}${generateIsNullable(property)}`;
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
