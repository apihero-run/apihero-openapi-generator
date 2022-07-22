import RefParser from "json-schema-ref-parser";

export const getOpenAPISpec = async (location: string): Promise<any> => {
  return RefParser.parse(location);
};
