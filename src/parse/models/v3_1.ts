import { pascalCase } from "change-case";
import { OpenAPIV3_1 } from "openapi-types";
import { Enum, Model, ModelComposition, Type } from "../../@types";
import { getRef } from "../common/v3_1";

export function getModels(doc: OpenAPIV3_1.Document): Model[] {
  const models: Model[] = [];

  if (doc.components && doc.components.schemas) {
    // Iterate over the doc.components.schemas
    for (const [name, schema] of Object.entries(doc.components.schemas)) {
      models.push(getModel(doc, name, schema));
    }
  }

  return models;
}

export function getModel(
  doc: OpenAPIV3_1.Document,
  name: string,
  schema: OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject,
  isDefinition = false,
): Model {
  const normalizedName = normalizeModelName(name);

  if ("$ref" in schema) {
    return getReferenceModel(doc, schema, normalizedName, name, isDefinition);
  } else {
    return getSchemaModel(doc, schema, normalizedName, name, isDefinition);
  }
}

function getReferenceModel(
  doc: OpenAPIV3_1.Document,
  schema: OpenAPIV3_1.ReferenceObject,
  name: string,
  identifier: string,
  isDefinition: boolean,
): Model {
  const model: Model = {
    name,
    type: "any",
    export: "reference",
    isDefinition,
    isReadOnly: true,
    isRequired: false,
    isNullable: false,
    imports: [],
    base: "any",
    template: null,
    properties: [],
    enum: [],
    enums: [],
    link: null,
    description: null,
    examples: [],
  };

  const definitionRef = getType(schema.$ref);
  model.type = definitionRef.type;
  model.base = definitionRef.base;
  model.template = definitionRef.template;
  model.imports.push(...definitionRef.imports);

  return model;
}

function getSchemaModel(
  doc: OpenAPIV3_1.Document,
  schema: OpenAPIV3_1.SchemaObject,
  name: string,
  identifier: string,
  isDefinition: boolean,
): Model {
  const model: Model = {
    name,
    type: "any",
    base: "any",
    export: "interface",
    isReadOnly: schema.readOnly === true,
    isRequired: false,
    isNullable: Array.isArray(schema.type) && schema.type.includes("null"),
    isDefinition,
    imports: [],
    properties: [],
    enum: [],
    enums: [],
    template: null,
    link: null,
    examples: schema.examples || [],
    description: schema.description ?? null,
    format: schema.format,
    maximum: schema.maximum,
    exclusiveMaximum: schema.exclusiveMaximum,
    minimum: schema.minimum,
    exclusiveMinimum: schema.exclusiveMinimum,
    multipleOf: schema.multipleOf,
    maxLength: schema.maxLength,
    minLength: schema.minLength,
    maxItems: schema.maxItems,
    minItems: schema.minItems,
    uniqueItems: schema.uniqueItems,
    maxProperties: schema.maxProperties,
    minProperties: schema.minProperties,
    pattern: getPattern(schema.pattern),
    deprecated: schema.deprecated,
  };

  const example = getExampleForIdentifier(doc, identifier);

  if (example) {
    model.example = example.value;
  }

  const schemaType = getSchemaType(schema.type);

  if (schema.enum && schemaType !== "boolean") {
    const enumerators = getEnum(schema.enum);
    const extendedEnumerators = extendEnum(enumerators, schema as WithEnumExtension);
    if (extendedEnumerators.length) {
      model.export = "enum";
      model.type = "string";
      model.base = "string";
      model.enum.push(...extendedEnumerators);
      return model;
    }
  }

  if (schemaType === "array" && "items" in schema && schema.items) {
    if ("$ref" in schema.items) {
      const arrayItems = getType(schema.items.$ref);

      model.export = "array";
      model.type = arrayItems.type;
      model.base = arrayItems.base;
      model.template = arrayItems.template;
      model.imports.push(...arrayItems.imports);

      return model;
    } else {
      const arrayItems = getModel(doc, "", schema.items);

      model.export = "array";
      model.type = arrayItems.type;
      model.base = arrayItems.base;
      model.template = arrayItems.template;
      model.link = arrayItems;
      model.imports.push(...arrayItems.imports);

      return model;
    }
  }

  if (schemaType === "object" && typeof schema.additionalProperties === "object") {
    if ("$ref" in schema.additionalProperties) {
      const additionalProperties = getType(schema.additionalProperties.$ref);

      model.export = "dictionary";
      model.type = additionalProperties.type;
      model.base = additionalProperties.base;
      model.template = additionalProperties.template;
      model.imports.push(...additionalProperties.imports);
      model.default = getModelDefault(schema as OpenAPIV3_1.NonArraySchemaObject, model);

      return model;
    } else {
      const additionalProperties = getModel(doc, "", schema.additionalProperties);

      model.export = "dictionary";
      model.type = additionalProperties.type;
      model.base = additionalProperties.base;
      model.template = additionalProperties.template;
      model.link = additionalProperties;
      model.imports.push(...additionalProperties.imports);
      model.default = getModelDefault(schema as OpenAPIV3_1.NonArraySchemaObject, model);

      return model;
    }
  }

  if (schema.oneOf?.length) {
    const composition = getModelComposition(doc, schema, schema.oneOf, "one-of");
    model.export = composition.type;
    model.imports.push(...composition.imports);
    model.properties.push(...composition.properties);
    model.enums.push(...composition.enums);
    return model;
  }

  if (schema.anyOf?.length) {
    const composition = getModelComposition(doc, schema, schema.anyOf, "any-of");
    model.export = composition.type;
    model.imports.push(...composition.imports);
    model.properties.push(...composition.properties);
    model.enums.push(...composition.enums);
    return model;
  }

  if (schema.allOf?.length) {
    const composition = getModelComposition(doc, schema, schema.allOf, "all-of");
    model.export = composition.type;
    model.imports.push(...composition.imports);
    model.properties.push(...composition.properties);
    model.enums.push(...composition.enums);
    return model;
  }

  if (schemaType === "object") {
    model.export = "interface";
    model.type = "any";
    model.base = "any";

    if (schema.properties) {
      const modelProperties = getModelProperties(doc, schema as OpenAPIV3_1.NonArraySchemaObject);

      modelProperties.forEach((modelProperty) => {
        model.imports.push(...modelProperty.imports);
        model.enums.push(...modelProperty.enums);
        model.properties.push(modelProperty);
        if (modelProperty.export === "enum") {
          model.enums.push(modelProperty);
        }
      });
    }

    return model;
  }

  // If the schema has a type than it can be a basic or generic type.
  if (schemaType) {
    const definitionType = getType(schema.type, schema.format);
    model.export = "generic";
    model.type = definitionType.type;
    model.base = definitionType.base;
    model.template = definitionType.template;
    model.isNullable = definitionType.isNullable || model.isNullable;
    model.imports.push(...definitionType.imports);
    model.default = getModelDefault(schema as OpenAPIV3_1.NonArraySchemaObject, model);
    return model;
  }

  return model;
}

export const getEnum = (values?: (string | number)[]): Enum[] => {
  if (Array.isArray(values)) {
    return values
      .filter((value, index, arr) => {
        return arr.indexOf(value) === index;
      })
      .filter((value: any) => {
        return typeof value === "number" || typeof value === "string";
      })
      .map((value) => {
        if (typeof value === "number") {
          return {
            name: `'_${value}'`,
            value: String(value),
            type: "number",
            description: null,
          };
        }
        return {
          name: String(value)
            .replace(/\W+/g, "_")
            .replace(/^(\d+)/g, "_$1")
            .replace(/([a-z])([A-Z]+)/g, "$1_$2")
            .toUpperCase(),
          value: `'${value.replace(/'/g, "\\'")}'`,
          type: "string",
          description: null,
        };
      });
  }
  return [];
};

type WithEnumExtension = {
  "x-enum-varnames"?: string[];
  "x-enum-descriptions"?: string[];
};

/**
 * Extend the enum with the x-enum properties. This adds the capability
 * to use names and descriptions inside the generated enums.
 * @param enumerators
 * @param definition
 */
export const extendEnum = (enumerators: Enum[], definition: WithEnumExtension): Enum[] => {
  const isString = (val: any): val is string => {
    return typeof val === "string";
  };

  const names = definition["x-enum-varnames"]?.filter(isString);
  const descriptions = definition["x-enum-descriptions"]?.filter(isString);

  return enumerators.map((enumerator, index) => ({
    name: names?.[index] || enumerator.name,
    description: descriptions?.[index] || enumerator.description,
    value: enumerator.value,
    type: enumerator.type,
  }));
};

export const getModelDefault = (
  schema: OpenAPIV3_1.NonArraySchemaObject,
  model?: Model,
): string | undefined => {
  if (schema.default === undefined) {
    return undefined;
  }

  if (schema.default === null) {
    return "null";
  }

  const type = schema.type || typeof schema.default;

  switch (type) {
    case "integer":
    case "number":
      if (model?.export === "enum" && model.enum?.[schema.default]) {
        return model.enum[schema.default].value;
      }
      return schema.default;

    case "boolean":
      return JSON.stringify(schema.default);

    case "string":
      return `'${schema.default}'`;

    case "object":
      try {
        return JSON.stringify(schema.default, null, 4);
      } catch (e) {
        // Ignore
      }
  }

  return undefined;
};

export const getModelComposition = (
  doc: OpenAPIV3_1.Document,
  schema: OpenAPIV3_1.SchemaObject,
  schemas: Array<OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject>,
  type: "one-of" | "any-of" | "all-of",
): ModelComposition => {
  const composition: ModelComposition = {
    type,
    imports: [],
    enums: [],
    properties: [],
  };

  const properties: Model[] = [];

  schemas
    .map((subSchema) => getModel(doc, "", subSchema))
    .filter((model) => {
      const hasProperties = model.properties.length;
      const hasEnums = model.enums.length;
      const isObject = model.type === "any";
      const isDictionary = model.export === "dictionary";
      const isEmpty = isObject && !hasProperties && !hasEnums;
      return !isEmpty || isDictionary;
    })
    .forEach((model) => {
      composition.imports.push(...model.imports);
      composition.enums.push(...model.enums);
      composition.properties.push(model);
    });

  if (schema.required) {
    const requiredProperties = getRequiredPropertiesFromComposition(doc, schema.required, schemas);
    requiredProperties.forEach((requiredProperty) => {
      composition.imports.push(...requiredProperty.imports);
      composition.enums.push(...requiredProperty.enums);
    });
    properties.push(...requiredProperties);
  }

  if (schema.properties) {
    const modelProperties = getModelProperties(doc, schema as OpenAPIV3_1.NonArraySchemaObject);
    modelProperties.forEach((modelProperty) => {
      composition.imports.push(...modelProperty.imports);
      composition.enums.push(...modelProperty.enums);
      if (modelProperty.export === "enum") {
        composition.enums.push(modelProperty);
      }
    });
    properties.push(...modelProperties);
  }

  if (properties.length) {
    composition.properties.push({
      name: "properties",
      export: "interface",
      type: "any",
      base: "any",
      template: null,
      link: null,
      description: "",
      isDefinition: false,
      isReadOnly: false,
      isNullable: false,
      isRequired: false,
      imports: [],
      enum: [],
      enums: [],
      examples: [],
      properties,
    });
  }

  return composition;
};

export const getRequiredPropertiesFromComposition = (
  doc: OpenAPIV3_1.Document,
  required: string[],
  schemas: Array<OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject>,
): Model[] => {
  return schemas
    .reduce((properties, s) => {
      if ("$ref" in s) {
        const schema = getRef<OpenAPIV3_1.SchemaObject>(doc, s);

        return [...properties, ...getModel(doc, "", schema).properties];
      }

      return [...properties, ...getModel(doc, "", s).properties];
    }, [] as Model[])
    .filter((property) => {
      return !property.isRequired && required.includes(property.name);
    })
    .map((property) => {
      return {
        ...property,
        isRequired: true,
      };
    });
};

export const getModelProperties = (
  doc: OpenAPIV3_1.Document,
  schema: OpenAPIV3_1.NonArraySchemaObject,
): Model[] => {
  const models: Model[] = [];

  if (!schema.properties) {
    return models;
  }

  for (const [propertyName, property] of Object.entries(schema.properties)) {
    const propertyRequired = !!schema.required?.includes(propertyName);

    if ("$ref" in property) {
      const model = getType(property.$ref);

      models.push({
        name: escapeName(propertyName),
        export: "reference",
        type: model.type,
        base: model.base,
        template: model.template,
        link: null,
        description: null,
        isDefinition: false,
        isReadOnly: false,
        isRequired: propertyRequired,
        isNullable: false,
        imports: model.imports,
        enum: [],
        enums: [],
        properties: [],
        examples: [],
      });
    } else {
      const model = getModel(doc, propertyName, property);

      models.push({
        name: escapeName(propertyName),
        export: model.export,
        type: model.type,
        base: model.base,
        template: model.template,
        link: model.link,
        description: property.description || null,
        isDefinition: false,
        isReadOnly: property.readOnly === true,
        isRequired: propertyRequired,
        isNullable: property["x-nullable" as keyof typeof property] === true,
        format: property.format,
        maximum: property.maximum,
        exclusiveMaximum: property.exclusiveMaximum,
        minimum: property.minimum,
        exclusiveMinimum: property.exclusiveMinimum,
        multipleOf: property.multipleOf,
        maxLength: property.maxLength,
        minLength: property.minLength,
        maxItems: property.maxItems,
        minItems: property.minItems,
        uniqueItems: property.uniqueItems,
        maxProperties: property.maxProperties,
        minProperties: property.minProperties,
        pattern: getPattern(property.pattern),
        imports: model.imports,
        enum: model.enum,
        enums: model.enums,
        properties: model.properties,
        deprecated: property.deprecated,
        examples: property.examples,
      });
    }
  }

  return models;
};

/**
 * The spec generates a pattern like this '^\d{3}-\d{2}-\d{4}$'
 * However, to use it in HTML or inside new RegExp() we need to
 * escape the pattern to become: '^\\d{3}-\\d{2}-\\d{4}$' in order
 * to make it a valid regexp string.
 * @param pattern
 */
export const getPattern = (pattern?: string): string | undefined => {
  return pattern?.replace(/\\/g, "\\\\");
};

export const escapeName = (value: string): string => {
  if (value || value === "") {
    const validName = /^[a-zA-Z_$][\w$]+$/g.test(value);
    if (!validName) {
      return `'${value}'`;
    }
  }
  return value;
};

const TYPE_MAPPINGS = new Map<string, string>([
  ["file", "binary"],
  ["any", "any"],
  ["object", "any"],
  ["array", "any[]"],
  ["boolean", "boolean"],
  ["byte", "number"],
  ["int", "number"],
  ["integer", "number"],
  ["float", "number"],
  ["double", "number"],
  ["short", "number"],
  ["long", "number"],
  ["number", "number"],
  ["char", "string"],
  ["date", "string"],
  ["date-time", "string"],
  ["password", "string"],
  ["string", "string"],
  ["void", "void"],
  ["null", "null"],
]);

/**
 * Get mapped type for given type to any basic Typescript/Javascript type.
 */
export const getMappedType = (type: string, format?: string): string | undefined => {
  if (format === "binary") {
    return "binary";
  }
  return TYPE_MAPPINGS.get(type);
};

export function getSchemaType(
  type: OpenAPIV3_1.SchemaObject["type"],
): OpenAPIV3_1.ArraySchemaObjectType | OpenAPIV3_1.NonArraySchemaObjectType | undefined {
  if (Array.isArray(type)) {
    return type.find((t) => t !== "null");
  }

  return type;
}

export function getType(type: string | string[] = "any", format?: string): Type {
  const encode = (value: string): string => {
    return value.replace(/^[^a-zA-Z_$]+/g, "").replace(/[^\w$]+/g, "_");
  };

  const stripNamespace = (value: string): string => {
    return value
      .trim()
      .replace(/^#\/components\/schemas\//, "")
      .replace(/^#\/components\/responses\//, "")
      .replace(/^#\/components\/parameters\//, "")
      .replace(/^#\/components\/examples\//, "")
      .replace(/^#\/components\/requestBodies\//, "")
      .replace(/^#\/components\/headers\//, "")
      .replace(/^#\/components\/securitySchemes\//, "")
      .replace(/^#\/components\/links\//, "")
      .replace(/^#\/components\/callbacks\//, "");
  };

  const result: Type = {
    type: "any",
    base: "any",
    template: null,
    imports: [],
    isNullable: false,
  };

  // Special case for JSON Schema spec (december 2020, page 17),
  // that allows type to be an array of primitive types...
  if (Array.isArray(type)) {
    const joinedType = type
      .filter((value) => value !== "null")
      .map((value) => getMappedType(value, format))
      .filter(isDefined)
      .join(" | ");

    result.type = joinedType;
    result.base = joinedType;
    result.isNullable = type.includes("null");

    return result;
  }

  const mapped = getMappedType(type, format);
  if (mapped) {
    result.type = mapped;
    result.base = mapped;
    return result;
  }

  const typeWithoutNamespace = decodeURIComponent(stripNamespace(type));

  if (/\[.*\]$/g.test(typeWithoutNamespace)) {
    const matches = typeWithoutNamespace.match(/(.*?)\[(.*)\]$/);
    if (matches?.length) {
      const match1 = getType(encode(matches[1]));
      const match2 = getType(encode(matches[2]));

      if (match1.type === "any[]") {
        result.type = `${match2.type}[]`;
        result.base = `${match2.type}`;
        match1.imports = [];
      } else if (match2.type) {
        result.type = `${match1.type}<${match2.type}>`;
        result.base = match1.type;
        result.template = match2.type;
      } else {
        result.type = match1.type;
        result.base = match1.type;
        result.template = match1.type;
      }

      result.imports.push(...match1.imports);
      result.imports.push(...match2.imports);
      return result;
    }
  }

  if (typeWithoutNamespace) {
    const type = pascalCase(encode(typeWithoutNamespace));
    result.type = type;
    result.base = type;
    result.imports.push(type);
    return result;
  }

  return result;
}

function getExampleForIdentifier(
  doc: OpenAPIV3_1.Document,
  identifier: string,
): OpenAPIV3_1.ExampleObject | undefined {
  const examples = doc.components?.examples;
  if (examples) {
    return examples[identifier];
  }
}

// normalizeModelName should be used to convert a model name to a valid typescript name
// Some examples:
//  "pet" => "Pet"
//  "from_email_object" => "FromEmailObject"
//  "contactdb_segments" => "ContactdbSegments"
function normalizeModelName(name: string): string {
  return pascalCase(name);
}

/**
 * Check if a value is defined
 * @param value
 */
export const isDefined = <T>(
  value: T | undefined | null | "",
): value is Exclude<T, undefined | null | ""> => {
  return value !== undefined && value !== null && value !== "";
};
