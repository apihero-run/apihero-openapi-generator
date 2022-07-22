import { OpenAPIV3, OpenAPIV3_1, OpenAPI } from "openapi-types";
import { Model } from "../../@types";

import * as v3 from "./v3";
import * as v3_1 from "./v3_1";
import * as v2 from "./v2";

export function getModels(doc: OpenAPI.Document): Model[] {
  if ("openapi" in doc) {
    if (doc.openapi.startsWith("3.0.")) {
      return v3.getModels(doc as OpenAPIV3.Document);
    }

    if (doc.openapi.startsWith("3.1.")) {
      return v3_1.getModels(doc as OpenAPIV3_1.Document);
    }

    throw new Error(`Unsupported OpenAPI version: ${doc.openapi}`);
  }

  if ("swagger" in doc) {
    return v2.getModels(doc);
  }

  return [];
}
