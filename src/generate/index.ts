import { Client, Model } from "~/@types";

export function generateFromClient(client: Client): string {
  const modelCode = generateClientModels(client.models);

  return `${modelCode}`;
}

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
      return generateTypeUnion(property, parent);
    default:
      throw new Error(`Unknown export type: ${property.export}`);
  }
}

function generateTypeUnion(model: Model, parent?: Model): string {
  const unique = <T>(val: T, index: number, arr: T[]): boolean => {
    return arr.indexOf(val) === index;
  };

  const types = model.properties.map((property) => generateType(property, parent));
  const uniqueTypes = types.filter(unique);
  let uniqueTypesString = uniqueTypes.join(" | ");
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
