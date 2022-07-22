import { getOpenAPISpec } from "../src/spec";

test("getOpenApiSpec v3/petstore.json", async () => {
  const location = "./tests/fixtures/specs/v3/petstore.json";
  const spec = await getOpenAPISpec(location);

  expect(spec).toBeDefined();
});

test.only("getOpenApiSpec v3/github.json", async () => {
  const location = "./tests/fixtures/specs/v3/github.json";
  const spec = await getOpenAPISpec(location);

  expect(spec).toBeDefined();
});
