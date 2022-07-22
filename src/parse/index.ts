import { OpenAPI } from "openapi-types";
import { Client } from "../@types";
import { getModels } from "./models";
import { getServices } from "./services";

export function parseSpec(doc: OpenAPI.Document): Client {
  return {
    version: doc.info.version,
    models: getModels(doc),
    services: getServices(doc),
  };
}
