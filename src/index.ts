import { OpenAPI } from "openapi-types";
import { Client, Enum, Model } from "~/@types";
import { generateFromClient } from "~/generate";
import { parseSpec } from "~/parse";
import prettier from "prettier";

export function generateClientCode(doc: OpenAPI.Document): string {
  const client = postProcessClient(parseSpec(doc));

  const rawCode = generateFromClient(client);
  const formattedCode = prettier.format(rawCode, { parser: "typescript", printWidth: 100 });

  console.log(formattedCode);

  return formattedCode;
}

const postProcessClient = (client: Client): Client => {
  return {
    ...client,
    models: client.models.map((model) => postProcessModel(model)),
  };
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
