import { OpenAPIV3, OpenAPIV3_1, OpenAPI } from "openapi-types";
import { Service } from "../../@types";

import * as v3 from "./v3";
import * as v3_1 from "./v3_1";
import * as v2 from "./v2";

export function getServices(doc: OpenAPI.Document): Service[] {
  if ("openapi" in doc) {
    if (doc.openapi.startsWith("3.0.")) {
      return v3.getServices(doc as OpenAPIV3.Document);
    }

    if (doc.openapi.startsWith("3.1.")) {
      return v3_1.getServices(doc as OpenAPIV3_1.Document);
    }

    throw new Error(`Unsupported OpenAPI version: ${doc.openapi}`);
  }

  if ("swagger" in doc) {
    return v2.getServices(doc);
  }

  return [];
}
