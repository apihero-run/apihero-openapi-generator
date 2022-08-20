import { readFile } from "fs/promises";
import { OpenAPIV3_1 } from "openapi-types";
import { getModel as getModelV3_1 } from "../../src/parse/models/v3_1";
import { generateClientModel } from "../../src/generate";
import invariant from "tiny-invariant";

async function loadSpecFromFixtureFile(
  filePath: string,
): Promise<OpenAPIV3_1.Document | undefined> {
  const rawFile = await readFile(filePath, "utf8");

  return JSON.parse(rawFile) as OpenAPIV3_1.Document;
}

test("getModel with Github v3.1", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3_1/github.json");

  invariant(doc, "doc should not be null");

  const model = getModelV3_1(doc, "MinimalRepository", {
    type: "object",
    title: "Minimal Repository",
    required: [
      "archive_url",
      "assignees_url",
      "blobs_url",
      "branches_url",
      "collaborators_url",
      "comments_url",
      "commits_url",
      "compare_url",
      "contents_url",
      "contributors_url",
      "deployments_url",
      "description",
      "downloads_url",
      "events_url",
      "fork",
      "forks_url",
      "full_name",
      "git_commits_url",
      "git_refs_url",
      "git_tags_url",
      "hooks_url",
      "html_url",
      "id",
      "node_id",
      "issue_comment_url",
      "issue_events_url",
      "issues_url",
      "keys_url",
      "labels_url",
      "languages_url",
      "merges_url",
      "milestones_url",
      "name",
      "notifications_url",
      "owner",
      "private",
      "pulls_url",
      "releases_url",
      "stargazers_url",
      "statuses_url",
      "subscribers_url",
      "subscription_url",
      "tags_url",
      "teams_url",
      "trees_url",
      "url",
    ],
    properties: {
      id: {
        type: "integer",
        examples: [1296269],
      },
      url: {
        type: "string",
        format: "uri",
        examples: ["https://api.github.com/repos/octocat/Hello-World"],
      },
      fork: {
        type: "boolean",
      },
      name: {
        type: "string",
        examples: ["Hello-World"],
      },
      size: {
        type: "integer",
      },
      forks: {
        type: "integer",
        examples: [0],
      },
      owner: {
        $ref: "#/components/schemas/simple-user",
      },
      topics: {
        type: "array",
        items: {
          type: "string",
        },
      },
      git_url: {
        type: "string",
      },
      license: {
        type: ["object", "null"],
        properties: {
          key: {
            type: "string",
          },
          url: {
            type: "string",
          },
          name: {
            type: "string",
          },
          node_id: {
            type: "string",
          },
          spdx_id: {
            type: "string",
          },
        },
      },
      node_id: {
        type: "string",
        examples: ["MDEwOlJlcG9zaXRvcnkxMjk2MjY5"],
      },
      private: {
        type: "boolean",
      },
      ssh_url: {
        type: "string",
      },
      svn_url: {
        type: "string",
      },
      archived: {
        type: "boolean",
      },
      disabled: {
        type: "boolean",
      },
      has_wiki: {
        type: "boolean",
      },
      homepage: {
        type: ["string", "null"],
      },
      html_url: {
        type: "string",
        format: "uri",
        examples: ["https://github.com/octocat/Hello-World"],
      },
      keys_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/keys{/key_id}"],
      },
      language: {
        type: ["string", "null"],
      },
      tags_url: {
        type: "string",
        format: "uri",
        examples: ["http://api.github.com/repos/octocat/Hello-World/tags"],
      },
      watchers: {
        type: "integer",
        examples: [0],
      },
      blobs_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}"],
      },
      clone_url: {
        type: "string",
      },
      forks_url: {
        type: "string",
        format: "uri",
        examples: ["http://api.github.com/repos/octocat/Hello-World/forks"],
      },
      full_name: {
        type: "string",
        examples: ["octocat/Hello-World"],
      },
      has_pages: {
        type: "boolean",
      },
      hooks_url: {
        type: "string",
        format: "uri",
        examples: ["http://api.github.com/repos/octocat/Hello-World/hooks"],
      },
      pulls_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/pulls{/number}"],
      },
      pushed_at: {
        type: ["string", "null"],
        format: "date-time",
        examples: ["2011-01-26T19:06:43Z"],
      },
      role_name: {
        type: "string",
        examples: ["admin"],
      },
      teams_url: {
        type: "string",
        format: "uri",
        examples: ["http://api.github.com/repos/octocat/Hello-World/teams"],
      },
      trees_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}"],
      },
      created_at: {
        type: ["string", "null"],
        format: "date-time",
        examples: ["2011-01-26T19:01:12Z"],
      },
      events_url: {
        type: "string",
        format: "uri",
        examples: ["http://api.github.com/repos/octocat/Hello-World/events"],
      },
      has_issues: {
        type: "boolean",
      },
      issues_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/issues{/number}"],
      },
      labels_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/labels{/name}"],
      },
      merges_url: {
        type: "string",
        format: "uri",
        examples: ["http://api.github.com/repos/octocat/Hello-World/merges"],
      },
      mirror_url: {
        type: ["string", "null"],
      },
      updated_at: {
        type: ["string", "null"],
        format: "date-time",
        examples: ["2011-01-26T19:14:43Z"],
      },
      visibility: {
        type: "string",
      },
      archive_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}"],
      },
      commits_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/commits{/sha}"],
      },
      compare_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}"],
      },
      description: {
        type: ["string", "null"],
        examples: ["This your first repo!"],
      },
      forks_count: {
        type: "integer",
      },
      is_template: {
        type: "boolean",
      },
      open_issues: {
        type: "integer",
        examples: [0],
      },
      permissions: {
        type: "object",
        properties: {
          pull: {
            type: "boolean",
          },
          push: {
            type: "boolean",
          },
          admin: {
            type: "boolean",
          },
          triage: {
            type: "boolean",
          },
          maintain: {
            type: "boolean",
          },
        },
      },
      branches_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/branches{/branch}"],
      },
      comments_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/comments{/number}"],
      },
      contents_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/contents/{+path}"],
      },
      git_refs_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}"],
      },
      git_tags_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}"],
      },
      has_projects: {
        type: "boolean",
      },
      releases_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/releases{/id}"],
      },
      statuses_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/statuses/{sha}"],
      },
      allow_forking: {
        type: "boolean",
      },
      assignees_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/assignees{/user}"],
      },
      downloads_url: {
        type: "string",
        format: "uri",
        examples: ["http://api.github.com/repos/octocat/Hello-World/downloads"],
      },
      has_downloads: {
        type: "boolean",
      },
      languages_url: {
        type: "string",
        format: "uri",
        examples: ["http://api.github.com/repos/octocat/Hello-World/languages"],
      },
      network_count: {
        type: "integer",
      },
      default_branch: {
        type: "string",
      },
      milestones_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/milestones{/number}"],
      },
      stargazers_url: {
        type: "string",
        format: "uri",
        examples: ["http://api.github.com/repos/octocat/Hello-World/stargazers"],
      },
      watchers_count: {
        type: "integer",
      },
      code_of_conduct: {
        $ref: "#/components/schemas/code-of-conduct",
      },
      deployments_url: {
        type: "string",
        format: "uri",
        examples: ["http://api.github.com/repos/octocat/Hello-World/deployments"],
      },
      git_commits_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}"],
      },
      subscribers_url: {
        type: "string",
        format: "uri",
        examples: ["http://api.github.com/repos/octocat/Hello-World/subscribers"],
      },
      contributors_url: {
        type: "string",
        format: "uri",
        examples: ["http://api.github.com/repos/octocat/Hello-World/contributors"],
      },
      issue_events_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/issues/events{/number}"],
      },
      stargazers_count: {
        type: "integer",
      },
      subscription_url: {
        type: "string",
        format: "uri",
        examples: ["http://api.github.com/repos/octocat/Hello-World/subscription"],
      },
      temp_clone_token: {
        type: "string",
      },
      collaborators_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}"],
      },
      issue_comment_url: {
        type: "string",
        examples: ["http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}"],
      },
      notifications_url: {
        type: "string",
        examples: [
          "http://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}",
        ],
      },
      open_issues_count: {
        type: "integer",
      },
      subscribers_count: {
        type: "integer",
      },
      template_repository: {
        anyOf: [
          {
            type: "null",
          },
          {
            $ref: "#/components/schemas/repository",
          },
        ],
      },
      delete_branch_on_merge: {
        type: "boolean",
      },
    },
    description: "Minimal Repository",
  });

  expect(generateClientModel(model)).toMatchInlineSnapshot(`
    "

    /** 
    * Minimal Repository
    */
    export type MinimalRepository = { 

    /** 
    * 
    * @example
    * 1296269
    */
    id: number;

    /** 
    * 
    * @example
    * \\"https://api.github.com/repos/octocat/Hello-World\\"
    */
    url: string;
    fork: boolean;

    /** 
    * 
    * @example
    * \\"Hello-World\\"
    */
    name: string;
    size?: number;

    /** 
    * 
    * @example
    * 0
    */
    forks?: number;
    owner: SimpleUser;
    topics?: Array<string>;
    git_url?: string;
    license?: {

    key?: string;
    url?: string;
    name?: string;
    node_id?: string;
    spdx_id?: string;
    };

    /** 
    * 
    * @example
    * \\"MDEwOlJlcG9zaXRvcnkxMjk2MjY5\\"
    */
    node_id: string;
    private: boolean;
    ssh_url?: string;
    svn_url?: string;
    archived?: boolean;
    disabled?: boolean;
    has_wiki?: boolean;
    homepage?: string;

    /** 
    * 
    * @example
    * \\"https://github.com/octocat/Hello-World\\"
    */
    html_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/keys{/key_id}\\"
    */
    keys_url: string;
    language?: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/tags\\"
    */
    tags_url: string;

    /** 
    * 
    * @example
    * 0
    */
    watchers?: number;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}\\"
    */
    blobs_url: string;
    clone_url?: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/forks\\"
    */
    forks_url: string;

    /** 
    * 
    * @example
    * \\"octocat/Hello-World\\"
    */
    full_name: string;
    has_pages?: boolean;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/hooks\\"
    */
    hooks_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/pulls{/number}\\"
    */
    pulls_url: string;

    /** 
    * 
    * @example
    * \\"2011-01-26T19:06:43Z\\"
    */
    pushed_at?: string;

    /** 
    * 
    * @example
    * \\"admin\\"
    */
    role_name?: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/teams\\"
    */
    teams_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}\\"
    */
    trees_url: string;

    /** 
    * 
    * @example
    * \\"2011-01-26T19:01:12Z\\"
    */
    created_at?: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/events\\"
    */
    events_url: string;
    has_issues?: boolean;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/issues{/number}\\"
    */
    issues_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/labels{/name}\\"
    */
    labels_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/merges\\"
    */
    merges_url: string;
    mirror_url?: string;

    /** 
    * 
    * @example
    * \\"2011-01-26T19:14:43Z\\"
    */
    updated_at?: string;
    visibility?: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}\\"
    */
    archive_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/commits{/sha}\\"
    */
    commits_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}\\"
    */
    compare_url: string;

    /** 
    * 
    * @example
    * \\"This your first repo!\\"
    */
    description: string;
    forks_count?: number;
    is_template?: boolean;

    /** 
    * 
    * @example
    * 0
    */
    open_issues?: number;
    permissions?: {

    pull?: boolean;
    push?: boolean;
    admin?: boolean;
    triage?: boolean;
    maintain?: boolean;
    };

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/branches{/branch}\\"
    */
    branches_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/comments{/number}\\"
    */
    comments_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/contents/{+path}\\"
    */
    contents_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}\\"
    */
    git_refs_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}\\"
    */
    git_tags_url: string;
    has_projects?: boolean;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/releases{/id}\\"
    */
    releases_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/statuses/{sha}\\"
    */
    statuses_url: string;
    allow_forking?: boolean;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/assignees{/user}\\"
    */
    assignees_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/downloads\\"
    */
    downloads_url: string;
    has_downloads?: boolean;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/languages\\"
    */
    languages_url: string;
    network_count?: number;
    default_branch?: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/milestones{/number}\\"
    */
    milestones_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/stargazers\\"
    */
    stargazers_url: string;
    watchers_count?: number;
    code_of_conduct?: CodeOfConduct;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/deployments\\"
    */
    deployments_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}\\"
    */
    git_commits_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/subscribers\\"
    */
    subscribers_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/contributors\\"
    */
    contributors_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/issues/events{/number}\\"
    */
    issue_events_url: string;
    stargazers_count?: number;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/subscription\\"
    */
    subscription_url: string;
    temp_clone_token?: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}\\"
    */
    collaborators_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}\\"
    */
    issue_comment_url: string;

    /** 
    * 
    * @example
    * \\"http://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}\\"
    */
    notifications_url: string;
    open_issues_count?: number;
    subscribers_count?: number;
    template_repository?: (null | Repository);
    delete_branch_on_merge?: boolean;}"
  `);
});