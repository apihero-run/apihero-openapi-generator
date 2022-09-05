import { OpenAPI } from "openapi-types";
import { generateClientFiles } from "../src";
import { readFile } from "fs/promises";

async function loadTestCase(testCaseId: string): Promise<OpenAPI.Document> {
  const rawFile = await readFile(`./tests/fixtures/testCases/${testCaseId}.json`, "utf8");

  return JSON.parse(rawFile) as OpenAPI.Document;
}

async function generateTestCase(testCaseId: string) {
  const doc = await loadTestCase(testCaseId);

  const code = generateClientFiles(doc, testCaseId, {
    generation: { inferRequestBodyParamName: true },
  });

  return code;
}

test("createLabel", async () => {
  expect(await generateTestCase("createLabel")).toMatchSnapshot();
});

test("getAuthenticatedApp", async () => {
  expect(await generateTestCase("getAuthenticatedApp")).toMatchSnapshot();
});

test("listPublicEmails", async () => {
  expect(await generateTestCase("listPublicEmails")).toMatchSnapshot();
});

test("addEmailAddress", async () => {
  expect(await generateTestCase("addEmailAddress")).toMatchSnapshot();
});

test("startUserMigration", async () => {
  expect(await generateTestCase("startUserMigration")).toMatchSnapshot();
});

test("createSelfHostedRunnerGroupForOrg", async () => {
  expect(await generateTestCase("createSelfHostedRunnerGroupForOrg")).toMatchSnapshot();
});

test("getThreadSubscriptionForAuthenticatedUser", async () => {
  expect(await generateTestCase("getThreadSubscriptionForAuthenticatedUser")).toMatchSnapshot();
});

test("createForAuthenticatedUser", async () => {
  expect(await generateTestCase("createForAuthenticatedUser")).toMatchSnapshot();
});

test("createCommitStatus", async () => {
  expect(await generateTestCase("createCommitStatus")).toMatchSnapshot();
});

test("updateReference", async () => {
  expect(await generateTestCase("updateReference")).toMatchSnapshot();
});

test("checkTeamPermissions", async () => {
  expect(await generateTestCase("checkTeamPermissions")).toMatchSnapshot();
});

test("renderMarkdown", async () => {
  expect(await generateTestCase("renderMarkdown")).toMatchSnapshot();
});

test("getRepo", async () => {
  expect(await generateTestCase("getRepo")).toMatchSnapshot();
});
