import { OpenAPI } from "openapi-types";
import { Client, Enum, Model, Operation, Service } from "./@types";
import {
  generateFromClient,
  GenerateClientOptions,
  GenerateClientCodeResult,
  GenerationOptions,
} from "./generate";
import { parseSpec } from "./parse";
import { format } from "prettier";

export { GenerateClientOptions, GenerationOptions };

export function generateClientFiles(
  doc: OpenAPI.Document,
  identifier: string,
  options?: GenerateClientOptions,
) {
  const client = generateClient(doc);

  return generateClientCode(client, identifier, options);
}

export function generateClientCode(
  client: Client,
  identifier: string,
  options?: GenerateClientOptions,
): GenerateClientCodeResult {
  const { files, mappings } = generateFromClient(client, identifier, options);

  // Format each file
  for (const [name, code] of Object.entries(files)) {
    files[name] = format(code, { parser: "typescript", printWidth: 100 });
  }

  return { files, mappings };
}

export function generateClient(doc: OpenAPI.Document): Client {
  return postProcessClient(parseSpec(doc));
}

const postProcessClient = (client: Client): Client => {
  return {
    ...client,
    models: client.models.map((model) => postProcessModel(model)),
    services: client.services.map((service) => postProcessService(service)),
  };
};

const postProcessService = (service: Service): Service => {
  const clone = { ...service };
  clone.operations = postProcessServiceOperations(clone);
  clone.operations.forEach((operation) => {
    clone.imports.push(...operation.imports);
  });
  clone.imports = postProcessServiceImports(clone);
  return clone;
};

export const postProcessServiceImports = (service: Service): string[] => {
  return service.imports.filter(unique).sort(sort);
};

const unique = <T>(val: T, index: number, arr: T[]): boolean => {
  return arr.indexOf(val) === index;
};

const sort = (a: string, b: string): number => {
  const nameA = a.toLowerCase();
  const nameB = b.toLowerCase();
  return nameA.localeCompare(nameB, "en");
};

export const postProcessServiceOperations = (service: Service): Operation[] => {
  const names = new Map<string, number>();

  return service.operations.map((operation) => {
    const clone = JSON.parse(JSON.stringify(operation)) as Operation;

    // Parse the service parameters and results, very similar to how we parse
    // properties of models. These methods will extend the type if needed.
    clone.imports.push(...flatMap(clone.parameters, (parameter) => parameter.imports));
    clone.imports.push(...flatMap(clone.results, (result) => result.imports));

    // Make sure the imports are unique
    clone.imports = clone.imports.filter(unique).sort(sort);

    // Check if the operation name is unique, if not then prefix this with a number
    const name = clone.name;
    const index = names.get(name) || 0;
    if (index > 0) {
      clone.name = `${name}${index}`;
    }
    names.set(name, index + 1);

    return clone;
  });
};

const flatMap = <U, T>(array: T[], callback: (value: T, index: number, array: T[]) => U[]): U[] => {
  const result: U[] = [];
  array.map<U[]>(callback).forEach((arr) => {
    result.push(...arr);
  });
  return result;
};

const postProcessModel = (model: Model): Model => {
  const postProcessModelImports = (model: Model): string[] => {
    return model.imports
      .filter(unique)
      .sort(sort)
      .filter((name) => model.name !== name);
  };

  const postProcessModelEnums = (model: Model): Model[] => {
    return model.enums.filter((property, index, arr) => {
      return arr.findIndex((item) => item.name === property.name) === index;
    });
  };

  const postProcessModelEnum = (model: Model): Enum[] => {
    return model.enum.filter((property, index, arr) => {
      return arr.findIndex((item) => item.name === property.name) === index;
    });
  };

  const sort = (a: string, b: string): number => {
    const nameA = a.toLowerCase();
    const nameB = b.toLowerCase();
    return nameA.localeCompare(nameB, "en");
  };

  const unique = <T>(val: T, index: number, arr: T[]): boolean => {
    return arr.indexOf(val) === index;
  };

  return {
    ...model,
    imports: postProcessModelImports(model),
    enums: postProcessModelEnums(model),
    enum: postProcessModelEnum(model),
  };
};
