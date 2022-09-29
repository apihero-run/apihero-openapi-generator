import { generateClientFiles } from "../src";
import { OpenAPI } from "openapi-types";
import { readFile } from "fs/promises";

async function loadSpecFromFixtureFile(filePath: string): Promise<OpenAPI.Document> {
  const rawFile = await readFile(filePath, "utf8");

  return JSON.parse(rawFile) as OpenAPI.Document;
}

test("v3/petstore.json", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3/petstore.json");

  const code = generateClientFiles(doc, "petstore/v3");

  expect(code.files).toMatchSnapshot();
  expect(code.mappings).toMatchInlineSnapshot(`
    Object {
      "deletePet": Array [
        Object {
          "mappedName": "apiKey",
          "name": "api_key",
          "type": "parameter",
        },
      ],
    }
  `);
});

test("v3/petstore.json with additional options", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3/petstore.json");

  const code = generateClientFiles(doc, "petstore/v3", {
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

  const { files, mappings } = generateClientFiles(doc, "github/v3");

  expect(files).toMatchSnapshot();
  expect(mappings).toMatchSnapshot();
});

test("v3_1/github.json", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3_1/github.json");

  const code = generateClientFiles(doc, "github/v3.1");

  expect(code).toMatchSnapshot();
});

test("v3_1/github.json with inferRequestBodyName", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3_1/github.json");

  const { files, mappings } = generateClientFiles(doc, "github/v3.1", {
    generation: { inferRequestBodyParamName: true },
  });

  expect(files).toMatchSnapshot();
  expect(mappings).toMatchSnapshot();
});

test("v3_1/cloudRenderer.json", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3_1/cloudRenderer.json");

  const code = generateClientFiles(doc, "cloudRenderer/v3.1");

  expect(code).toMatchSnapshot();
});

test("v3/twitter.json", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3/twitter.json");

  const code = generateClientFiles(doc, "twitter/v3");

  expect(code).toMatchSnapshot();
});
