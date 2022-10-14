import { generateClientFiles } from "../src";
import { OpenAPI } from "openapi-types";
import { readFile } from "fs/promises";
import { load } from "js-yaml";

function parseYamlOrJson(type: "yaml" | "json", rawValue: string): OpenAPI.Document {
  if (type === "yaml") {
    return load(rawValue) as OpenAPI.Document;
  }

  return JSON.parse(rawValue) as OpenAPI.Document;
}

function detectFileType(filePath: string): "json" | "yaml" {
  const extension = filePath.split(".").pop();

  if (extension === "json") {
    return "json";
  }

  return "yaml";
}

async function loadSpecFromFixtureFile(filePath: string): Promise<OpenAPI.Document> {
  const rawFile = await readFile(filePath, "utf8");

  return parseYamlOrJson(detectFileType(filePath), rawFile);
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

test("v3/twitterLabs.json", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3/twitterLabs.json");

  const code = generateClientFiles(doc, "twitterLabs/v3");

  expect(code).toMatchSnapshot();
});

test("v3/twitterFull.json", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3/twitter.json");

  const code = generateClientFiles(doc, "twitter/v3");

  expect(code).toMatchSnapshot();
});

test.skip("v3/stripe.json", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3/stripe.json");

  const code = generateClientFiles(doc, "stripe/v3");

  expect(code).toMatchSnapshot();
});

test("v3_1/sendgrid.json", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3_1/sendgrid.json");

  const code = generateClientFiles(doc, "sendgrid/v3_1");

  expect(code).toMatchSnapshot();
});

test("v3/mergent.yaml", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3/mergent.yaml");

  const code = generateClientFiles(doc, "v3/mergent");

  expect(code).toMatchSnapshot();
});
