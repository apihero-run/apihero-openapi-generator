import { OpenAPI } from "openapi-types";
import { generateClientFiles } from "../src";
import { readFile } from "fs/promises";

async function loadTestCase(testCaseId: string): Promise<OpenAPI.Document> {
  const rawFile = await readFile(`./tests/fixtures/testCases/${testCaseId}.json`, "utf8");

  return JSON.parse(rawFile) as OpenAPI.Document;
}

async function generateTestCase(testCaseId: string): Promise<Map<string, string>> {
  const doc = await loadTestCase(testCaseId);

  const code = generateClientFiles(doc, testCaseId);

  return code;
}

test("code generation test cases", async () => {
  expect(await generateTestCase("createLabel")).toMatchSnapshot();
});
