import { generateClientFiles, generatePackage, generateOperationCode } from "../src";
import { OpenAPI } from "openapi-types";
import { readFile } from "fs/promises";

async function loadSpecFromFixtureFile(filePath: string): Promise<OpenAPI.Document> {
  const rawFile = await readFile(filePath, "utf8");

  return JSON.parse(rawFile) as OpenAPI.Document;
}

test("v3/petstore.json", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3/petstore.json");

  const code = generateClientFiles(doc);

  expect(code).toMatchSnapshot();
});

test("v3/petstore.json with additional options", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3/petstore.json");

  const code = generateClientFiles(doc, {
    additionalImports: [{ name: "@apihero/endpoint", imports: ["ApiHeroEndpoint"] }],
    additionalData: {
      clientId: "github",
      count: 12,
    },
  });

  expect(code).toMatchSnapshot();
});

test("v3/github.json", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3/github.json");

  const code = generateClientFiles(doc);

  expect(code).toMatchSnapshot();
});

test("v3_1/github.json", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3_1/github.json");

  const code = generateClientFiles(doc);

  expect(code).toMatchSnapshot();
});

test("v3_1/github.json generateOperationCode", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3_1/github.json");

  const code = generateOperationCode(doc, "repos/get");

  expect(code).toMatchSnapshot();
});

test("generatePackage", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3/petstore.json");

  await generatePackage(doc, "./tests/tmp/packages/petstore", {
    name: "petstore",
    version: { major: 1, minor: 0, patch: 0 },
  });
});
