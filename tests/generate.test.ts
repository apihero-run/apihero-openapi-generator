import { generateClientCode } from "../src";
import { OpenAPI } from "openapi-types";
import { readFile } from "fs/promises";

async function loadSpecFromFixtureFile(filePath: string): Promise<OpenAPI.Document> {
  const rawFile = await readFile(filePath, "utf8");

  return JSON.parse(rawFile) as OpenAPI.Document;
}

test("v3/petstore.json", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3/petstore.json");

  const code = await generateClientCode(doc);

  expect(code).toMatchInlineSnapshot(`
    "export type Order = {
      id?: number;
      petId?: number;
      quantity?: number;
      shipDate?: string;

      /**
       * Order Status
       */
      status?: \\"placed\\" | \\"approved\\" | \\"delivered\\";
      complete?: boolean;
    };

    export type Customer = {
      id?: number;
      username?: string;
      address?: Array<Address>;
    };

    export type Address = {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    };

    export type Category = {
      id?: number;
      name?: string;
    };

    export type User = {
      id?: number;
      username?: string;
      firstName?: string;

      /**
       * Please use firstName instead of lastName
       * @deprecated
       */
      lastName?: string;
      email?: string;
      password?: string;
      phone?: string;

      /**
       * User Status
       */
      userStatus?: number;
    };

    export type Tag = {
      id?: number;
      name?: string;
    };

    export type Pet = {
      id?: number;
      name: string;
      category?: Category;
      photoUrls: Array<string>;
      tags?: Array<Tag>;

      /**
       * pet status in the store
       */
      status?: \\"available\\" | \\"pending\\" | \\"sold\\";
    };

    export type ApiResponse = {
      code?: number;
      type?: string;
      message?: string;
    };
    "
  `);
});

test.only("v3/github.json", async () => {
  const doc = await loadSpecFromFixtureFile("./tests/fixtures/specs/v3/github.json");

  const code = await generateClientCode(doc);

  expect(code).toMatchInlineSnapshot(`
    "export type Root = {
      current_user_url: string;
      current_user_authorizations_html_url: string;
      authorizations_url: string;
      code_search_url: string;
      commit_search_url: string;
      emails_url: string;
      emojis_url: string;
      events_url: string;
      feeds_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      hub_url: string;
      issue_search_url: string;
      issues_url: string;
      keys_url: string;
      label_search_url: string;
      notifications_url: string;
      organization_url: string;
      organization_repositories_url: string;
      organization_teams_url: string;
      public_gists_url: string;
      rate_limit_url: string;
      repository_url: string;
      repository_search_url: string;
      current_user_repositories_url: string;
      starred_url: string;
      starred_gists_url: string;
      topic_search_url?: string;
      user_url: string;
      user_organizations_url: string;
      user_repositories_url: string;
      user_search_url: string;
    };

    /**
     * Simple User
     */
    export type NullableSimpleUser = {
      name?: string;
      email?: string;
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
      starred_at?: string;
    };

    /**
     * GitHub apps are a new way to extend GitHub. They can be installed directly on organizations and user accounts and granted access to specific repositories. They come with granular permissions and built-in webhooks. GitHub apps are first class actors within GitHub.
     */
    export type Integration = {
      /**
       * Unique identifier of the GitHub app
       */
      id: number;

      /**
       * The slug name of the GitHub app
       */
      slug?: string;
      node_id: string;
      owner: NullableSimpleUser;

      /**
       * The name of the GitHub app
       */
      name: string;
      description: string;
      external_url: string;
      html_url: string;
      created_at: string;
      updated_at: string;

      /**
       * The set of permissions for the GitHub app
       */
      permissions: Record<string, string>;

      /**
       * The list of events for the GitHub app
       */
      events: Array<string>;

      /**
       * The number of installations associated with the GitHub app
       */
      installations_count?: number;
      client_id?: string;
      client_secret?: string;
      webhook_secret?: string;
      pem?: string;
    };

    /**
     * Basic Error
     */
    export type BasicError = {
      message?: string;
      documentation_url?: string;
      url?: string;
      status?: string;
    };

    /**
     * Validation Error Simple
     */
    export type ValidationErrorSimple = {
      message: string;
      documentation_url: string;
      errors?: Array<string>;
    };

    /**
     * The URL to which the payloads will be delivered.
     */
    export type WebhookConfigUrl = string;

    /**
     * The media type used to serialize the payloads. Supported values include \`json\` and \`form\`. The default is \`form\`.
     */
    export type WebhookConfigContentType = string;

    /**
     * If provided, the \`secret\` will be used as the \`key\` to generate the HMAC hex digest value for [delivery signature headers](https://docs.github.com/webhooks/event-payloads/#delivery-headers).
     */
    export type WebhookConfigSecret = string;

    export type WebhookConfigInsecureSsl = string | number;

    /**
     * Configuration object of the webhook
     */
    export type WebhookConfig = {
      url?: WebhookConfigUrl;
      content_type?: WebhookConfigContentType;
      secret?: WebhookConfigSecret;
      insecure_ssl?: WebhookConfigInsecureSsl;
    };

    /**
     * Delivery made by a webhook, without request and response information.
     */
    export type HookDeliveryItem = {
      /**
       * Unique identifier of the webhook delivery.
       */
      id: number;

      /**
       * Unique identifier for the event (shared with all deliveries for all webhooks that subscribe to this event).
       */
      guid: string;

      /**
       * Time when the webhook delivery occurred.
       */
      delivered_at: string;

      /**
       * Whether the webhook delivery is a redelivery.
       */
      redelivery: boolean;

      /**
       * Time spent delivering.
       */
      duration: number;

      /**
       * Describes the response returned after attempting the delivery.
       */
      status: string;

      /**
       * Status code received when delivery was made.
       */
      status_code: number;

      /**
       * The event that triggered the delivery.
       */
      event: string;

      /**
       * The type of activity for the event that triggered the delivery.
       */
      action: string;

      /**
       * The id of the GitHub App installation associated with this event.
       */
      installation_id: number;

      /**
       * The id of the repository associated with this event.
       */
      repository_id: number;
    };

    /**
     * Scim Error
     */
    export type ScimError = {
      message?: string;
      documentation_url?: string;
      detail?: string;
      status?: number;
      scimType?: string;
      schemas?: Array<string>;
    };

    /**
     * Validation Error
     */
    export type ValidationError = {
      message: string;
      documentation_url: string;
      errors?: Array<{
        resource?: string;

        field?: string;

        message?: string;

        code: string;

        index?: number;

        value?: string | null | number | null | Array<string> | null;
      }>;
    };

    /**
     * Delivery made by a webhook.
     */
    export type HookDelivery = {
      /**
       * Unique identifier of the delivery.
       */
      id: number;

      /**
       * Unique identifier for the event (shared with all deliveries for all webhooks that subscribe to this event).
       */
      guid: string;

      /**
       * Time when the delivery was delivered.
       */
      delivered_at: string;

      /**
       * Whether the delivery is a redelivery.
       */
      redelivery: boolean;

      /**
       * Time spent delivering.
       */
      duration: number;

      /**
       * Description of the status of the attempted delivery
       */
      status: string;

      /**
       * Status code received when delivery was made.
       */
      status_code: number;

      /**
       * The event that triggered the delivery.
       */
      event: string;

      /**
       * The type of activity for the event that triggered the delivery.
       */
      action: string;

      /**
       * The id of the GitHub App installation associated with this event.
       */
      installation_id: number;

      /**
       * The id of the repository associated with this event.
       */
      repository_id: number;

      /**
       * The URL target of the delivery.
       */
      url?: string;
      request: {
        /**
         * The request headers sent with the webhook delivery.
         */
        headers: {};

        /**
         * The webhook payload.
         */
        payload: {};
      };
      response: {
        /**
         * The response headers received when the delivery was made.
         */
        headers: {};

        /**
         * The response payload received.
         */
        payload: string;
      };
    };

    /**
     * Simple User
     */
    export type SimpleUser = {
      name?: string;
      email?: string;
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
      starred_at?: string;
    };

    /**
     * An enterprise account
     */
    export type Enterprise = {
      /**
       * A short description of the enterprise.
       */
      description?: string;
      html_url: string;

      /**
       * The enterprise's website URL.
       */
      website_url?: string;

      /**
       * Unique identifier of the enterprise
       */
      id: number;
      node_id: string;

      /**
       * The name of the enterprise.
       */
      name: string;

      /**
       * The slug url identifier for the enterprise.
       */
      slug: string;
      created_at: string;
      updated_at: string;
      avatar_url: string;
    };

    /**
     * The permissions granted to the user-to-server access token.
     */
    export type AppPermissions = {
      /**
       * The level of permission to grant the access token for GitHub Actions workflows, workflow runs, and artifacts.
       */
      actions?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token for repository creation, deletion, settings, teams, and collaborators creation.
       */
      administration?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token for checks on code.
       */
      checks?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token for repository contents, commits, branches, downloads, releases, and merges.
       */
      contents?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token for deployments and deployment statuses.
       */
      deployments?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token for managing repository environments.
       */
      environments?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token for issues and related comments, assignees, labels, and milestones.
       */
      issues?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to search repositories, list collaborators, and access repository metadata.
       */
      metadata?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token for packages published to GitHub Packages.
       */
      packages?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to retrieve Pages statuses, configuration, and builds, as well as create new builds.
       */
      pages?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token for pull requests and related comments, assignees, labels, milestones, and merges.
       */
      pull_requests?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to manage the post-receive hooks for a repository.
       */
      repository_hooks?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to manage repository projects, columns, and cards.
       */
      repository_projects?: \\"read\\" | \\"write\\" | \\"admin\\";

      /**
       * The level of permission to grant the access token to view and manage secret scanning alerts.
       */
      secret_scanning_alerts?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to manage repository secrets.
       */
      secrets?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to view and manage security events like code scanning alerts.
       */
      security_events?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to manage just a single file.
       */
      single_file?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token for commit statuses.
       */
      statuses?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to manage Dependabot alerts.
       */
      vulnerability_alerts?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to update GitHub Actions workflow files.
       */
      workflows?: \\"write\\";

      /**
       * The level of permission to grant the access token for organization teams and members.
       */
      members?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to manage access to an organization.
       */
      organization_administration?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to manage the post-receive hooks for an organization.
       */
      organization_hooks?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token for viewing an organization's plan.
       */
      organization_plan?: \\"read\\";

      /**
       * The level of permission to grant the access token to manage organization projects and projects beta (where available).
       */
      organization_projects?: \\"read\\" | \\"write\\" | \\"admin\\";

      /**
       * The level of permission to grant the access token for organization packages published to GitHub Packages.
       */
      organization_packages?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to manage organization secrets.
       */
      organization_secrets?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to view and manage GitHub Actions self-hosted runners available to an organization.
       */
      organization_self_hosted_runners?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to view and manage users blocked by the organization.
       */
      organization_user_blocking?: \\"read\\" | \\"write\\";

      /**
       * The level of permission to grant the access token to manage team discussions and related comments.
       */
      team_discussions?: \\"read\\" | \\"write\\";
    };

    /**
     * Installation
     */
    export type Installation = {
      /**
       * The ID of the installation.
       */
      id: number;
      account: SimpleUser | Enterprise;

      /**
       * Describe whether all repositories have been selected or there's a selection involved
       */
      repository_selection: \\"all\\" | \\"selected\\";
      access_tokens_url: string;
      repositories_url: string;
      html_url: string;
      app_id: number;

      /**
       * The ID of the user or organization this token is being scoped to.
       */
      target_id: number;
      target_type: string;
      permissions: AppPermissions;
      events: Array<string>;
      created_at: string;
      updated_at: string;
      single_file_name: string;
      has_multiple_single_files?: boolean;
      single_file_paths?: Array<string>;
      app_slug: string;
      suspended_by: NullableSimpleUser;
      suspended_at: string;
      contact_email?: string;
    };

    /**
     * License Simple
     */
    export type NullableLicenseSimple = {
      key: string;
      name: string;
      url: string;
      spdx_id: string;
      node_id: string;
      html_url?: string;
    };

    /**
     * A git repository
     */
    export type Repository = {
      /**
       * Unique identifier of the repository
       */
      id: number;
      node_id: string;

      /**
       * The name of the repository.
       */
      name: string;
      full_name: string;
      license: NullableLicenseSimple;
      organization?: NullableSimpleUser;
      forks: number;
      permissions?: {
        admin: boolean;

        pull: boolean;

        triage?: boolean;

        push: boolean;

        maintain?: boolean;
      };
      owner: SimpleUser;

      /**
       * Whether the repository is private or public.
       */
      private: boolean;
      html_url: string;
      description: string;
      fork: boolean;
      url: string;
      archive_url: string;
      assignees_url: string;
      blobs_url: string;
      branches_url: string;
      collaborators_url: string;
      comments_url: string;
      commits_url: string;
      compare_url: string;
      contents_url: string;
      contributors_url: string;
      deployments_url: string;
      downloads_url: string;
      events_url: string;
      forks_url: string;
      git_commits_url: string;
      git_refs_url: string;
      git_tags_url: string;
      git_url: string;
      issue_comment_url: string;
      issue_events_url: string;
      issues_url: string;
      keys_url: string;
      labels_url: string;
      languages_url: string;
      merges_url: string;
      milestones_url: string;
      notifications_url: string;
      pulls_url: string;
      releases_url: string;
      ssh_url: string;
      stargazers_url: string;
      statuses_url: string;
      subscribers_url: string;
      subscription_url: string;
      tags_url: string;
      teams_url: string;
      trees_url: string;
      clone_url: string;
      mirror_url: string;
      hooks_url: string;
      svn_url: string;
      homepage: string;
      language: string;
      forks_count: number;
      stargazers_count: number;
      watchers_count: number;
      size: number;

      /**
       * The default branch of the repository.
       */
      default_branch: string;
      open_issues_count: number;

      /**
       * Whether this repository acts as a template that can be used to generate new repositories.
       */
      is_template?: boolean;
      topics?: Array<string>;

      /**
       * Whether issues are enabled.
       */
      has_issues: boolean;

      /**
       * Whether projects are enabled.
       */
      has_projects: boolean;

      /**
       * Whether the wiki is enabled.
       */
      has_wiki: boolean;
      has_pages: boolean;

      /**
       * Whether downloads are enabled.
       */
      has_downloads: boolean;

      /**
       * Whether the repository is archived.
       */
      archived: boolean;

      /**
       * Returns whether or not this repository disabled.
       */
      disabled: boolean;

      /**
       * The repository visibility: public, private, or internal.
       */
      visibility?: string;
      pushed_at: string;
      created_at: string;
      updated_at: string;

      /**
       * Whether to allow rebase merges for pull requests.
       */
      allow_rebase_merge?: boolean;
      template_repository?: {
        id?: number;

        node_id?: string;

        name?: string;

        full_name?: string;

        owner?: {
          login?: string;

          id?: number;

          node_id?: string;

          avatar_url?: string;

          gravatar_id?: string;

          url?: string;

          html_url?: string;

          followers_url?: string;

          following_url?: string;

          gists_url?: string;

          starred_url?: string;

          subscriptions_url?: string;

          organizations_url?: string;

          repos_url?: string;

          events_url?: string;

          received_events_url?: string;

          type?: string;

          site_admin?: boolean;
        };

        private?: boolean;

        html_url?: string;

        description?: string;

        fork?: boolean;

        url?: string;

        archive_url?: string;

        assignees_url?: string;

        blobs_url?: string;

        branches_url?: string;

        collaborators_url?: string;

        comments_url?: string;

        commits_url?: string;

        compare_url?: string;

        contents_url?: string;

        contributors_url?: string;

        deployments_url?: string;

        downloads_url?: string;

        events_url?: string;

        forks_url?: string;

        git_commits_url?: string;

        git_refs_url?: string;

        git_tags_url?: string;

        git_url?: string;

        issue_comment_url?: string;

        issue_events_url?: string;

        issues_url?: string;

        keys_url?: string;

        labels_url?: string;

        languages_url?: string;

        merges_url?: string;

        milestones_url?: string;

        notifications_url?: string;

        pulls_url?: string;

        releases_url?: string;

        ssh_url?: string;

        stargazers_url?: string;

        statuses_url?: string;

        subscribers_url?: string;

        subscription_url?: string;

        tags_url?: string;

        teams_url?: string;

        trees_url?: string;

        clone_url?: string;

        mirror_url?: string;

        hooks_url?: string;

        svn_url?: string;

        homepage?: string;

        language?: string;

        forks_count?: number;

        stargazers_count?: number;

        watchers_count?: number;

        size?: number;

        default_branch?: string;

        open_issues_count?: number;

        is_template?: boolean;

        topics?: Array<string>;

        has_issues?: boolean;

        has_projects?: boolean;

        has_wiki?: boolean;

        has_pages?: boolean;

        has_downloads?: boolean;

        archived?: boolean;

        disabled?: boolean;

        visibility?: string;

        pushed_at?: string;

        created_at?: string;

        updated_at?: string;

        permissions?: {
          admin?: boolean;

          maintain?: boolean;

          push?: boolean;

          triage?: boolean;

          pull?: boolean;
        };

        allow_rebase_merge?: boolean;

        temp_clone_token?: string;

        allow_squash_merge?: boolean;

        allow_auto_merge?: boolean;

        delete_branch_on_merge?: boolean;

        allow_update_branch?: boolean;

        use_squash_pr_title_as_default?: boolean;

        allow_merge_commit?: boolean;

        subscribers_count?: number;

        network_count?: number;
      };
      temp_clone_token?: string;

      /**
       * Whether to allow squash merges for pull requests.
       */
      allow_squash_merge?: boolean;

      /**
       * Whether to allow Auto-merge to be used on pull requests.
       */
      allow_auto_merge?: boolean;

      /**
       * Whether to delete head branches when pull requests are merged
       */
      delete_branch_on_merge?: boolean;

      /**
       * Whether or not a pull request head branch that is behind its base branch can always be updated even if it is not required to be up to date before merging.
       */
      allow_update_branch?: boolean;

      /**
       * Whether a squash merge commit can use the pull request title as default.
       */
      use_squash_pr_title_as_default?: boolean;

      /**
       * Whether to allow merge commits for pull requests.
       */
      allow_merge_commit?: boolean;

      /**
       * Whether to allow forking this repo
       */
      allow_forking?: boolean;
      subscribers_count?: number;
      network_count?: number;
      open_issues: number;
      watchers: number;
      master_branch?: string;
      starred_at?: string;
    };

    /**
     * Authentication token for a GitHub App installed on a user or org.
     */
    export type InstallationToken = {
      token: string;
      expires_at: string;
      permissions?: AppPermissions;
      repository_selection?: \\"all\\" | \\"selected\\";
      repositories?: Array<Repository>;
      single_file?: string;
      has_multiple_single_files?: boolean;
      single_file_paths?: Array<string>;
    };

    /**
     * The authorization associated with an OAuth Access.
     */
    export type ApplicationGrant = {
      id: number;
      url: string;
      app: {
        client_id: string;

        name: string;

        url: string;
      };
      created_at: string;
      updated_at: string;
      scopes: Array<string>;
      user?: NullableSimpleUser;
    };

    export type NullableScopedInstallation = {
      permissions: AppPermissions;

      /**
       * Describe whether all repositories have been selected or there's a selection involved
       */
      repository_selection: \\"all\\" | \\"selected\\";
      single_file_name: string;
      has_multiple_single_files?: boolean;
      single_file_paths?: Array<string>;
      repositories_url: string;
      account: SimpleUser;
    };

    /**
     * The authorization for an OAuth app, GitHub App, or a Personal Access Token.
     */
    export type Authorization = {
      id: number;
      url: string;

      /**
       * A list of scopes that this authorization is in.
       */
      scopes: Array<string>;
      token: string;
      token_last_eight: string;
      hashed_token: string;
      app: {
        client_id: string;

        name: string;

        url: string;
      };
      note: string;
      note_url: string;
      updated_at: string;
      created_at: string;
      fingerprint: string;
      user?: NullableSimpleUser;
      installation?: NullableScopedInstallation;
      expires_at: string;
    };

    /**
     * Code Of Conduct
     */
    export type CodeOfConduct = {
      key: string;
      name: string;
      url: string;
      body?: string;
      html_url: string;
    };

    /**
     * Response of S4 Proxy endpoint that provides GHES statistics
     */
    export type ServerStatistics = {};

    export type ActionsCacheUsageOrgEnterprise = {
      /**
       * The count of active caches across all repositories of an enterprise or an organization.
       */
      total_active_caches_count: number;

      /**
       * The total size in bytes of all active cache items across all repositories of an enterprise or an organization.
       */
      total_active_caches_size_in_bytes: number;
    };

    export type ActionsOidcCustomIssuerPolicyForEnterprise = {
      /**
       * Whether the enterprise customer requested a custom issuer URL.
       */
      include_enterprise_slug?: boolean;
    };

    /**
     * The policy that controls the organizations in the enterprise that are allowed to run GitHub Actions.
     */
    export type EnabledOrganizations = \\"all\\" | \\"none\\" | \\"selected\\";

    /**
     * The permissions policy that controls the actions and reusable workflows that are allowed to run.
     */
    export type AllowedActions = \\"all\\" | \\"local_only\\" | \\"selected\\";

    /**
     * The API URL to use to get or set the actions and reusable workflows that are allowed to run, when \`allowed_actions\` is set to \`selected\`.
     */
    export type SelectedActionsUrl = string;

    export type ActionsEnterprisePermissions = {
      enabled_organizations: EnabledOrganizations;

      /**
       * The API URL to use to get or set the selected organizations that are allowed to run GitHub Actions, when \`enabled_organizations\` is set to \`selected\`.
       */
      selected_organizations_url?: string;
      allowed_actions?: AllowedActions;
      selected_actions_url?: SelectedActionsUrl;
    };

    /**
     * Organization Simple
     */
    export type OrganizationSimple = {
      login: string;
      id: number;
      node_id: string;
      url: string;
      repos_url: string;
      events_url: string;
      hooks_url: string;
      issues_url: string;
      members_url: string;
      public_members_url: string;
      avatar_url: string;
      description: string;
    };

    export type SelectedActions = {
      /**
       * Whether GitHub-owned actions are allowed. For example, this includes the actions in the \`actions\` organization.
       */
      github_owned_allowed?: boolean;

      /**
       * Whether actions from GitHub Marketplace verified creators are allowed. Set to \`true\` to allow all actions by GitHub Marketplace verified creators.
       */
      verified_allowed?: boolean;

      /**
       * Specifies a list of string-matching patterns to allow specific action(s) and reusable workflow(s). Wildcards, tags, and SHAs are allowed. For example, \`monalisa/octocat@*\`, \`monalisa/octocat@v2\`, \`monalisa/*\`.\\"
       */
      patterns_allowed?: Array<string>;
    };

    /**
     * The default workflow permissions granted to the GITHUB_TOKEN when running workflows.
     */
    export type ActionsDefaultWorkflowPermissions = \\"read\\" | \\"write\\";

    /**
     * Whether GitHub Actions can approve pull requests. Enabling this can be a security risk.
     */
    export type ActionsCanApprovePullRequestReviews = boolean;

    export type ActionsGetDefaultWorkflowPermissions = {
      default_workflow_permissions: ActionsDefaultWorkflowPermissions;
      can_approve_pull_request_reviews: ActionsCanApprovePullRequestReviews;
    };

    export type ActionsSetDefaultWorkflowPermissions = {
      default_workflow_permissions?: ActionsDefaultWorkflowPermissions;
      can_approve_pull_request_reviews?: ActionsCanApprovePullRequestReviews;
    };

    export type RunnerGroupsEnterprise = {
      id: number;
      name: string;
      visibility: string;
      default: boolean;
      selected_organizations_url?: string;
      runners_url: string;
      allows_public_repositories: boolean;

      /**
       * If \`true\`, the \`restricted_to_workflows\` and \`selected_workflows\` fields cannot be modified.
       */
      workflow_restrictions_read_only?: boolean;

      /**
       * If \`true\`, the runner group will be restricted to running only the workflows specified in the \`selected_workflows\` array.
       */
      restricted_to_workflows?: boolean;

      /**
       * List of workflows the runner group should be allowed to run. This setting will be ignored unless \`restricted_to_workflows\` is set to \`true\`.
       */
      selected_workflows?: Array<string>;
    };

    /**
     * A label for a self hosted runner
     */
    export type RunnerLabel = {
      /**
       * Unique identifier of the label.
       */
      id?: number;

      /**
       * Name of the label.
       */
      name: string;

      /**
       * The type of label. Read-only labels are applied automatically when the runner is configured.
       */
      type?: \\"read-only\\" | \\"custom\\";
    };

    /**
     * A self hosted runner
     */
    export type Runner = {
      /**
       * The id of the runner.
       */
      id: number;

      /**
       * The name of the runner.
       */
      name: string;

      /**
       * The Operating System of the runner.
       */
      os: string;

      /**
       * The status of the runner.
       */
      status: string;
      busy: boolean;
      labels: Array<RunnerLabel>;
    };

    /**
     * Runner Application
     */
    export type RunnerApplication = {
      os: string;
      architecture: string;
      download_url: string;
      filename: string;

      /**
       * A short lived bearer token used to download the runner, if needed.
       */
      temp_download_token?: string;
      sha256_checksum?: string;
    };

    /**
     * Authentication Token
     */
    export type AuthenticationToken = {
      /**
       * The token used for authentication
       */
      token: string;

      /**
       * The time this token expires
       */
      expires_at: string;
      permissions?: {};

      /**
       * The repositories this token has access to
       */
      repositories?: Array<Repository>;
      single_file?: string;

      /**
       * Describe whether all repositories have been selected or there's a selection involved
       */
      repository_selection?: \\"all\\" | \\"selected\\";
    };

    export type AuditLogEvent = {
      /**
       * The time the audit log event occurred, given as a [Unix timestamp](http://en.wikipedia.org/wiki/Unix_time).
       */
      \\"@timestamp\\"?: number;

      /**
       * The name of the action that was performed, for example \`user.login\` or \`repo.create\`.
       */
      action?: string;
      active?: boolean;
      active_was?: boolean;

      /**
       * The actor who performed the action.
       */
      actor?: string;

      /**
       * The id of the actor who performed the action.
       */
      actor_id?: number;
      actor_location?: {
        country_name?: string;
      };
      data?: {};
      org_id?: number;

      /**
       * The username of the account being blocked.
       */
      blocked_user?: string;
      business?: string;
      config?: Array<{}>;
      config_was?: Array<{}>;
      content_type?: string;

      /**
       * The time the audit log event was recorded, given as a [Unix timestamp](http://en.wikipedia.org/wiki/Unix_time).
       */
      created_at?: number;
      deploy_key_fingerprint?: string;

      /**
       * A unique identifier for an audit event.
       */
      _document_id?: string;
      emoji?: string;
      events?: Array<{}>;
      events_were?: Array<{}>;
      explanation?: string;
      fingerprint?: string;
      hook_id?: number;
      limited_availability?: boolean;
      message?: string;
      name?: string;
      old_user?: string;
      openssh_public_key?: string;
      org?: string;
      previous_visibility?: string;
      read_only?: boolean;

      /**
       * The name of the repository.
       */
      repo?: string;

      /**
       * The name of the repository.
       */
      repository?: string;
      repository_public?: boolean;
      target_login?: string;
      team?: string;

      /**
       * The type of protocol (for example, HTTP or SSH) used to transfer Git data.
       */
      transport_protocol?: number;

      /**
       * A human readable name for the protocol (for example, HTTP or SSH) used to transfer Git data.
       */
      transport_protocol_name?: string;

      /**
       * The user that was affected by the action performed (if available).
       */
      user?: string;

      /**
       * The repository visibility, for example \`public\` or \`private\`.
       */
      visibility?: string;
    };

    /**
     * The name of the tool used to generate the code scanning analysis.
     */
    export type CodeScanningAnalysisToolName = string;

    /**
     * The GUID of the tool used to generate the code scanning analysis, if provided in the uploaded SARIF data.
     */
    export type CodeScanningAnalysisToolGuid = string | null;

    /**
     * State of a code scanning alert.
     */
    export type CodeScanningAlertState = \\"open\\" | \\"closed\\" | \\"dismissed\\" | \\"fixed\\";

    /**
     * The security alert number.
     */
    export type AlertNumber = number;

    /**
     * The time that the alert was created in ISO 8601 format: \`YYYY-MM-DDTHH:MM:SSZ\`.
     */
    export type AlertCreatedAt = string;

    /**
     * The time that the alert was last updated in ISO 8601 format: \`YYYY-MM-DDTHH:MM:SSZ\`.
     */
    export type AlertUpdatedAt = string;

    /**
     * The REST API URL of the alert resource.
     */
    export type AlertUrl = string;

    /**
     * The GitHub URL of the alert resource.
     */
    export type AlertHtmlUrl = string;

    /**
     * The REST API URL for fetching the list of instances for an alert.
     */
    export type AlertInstancesUrl = string;

    /**
     * The time that the alert was no longer detected and was considered fixed in ISO 8601 format: \`YYYY-MM-DDTHH:MM:SSZ\`.
     */
    export type CodeScanningAlertFixedAt = string | null;

    /**
     * The time that the alert was dismissed in ISO 8601 format: \`YYYY-MM-DDTHH:MM:SSZ\`.
     */
    export type CodeScanningAlertDismissedAt = string | null;

    /**
     * **Required when the state is dismissed.** The reason for dismissing or closing the alert.
     */
    export type CodeScanningAlertDismissedReason =
      | \\"false positive\\"
      | \\"won't fix\\"
      | \\"used in tests\\"
      | null;

    /**
     * The dismissal comment associated with the dismissal of the alert.
     */
    export type CodeScanningAlertDismissedComment = string | null;

    export type CodeScanningAlertRule = {
      /**
       * A unique identifier for the rule used to detect the alert.
       */
      id?: string;

      /**
       * The name of the rule used to detect the alert.
       */
      name?: string;

      /**
       * The severity of the alert.
       */
      severity?: \\"none\\" | \\"note\\" | \\"warning\\" | \\"error\\";

      /**
       * The security severity of the alert.
       */
      security_severity_level?: \\"low\\" | \\"medium\\" | \\"high\\" | \\"critical\\";

      /**
       * A short description of the rule used to detect the alert.
       */
      description?: string;

      /**
       * description of the rule used to detect the alert.
       */
      full_description?: string;

      /**
       * A set of tags applicable for the rule.
       */
      tags?: Array<string>;

      /**
       * Detailed documentation for the rule as GitHub Flavored Markdown.
       */
      help?: string;
    };

    /**
     * The version of the tool used to generate the code scanning analysis.
     */
    export type CodeScanningAnalysisToolVersion = string | null;

    export type CodeScanningAnalysisTool = {
      name?: CodeScanningAnalysisToolName;
      version?: CodeScanningAnalysisToolVersion;
      guid?: CodeScanningAnalysisToolGuid;
    };

    /** 
    * The full Git reference, formatted as \`refs/heads/<branch name>\`,
    \`refs/pull/<number>/merge\`, or \`refs/pull/<number>/head\`.
    */
    export type CodeScanningRef = string;

    /**
     * Identifies the configuration under which the analysis was executed. For example, in GitHub Actions this includes the workflow filename and job name.
     */
    export type CodeScanningAnalysisAnalysisKey = string;

    /**
     * Identifies the variable values associated with the environment in which the analysis that generated this alert instance was performed, such as the language that was analyzed.
     */
    export type CodeScanningAlertEnvironment = string;

    /**
     * Identifies the configuration under which the analysis was executed. Used to distinguish between multiple analyses for the same tool and commit, but performed on different languages or different parts of the code.
     */
    export type CodeScanningAnalysisCategory = string;

    /**
     * Describe a region within a file for the alert.
     */
    export type CodeScanningAlertLocation = {
      path?: string;
      start_line?: number;
      end_line?: number;
      start_column?: number;
      end_column?: number;
    };

    /**
     * A classification of the file. For example to identify it as generated.
     */
    export type CodeScanningAlertClassification = \\"source\\" | \\"generated\\" | \\"test\\" | \\"library\\" | null;

    export type CodeScanningAlertInstance = {
      ref?: CodeScanningRef;
      analysis_key?: CodeScanningAnalysisAnalysisKey;
      environment?: CodeScanningAlertEnvironment;
      category?: CodeScanningAnalysisCategory;
      state?: CodeScanningAlertState;
      commit_sha?: string;
      message?: {
        text?: string;
      };
      location?: CodeScanningAlertLocation;
      html_url?: string;

      /** 
    * Classifications that have been applied to the file that triggered the alert.
    For example identifying it as documentation, or a generated file.
    */
      classifications?: Array<CodeScanningAlertClassification>;
    };

    /**
     * Simple Repository
     */
    export type SimpleRepository = {
      /**
       * A unique identifier of the repository.
       */
      id: number;

      /**
       * The GraphQL identifier of the repository.
       */
      node_id: string;

      /**
       * The name of the repository.
       */
      name: string;

      /**
       * The full, globally unique, name of the repository.
       */
      full_name: string;
      owner: SimpleUser;

      /**
       * Whether the repository is private.
       */
      private: boolean;

      /**
       * The URL to view the repository on GitHub.com.
       */
      html_url: string;

      /**
       * The repository description.
       */
      description: string;

      /**
       * Whether the repository is a fork.
       */
      fork: boolean;

      /**
       * The URL to get more information about the repository from the GitHub API.
       */
      url: string;

      /**
       * A template for the API URL to download the repository as an archive.
       */
      archive_url: string;

      /**
       * A template for the API URL to list the available assignees for issues in the repository.
       */
      assignees_url: string;

      /**
       * A template for the API URL to create or retrieve a raw Git blob in the repository.
       */
      blobs_url: string;

      /**
       * A template for the API URL to get information about branches in the repository.
       */
      branches_url: string;

      /**
       * A template for the API URL to get information about collaborators of the repository.
       */
      collaborators_url: string;

      /**
       * A template for the API URL to get information about comments on the repository.
       */
      comments_url: string;

      /**
       * A template for the API URL to get information about commits on the repository.
       */
      commits_url: string;

      /**
       * A template for the API URL to compare two commits or refs.
       */
      compare_url: string;

      /**
       * A template for the API URL to get the contents of the repository.
       */
      contents_url: string;

      /**
       * A template for the API URL to list the contributors to the repository.
       */
      contributors_url: string;

      /**
       * The API URL to list the deployments of the repository.
       */
      deployments_url: string;

      /**
       * The API URL to list the downloads on the repository.
       */
      downloads_url: string;

      /**
       * The API URL to list the events of the repository.
       */
      events_url: string;

      /**
       * The API URL to list the forks of the repository.
       */
      forks_url: string;

      /**
       * A template for the API URL to get information about Git commits of the repository.
       */
      git_commits_url: string;

      /**
       * A template for the API URL to get information about Git refs of the repository.
       */
      git_refs_url: string;

      /**
       * A template for the API URL to get information about Git tags of the repository.
       */
      git_tags_url: string;

      /**
       * A template for the API URL to get information about issue comments on the repository.
       */
      issue_comment_url: string;

      /**
       * A template for the API URL to get information about issue events on the repository.
       */
      issue_events_url: string;

      /**
       * A template for the API URL to get information about issues on the repository.
       */
      issues_url: string;

      /**
       * A template for the API URL to get information about deploy keys on the repository.
       */
      keys_url: string;

      /**
       * A template for the API URL to get information about labels of the repository.
       */
      labels_url: string;

      /**
       * The API URL to get information about the languages of the repository.
       */
      languages_url: string;

      /**
       * The API URL to merge branches in the repository.
       */
      merges_url: string;

      /**
       * A template for the API URL to get information about milestones of the repository.
       */
      milestones_url: string;

      /**
       * A template for the API URL to get information about notifications on the repository.
       */
      notifications_url: string;

      /**
       * A template for the API URL to get information about pull requests on the repository.
       */
      pulls_url: string;

      /**
       * A template for the API URL to get information about releases on the repository.
       */
      releases_url: string;

      /**
       * The API URL to list the stargazers on the repository.
       */
      stargazers_url: string;

      /**
       * A template for the API URL to get information about statuses of a commit.
       */
      statuses_url: string;

      /**
       * The API URL to list the subscribers on the repository.
       */
      subscribers_url: string;

      /**
       * The API URL to subscribe to notifications for this repository.
       */
      subscription_url: string;

      /**
       * The API URL to get information about tags on the repository.
       */
      tags_url: string;

      /**
       * The API URL to list the teams on the repository.
       */
      teams_url: string;

      /**
       * A template for the API URL to create or retrieve a raw Git tree of the repository.
       */
      trees_url: string;

      /**
       * The API URL to list the hooks on the repository.
       */
      hooks_url: string;
    };

    export type CodeScanningOrganizationAlertItems = {
      number: AlertNumber;
      created_at: AlertCreatedAt;
      updated_at?: AlertUpdatedAt;
      url: AlertUrl;
      html_url: AlertHtmlUrl;
      instances_url: AlertInstancesUrl;
      state: CodeScanningAlertState;
      fixed_at?: CodeScanningAlertFixedAt;
      dismissed_by: NullableSimpleUser;
      dismissed_at: CodeScanningAlertDismissedAt;
      dismissed_reason: CodeScanningAlertDismissedReason;
      dismissed_comment?: CodeScanningAlertDismissedComment;
      rule: CodeScanningAlertRule;
      tool: CodeScanningAnalysisTool;
      most_recent_instance: CodeScanningAlertInstance;
      repository: SimpleRepository;
    };

    /**
     * The time that the alert was last updated in ISO 8601 format: \`YYYY-MM-DDTHH:MM:SSZ\`.
     */
    export type NullableAlertUpdatedAt = string | null;

    /**
     * Sets the state of the secret scanning alert. Can be either \`open\` or \`resolved\`. You must provide \`resolution\` when you set the state to \`resolved\`.
     */
    export type SecretScanningAlertState = \\"open\\" | \\"resolved\\";

    /**
     * **Required when the \`state\` is \`resolved\`.** The reason for resolving the alert.
     */
    export type SecretScanningAlertResolution =
      | \\"false_positive\\"
      | \\"wont_fix\\"
      | \\"revoked\\"
      | \\"used_in_tests\\"
      | null;

    export type OrganizationSecretScanningAlert = {
      number?: AlertNumber;
      created_at?: AlertCreatedAt;
      updated_at?: NullableAlertUpdatedAt;
      url?: AlertUrl;
      html_url?: AlertHtmlUrl;

      /**
       * The REST API URL of the code locations for this alert.
       */
      locations_url?: string;
      state?: SecretScanningAlertState;
      resolution?: SecretScanningAlertResolution;

      /**
       * The time that the alert was resolved in ISO 8601 format: \`YYYY-MM-DDTHH:MM:SSZ\`.
       */
      resolved_at?: string;
      resolved_by?: NullableSimpleUser;

      /**
       * The type of secret that secret scanning detected.
       */
      secret_type?: string;

      /** 
    * User-friendly name for the detected secret, matching the \`secret_type\`.
    For a list of built-in patterns, see \\"[Secret scanning patterns](https://docs.github.com/code-security/secret-scanning/secret-scanning-patterns#supported-secrets-for-advanced-security).\\"
    */
      secret_type_display_name?: string;

      /**
       * The secret that was detected.
       */
      secret?: string;
      repository?: SimpleRepository;

      /**
       * Whether push protection was bypassed for the detected secret.
       */
      push_protection_bypassed?: boolean;
      push_protection_bypassed_by?: NullableSimpleUser;

      /**
       * The time that push protection was bypassed in ISO 8601 format: \`YYYY-MM-DDTHH:MM:SSZ\`.
       */
      push_protection_bypassed_at?: string;
    };

    export type ActionsBillingUsage = {
      /**
       * The sum of the free and paid GitHub Actions minutes used.
       */
      total_minutes_used: number;

      /**
       * The total paid GitHub Actions minutes used.
       */
      total_paid_minutes_used: number;

      /**
       * The amount of free GitHub Actions minutes available.
       */
      included_minutes: number;
      minutes_used_breakdown: {
        /**
         * Total minutes used on Ubuntu runner machines.
         */
        UBUNTU?: number;

        /**
         * Total minutes used on macOS runner machines.
         */
        MACOS?: number;

        /**
         * Total minutes used on Windows runner machines.
         */
        WINDOWS?: number;

        /**
         * Total minutes used on Ubuntu 4 core runner machines.
         */
        ubuntu_4_core?: number;

        /**
         * Total minutes used on Ubuntu 8 core runner machines.
         */
        ubuntu_8_core?: number;

        /**
         * Total minutes used on Ubuntu 16 core runner machines.
         */
        ubuntu_16_core?: number;

        /**
         * Total minutes used on Ubuntu 32 core runner machines.
         */
        ubuntu_32_core?: number;

        /**
         * Total minutes used on Ubuntu 64 core runner machines.
         */
        ubuntu_64_core?: number;

        /**
         * Total minutes used on Windows 4 core runner machines.
         */
        windows_4_core?: number;

        /**
         * Total minutes used on Windows 8 core runner machines.
         */
        windows_8_core?: number;

        /**
         * Total minutes used on Windows 16 core runner machines.
         */
        windows_16_core?: number;

        /**
         * Total minutes used on Windows 32 core runner machines.
         */
        windows_32_core?: number;

        /**
         * Total minutes used on Windows 64 core runner machines.
         */
        windows_64_core?: number;

        /**
         * Total minutes used on all runner machines.
         */
        total?: number;
      };
    };

    export type AdvancedSecurityActiveCommittersUser = {
      user_login: string;
      last_pushed_date: string;
    };

    export type AdvancedSecurityActiveCommittersRepository = {
      name: string;
      advanced_security_committers: number;
      advanced_security_committers_breakdown: Array<AdvancedSecurityActiveCommittersUser>;
    };

    export type AdvancedSecurityActiveCommitters = {
      total_advanced_security_committers?: number;
      total_count?: number;
      repositories: Array<AdvancedSecurityActiveCommittersRepository>;
    };

    export type PackagesBillingUsage = {
      /**
       * Sum of the free and paid storage space (GB) for GitHuub Packages.
       */
      total_gigabytes_bandwidth_used: number;

      /**
       * Total paid storage space (GB) for GitHuub Packages.
       */
      total_paid_gigabytes_bandwidth_used: number;

      /**
       * Free storage space (GB) for GitHub Packages.
       */
      included_gigabytes_bandwidth: number;
    };

    export type CombinedBillingUsage = {
      /**
       * Numbers of days left in billing cycle.
       */
      days_left_in_billing_cycle: number;

      /**
       * Estimated storage space (GB) used in billing cycle.
       */
      estimated_paid_storage_for_month: number;

      /**
       * Estimated sum of free and paid storage space (GB) used in billing cycle.
       */
      estimated_storage_for_month: number;
    };

    /**
     * Actor
     */
    export type Actor = {
      id: number;
      login: string;
      display_login?: string;
      gravatar_id: string;
      url: string;
      avatar_url: string;
    };

    /**
     * A collection of related issues and pull requests.
     */
    export type NullableMilestone = {
      url: string;
      html_url: string;
      labels_url: string;
      id: number;
      node_id: string;

      /**
       * The number of the milestone.
       */
      number: number;

      /**
       * The state of the milestone.
       */
      state: \\"open\\" | \\"closed\\";

      /**
       * The title of the milestone.
       */
      title: string;
      description: string;
      creator: NullableSimpleUser;
      open_issues: number;
      closed_issues: number;
      created_at: string;
      updated_at: string;
      closed_at: string;
      due_on: string;
    };

    /**
     * GitHub apps are a new way to extend GitHub. They can be installed directly on organizations and user accounts and granted access to specific repositories. They come with granular permissions and built-in webhooks. GitHub apps are first class actors within GitHub.
     */
    export type NullableIntegration = {
      /**
       * Unique identifier of the GitHub app
       */
      id: number;

      /**
       * The slug name of the GitHub app
       */
      slug?: string;
      node_id: string;
      owner: NullableSimpleUser;

      /**
       * The name of the GitHub app
       */
      name: string;
      description: string;
      external_url: string;
      html_url: string;
      created_at: string;
      updated_at: string;

      /**
       * The set of permissions for the GitHub app
       */
      permissions: Record<string, string>;

      /**
       * The list of events for the GitHub app
       */
      events: Array<string>;

      /**
       * The number of installations associated with the GitHub app
       */
      installations_count?: number;
      client_id?: string;
      client_secret?: string;
      webhook_secret?: string;
      pem?: string;
    };

    /**
     * How the author is associated with the repository.
     */
    export type AuthorAssociation =
      | \\"COLLABORATOR\\"
      | \\"CONTRIBUTOR\\"
      | \\"FIRST_TIMER\\"
      | \\"FIRST_TIME_CONTRIBUTOR\\"
      | \\"MANNEQUIN\\"
      | \\"MEMBER\\"
      | \\"NONE\\"
      | \\"OWNER\\";

    export type ReactionRollup = {
      url: string;
      total_count: number;
      \\"+1\\": number;
      \\"-1\\": number;
      laugh: number;
      confused: number;
      heart: number;
      hooray: number;
      eyes: number;
      rocket: number;
    };

    /**
     * Issues are a great way to keep track of tasks, enhancements, and bugs for your projects.
     */
    export type Issue = {
      id: number;
      node_id: string;

      /**
       * URL for the issue
       */
      url: string;
      repository_url: string;
      labels_url: string;
      comments_url: string;
      events_url: string;
      html_url: string;

      /**
       * Number uniquely identifying the issue within its repository
       */
      number: number;

      /**
       * State of the issue; either 'open' or 'closed'
       */
      state: string;

      /**
       * The reason for the current state
       */
      state_reason?: string;

      /**
       * Title of the issue
       */
      title: string;

      /**
       * Contents of the issue
       */
      body?: string;
      user: NullableSimpleUser;

      /**
       * Labels to associate with this issue; pass one or more label names to replace the set of labels on this issue; send an empty array to clear all labels from the issue; note that the labels are silently dropped for users without push access to the repository
       */
      labels: Array<
        | string
        | {
            id?: number;

            node_id?: string;

            url?: string;

            name?: string;

            description?: string;

            color?: string;

            default?: boolean;
          }
      >;
      assignee: NullableSimpleUser;
      assignees?: Array<SimpleUser>;
      milestone: NullableMilestone;
      locked: boolean;
      active_lock_reason?: string;
      comments: number;
      pull_request?: {
        merged_at?: string;

        diff_url: string;

        html_url: string;

        patch_url: string;

        url: string;
      };
      closed_at: string;
      created_at: string;
      updated_at: string;
      draft?: boolean;
      closed_by?: NullableSimpleUser;
      body_html?: string;
      body_text?: string;
      timeline_url?: string;
      repository?: Repository;
      performed_via_github_app?: NullableIntegration;
      author_association: AuthorAssociation;
      reactions?: ReactionRollup;
    };

    /**
     * Comments provide a way for people to collaborate on an issue.
     */
    export type IssueComment = {
      /**
       * Unique identifier of the issue comment
       */
      id: number;
      node_id: string;

      /**
       * URL for the issue comment
       */
      url: string;

      /**
       * Contents of the issue comment
       */
      body?: string;
      body_text?: string;
      body_html?: string;
      html_url: string;
      user: NullableSimpleUser;
      created_at: string;
      updated_at: string;
      issue_url: string;
      author_association: AuthorAssociation;
      performed_via_github_app?: NullableIntegration;
      reactions?: ReactionRollup;
    };

    /**
     * Event
     */
    export type Event = {
      id: string;
      type: string;
      actor: Actor;
      repo: {
        id: number;

        name: string;

        url: string;
      };
      org?: Actor;
      payload: {
        action?: string;

        issue?: Issue;

        comment?: IssueComment;

        pages?: Array<{
          page_name?: string;

          title?: string;

          summary?: string;

          action?: string;

          sha?: string;

          html_url?: string;
        }>;
      };
      public: boolean;
      created_at: string;
    };

    /**
     * Hypermedia Link with Type
     */
    export type LinkWithType = {
      href: string;
      type: string;
    };

    /**
     * Feed
     */
    export type Feed = {
      timeline_url: string;
      user_url: string;
      current_user_public_url?: string;
      current_user_url?: string;
      current_user_actor_url?: string;
      current_user_organization_url?: string;
      current_user_organization_urls?: Array<string>;
      security_advisories_url?: string;
      _links: {
        timeline: LinkWithType;

        user: LinkWithType;

        security_advisories?: LinkWithType;

        current_user?: LinkWithType;

        current_user_public?: LinkWithType;

        current_user_actor?: LinkWithType;

        current_user_organization?: LinkWithType;

        current_user_organizations?: Array<LinkWithType>;
      };
    };

    /**
     * Base Gist
     */
    export type BaseGist = {
      url: string;
      forks_url: string;
      commits_url: string;
      id: string;
      node_id: string;
      git_pull_url: string;
      git_push_url: string;
      html_url: string;
      files: Record<
        string,
        {
          filename?: string;

          type?: string;

          language?: string;

          raw_url?: string;

          size?: number;
        }
      >;
      public: boolean;
      created_at: string;
      updated_at: string;
      description: string;
      comments: number;
      user: NullableSimpleUser;
      comments_url: string;
      owner?: SimpleUser;
      truncated?: boolean;
      forks?: Array<{}>;
      history?: Array<{}>;
    };

    /**
     * Public User
     */
    export type PublicUser = {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
      name: string;
      company: string;
      blog: string;
      location: string;
      email: string;
      hireable: boolean;
      bio: string;
      twitter_username?: string;
      public_repos: number;
      public_gists: number;
      followers: number;
      following: number;
      created_at: string;
      updated_at: string;
      plan?: {
        collaborators: number;

        name: string;

        space: number;

        private_repos: number;
      };
      suspended_at?: string;
      private_gists?: number;
      total_private_repos?: number;
      owned_private_repos?: number;
      disk_usage?: number;
      collaborators?: number;
    };

    /**
     * Gist History
     */
    export type GistHistory = {
      user?: NullableSimpleUser;
      version?: string;
      committed_at?: string;
      change_status?: {
        total?: number;

        additions?: number;

        deletions?: number;
      };
      url?: string;
    };

    /**
     * Gist Simple
     */
    export type GistSimple = {
      /**
       * @deprecated
       */
      forks?: Array<{
        id?: string;

        url?: string;

        user?: PublicUser;

        created_at?: string;

        updated_at?: string;
      }>;

      /**
       * @deprecated
       */
      history?: Array<GistHistory>;

      /**
       * Gist
       */
      fork_of?: {
        url: string;

        forks_url: string;

        commits_url: string;

        id: string;

        node_id: string;

        git_pull_url: string;

        git_push_url: string;

        html_url: string;

        files: Record<
          string,
          {
            filename?: string;

            type?: string;

            language?: string;

            raw_url?: string;

            size?: number;
          }
        >;

        public: boolean;

        created_at: string;

        updated_at: string;

        description: string;

        comments: number;

        user: NullableSimpleUser;

        comments_url: string;

        owner?: NullableSimpleUser;

        truncated?: boolean;

        forks?: Array<{}>;

        history?: Array<{}>;
      };
      url?: string;
      forks_url?: string;
      commits_url?: string;
      id?: string;
      node_id?: string;
      git_pull_url?: string;
      git_push_url?: string;
      html_url?: string;
      files?: Record<
        string,
        {
          filename?: string;

          type?: string;

          language?: string;

          raw_url?: string;

          size?: number;

          truncated?: boolean;

          content?: string;
        } | null
      >;
      public?: boolean;
      created_at?: string;
      updated_at?: string;
      description?: string;
      comments?: number;
      user?: string;
      comments_url?: string;
      owner?: SimpleUser;
      truncated?: boolean;
    };

    /**
     * A comment made to a gist.
     */
    export type GistComment = {
      id: number;
      node_id: string;
      url: string;

      /**
       * The comment text.
       */
      body: string;
      user: NullableSimpleUser;
      created_at: string;
      updated_at: string;
      author_association: AuthorAssociation;
    };

    /**
     * Gist Commit
     */
    export type GistCommit = {
      url: string;
      version: string;
      user: NullableSimpleUser;
      change_status: {
        total?: number;

        additions?: number;

        deletions?: number;
      };
      committed_at: string;
    };

    /**
     * Gitignore Template
     */
    export type GitignoreTemplate = {
      name: string;
      source: string;
    };

    /**
     * License Simple
     */
    export type LicenseSimple = {
      key: string;
      name: string;
      url: string;
      spdx_id: string;
      node_id: string;
      html_url?: string;
    };

    /**
     * License
     */
    export type License = {
      key: string;
      name: string;
      spdx_id: string;
      url: string;
      node_id: string;
      html_url: string;
      description: string;
      implementation: string;
      permissions: Array<string>;
      conditions: Array<string>;
      limitations: Array<string>;
      body: string;
      featured: boolean;
    };

    /**
     * Marketplace Listing Plan
     */
    export type MarketplaceListingPlan = {
      url: string;
      accounts_url: string;
      id: number;
      number: number;
      name: string;
      description: string;
      monthly_price_in_cents: number;
      yearly_price_in_cents: number;
      price_model: string;
      has_free_trial: boolean;
      unit_name: string;
      state: string;
      bullets: Array<string>;
    };

    /**
     * Marketplace Purchase
     */
    export type MarketplacePurchase = {
      url: string;
      type: string;
      id: number;
      login: string;
      organization_billing_email?: string;
      email?: string;
      marketplace_pending_change?: {
        is_installed?: boolean;

        effective_date?: string;

        unit_count?: number;

        id?: number;

        plan?: MarketplaceListingPlan;
      };
      marketplace_purchase: {
        billing_cycle?: string;

        next_billing_date?: string;

        is_installed?: boolean;

        unit_count?: number;

        on_free_trial?: boolean;

        free_trial_ends_on?: string;

        updated_at?: string;

        plan?: MarketplaceListingPlan;
      };
    };

    /**
     * Api Overview
     */
    export type ApiOverview = {
      verifiable_password_authentication: boolean;
      ssh_key_fingerprints?: {
        SHA256_RSA?: string;

        SHA256_DSA?: string;

        SHA256_ECDSA?: string;

        SHA256_ED25519?: string;
      };
      ssh_keys?: Array<string>;
      hooks?: Array<string>;
      web?: Array<string>;
      api?: Array<string>;
      git?: Array<string>;
      packages?: Array<string>;
      pages?: Array<string>;
      importer?: Array<string>;
      actions?: Array<string>;
      dependabot?: Array<string>;
    };

    /**
     * A git repository
     */
    export type NullableRepository = {
      /**
       * Unique identifier of the repository
       */
      id: number;
      node_id: string;

      /**
       * The name of the repository.
       */
      name: string;
      full_name: string;
      license: NullableLicenseSimple;
      organization?: NullableSimpleUser;
      forks: number;
      permissions?: {
        admin: boolean;

        pull: boolean;

        triage?: boolean;

        push: boolean;

        maintain?: boolean;
      };
      owner: SimpleUser;

      /**
       * Whether the repository is private or public.
       */
      private: boolean;
      html_url: string;
      description: string;
      fork: boolean;
      url: string;
      archive_url: string;
      assignees_url: string;
      blobs_url: string;
      branches_url: string;
      collaborators_url: string;
      comments_url: string;
      commits_url: string;
      compare_url: string;
      contents_url: string;
      contributors_url: string;
      deployments_url: string;
      downloads_url: string;
      events_url: string;
      forks_url: string;
      git_commits_url: string;
      git_refs_url: string;
      git_tags_url: string;
      git_url: string;
      issue_comment_url: string;
      issue_events_url: string;
      issues_url: string;
      keys_url: string;
      labels_url: string;
      languages_url: string;
      merges_url: string;
      milestones_url: string;
      notifications_url: string;
      pulls_url: string;
      releases_url: string;
      ssh_url: string;
      stargazers_url: string;
      statuses_url: string;
      subscribers_url: string;
      subscription_url: string;
      tags_url: string;
      teams_url: string;
      trees_url: string;
      clone_url: string;
      mirror_url: string;
      hooks_url: string;
      svn_url: string;
      homepage: string;
      language: string;
      forks_count: number;
      stargazers_count: number;
      watchers_count: number;
      size: number;

      /**
       * The default branch of the repository.
       */
      default_branch: string;
      open_issues_count: number;

      /**
       * Whether this repository acts as a template that can be used to generate new repositories.
       */
      is_template?: boolean;
      topics?: Array<string>;

      /**
       * Whether issues are enabled.
       */
      has_issues: boolean;

      /**
       * Whether projects are enabled.
       */
      has_projects: boolean;

      /**
       * Whether the wiki is enabled.
       */
      has_wiki: boolean;
      has_pages: boolean;

      /**
       * Whether downloads are enabled.
       */
      has_downloads: boolean;

      /**
       * Whether the repository is archived.
       */
      archived: boolean;

      /**
       * Returns whether or not this repository disabled.
       */
      disabled: boolean;

      /**
       * The repository visibility: public, private, or internal.
       */
      visibility?: string;
      pushed_at: string;
      created_at: string;
      updated_at: string;

      /**
       * Whether to allow rebase merges for pull requests.
       */
      allow_rebase_merge?: boolean;
      template_repository?: {
        id?: number;

        node_id?: string;

        name?: string;

        full_name?: string;

        owner?: {
          login?: string;

          id?: number;

          node_id?: string;

          avatar_url?: string;

          gravatar_id?: string;

          url?: string;

          html_url?: string;

          followers_url?: string;

          following_url?: string;

          gists_url?: string;

          starred_url?: string;

          subscriptions_url?: string;

          organizations_url?: string;

          repos_url?: string;

          events_url?: string;

          received_events_url?: string;

          type?: string;

          site_admin?: boolean;
        };

        private?: boolean;

        html_url?: string;

        description?: string;

        fork?: boolean;

        url?: string;

        archive_url?: string;

        assignees_url?: string;

        blobs_url?: string;

        branches_url?: string;

        collaborators_url?: string;

        comments_url?: string;

        commits_url?: string;

        compare_url?: string;

        contents_url?: string;

        contributors_url?: string;

        deployments_url?: string;

        downloads_url?: string;

        events_url?: string;

        forks_url?: string;

        git_commits_url?: string;

        git_refs_url?: string;

        git_tags_url?: string;

        git_url?: string;

        issue_comment_url?: string;

        issue_events_url?: string;

        issues_url?: string;

        keys_url?: string;

        labels_url?: string;

        languages_url?: string;

        merges_url?: string;

        milestones_url?: string;

        notifications_url?: string;

        pulls_url?: string;

        releases_url?: string;

        ssh_url?: string;

        stargazers_url?: string;

        statuses_url?: string;

        subscribers_url?: string;

        subscription_url?: string;

        tags_url?: string;

        teams_url?: string;

        trees_url?: string;

        clone_url?: string;

        mirror_url?: string;

        hooks_url?: string;

        svn_url?: string;

        homepage?: string;

        language?: string;

        forks_count?: number;

        stargazers_count?: number;

        watchers_count?: number;

        size?: number;

        default_branch?: string;

        open_issues_count?: number;

        is_template?: boolean;

        topics?: Array<string>;

        has_issues?: boolean;

        has_projects?: boolean;

        has_wiki?: boolean;

        has_pages?: boolean;

        has_downloads?: boolean;

        archived?: boolean;

        disabled?: boolean;

        visibility?: string;

        pushed_at?: string;

        created_at?: string;

        updated_at?: string;

        permissions?: {
          admin?: boolean;

          maintain?: boolean;

          push?: boolean;

          triage?: boolean;

          pull?: boolean;
        };

        allow_rebase_merge?: boolean;

        temp_clone_token?: string;

        allow_squash_merge?: boolean;

        allow_auto_merge?: boolean;

        delete_branch_on_merge?: boolean;

        allow_update_branch?: boolean;

        use_squash_pr_title_as_default?: boolean;

        allow_merge_commit?: boolean;

        subscribers_count?: number;

        network_count?: number;
      };
      temp_clone_token?: string;

      /**
       * Whether to allow squash merges for pull requests.
       */
      allow_squash_merge?: boolean;

      /**
       * Whether to allow Auto-merge to be used on pull requests.
       */
      allow_auto_merge?: boolean;

      /**
       * Whether to delete head branches when pull requests are merged
       */
      delete_branch_on_merge?: boolean;

      /**
       * Whether or not a pull request head branch that is behind its base branch can always be updated even if it is not required to be up to date before merging.
       */
      allow_update_branch?: boolean;

      /**
       * Whether a squash merge commit can use the pull request title as default.
       */
      use_squash_pr_title_as_default?: boolean;

      /**
       * Whether to allow merge commits for pull requests.
       */
      allow_merge_commit?: boolean;

      /**
       * Whether to allow forking this repo
       */
      allow_forking?: boolean;
      subscribers_count?: number;
      network_count?: number;
      open_issues: number;
      watchers: number;
      master_branch?: string;
      starred_at?: string;
    };

    /**
     * Minimal Repository
     */
    export type MinimalRepository = {
      id: number;
      node_id: string;
      name: string;
      full_name: string;
      owner: SimpleUser;
      private: boolean;
      html_url: string;
      description: string;
      fork: boolean;
      url: string;
      archive_url: string;
      assignees_url: string;
      blobs_url: string;
      branches_url: string;
      collaborators_url: string;
      comments_url: string;
      commits_url: string;
      compare_url: string;
      contents_url: string;
      contributors_url: string;
      deployments_url: string;
      downloads_url: string;
      events_url: string;
      forks_url: string;
      git_commits_url: string;
      git_refs_url: string;
      git_tags_url: string;
      git_url?: string;
      issue_comment_url: string;
      issue_events_url: string;
      issues_url: string;
      keys_url: string;
      labels_url: string;
      languages_url: string;
      merges_url: string;
      milestones_url: string;
      notifications_url: string;
      pulls_url: string;
      releases_url: string;
      ssh_url?: string;
      stargazers_url: string;
      statuses_url: string;
      subscribers_url: string;
      subscription_url: string;
      tags_url: string;
      teams_url: string;
      trees_url: string;
      clone_url?: string;
      mirror_url?: string;
      hooks_url: string;
      svn_url?: string;
      homepage?: string;
      language?: string;
      forks_count?: number;
      stargazers_count?: number;
      watchers_count?: number;
      size?: number;
      default_branch?: string;
      open_issues_count?: number;
      is_template?: boolean;
      topics?: Array<string>;
      has_issues?: boolean;
      has_projects?: boolean;
      has_wiki?: boolean;
      has_pages?: boolean;
      has_downloads?: boolean;
      archived?: boolean;
      disabled?: boolean;
      visibility?: string;
      pushed_at?: string;
      created_at?: string;
      updated_at?: string;
      permissions?: {
        admin?: boolean;

        maintain?: boolean;

        push?: boolean;

        triage?: boolean;

        pull?: boolean;
      };
      role_name?: string;
      template_repository?: NullableRepository;
      temp_clone_token?: string;
      delete_branch_on_merge?: boolean;
      subscribers_count?: number;
      network_count?: number;
      code_of_conduct?: CodeOfConduct;
      license?: {
        key?: string;

        name?: string;

        spdx_id?: string;

        url?: string;

        node_id?: string;
      };
      forks?: number;
      open_issues?: number;
      watchers?: number;
      allow_forking?: boolean;
    };

    /**
     * Thread
     */
    export type Thread = {
      id: string;
      repository: MinimalRepository;
      subject: {
        title: string;

        url: string;

        latest_comment_url: string;

        type: string;
      };
      reason: string;
      unread: boolean;
      updated_at: string;
      last_read_at: string;
      url: string;
      subscription_url: string;
    };

    /**
     * Thread Subscription
     */
    export type ThreadSubscription = {
      subscribed: boolean;
      ignored: boolean;
      reason: string;
      created_at: string;
      url: string;
      thread_url?: string;
      repository_url?: string;
    };

    /**
     * Custom repository roles created by organization administrators
     */
    export type OrganizationCustomRepositoryRole = {
      id: number;
      name: string;
    };

    /**
     * Organization Full
     */
    export type OrganizationFull = {
      login: string;
      id: number;
      node_id: string;
      url: string;
      repos_url: string;
      events_url: string;
      hooks_url: string;
      issues_url: string;
      members_url: string;
      public_members_url: string;
      avatar_url: string;
      description: string;
      name?: string;
      company?: string;
      blog?: string;
      location?: string;
      email?: string;
      twitter_username?: string;
      is_verified?: boolean;
      has_organization_projects: boolean;
      has_repository_projects: boolean;
      public_repos: number;
      public_gists: number;
      followers: number;
      following: number;
      html_url: string;
      created_at: string;
      type: string;
      total_private_repos?: number;
      owned_private_repos?: number;
      private_gists?: number;
      disk_usage?: number;
      collaborators?: number;
      billing_email?: string;
      plan?: {
        name: string;

        space: number;

        private_repos: number;

        filled_seats?: number;

        seats?: number;
      };
      default_repository_permission?: string;
      members_can_create_repositories?: boolean;
      two_factor_requirement_enabled?: boolean;
      members_allowed_repository_creation_type?: string;
      members_can_create_public_repositories?: boolean;
      members_can_create_private_repositories?: boolean;
      members_can_create_internal_repositories?: boolean;
      members_can_create_pages?: boolean;
      members_can_create_public_pages?: boolean;
      members_can_create_private_pages?: boolean;
      members_can_fork_private_repositories?: boolean;
      updated_at: string;
    };

    /**
     * GitHub Actions Cache Usage by repository.
     */
    export type ActionsCacheUsageByRepository = {
      /**
       * The repository owner and name for the cache usage being shown.
       */
      full_name: string;

      /**
       * The sum of the size in bytes of all the active cache items in the repository.
       */
      active_caches_size_in_bytes: number;

      /**
       * The number of active caches in the repository.
       */
      active_caches_count: number;
    };

    /**
     * Actions OIDC Subject customization
     */
    export type OidcCustomSub = {
      include_claim_keys: Array<string>;
    };

    /**
     * An object without any properties.
     */
    export type EmptyObject = {};

    /**
     * The policy that controls the repositories in the organization that are allowed to run GitHub Actions.
     */
    export type EnabledRepositories = \\"all\\" | \\"none\\" | \\"selected\\";

    export type ActionsOrganizationPermissions = {
      enabled_repositories: EnabledRepositories;

      /**
       * The API URL to use to get or set the selected repositories that are allowed to run GitHub Actions, when \`enabled_repositories\` is set to \`selected\`.
       */
      selected_repositories_url?: string;
      allowed_actions?: AllowedActions;
      selected_actions_url?: SelectedActionsUrl;
    };

    export type RunnerGroupsOrg = {
      id: number;
      name: string;
      visibility: string;
      default: boolean;

      /**
       * Link to the selected repositories resource for this runner group. Not present unless visibility was set to \`selected\`
       */
      selected_repositories_url?: string;
      runners_url: string;
      inherited: boolean;
      inherited_allows_public_repositories?: boolean;
      allows_public_repositories: boolean;

      /**
       * If \`true\`, the \`restricted_to_workflows\` and \`selected_workflows\` fields cannot be modified.
       */
      workflow_restrictions_read_only?: boolean;

      /**
       * If \`true\`, the runner group will be restricted to running only the workflows specified in the \`selected_workflows\` array.
       */
      restricted_to_workflows?: boolean;

      /**
       * List of workflows the runner group should be allowed to run. This setting will be ignored unless \`restricted_to_workflows\` is set to \`true\`.
       */
      selected_workflows?: Array<string>;
    };

    /**
     * Secrets for GitHub Actions for an organization.
     */
    export type OrganizationActionsSecret = {
      /**
       * The name of the secret.
       */
      name: string;
      created_at: string;
      updated_at: string;

      /**
       * Visibility of a secret
       */
      visibility: \\"all\\" | \\"private\\" | \\"selected\\";
      selected_repositories_url?: string;
    };

    /**
     * The public key used for setting Actions Secrets.
     */
    export type ActionsPublicKey = {
      /**
       * The identifier for the key.
       */
      key_id: string;

      /**
       * The Base64 encoded public key.
       */
      key: string;
      id?: number;
      url?: string;
      title?: string;
      created_at?: string;
    };

    /**
     * A description of the machine powering a codespace.
     */
    export type NullableCodespaceMachine = {
      /**
       * The name of the machine.
       */
      name: string;

      /**
       * The display name of the machine includes cores, memory, and storage.
       */
      display_name: string;

      /**
       * The operating system of the machine.
       */
      operating_system: string;

      /**
       * How much storage is available to the codespace.
       */
      storage_in_bytes: number;

      /**
       * How much memory is available to the codespace.
       */
      memory_in_bytes: number;

      /**
       * How many cores are available to the codespace.
       */
      cpus: number;

      /**
       * Whether a prebuild is currently available when creating a codespace for this machine and repository. If a branch was not specified as a ref, the default branch will be assumed. Value will be \\"null\\" if prebuilds are not supported or prebuild availability could not be determined. Value will be \\"none\\" if no prebuild is available. Latest values \\"ready\\" and \\"in_progress\\" indicate the prebuild availability status.
       */
      prebuild_availability: \\"none\\" | \\"ready\\" | \\"in_progress\\";
    };

    /**
     * A codespace.
     */
    export type Codespace = {
      id: number;

      /**
       * Automatically generated name of this codespace.
       */
      name: string;

      /**
       * Display name for this codespace.
       */
      display_name?: string;

      /**
       * UUID identifying this codespace's environment.
       */
      environment_id: string;
      owner: SimpleUser;
      billable_owner: SimpleUser;
      repository: MinimalRepository;
      machine: NullableCodespaceMachine;

      /**
       * Path to devcontainer.json from repo root used to create Codespace.
       */
      devcontainer_path?: string;

      /**
       * Whether the codespace was created from a prebuild.
       */
      prebuild: boolean;
      created_at: string;
      updated_at: string;

      /**
       * Last known time this codespace was started.
       */
      last_used_at: string;

      /**
       * State of this codespace.
       */
      state:
        | \\"Unknown\\"
        | \\"Created\\"
        | \\"Queued\\"
        | \\"Provisioning\\"
        | \\"Available\\"
        | \\"Awaiting\\"
        | \\"Unavailable\\"
        | \\"Deleted\\"
        | \\"Moved\\"
        | \\"Shutdown\\"
        | \\"Archived\\"
        | \\"Starting\\"
        | \\"ShuttingDown\\"
        | \\"Failed\\"
        | \\"Exporting\\"
        | \\"Updating\\"
        | \\"Rebuilding\\";

      /**
       * API URL for this codespace.
       */
      url: string;

      /**
       * Details about the codespace's git repository.
       */
      git_status: {
        /**
         * The number of commits the local repository is ahead of the remote.
         */
        ahead?: number;

        /**
         * The number of commits the local repository is behind the remote.
         */
        behind?: number;

        /**
         * Whether the local repository has unpushed changes.
         */
        has_unpushed_changes?: boolean;

        /**
         * Whether the local repository has uncommitted changes.
         */
        has_uncommitted_changes?: boolean;

        /**
         * The current branch (or SHA if in detached HEAD state) of the local repository.
         */
        ref?: string;
      };

      /**
       * The Azure region where this codespace is located.
       */
      location: \\"EastUs\\" | \\"SouthEastAsia\\" | \\"WestEurope\\" | \\"WestUs2\\";

      /**
       * The number of minutes of inactivity after which this codespace will be automatically stopped.
       */
      idle_timeout_minutes: number;

      /**
       * URL to access this codespace on the web.
       */
      web_url: string;

      /**
       * API URL to access available alternate machine types for this codespace.
       */
      machines_url: string;

      /**
       * API URL to start this codespace.
       */
      start_url: string;

      /**
       * API URL to stop this codespace.
       */
      stop_url: string;

      /**
       * API URL for the Pull Request associated with this codespace, if any.
       */
      pulls_url: string;
      recent_folders: Array<string>;
      runtime_constraints?: {
        /**
         * The privacy settings a user can select from when forwarding a port.
         */
        allowed_port_privacy_settings?: Array<string>;
      };

      /**
       * Whether or not a codespace has a pending async operation. This would mean that the codespace is temporarily unavailable. The only thing that you can do with a codespace in this state is delete it.
       */
      pending_operation?: boolean;

      /**
       * Text to show user when codespace is disabled by a pending operation
       */
      pending_operation_disabled_reason?: string;

      /**
       * Text to show user when codespace idle timeout minutes has been overriden by an organization policy
       */
      idle_timeout_notice?: string;
    };

    /**
     * Credential Authorization
     */
    export type CredentialAuthorization = {
      /**
       * User login that owns the underlying credential.
       */
      login: string;

      /**
       * Unique identifier for the credential.
       */
      credential_id: number;

      /**
       * Human-readable description of the credential type.
       */
      credential_type: string;

      /**
       * Last eight characters of the credential. Only included in responses with credential_type of personal access token.
       */
      token_last_eight?: string;

      /**
       * Date when the credential was authorized for use.
       */
      credential_authorized_at: string;

      /**
       * List of oauth scopes the token has been granted.
       */
      scopes?: Array<string>;

      /**
       * Unique string to distinguish the credential. Only included in responses with credential_type of SSH Key.
       */
      fingerprint?: string;

      /**
       * Date when the credential was last accessed. May be null if it was never accessed
       */
      credential_accessed_at: string;
      authorized_credential_id: number;

      /**
       * The title given to the ssh key. This will only be present when the credential is an ssh key.
       */
      authorized_credential_title?: string;

      /**
       * The note given to the token. This will only be present when the credential is a token.
       */
      authorized_credential_note?: string;

      /**
       * The expiry for the token. This will only be present when the credential is a token.
       */
      authorized_credential_expires_at?: string;
    };

    /**
     * Secrets for GitHub Dependabot for an organization.
     */
    export type OrganizationDependabotSecret = {
      /**
       * The name of the secret.
       */
      name: string;
      created_at: string;
      updated_at: string;

      /**
       * Visibility of a secret
       */
      visibility: \\"all\\" | \\"private\\" | \\"selected\\";
      selected_repositories_url?: string;
    };

    /**
     * The public key used for setting Dependabot Secrets.
     */
    export type DependabotPublicKey = {
      /**
       * The identifier for the key.
       */
      key_id: string;

      /**
       * The Base64 encoded public key.
       */
      key: string;
    };

    /**
     * Information about an external group's usage and its members
     */
    export type ExternalGroup = {
      /**
       * The internal ID of the group
       */
      group_id: number;

      /**
       * The display name for the group
       */
      group_name: string;

      /**
       * The date when the group was last updated_at
       */
      updated_at?: string;

      /**
       * An array of teams linked to this group
       */
      teams: Array<{
        /**
         * The id for a team
         */
        team_id: number;

        /**
         * The name of the team
         */
        team_name: string;
      }>;

      /**
       * An array of external members linked to this group
       */
      members: Array<{
        /**
         * The internal user ID of the identity
         */
        member_id: number;

        /**
         * The handle/login for the user
         */
        member_login: string;

        /**
         * The user display name/profile name
         */
        member_name: string;

        /**
         * An email attached to a user
         */
        member_email: string;
      }>;
    };

    /**
     * A list of external groups available to be connected to a team
     */
    export type ExternalGroups = {
      /**
       * An array of external groups available to be mapped to a team
       */
      groups?: Array<{
        /**
         * The internal ID of the group
         */
        group_id: number;

        /**
         * The display name of the group
         */
        group_name: string;

        /**
         * The time of the last update for this group
         */
        updated_at: string;
      }>;
    };

    /**
     * Organization Invitation
     */
    export type OrganizationInvitation = {
      id: number;
      login: string;
      email: string;
      role: string;
      created_at: string;
      failed_at?: string;
      failed_reason?: string;
      inviter: SimpleUser;
      team_count: number;
      node_id: string;
      invitation_teams_url: string;
    };

    /**
     * Org Hook
     */
    export type OrgHook = {
      id: number;
      url: string;
      ping_url: string;
      deliveries_url?: string;
      name: string;
      events: Array<string>;
      active: boolean;
      config: {
        url?: string;

        insecure_ssl?: string;

        content_type?: string;

        secret?: string;
      };
      updated_at: string;
      created_at: string;
      type: string;
    };

    /**
     * The type of GitHub user that can comment, open issues, or create pull requests while the interaction limit is in effect.
     */
    export type InteractionGroup = \\"existing_users\\" | \\"contributors_only\\" | \\"collaborators_only\\";

    /**
     * Interaction limit settings.
     */
    export type InteractionLimitResponse = {
      limit: InteractionGroup;
      origin: string;
      expires_at: string;
    };

    /**
     * The duration of the interaction restriction. Default: \`one_day\`.
     */
    export type InteractionExpiry = \\"one_day\\" | \\"three_days\\" | \\"one_week\\" | \\"one_month\\" | \\"six_months\\";

    /**
     * Limit interactions to a specific type of user for a specified duration
     */
    export type InteractionLimit = {
      limit: InteractionGroup;
      expiry?: InteractionExpiry;
    };

    /**
     * Groups of organization members that gives permissions on specified repositories.
     */
    export type NullableTeamSimple = {
      /**
       * Unique identifier of the team
       */
      id: number;
      node_id: string;

      /**
       * URL for the team
       */
      url: string;
      members_url: string;

      /**
       * Name of the team
       */
      name: string;

      /**
       * Description of the team
       */
      description: string;

      /**
       * Permission that the team will have for its repositories
       */
      permission: string;

      /**
       * The level of privacy this team should have
       */
      privacy?: string;
      html_url: string;
      repositories_url: string;
      slug: string;

      /**
       * Distinguished Name (DN) that team maps to within LDAP environment
       */
      ldap_dn?: string;
    };

    /**
     * Groups of organization members that gives permissions on specified repositories.
     */
    export type Team = {
      id: number;
      node_id: string;
      name: string;
      slug: string;
      description: string;
      privacy?: string;
      permission: string;
      permissions?: {
        pull: boolean;

        triage: boolean;

        push: boolean;

        maintain: boolean;

        admin: boolean;
      };
      url: string;
      html_url: string;
      members_url: string;
      repositories_url: string;
      parent: NullableTeamSimple;
    };

    /**
     * Org Membership
     */
    export type OrgMembership = {
      url: string;

      /**
       * The state of the member in the organization. The \`pending\` state indicates the user has not yet accepted an invitation.
       */
      state: \\"active\\" | \\"pending\\";

      /**
       * The user's membership type in the organization.
       */
      role: \\"admin\\" | \\"member\\" | \\"billing_manager\\";
      organization_url: string;
      organization: OrganizationSimple;
      user: NullableSimpleUser;
      permissions?: {
        can_create_repository: boolean;
      };
    };

    /**
     * A migration.
     */
    export type Migration = {
      id: number;
      owner: NullableSimpleUser;
      guid: string;
      state: string;
      lock_repositories: boolean;
      exclude_metadata: boolean;
      exclude_git_data: boolean;
      exclude_attachments: boolean;
      exclude_releases: boolean;
      exclude_owner_projects: boolean;
      org_metadata_only: boolean;
      repositories: Array<Repository>;
      url: string;
      created_at: string;
      updated_at: string;
      node_id: string;
      archive_url?: string;
      exclude?: Array<{}>;
    };

    /**
     * Minimal Repository
     */
    export type NullableMinimalRepository = {
      id: number;
      node_id: string;
      name: string;
      full_name: string;
      owner: SimpleUser;
      private: boolean;
      html_url: string;
      description: string;
      fork: boolean;
      url: string;
      archive_url: string;
      assignees_url: string;
      blobs_url: string;
      branches_url: string;
      collaborators_url: string;
      comments_url: string;
      commits_url: string;
      compare_url: string;
      contents_url: string;
      contributors_url: string;
      deployments_url: string;
      downloads_url: string;
      events_url: string;
      forks_url: string;
      git_commits_url: string;
      git_refs_url: string;
      git_tags_url: string;
      git_url?: string;
      issue_comment_url: string;
      issue_events_url: string;
      issues_url: string;
      keys_url: string;
      labels_url: string;
      languages_url: string;
      merges_url: string;
      milestones_url: string;
      notifications_url: string;
      pulls_url: string;
      releases_url: string;
      ssh_url?: string;
      stargazers_url: string;
      statuses_url: string;
      subscribers_url: string;
      subscription_url: string;
      tags_url: string;
      teams_url: string;
      trees_url: string;
      clone_url?: string;
      mirror_url?: string;
      hooks_url: string;
      svn_url?: string;
      homepage?: string;
      language?: string;
      forks_count?: number;
      stargazers_count?: number;
      watchers_count?: number;
      size?: number;
      default_branch?: string;
      open_issues_count?: number;
      is_template?: boolean;
      topics?: Array<string>;
      has_issues?: boolean;
      has_projects?: boolean;
      has_wiki?: boolean;
      has_pages?: boolean;
      has_downloads?: boolean;
      archived?: boolean;
      disabled?: boolean;
      visibility?: string;
      pushed_at?: string;
      created_at?: string;
      updated_at?: string;
      permissions?: {
        admin?: boolean;

        maintain?: boolean;

        push?: boolean;

        triage?: boolean;

        pull?: boolean;
      };
      role_name?: string;
      template_repository?: NullableRepository;
      temp_clone_token?: string;
      delete_branch_on_merge?: boolean;
      subscribers_count?: number;
      network_count?: number;
      code_of_conduct?: CodeOfConduct;
      license?: {
        key?: string;

        name?: string;

        spdx_id?: string;

        url?: string;

        node_id?: string;
      };
      forks?: number;
      open_issues?: number;
      watchers?: number;
      allow_forking?: boolean;
    };

    /**
     * A software package
     */
    export type Package = {
      /**
       * Unique identifier of the package.
       */
      id: number;

      /**
       * The name of the package.
       */
      name: string;
      package_type: \\"npm\\" | \\"maven\\" | \\"rubygems\\" | \\"docker\\" | \\"nuget\\" | \\"container\\";
      url: string;
      html_url: string;

      /**
       * The number of versions of the package.
       */
      version_count: number;
      visibility: \\"private\\" | \\"public\\";
      owner?: NullableSimpleUser;
      repository?: NullableMinimalRepository;
      created_at: string;
      updated_at: string;
    };

    /**
     * A version of a software package
     */
    export type PackageVersion = {
      /**
       * Unique identifier of the package version.
       */
      id: number;

      /**
       * The name of the package version.
       */
      name: string;
      url: string;
      package_html_url: string;
      html_url?: string;
      license?: string;
      description?: string;
      created_at: string;
      updated_at: string;
      deleted_at?: string;
      metadata?: {
        package_type: \\"npm\\" | \\"maven\\" | \\"rubygems\\" | \\"docker\\" | \\"nuget\\" | \\"container\\";

        container?: {
          tags: Array<string>;
        };

        docker?: {
          tag?: Array<string>;
        };
      };
    };

    /**
     * Projects are a way to organize columns and cards of work.
     */
    export type Project = {
      owner_url: string;
      url: string;
      html_url: string;
      columns_url: string;
      id: number;
      node_id: string;

      /**
       * Name of the project
       */
      name: string;

      /**
       * Body of the project
       */
      body: string;
      number: number;

      /**
       * State of the project; either 'open' or 'closed'
       */
      state: string;
      creator: NullableSimpleUser;
      created_at: string;
      updated_at: string;

      /**
       * The baseline permission that all organization members have on this project. Only present if owner is an organization.
       */
      organization_permission?: \\"read\\" | \\"write\\" | \\"admin\\" | \\"none\\";

      /**
       * Whether or not this project can be seen by everyone. Only present if owner is an organization.
       */
      private?: boolean;
    };

    /**
     * External Groups to be mapped to a team for membership
     */
    export type GroupMapping = {
      /**
       * Array of groups to be mapped to this team
       */
      groups?: Array<{
        /**
         * The ID of the group
         */
        group_id: string;

        /**
         * The name of the group
         */
        group_name: string;

        /**
         * a description of the group
         */
        group_description: string;

        /**
         * synchronization status for this group mapping
         */
        status?: string;

        /**
         * the time of the last sync for this group-mapping
         */
        synced_at?: string;
      }>;
    };

    /**
     * Groups of organization members that gives permissions on specified repositories.
     */
    export type TeamFull = {
      /**
       * Unique identifier of the team
       */
      id: number;
      node_id: string;

      /**
       * URL for the team
       */
      url: string;
      html_url: string;

      /**
       * Name of the team
       */
      name: string;
      slug: string;
      description: string;

      /**
       * The level of privacy this team should have
       */
      privacy?: \\"closed\\" | \\"secret\\";

      /**
       * Permission that the team will have for its repositories
       */
      permission: string;
      members_url: string;
      repositories_url: string;
      parent?: NullableTeamSimple;
      members_count: number;
      repos_count: number;
      created_at: string;
      updated_at: string;
      organization: OrganizationFull;

      /**
       * Distinguished Name (DN) that team maps to within LDAP environment
       */
      ldap_dn?: string;
    };

    /**
     * A team discussion is a persistent record of a free-form conversation within a team.
     */
    export type TeamDiscussion = {
      author: NullableSimpleUser;

      /**
       * The main text of the discussion.
       */
      body: string;
      body_html: string;

      /**
       * The current version of the body content. If provided, this update operation will be rejected if the given version does not match the latest version on the server.
       */
      body_version: string;
      comments_count: number;
      comments_url: string;
      created_at: string;
      last_edited_at: string;
      html_url: string;
      node_id: string;

      /**
       * The unique sequence number of a team discussion.
       */
      number: number;

      /**
       * Whether or not this discussion should be pinned for easy retrieval.
       */
      pinned: boolean;

      /**
       * Whether or not this discussion should be restricted to team members and organization administrators.
       */
      private: boolean;
      team_url: string;

      /**
       * The title of the discussion.
       */
      title: string;
      updated_at: string;
      url: string;
      reactions?: ReactionRollup;
    };

    /**
     * A reply to a discussion within a team.
     */
    export type TeamDiscussionComment = {
      author: NullableSimpleUser;

      /**
       * The main text of the comment.
       */
      body: string;
      body_html: string;

      /**
       * The current version of the body content. If provided, this update operation will be rejected if the given version does not match the latest version on the server.
       */
      body_version: string;
      created_at: string;
      last_edited_at: string;
      discussion_url: string;
      html_url: string;
      node_id: string;

      /**
       * The unique sequence number of a team discussion comment.
       */
      number: number;
      updated_at: string;
      url: string;
      reactions?: ReactionRollup;
    };

    /**
     * Reactions to conversations provide a way to help people express their feelings more simply and effectively.
     */
    export type Reaction = {
      id: number;
      node_id: string;
      user: NullableSimpleUser;

      /**
       * The reaction to use
       */
      content: \\"+1\\" | \\"-1\\" | \\"laugh\\" | \\"confused\\" | \\"heart\\" | \\"hooray\\" | \\"rocket\\" | \\"eyes\\";
      created_at: string;
    };

    /**
     * Team Membership
     */
    export type TeamMembership = {
      url: string;

      /**
       * The role of the user in the team.
       */
      role: \\"member\\" | \\"maintainer\\";

      /**
       * The state of the user's membership in the team.
       */
      state: \\"active\\" | \\"pending\\";
    };

    /**
     * A team's access to a project.
     */
    export type TeamProject = {
      owner_url: string;
      url: string;
      html_url: string;
      columns_url: string;
      id: number;
      node_id: string;
      name: string;
      body: string;
      number: number;
      state: string;
      creator: SimpleUser;
      created_at: string;
      updated_at: string;

      /**
       * The organization permission for this project. Only present when owner is an organization.
       */
      organization_permission?: string;

      /**
       * Whether the project is private or not. Only present when owner is an organization.
       */
      private?: boolean;
      permissions: {
        read: boolean;

        write: boolean;

        admin: boolean;
      };
    };

    /**
     * A team's access to a repository.
     */
    export type TeamRepository = {
      /**
       * Unique identifier of the repository
       */
      id: number;
      node_id: string;

      /**
       * The name of the repository.
       */
      name: string;
      full_name: string;
      license: NullableLicenseSimple;
      forks: number;
      permissions?: {
        admin: boolean;

        pull: boolean;

        triage?: boolean;

        push: boolean;

        maintain?: boolean;
      };
      role_name?: string;
      owner: NullableSimpleUser;

      /**
       * Whether the repository is private or public.
       */
      private: boolean;
      html_url: string;
      description: string;
      fork: boolean;
      url: string;
      archive_url: string;
      assignees_url: string;
      blobs_url: string;
      branches_url: string;
      collaborators_url: string;
      comments_url: string;
      commits_url: string;
      compare_url: string;
      contents_url: string;
      contributors_url: string;
      deployments_url: string;
      downloads_url: string;
      events_url: string;
      forks_url: string;
      git_commits_url: string;
      git_refs_url: string;
      git_tags_url: string;
      git_url: string;
      issue_comment_url: string;
      issue_events_url: string;
      issues_url: string;
      keys_url: string;
      labels_url: string;
      languages_url: string;
      merges_url: string;
      milestones_url: string;
      notifications_url: string;
      pulls_url: string;
      releases_url: string;
      ssh_url: string;
      stargazers_url: string;
      statuses_url: string;
      subscribers_url: string;
      subscription_url: string;
      tags_url: string;
      teams_url: string;
      trees_url: string;
      clone_url: string;
      mirror_url: string;
      hooks_url: string;
      svn_url: string;
      homepage: string;
      language: string;
      forks_count: number;
      stargazers_count: number;
      watchers_count: number;
      size: number;

      /**
       * The default branch of the repository.
       */
      default_branch: string;
      open_issues_count: number;

      /**
       * Whether this repository acts as a template that can be used to generate new repositories.
       */
      is_template?: boolean;
      topics?: Array<string>;

      /**
       * Whether issues are enabled.
       */
      has_issues: boolean;

      /**
       * Whether projects are enabled.
       */
      has_projects: boolean;

      /**
       * Whether the wiki is enabled.
       */
      has_wiki: boolean;
      has_pages: boolean;

      /**
       * Whether downloads are enabled.
       */
      has_downloads: boolean;

      /**
       * Whether the repository is archived.
       */
      archived: boolean;

      /**
       * Returns whether or not this repository disabled.
       */
      disabled: boolean;

      /**
       * The repository visibility: public, private, or internal.
       */
      visibility?: string;
      pushed_at: string;
      created_at: string;
      updated_at: string;

      /**
       * Whether to allow rebase merges for pull requests.
       */
      allow_rebase_merge?: boolean;
      template_repository?: NullableRepository;
      temp_clone_token?: string;

      /**
       * Whether to allow squash merges for pull requests.
       */
      allow_squash_merge?: boolean;

      /**
       * Whether to allow Auto-merge to be used on pull requests.
       */
      allow_auto_merge?: boolean;

      /**
       * Whether to delete head branches when pull requests are merged
       */
      delete_branch_on_merge?: boolean;

      /**
       * Whether to allow merge commits for pull requests.
       */
      allow_merge_commit?: boolean;

      /**
       * Whether to allow forking this repo
       */
      allow_forking?: boolean;
      subscribers_count?: number;
      network_count?: number;
      open_issues: number;
      watchers: number;
      master_branch?: string;
    };

    /**
     * Project cards represent a scope of work.
     */
    export type ProjectCard = {
      url: string;

      /**
       * The project card's ID
       */
      id: number;
      node_id: string;
      note: string;
      creator: NullableSimpleUser;
      created_at: string;
      updated_at: string;

      /**
       * Whether or not the card is archived
       */
      archived?: boolean;
      column_name?: string;
      project_id?: string;
      column_url: string;
      content_url?: string;
      project_url: string;
    };

    /**
     * Project columns contain cards of work.
     */
    export type ProjectColumn = {
      url: string;
      project_url: string;
      cards_url: string;

      /**
       * The unique identifier of the project column
       */
      id: number;
      node_id: string;

      /**
       * Name of the project column
       */
      name: string;
      created_at: string;
      updated_at: string;
    };

    /**
     * Project Collaborator Permission
     */
    export type ProjectCollaboratorPermission = {
      permission: string;
      user: NullableSimpleUser;
    };

    export type RateLimit = {
      limit: number;
      remaining: number;
      reset: number;
      used: number;
    };

    /**
     * Rate Limit Overview
     */
    export type RateLimitOverview = {
      resources: {
        core: RateLimit;

        graphql?: RateLimit;

        search: RateLimit;

        source_import?: RateLimit;

        integration_manifest?: RateLimit;

        code_scanning_upload?: RateLimit;

        actions_runner_registration?: RateLimit;

        scim?: RateLimit;

        dependency_snapshots?: RateLimit;
      };
      rate: RateLimit;
    };

    /**
     * Code of Conduct Simple
     */
    export type CodeOfConductSimple = {
      url: string;
      key: string;
      name: string;
      html_url: string;
    };

    export type SecurityAndAnalysis = {
      advanced_security?: {
        status?: \\"enabled\\" | \\"disabled\\";
      };
      secret_scanning?: {
        status?: \\"enabled\\" | \\"disabled\\";
      };
      secret_scanning_push_protection?: {
        status?: \\"enabled\\" | \\"disabled\\";
      };
    };

    /**
     * Full Repository
     */
    export type FullRepository = {
      id: number;
      node_id: string;
      name: string;
      full_name: string;
      owner: SimpleUser;
      private: boolean;
      html_url: string;
      description: string;
      fork: boolean;
      url: string;
      archive_url: string;
      assignees_url: string;
      blobs_url: string;
      branches_url: string;
      collaborators_url: string;
      comments_url: string;
      commits_url: string;
      compare_url: string;
      contents_url: string;
      contributors_url: string;
      deployments_url: string;
      downloads_url: string;
      events_url: string;
      forks_url: string;
      git_commits_url: string;
      git_refs_url: string;
      git_tags_url: string;
      git_url: string;
      issue_comment_url: string;
      issue_events_url: string;
      issues_url: string;
      keys_url: string;
      labels_url: string;
      languages_url: string;
      merges_url: string;
      milestones_url: string;
      notifications_url: string;
      pulls_url: string;
      releases_url: string;
      ssh_url: string;
      stargazers_url: string;
      statuses_url: string;
      subscribers_url: string;
      subscription_url: string;
      tags_url: string;
      teams_url: string;
      trees_url: string;
      clone_url: string;
      mirror_url: string;
      hooks_url: string;
      svn_url: string;
      homepage: string;
      language: string;
      forks_count: number;
      stargazers_count: number;
      watchers_count: number;
      size: number;
      default_branch: string;
      open_issues_count: number;
      is_template?: boolean;
      topics?: Array<string>;
      has_issues: boolean;
      has_projects: boolean;
      has_wiki: boolean;
      has_pages: boolean;
      has_downloads: boolean;
      archived: boolean;

      /**
       * Returns whether or not this repository disabled.
       */
      disabled: boolean;

      /**
       * The repository visibility: public, private, or internal.
       */
      visibility?: string;
      pushed_at: string;
      created_at: string;
      updated_at: string;
      permissions?: {
        admin: boolean;

        maintain?: boolean;

        push: boolean;

        triage?: boolean;

        pull: boolean;
      };
      allow_rebase_merge?: boolean;
      template_repository?: NullableRepository;
      temp_clone_token?: string;
      allow_squash_merge?: boolean;
      allow_auto_merge?: boolean;
      delete_branch_on_merge?: boolean;
      allow_merge_commit?: boolean;
      allow_update_branch?: boolean;
      use_squash_pr_title_as_default?: boolean;
      allow_forking?: boolean;
      subscribers_count: number;
      network_count: number;
      license: NullableLicenseSimple;
      organization?: NullableSimpleUser;
      parent?: Repository;
      source?: Repository;
      forks: number;
      master_branch?: string;
      open_issues: number;
      watchers: number;

      /**
       * Whether anonymous git access is allowed.
       */
      anonymous_access_enabled?: boolean;
      code_of_conduct?: CodeOfConductSimple;
      security_and_analysis?: SecurityAndAnalysis;
    };

    /**
     * An artifact
     */
    export type Artifact = {
      id: number;
      node_id: string;

      /**
       * The name of the artifact.
       */
      name: string;

      /**
       * The size in bytes of the artifact.
       */
      size_in_bytes: number;
      url: string;
      archive_download_url: string;

      /**
       * Whether or not the artifact has expired.
       */
      expired: boolean;
      created_at: string;
      expires_at: string;
      updated_at: string;
      workflow_run?: {
        id?: number;

        repository_id?: number;

        head_repository_id?: number;

        head_branch?: string;

        head_sha?: string;
      };
    };

    /**
     * Repository actions caches
     */
    export type ActionsCacheList = {
      /**
       * Total number of caches
       */
      total_count: number;

      /**
       * Array of caches
       */
      actions_caches: Array<{
        id?: number;

        ref?: string;

        key?: string;

        version?: string;

        last_accessed_at?: string;

        created_at?: string;

        size_in_bytes?: number;
      }>;
    };

    /**
     * Information of a job execution in a workflow run
     */
    export type Job = {
      /**
       * The id of the job.
       */
      id: number;

      /**
       * The id of the associated workflow run.
       */
      run_id: number;
      run_url: string;

      /**
       * Attempt number of the associated workflow run, 1 for first attempt and higher if the workflow was re-run.
       */
      run_attempt?: number;
      node_id: string;

      /**
       * The SHA of the commit that is being run.
       */
      head_sha: string;
      url: string;
      html_url: string;

      /**
       * The phase of the lifecycle that the job is currently in.
       */
      status: \\"queued\\" | \\"in_progress\\" | \\"completed\\";

      /**
       * The outcome of the job.
       */
      conclusion: string;

      /**
       * The time that the job started, in ISO 8601 format.
       */
      started_at: string;

      /**
       * The time that the job finished, in ISO 8601 format.
       */
      completed_at: string;

      /**
       * The name of the job.
       */
      name: string;

      /**
       * Steps in this job.
       */
      steps?: Array<{
        /**
         * The phase of the lifecycle that the job is currently in.
         */
        status: \\"queued\\" | \\"in_progress\\" | \\"completed\\";

        /**
         * The outcome of the job.
         */
        conclusion: string;

        /**
         * The name of the job.
         */
        name: string;

        number: number;

        /**
         * The time that the step started, in ISO 8601 format.
         */
        started_at?: string;

        /**
         * The time that the job finished, in ISO 8601 format.
         */
        completed_at?: string;
      }>;
      check_run_url: string;

      /**
       * Labels for the workflow job. Specified by the \\"runs_on\\" attribute in the action's workflow file.
       */
      labels: Array<string>;

      /**
       * The ID of the runner to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
       */
      runner_id: number;

      /**
       * The name of the runner to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
       */
      runner_name: string;

      /**
       * The ID of the runner group to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
       */
      runner_group_id: number;

      /**
       * The name of the runner group to which this job has been assigned. (If a runner hasn't yet been assigned, this will be null.)
       */
      runner_group_name: string;
    };

    /**
     * OIDC Customer Subject
     */
    export type OptOutOidcCustomSub = {
      use_default: boolean;
    };

    /**
     * Whether GitHub Actions is enabled on the repository.
     */
    export type ActionsEnabled = boolean;

    export type ActionsRepositoryPermissions = {
      enabled: ActionsEnabled;
      allowed_actions?: AllowedActions;
      selected_actions_url?: SelectedActionsUrl;
    };

    export type ActionsWorkflowAccessToRepository = {
      /** 
    * Defines the level of access that workflows outside of the repository have to actions and reusable workflows within the
    repository. \`none\` means access is only possible from workflows in this repository.
    */
      access_level: \\"none\\" | \\"organization\\" | \\"enterprise\\";
    };

    /**
     * A workflow referenced/reused by the initial caller workflow
     */
    export type ReferencedWorkflow = {
      path: string;
      sha: string;
      ref?: string;
    };

    export type PullRequestMinimal = {
      id: number;
      number: number;
      url: string;
      head: {
        ref: string;

        sha: string;

        repo: {
          id: number;

          url: string;

          name: string;
        };
      };
      base: {
        ref: string;

        sha: string;

        repo: {
          id: number;

          url: string;

          name: string;
        };
      };
    };

    /**
     * Simple Commit
     */
    export type NullableSimpleCommit = {
      id: string;
      tree_id: string;
      message: string;
      timestamp: string;
      author: {
        name: string;

        email: string;
      };
      committer: {
        name: string;

        email: string;
      };
    };

    /**
     * An invocation of a workflow
     */
    export type WorkflowRun = {
      /**
       * The ID of the workflow run.
       */
      id: number;

      /**
       * The name of the workflow run.
       */
      name?: string;
      node_id: string;

      /**
       * The ID of the associated check suite.
       */
      check_suite_id?: number;

      /**
       * The node ID of the associated check suite.
       */
      check_suite_node_id?: string;
      head_branch: string;

      /**
       * The SHA of the head commit that points to the version of the workflow being run.
       */
      head_sha: string;

      /**
       * The full path of the workflow
       */
      path: string;

      /**
       * The auto incrementing run number for the workflow run.
       */
      run_number: number;

      /**
       * Attempt number of the run, 1 for first attempt and higher if the workflow was re-run.
       */
      run_attempt?: number;
      referenced_workflows?: Array<ReferencedWorkflow>;
      event: string;
      status: string;
      conclusion: string;

      /**
       * The ID of the parent workflow.
       */
      workflow_id: number;

      /**
       * The URL to the workflow run.
       */
      url: string;
      html_url: string;
      pull_requests: Array<PullRequestMinimal>;
      created_at: string;
      updated_at: string;
      actor?: SimpleUser;
      triggering_actor?: SimpleUser;

      /**
       * The start time of the latest run. Resets on re-run.
       */
      run_started_at?: string;

      /**
       * The URL to the jobs for the workflow run.
       */
      jobs_url: string;

      /**
       * The URL to download the logs for the workflow run.
       */
      logs_url: string;

      /**
       * The URL to the associated check suite.
       */
      check_suite_url: string;

      /**
       * The URL to the artifacts for the workflow run.
       */
      artifacts_url: string;

      /**
       * The URL to cancel the workflow run.
       */
      cancel_url: string;

      /**
       * The URL to rerun the workflow run.
       */
      rerun_url: string;

      /**
       * The URL to the previous attempted run of this workflow, if one exists.
       */
      previous_attempt_url?: string;

      /**
       * The URL to the workflow.
       */
      workflow_url: string;
      head_commit: NullableSimpleCommit;
      repository: MinimalRepository;
      head_repository: MinimalRepository;
      head_repository_id?: number;
    };

    /**
     * An entry in the reviews log for environment deployments
     */
    export type EnvironmentApprovals = {
      /**
       * The list of environments that were approved or rejected
       */
      environments: Array<{
        /**
         * The id of the environment.
         */
        id?: number;

        node_id?: string;

        /**
         * The name of the environment.
         */
        name?: string;

        url?: string;

        html_url?: string;

        /**
         * The time that the environment was created, in ISO 8601 format.
         */
        created_at?: string;

        /**
         * The time that the environment was last updated, in ISO 8601 format.
         */
        updated_at?: string;
      }>;

      /**
       * Whether deployment to the environment(s) was approved or rejected
       */
      state: \\"approved\\" | \\"rejected\\";
      user: SimpleUser;

      /**
       * The comment submitted with the deployment review
       */
      comment: string;
    };

    /**
     * The type of reviewer.
     */
    export type DeploymentReviewerType = \\"User\\" | \\"Team\\";

    /**
     * Details of a deployment that is waiting for protection rules to pass
     */
    export type PendingDeployment = {
      environment: {
        /**
         * The id of the environment.
         */
        id?: number;

        node_id?: string;

        /**
         * The name of the environment.
         */
        name?: string;

        url?: string;

        html_url?: string;
      };

      /**
       * The set duration of the wait timer
       */
      wait_timer: number;

      /**
       * The time that the wait timer began.
       */
      wait_timer_started_at: string;

      /**
       * Whether the currently authenticated user can approve the deployment
       */
      current_user_can_approve: boolean;

      /**
       * The people or teams that may approve jobs that reference the environment. You can list up to six users or teams as reviewers. The reviewers must have at least read access to the repository. Only one of the required reviewers needs to approve the job for it to proceed.
       */
      reviewers: Array<{
        type?: DeploymentReviewerType;

        reviewer?: SimpleUser | Team;
      }>;
    };

    /**
     * A request for a specific ref(branch,sha,tag) to be deployed
     */
    export type Deployment = {
      url: string;

      /**
       * Unique identifier of the deployment
       */
      id: number;
      node_id: string;
      sha: string;

      /**
       * The ref to deploy. This can be a branch, tag, or sha.
       */
      ref: string;

      /**
       * Parameter to specify a task to execute
       */
      task: string;
      payload: string;
      original_environment?: string;

      /**
       * Name for the target deployment environment.
       */
      environment: string;
      description: string;
      creator: NullableSimpleUser;
      created_at: string;
      updated_at: string;
      statuses_url: string;
      repository_url: string;

      /**
       * Specifies if the given environment is will no longer exist at some point in the future. Default: false.
       */
      transient_environment?: boolean;

      /**
       * Specifies if the given environment is one that end-users directly interact with. Default: false.
       */
      production_environment?: boolean;
      performed_via_github_app?: NullableIntegration;
    };

    /**
     * Workflow Run Usage
     */
    export type WorkflowRunUsage = {
      billable: {
        UBUNTU?: {
          total_ms: number;

          jobs: number;

          job_runs?: Array<{
            job_id: number;

            duration_ms: number;
          }>;
        };

        MACOS?: {
          total_ms: number;

          jobs: number;

          job_runs?: Array<{
            job_id: number;

            duration_ms: number;
          }>;
        };

        WINDOWS?: {
          total_ms: number;

          jobs: number;

          job_runs?: Array<{
            job_id: number;

            duration_ms: number;
          }>;
        };
      };
      run_duration_ms?: number;
    };

    /**
     * Set secrets for GitHub Actions.
     */
    export type ActionsSecret = {
      /**
       * The name of the secret.
       */
      name: string;
      created_at: string;
      updated_at: string;
    };

    /**
     * A GitHub Actions workflow
     */
    export type Workflow = {
      id: number;
      node_id: string;
      name: string;
      path: string;
      state: \\"active\\" | \\"deleted\\" | \\"disabled_fork\\" | \\"disabled_inactivity\\" | \\"disabled_manually\\";
      created_at: string;
      updated_at: string;
      url: string;
      html_url: string;
      badge_url: string;
      deleted_at?: string;
    };

    /**
     * Workflow Usage
     */
    export type WorkflowUsage = {
      billable: {
        UBUNTU?: {
          total_ms?: number;
        };

        MACOS?: {
          total_ms?: number;
        };

        WINDOWS?: {
          total_ms?: number;
        };
      };
    };

    /**
     * An autolink reference.
     */
    export type Autolink = {
      id: number;

      /**
       * The prefix of a key that is linkified.
       */
      key_prefix: string;

      /**
       * A template for the target URL that is generated if a key was found.
       */
      url_template: string;

      /**
       * Whether this autolink reference matches alphanumeric characters. If false, this autolink reference is a legacy autolink that only matches numeric characters.
       */
      is_alphanumeric?: boolean;
    };

    /**
     * Protected Branch Required Status Check
     */
    export type ProtectedBranchRequiredStatusCheck = {
      url?: string;
      enforcement_level?: string;
      contexts: Array<string>;
      checks: Array<{
        context: string;

        app_id: number;
      }>;
      contexts_url?: string;
      strict?: boolean;
    };

    /**
     * Protected Branch Admin Enforced
     */
    export type ProtectedBranchAdminEnforced = {
      url: string;
      enabled: boolean;
    };

    /**
     * Protected Branch Pull Request Review
     */
    export type ProtectedBranchPullRequestReview = {
      url?: string;
      dismissal_restrictions?: {
        /**
         * The list of users with review dismissal access.
         */
        users?: Array<SimpleUser>;

        /**
         * The list of teams with review dismissal access.
         */
        teams?: Array<Team>;

        /**
         * The list of apps with review dismissal access.
         */
        apps?: Array<Integration>;

        url?: string;

        users_url?: string;

        teams_url?: string;
      };

      /**
       * Allow specific users, teams, or apps to bypass pull request requirements.
       */
      bypass_pull_request_allowances?: {
        /**
         * The list of users allowed to bypass pull request requirements.
         */
        users?: Array<SimpleUser>;

        /**
         * The list of teams allowed to bypass pull request requirements.
         */
        teams?: Array<Team>;

        /**
         * The list of apps allowed to bypass pull request requirements.
         */
        apps?: Array<Integration>;
      };
      dismiss_stale_reviews: boolean;
      require_code_owner_reviews: boolean;
      required_approving_review_count?: number;
    };

    /**
     * Branch Restriction Policy
     */
    export type BranchRestrictionPolicy = {
      url: string;
      users_url: string;
      teams_url: string;
      apps_url: string;
      users: Array<{
        login?: string;

        id?: number;

        node_id?: string;

        avatar_url?: string;

        gravatar_id?: string;

        url?: string;

        html_url?: string;

        followers_url?: string;

        following_url?: string;

        gists_url?: string;

        starred_url?: string;

        subscriptions_url?: string;

        organizations_url?: string;

        repos_url?: string;

        events_url?: string;

        received_events_url?: string;

        type?: string;

        site_admin?: boolean;
      }>;
      teams: Array<{
        id?: number;

        node_id?: string;

        url?: string;

        html_url?: string;

        name?: string;

        slug?: string;

        description?: string;

        privacy?: string;

        permission?: string;

        members_url?: string;

        repositories_url?: string;

        parent?: string;
      }>;
      apps: Array<{
        id?: number;

        slug?: string;

        node_id?: string;

        owner?: {
          login?: string;

          id?: number;

          node_id?: string;

          url?: string;

          repos_url?: string;

          events_url?: string;

          hooks_url?: string;

          issues_url?: string;

          members_url?: string;

          public_members_url?: string;

          avatar_url?: string;

          description?: string;

          gravatar_id?: string;

          html_url?: string;

          followers_url?: string;

          following_url?: string;

          gists_url?: string;

          starred_url?: string;

          subscriptions_url?: string;

          organizations_url?: string;

          received_events_url?: string;

          type?: string;

          site_admin?: boolean;
        };

        name?: string;

        description?: string;

        external_url?: string;

        html_url?: string;

        created_at?: string;

        updated_at?: string;

        permissions?: {
          metadata?: string;

          contents?: string;

          issues?: string;

          single_file?: string;
        };

        events?: Array<string>;
      }>;
    };

    /**
     * Branch Protection
     */
    export type BranchProtection = {
      url?: string;
      enabled?: boolean;
      required_status_checks?: ProtectedBranchRequiredStatusCheck;
      enforce_admins?: ProtectedBranchAdminEnforced;
      required_pull_request_reviews?: ProtectedBranchPullRequestReview;
      restrictions?: BranchRestrictionPolicy;
      required_linear_history?: {
        enabled?: boolean;
      };
      allow_force_pushes?: {
        enabled?: boolean;
      };
      allow_deletions?: {
        enabled?: boolean;
      };
      block_creations?: {
        enabled?: boolean;
      };
      required_conversation_resolution?: {
        enabled?: boolean;
      };
      name?: string;
      protection_url?: string;
      required_signatures?: {
        url: string;

        enabled: boolean;
      };
    };

    /**
     * Short Branch
     */
    export type ShortBranch = {
      name: string;
      commit: {
        sha: string;

        url: string;
      };
      protected: boolean;
      protection?: BranchProtection;
      protection_url?: string;
    };

    /**
     * Metaproperties for Git author/committer information.
     */
    export type NullableGitUser = {
      name?: string;
      email?: string;
      date?: string;
    };

    export type Verification = {
      verified: boolean;
      reason: string;
      payload: string;
      signature: string;
    };

    /**
     * Diff Entry
     */
    export type DiffEntry = {
      sha: string;
      filename: string;
      status: \\"added\\" | \\"removed\\" | \\"modified\\" | \\"renamed\\" | \\"copied\\" | \\"changed\\" | \\"unchanged\\";
      additions: number;
      deletions: number;
      changes: number;
      blob_url: string;
      raw_url: string;
      contents_url: string;
      patch?: string;
      previous_filename?: string;
    };

    /**
     * Commit
     */
    export type Commit = {
      url: string;
      sha: string;
      node_id: string;
      html_url: string;
      comments_url: string;
      commit: {
        url: string;

        author: NullableGitUser;

        committer: NullableGitUser;

        message: string;

        comment_count: number;

        tree: {
          sha: string;

          url: string;
        };

        verification?: Verification;
      };
      author: NullableSimpleUser;
      committer: NullableSimpleUser;
      parents: Array<{
        sha: string;

        url: string;

        html_url?: string;
      }>;
      stats?: {
        additions?: number;

        deletions?: number;

        total?: number;
      };
      files?: Array<DiffEntry>;
    };

    /**
     * Branch With Protection
     */
    export type BranchWithProtection = {
      name: string;
      commit: Commit;
      _links: {
        html: string;

        self: string;
      };
      protected: boolean;
      protection: BranchProtection;
      protection_url: string;
      pattern?: string;
      required_approving_review_count?: number;
    };

    /**
     * Status Check Policy
     */
    export type StatusCheckPolicy = {
      url: string;
      strict: boolean;
      contexts: Array<string>;
      checks: Array<{
        context: string;

        app_id: number;
      }>;
      contexts_url: string;
    };

    /**
     * Branch protections protect branches
     */
    export type ProtectedBranch = {
      url: string;
      required_status_checks?: StatusCheckPolicy;
      required_pull_request_reviews?: {
        url: string;

        dismiss_stale_reviews?: boolean;

        require_code_owner_reviews?: boolean;

        required_approving_review_count?: number;

        dismissal_restrictions?: {
          url: string;

          users_url: string;

          teams_url: string;

          users: Array<SimpleUser>;

          teams: Array<Team>;

          apps?: Array<Integration>;
        };

        bypass_pull_request_allowances?: {
          users: Array<SimpleUser>;

          teams: Array<Team>;

          apps?: Array<Integration>;
        };
      };
      required_signatures?: {
        url: string;

        enabled: boolean;
      };
      enforce_admins?: {
        url: string;

        enabled: boolean;
      };
      required_linear_history?: {
        enabled: boolean;
      };
      allow_force_pushes?: {
        enabled: boolean;
      };
      allow_deletions?: {
        enabled: boolean;
      };
      restrictions?: BranchRestrictionPolicy;
      required_conversation_resolution?: {
        enabled?: boolean;
      };
      block_creations?: {
        enabled: boolean;
      };
    };

    /**
     * A deployment created as the result of an Actions check run from a workflow that references an environment
     */
    export type DeploymentSimple = {
      url: string;

      /**
       * Unique identifier of the deployment
       */
      id: number;
      node_id: string;

      /**
       * Parameter to specify a task to execute
       */
      task: string;
      original_environment?: string;

      /**
       * Name for the target deployment environment.
       */
      environment: string;
      description: string;
      created_at: string;
      updated_at: string;
      statuses_url: string;
      repository_url: string;

      /**
       * Specifies if the given environment is will no longer exist at some point in the future. Default: false.
       */
      transient_environment?: boolean;

      /**
       * Specifies if the given environment is one that end-users directly interact with. Default: false.
       */
      production_environment?: boolean;
      performed_via_github_app?: NullableIntegration;
    };

    /**
     * A check performed on the code of a given code change
     */
    export type CheckRun = {
      /**
       * The id of the check.
       */
      id: number;

      /**
       * The SHA of the commit that is being checked.
       */
      head_sha: string;
      node_id: string;
      external_id: string;
      url: string;
      html_url: string;
      details_url: string;

      /**
       * The phase of the lifecycle that the check is currently in.
       */
      status: \\"queued\\" | \\"in_progress\\" | \\"completed\\";
      conclusion:
        | \\"success\\"
        | \\"failure\\"
        | \\"neutral\\"
        | \\"cancelled\\"
        | \\"skipped\\"
        | \\"timed_out\\"
        | \\"action_required\\";
      started_at: string;
      completed_at: string;
      output: {
        title: string;

        summary: string;

        text: string;

        annotations_count: number;

        annotations_url: string;
      };

      /**
       * The name of the check.
       */
      name: string;
      check_suite: {
        id: number;
      };
      app: NullableIntegration;
      pull_requests: Array<PullRequestMinimal>;
      deployment?: DeploymentSimple;
    };

    /**
     * Check Annotation
     */
    export type CheckAnnotation = {
      path: string;
      start_line: number;
      end_line: number;
      start_column: number;
      end_column: number;
      annotation_level: string;
      title: string;
      message: string;
      raw_details: string;
      blob_href: string;
    };

    /**
     * Simple Commit
     */
    export type SimpleCommit = {
      id: string;
      tree_id: string;
      message: string;
      timestamp: string;
      author: {
        name: string;

        email: string;
      };
      committer: {
        name: string;

        email: string;
      };
    };

    /**
     * A suite of checks performed on the code of a given code change
     */
    export type CheckSuite = {
      id: number;
      node_id: string;
      head_branch: string;

      /**
       * The SHA of the head commit that is being checked.
       */
      head_sha: string;
      status: \\"queued\\" | \\"in_progress\\" | \\"completed\\";
      conclusion:
        | \\"success\\"
        | \\"failure\\"
        | \\"neutral\\"
        | \\"cancelled\\"
        | \\"skipped\\"
        | \\"timed_out\\"
        | \\"action_required\\";
      url: string;
      before: string;
      after: string;
      pull_requests: Array<PullRequestMinimal>;
      app: NullableIntegration;
      repository: MinimalRepository;
      created_at: string;
      updated_at: string;
      head_commit: SimpleCommit;
      latest_check_runs_count: number;
      check_runs_url: string;
      rerequestable?: boolean;
      runs_rerequestable?: boolean;
    };

    /**
     * Check suite configuration preferences for a repository.
     */
    export type CheckSuitePreference = {
      preferences: {
        auto_trigger_checks?: Array<{
          app_id: number;

          setting: boolean;
        }>;
      };
      repository: MinimalRepository;
    };

    export type CodeScanningAlertRuleSummary = {
      /**
       * A unique identifier for the rule used to detect the alert.
       */
      id?: string;

      /**
       * The name of the rule used to detect the alert.
       */
      name?: string;

      /**
       * A set of tags applicable for the rule.
       */
      tags?: Array<string>;

      /**
       * The severity of the alert.
       */
      severity?: \\"none\\" | \\"note\\" | \\"warning\\" | \\"error\\";

      /**
       * A short description of the rule used to detect the alert.
       */
      description?: string;
    };

    export type CodeScanningAlertItems = {
      number: AlertNumber;
      created_at: AlertCreatedAt;
      updated_at?: AlertUpdatedAt;
      url: AlertUrl;
      html_url: AlertHtmlUrl;
      instances_url: AlertInstancesUrl;
      state: CodeScanningAlertState;
      fixed_at?: CodeScanningAlertFixedAt;
      dismissed_by: NullableSimpleUser;
      dismissed_at: CodeScanningAlertDismissedAt;
      dismissed_reason: CodeScanningAlertDismissedReason;
      dismissed_comment?: CodeScanningAlertDismissedComment;
      rule: CodeScanningAlertRuleSummary;
      tool: CodeScanningAnalysisTool;
      most_recent_instance: CodeScanningAlertInstance;
    };

    export type CodeScanningAlert = {
      number: AlertNumber;
      created_at: AlertCreatedAt;
      updated_at?: AlertUpdatedAt;
      url: AlertUrl;
      html_url: AlertHtmlUrl;
      instances_url: AlertInstancesUrl;
      state: CodeScanningAlertState;
      fixed_at?: CodeScanningAlertFixedAt;
      dismissed_by: NullableSimpleUser;
      dismissed_at: CodeScanningAlertDismissedAt;
      dismissed_reason: CodeScanningAlertDismissedReason;
      dismissed_comment?: CodeScanningAlertDismissedComment;
      rule: CodeScanningAlertRule;
      tool: CodeScanningAnalysisTool;
      most_recent_instance: CodeScanningAlertInstance;
    };

    /**
     * Sets the state of the code scanning alert. You must provide \`dismissed_reason\` when you set the state to \`dismissed\`.
     */
    export type CodeScanningAlertSetState = \\"open\\" | \\"dismissed\\";

    /**
     * An identifier for the upload.
     */
    export type CodeScanningAnalysisSarifId = string;

    /**
     * The SHA of the commit to which the analysis you are uploading relates.
     */
    export type CodeScanningAnalysisCommitSha = string;

    /**
     * Identifies the variable values associated with the environment in which this analysis was performed.
     */
    export type CodeScanningAnalysisEnvironment = string;

    /**
     * The time that the analysis was created in ISO 8601 format: \`YYYY-MM-DDTHH:MM:SSZ\`.
     */
    export type CodeScanningAnalysisCreatedAt = string;

    /**
     * The REST API URL of the analysis resource.
     */
    export type CodeScanningAnalysisUrl = string;

    export type CodeScanningAnalysis = {
      ref: CodeScanningRef;
      commit_sha: CodeScanningAnalysisCommitSha;
      analysis_key: CodeScanningAnalysisAnalysisKey;
      environment: CodeScanningAnalysisEnvironment;
      category?: CodeScanningAnalysisCategory;
      error: string;
      created_at: CodeScanningAnalysisCreatedAt;

      /**
       * The total number of results in the analysis.
       */
      results_count: number;

      /**
       * The total number of rules used in the analysis.
       */
      rules_count: number;

      /**
       * Unique identifier for this analysis.
       */
      id: number;
      url: CodeScanningAnalysisUrl;
      sarif_id: CodeScanningAnalysisSarifId;
      tool: CodeScanningAnalysisTool;
      deletable: boolean;

      /**
       * Warning generated when processing the analysis
       */
      warning: string;
    };

    /**
     * Successful deletion of a code scanning analysis
     */
    export type CodeScanningAnalysisDeletion = {
      /**
       * Next deletable analysis in chain, without last analysis deletion confirmation
       */
      readonly next_analysis_url: string;

      /**
       * Next deletable analysis in chain, with last analysis deletion confirmation
       */
      readonly confirm_delete_url: string;
    };

    /**
     * A Base64 string representing the SARIF file to upload. You must first compress your SARIF file using [\`gzip\`](http://www.gnu.org/software/gzip/manual/gzip.html) and then translate the contents of the file into a Base64 encoding string. For more information, see \\"[SARIF support for code scanning](https://docs.github.com/code-security/secure-coding/sarif-support-for-code-scanning).\\"
     */
    export type CodeScanningAnalysisSarifFile = string;

    export type CodeScanningSarifsReceipt = {
      id?: CodeScanningAnalysisSarifId;

      /**
       * The REST API URL for checking the status of the upload.
       */
      readonly url?: string;
    };

    export type CodeScanningSarifsStatus = {
      /**
       * \`pending\` files have not yet been processed, while \`complete\` means results from the SARIF have been stored. \`failed\` files have either not been processed at all, or could only be partially processed.
       */
      processing_status?: \\"pending\\" | \\"complete\\" | \\"failed\\";

      /**
       * The REST API URL for getting the analyses associated with the upload.
       */
      readonly analyses_url?: string;

      /**
       * Any errors that ocurred during processing of the delivery.
       */
      readonly errors?: Array<string>;
    };

    /**
     * A list of errors found in a repo's CODEOWNERS file
     */
    export type CodeownersErrors = {
      errors: Array<{
        /**
         * The line number where this errors occurs.
         */
        line: number;

        /**
         * The column number where this errors occurs.
         */
        column: number;

        /**
         * The contents of the line where the error occurs.
         */
        source?: string;

        /**
         * The type of error.
         */
        kind: string;

        /**
         * Suggested action to fix the error. This will usually be \`null\`, but is provided for some common errors.
         */
        suggestion?: string;

        /**
         * A human-readable description of the error, combining information from multiple fields, laid out for display in a monospaced typeface (for example, a command-line setting).
         */
        message: string;

        /**
         * The path of the file where the error occured.
         */
        path: string;
      }>;
    };

    /**
     * A description of the machine powering a codespace.
     */
    export type CodespaceMachine = {
      /**
       * The name of the machine.
       */
      name: string;

      /**
       * The display name of the machine includes cores, memory, and storage.
       */
      display_name: string;

      /**
       * The operating system of the machine.
       */
      operating_system: string;

      /**
       * How much storage is available to the codespace.
       */
      storage_in_bytes: number;

      /**
       * How much memory is available to the codespace.
       */
      memory_in_bytes: number;

      /**
       * How many cores are available to the codespace.
       */
      cpus: number;

      /**
       * Whether a prebuild is currently available when creating a codespace for this machine and repository. If a branch was not specified as a ref, the default branch will be assumed. Value will be \\"null\\" if prebuilds are not supported or prebuild availability could not be determined. Value will be \\"none\\" if no prebuild is available. Latest values \\"ready\\" and \\"in_progress\\" indicate the prebuild availability status.
       */
      prebuild_availability: \\"none\\" | \\"ready\\" | \\"in_progress\\";
    };

    /**
     * Set repository secrets for GitHub Codespaces.
     */
    export type RepoCodespacesSecret = {
      /**
       * The name of the secret.
       */
      name: string;
      created_at: string;
      updated_at: string;
    };

    /**
     * The public key used for setting Codespaces secrets.
     */
    export type CodespacesPublicKey = {
      /**
       * The identifier for the key.
       */
      key_id: string;

      /**
       * The Base64 encoded public key.
       */
      key: string;
      id?: number;
      url?: string;
      title?: string;
      created_at?: string;
    };

    /**
     * Collaborator
     */
    export type Collaborator = {
      login: string;
      id: number;
      email?: string;
      name?: string;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
      permissions?: {
        pull: boolean;

        triage?: boolean;

        push: boolean;

        maintain?: boolean;

        admin: boolean;
      };
      role_name: string;
    };

    /**
     * Repository invitations let you manage who you collaborate with.
     */
    export type RepositoryInvitation = {
      /**
       * Unique identifier of the repository invitation.
       */
      id: number;
      repository: MinimalRepository;
      invitee: NullableSimpleUser;
      inviter: NullableSimpleUser;

      /**
       * The permission associated with the invitation.
       */
      permissions: \\"read\\" | \\"write\\" | \\"admin\\" | \\"triage\\" | \\"maintain\\";
      created_at: string;

      /**
       * Whether or not the invitation has expired
       */
      expired?: boolean;

      /**
       * URL for the repository invitation
       */
      url: string;
      html_url: string;
      node_id: string;
    };

    /**
     * Collaborator
     */
    export type NullableCollaborator = {
      login: string;
      id: number;
      email?: string;
      name?: string;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
      permissions?: {
        pull: boolean;

        triage?: boolean;

        push: boolean;

        maintain?: boolean;

        admin: boolean;
      };
      role_name: string;
    };

    /**
     * Repository Collaborator Permission
     */
    export type RepositoryCollaboratorPermission = {
      permission: string;
      role_name: string;
      user: NullableCollaborator;
    };

    /**
     * Commit Comment
     */
    export type CommitComment = {
      html_url: string;
      url: string;
      id: number;
      node_id: string;
      body: string;
      path: string;
      position: number;
      line: number;
      commit_id: string;
      user: NullableSimpleUser;
      created_at: string;
      updated_at: string;
      author_association: AuthorAssociation;
      reactions?: ReactionRollup;
    };

    /**
     * Branch Short
     */
    export type BranchShort = {
      name: string;
      commit: {
        sha: string;

        url: string;
      };
      protected: boolean;
    };

    /**
     * Hypermedia Link
     */
    export type Link = {
      href: string;
    };

    /**
     * The status of auto merging a pull request.
     */
    export type AutoMerge = {
      enabled_by: SimpleUser;

      /**
       * The merge method to use.
       */
      merge_method: \\"merge\\" | \\"squash\\" | \\"rebase\\";

      /**
       * Title for the merge commit message.
       */
      commit_title: string;

      /**
       * Commit message for the merge commit.
       */
      commit_message: string;
    };

    /**
     * Pull Request Simple
     */
    export type PullRequestSimple = {
      url: string;
      id: number;
      node_id: string;
      html_url: string;
      diff_url: string;
      patch_url: string;
      issue_url: string;
      commits_url: string;
      review_comments_url: string;
      review_comment_url: string;
      comments_url: string;
      statuses_url: string;
      number: number;
      state: string;
      locked: boolean;
      title: string;
      user: NullableSimpleUser;
      body: string;
      labels: Array<{
        id: number;

        node_id: string;

        url: string;

        name: string;

        description: string;

        color: string;

        default: boolean;
      }>;
      milestone: NullableMilestone;
      active_lock_reason?: string;
      created_at: string;
      updated_at: string;
      closed_at: string;
      merged_at: string;
      merge_commit_sha: string;
      assignee: NullableSimpleUser;
      assignees?: Array<SimpleUser>;
      requested_reviewers?: Array<SimpleUser>;
      requested_teams?: Array<Team>;
      head: {
        label: string;

        ref: string;

        repo: Repository;

        sha: string;

        user: NullableSimpleUser;
      };
      base: {
        label: string;

        ref: string;

        repo: Repository;

        sha: string;

        user: NullableSimpleUser;
      };
      _links: {
        comments: Link;

        commits: Link;

        statuses: Link;

        html: Link;

        issue: Link;

        review_comments: Link;

        review_comment: Link;

        self: Link;
      };
      author_association: AuthorAssociation;
      auto_merge: AutoMerge;

      /**
       * Indicates whether or not the pull request is a draft.
       */
      draft?: boolean;
    };

    export type SimpleCommitStatus = {
      description: string;
      id: number;
      node_id: string;
      state: string;
      context: string;
      target_url: string;
      required?: boolean;
      avatar_url: string;
      url: string;
      created_at: string;
      updated_at: string;
    };

    /**
     * Combined Commit Status
     */
    export type CombinedCommitStatus = {
      state: string;
      statuses: Array<SimpleCommitStatus>;
      sha: string;
      total_count: number;
      repository: MinimalRepository;
      commit_url: string;
      url: string;
    };

    /**
     * The status of a commit.
     */
    export type Status = {
      url: string;
      avatar_url: string;
      id: number;
      node_id: string;
      state: string;
      description: string;
      target_url: string;
      context: string;
      created_at: string;
      updated_at: string;
      creator: NullableSimpleUser;
    };

    /**
     * Code of Conduct Simple
     */
    export type NullableCodeOfConductSimple = {
      url: string;
      key: string;
      name: string;
      html_url: string;
    };

    export type NullableCommunityHealthFile = {
      url: string;
      html_url: string;
    };

    /**
     * Community Profile
     */
    export type CommunityProfile = {
      health_percentage: number;
      description: string;
      documentation: string;
      files: {
        code_of_conduct: NullableCodeOfConductSimple;

        code_of_conduct_file: NullableCommunityHealthFile;

        license: NullableLicenseSimple;

        contributing: NullableCommunityHealthFile;

        readme: NullableCommunityHealthFile;

        issue_template: NullableCommunityHealthFile;

        pull_request_template: NullableCommunityHealthFile;
      };
      updated_at: string;
      content_reports_enabled?: boolean;
    };

    /**
     * Commit Comparison
     */
    export type CommitComparison = {
      url: string;
      html_url: string;
      permalink_url: string;
      diff_url: string;
      patch_url: string;
      base_commit: Commit;
      merge_base_commit: Commit;
      status: \\"diverged\\" | \\"ahead\\" | \\"behind\\" | \\"identical\\";
      ahead_by: number;
      behind_by: number;
      total_commits: number;
      commits: Array<Commit>;
      files?: Array<DiffEntry>;
    };

    /**
     * Content Tree
     */
    export type ContentTree = {
      type: string;
      size: number;
      name: string;
      path: string;
      sha: string;
      url: string;
      git_url: string;
      html_url: string;
      download_url: string;
      entries?: Array<{
        type: string;

        size: number;

        name: string;

        path: string;

        content?: string;

        sha: string;

        url: string;

        git_url: string;

        html_url: string;

        download_url: string;

        _links: {
          git: string;

          html: string;

          self: string;
        };
      }>;
      _links: {
        git: string;

        html: string;

        self: string;
      };
    };

    /**
     * A list of directory items
     */
    export type ContentDirectory = Array<{
      type: string;

      size: number;

      name: string;

      path: string;

      content?: string;

      sha: string;

      url: string;

      git_url: string;

      html_url: string;

      download_url: string;

      _links: {
        git: string;

        html: string;

        self: string;
      };
    }>;

    /**
     * Content File
     */
    export type ContentFile = {
      type: string;
      encoding: string;
      size: number;
      name: string;
      path: string;
      content: string;
      sha: string;
      url: string;
      git_url: string;
      html_url: string;
      download_url: string;
      _links: {
        git: string;

        html: string;

        self: string;
      };
      target?: string;
      submodule_git_url?: string;
    };

    /**
     * An object describing a symlink
     */
    export type ContentSymlink = {
      type: string;
      target: string;
      size: number;
      name: string;
      path: string;
      sha: string;
      url: string;
      git_url: string;
      html_url: string;
      download_url: string;
      _links: {
        git: string;

        html: string;

        self: string;
      };
    };

    /**
     * An object describing a symlink
     */
    export type ContentSubmodule = {
      type: string;
      submodule_git_url: string;
      size: number;
      name: string;
      path: string;
      sha: string;
      url: string;
      git_url: string;
      html_url: string;
      download_url: string;
      _links: {
        git: string;

        html: string;

        self: string;
      };
    };

    /**
     * File Commit
     */
    export type FileCommit = {
      content: {
        name?: string;

        path?: string;

        sha?: string;

        size?: number;

        url?: string;

        html_url?: string;

        git_url?: string;

        download_url?: string;

        type?: string;

        _links?: {
          self?: string;

          git?: string;

          html?: string;
        };
      };
      commit: {
        sha?: string;

        node_id?: string;

        url?: string;

        html_url?: string;

        author?: {
          date?: string;

          name?: string;

          email?: string;
        };

        committer?: {
          date?: string;

          name?: string;

          email?: string;
        };

        message?: string;

        tree?: {
          url?: string;

          sha?: string;
        };

        parents?: Array<{
          url?: string;

          html_url?: string;

          sha?: string;
        }>;

        verification?: {
          verified?: boolean;

          reason?: string;

          signature?: string;

          payload?: string;
        };
      };
    };

    /**
     * Contributor
     */
    export type Contributor = {
      login?: string;
      id?: number;
      node_id?: string;
      avatar_url?: string;
      gravatar_id?: string;
      url?: string;
      html_url?: string;
      followers_url?: string;
      following_url?: string;
      gists_url?: string;
      starred_url?: string;
      subscriptions_url?: string;
      organizations_url?: string;
      repos_url?: string;
      events_url?: string;
      received_events_url?: string;
      type: string;
      site_admin?: boolean;
      contributions: number;
      email?: string;
      name?: string;
    };

    /**
     * Set secrets for Dependabot.
     */
    export type DependabotSecret = {
      /**
       * The name of the secret.
       */
      name: string;
      created_at: string;
      updated_at: string;
    };

    /**
     * A diff of the dependencies between two commits.
     */
    export type DependencyGraphDiff = Array<{
      change_type: \\"added\\" | \\"removed\\";

      manifest: string;

      ecosystem: string;

      name: string;

      version: string;

      package_url: string;

      license: string;

      source_repository_url: string;

      vulnerabilities: Array<{
        severity: string;

        advisory_ghsa_id: string;

        advisory_summary: string;

        advisory_url: string;
      }>;
    }>;

    /**
     * User-defined metadata to store domain-specific information limited to 8 keys with scalar values.
     */
    export type Metadata = Record<string, string | number | boolean>;

    /**
     * A single package dependency.
     */
    export type Dependency = {
      /**
       * Package-url (PURL) of dependency. See https://github.com/package-url/purl-spec for more details.
       */
      package_url?: string;
      metadata?: Metadata;

      /**
       * A notation of whether a dependency is requested directly by this manifest or is a dependency of another dependency.
       */
      relationship?: \\"direct\\" | \\"indirect\\";

      /**
       * A notation of whether the dependency is required for the primary build artifact (runtime) or is only used for development. Future versions of this specification may allow for more granular scopes.
       */
      scope?: \\"runtime\\" | \\"development\\";

      /**
       * Array of package-url (PURLs) of direct child dependencies.
       */
      dependencies?: Array<string>;
    };

    /**
     * A collection of related dependencies declared in a file or representing a logical group of dependencies.
     */
    export type Manifest = {
      /**
       * The name of the manifest.
       */
      name: string;
      file?: {
        /**
         * The path of the manifest file relative to the root of the Git repository.
         */
        source_location?: string;
      };
      metadata?: Metadata;
      resolved?: {};
    };

    /**
     * Create a new snapshot of a repository's dependencies.
     */
    export type Snapshot = {
      /**
       * The version of the repository snapshot submission.
       */
      version: number;
      job: {
        /**
         * The external ID of the job.
         */
        id: string;

        /**
         * Correlator provides a key that is used to group snapshots submitted over time. Only the \\"latest\\" submitted snapshot for a given combination of \`job.correlator\` and \`detector.name\` will be considered when calculating a repository's current dependencies. Correlator should be as unique as it takes to distinguish all detection runs for a given \\"wave\\" of CI workflow you run. If you're using GitHub Actions, a good default value for this could be the environment variables GITHUB_WORKFLOW and GITHUB_JOB concatenated together. If you're using a build matrix, then you'll also need to add additional key(s) to distinguish between each submission inside a matrix variation.
         */
        correlator: string;

        /**
         * The url for the job.
         */
        html_url?: string;
      };

      /**
       * The commit SHA associated with this dependency snapshot.
       */
      sha: string;

      /**
       * The repository branch that triggered this snapshot.
       */
      ref: string;

      /**
       * A description of the detector used.
       */
      detector: {
        /**
         * The name of the detector used.
         */
        name: string;

        /**
         * The version of the detector used.
         */
        version: string;

        /**
         * The url of the detector used.
         */
        url: string;
      };
      metadata?: Metadata;

      /**
       * A collection of package manifests
       */
      manifests?: Record<string, Manifest>;

      /**
       * The time at which the snapshot was scanned.
       */
      scanned: string;
    };

    /**
     * The status of a deployment.
     */
    export type DeploymentStatus = {
      url: string;
      id: number;
      node_id: string;

      /**
       * The state of the status.
       */
      state: \\"error\\" | \\"failure\\" | \\"inactive\\" | \\"pending\\" | \\"success\\" | \\"queued\\" | \\"in_progress\\";
      creator: NullableSimpleUser;

      /**
       * A short description of the status.
       */
      description: string;

      /**
       * The environment of the deployment that the status is for.
       */
      environment?: string;

      /**
       * Deprecated: the URL to associate with this status.
       */
      target_url: string;
      created_at: string;
      updated_at: string;
      deployment_url: string;
      repository_url: string;

      /**
       * The URL for accessing your environment.
       */
      environment_url?: string;

      /**
       * The URL to associate with this status.
       */
      log_url?: string;
      performed_via_github_app?: NullableIntegration;
    };

    /**
     * The amount of time to delay a job after the job is initially triggered. The time (in minutes) must be an integer between 0 and 43,200 (30 days).
     */
    export type WaitTimer = number;

    /**
     * The type of deployment branch policy for this environment. To allow all branches to deploy, set to \`null\`.
     */
    export type DeploymentBranchPolicy = {
      /**
       * Whether only branches with branch protection rules can deploy to this environment. If \`protected_branches\` is \`true\`, \`custom_branch_policies\` must be \`false\`; if \`protected_branches\` is \`false\`, \`custom_branch_policies\` must be \`true\`.
       */
      protected_branches: boolean;

      /**
       * Whether only branches that match the specified name patterns can deploy to this environment.  If \`custom_branch_policies\` is \`true\`, \`protected_branches\` must be \`false\`; if \`custom_branch_policies\` is \`false\`, \`protected_branches\` must be \`true\`.
       */
      custom_branch_policies: boolean;
    };

    /**
     * Details of a deployment environment
     */
    export type Environment = {
      /**
       * The id of the environment.
       */
      id: number;
      node_id: string;

      /**
       * The name of the environment.
       */
      name: string;
      url: string;
      html_url: string;

      /**
       * The time that the environment was created, in ISO 8601 format.
       */
      created_at: string;

      /**
       * The time that the environment was last updated, in ISO 8601 format.
       */
      updated_at: string;
      protection_rules?: Array<
        | {
            id: number;

            node_id: string;

            type: string;

            wait_timer?: WaitTimer;
          }
        | {
            id: number;

            node_id: string;

            type: string;

            /**
             * The people or teams that may approve jobs that reference the environment. You can list up to six users or teams as reviewers. The reviewers must have at least read access to the repository. Only one of the required reviewers needs to approve the job for it to proceed.
             */
            reviewers?: Array<{
              type?: DeploymentReviewerType;

              reviewer?: SimpleUser | Team;
            }>;
          }
        | {
            id: number;

            node_id: string;

            type: string;
          }
      >;
      deployment_branch_policy?: DeploymentBranchPolicy;
    };

    /**
     * Short Blob
     */
    export type ShortBlob = {
      url: string;
      sha: string;
    };

    /**
     * Blob
     */
    export type Blob = {
      content: string;
      encoding: string;
      url: string;
      sha: string;
      size: number;
      node_id: string;
      highlighted_content?: string;
    };

    /**
     * Low-level Git commit operations within a repository
     */
    export type GitCommit = {
      /**
       * SHA for the commit
       */
      sha: string;
      node_id: string;
      url: string;

      /**
       * Identifying information for the git-user
       */
      author: {
        /**
         * Timestamp of the commit
         */
        date: string;

        /**
         * Git email address of the user
         */
        email: string;

        /**
         * Name of the git user
         */
        name: string;
      };

      /**
       * Identifying information for the git-user
       */
      committer: {
        /**
         * Timestamp of the commit
         */
        date: string;

        /**
         * Git email address of the user
         */
        email: string;

        /**
         * Name of the git user
         */
        name: string;
      };

      /**
       * Message describing the purpose of the commit
       */
      message: string;
      tree: {
        /**
         * SHA for the commit
         */
        sha: string;

        url: string;
      };
      parents: Array<{
        /**
         * SHA for the commit
         */
        sha: string;

        url: string;

        html_url: string;
      }>;
      verification: {
        verified: boolean;

        reason: string;

        signature: string;

        payload: string;
      };
      html_url: string;
    };

    /**
     * Git references within a repository
     */
    export type GitRef = {
      ref: string;
      node_id: string;
      url: string;
      object: {
        type: string;

        /**
         * SHA for the reference
         */
        sha: string;

        url: string;
      };
    };

    /**
     * Metadata for a Git tag
     */
    export type GitTag = {
      node_id: string;

      /**
       * Name of the tag
       */
      tag: string;
      sha: string;

      /**
       * URL for the tag
       */
      url: string;

      /**
       * Message describing the purpose of the tag
       */
      message: string;
      tagger: {
        date: string;

        email: string;

        name: string;
      };
      object: {
        sha: string;

        type: string;

        url: string;
      };
      verification?: Verification;
    };

    /**
     * The hierarchy between files in a Git repository.
     */
    export type GitTree = {
      sha: string;
      url: string;
      truncated: boolean;

      /**
       * Objects specifying a tree structure
       */
      tree: Array<{
        path?: string;

        mode?: string;

        type?: string;

        sha?: string;

        size?: number;

        url?: string;
      }>;
    };

    export type HookResponse = {
      code: number;
      status: string;
      message: string;
    };

    /**
     * Webhooks for repositories.
     */
    export type Hook = {
      type: string;

      /**
       * Unique identifier of the webhook.
       */
      id: number;

      /**
       * The name of a valid service, use 'web' for a webhook.
       */
      name: string;

      /**
       * Determines whether the hook is actually triggered on pushes.
       */
      active: boolean;

      /**
       * Determines what events the hook is triggered for. Default: ['push'].
       */
      events: Array<string>;
      config: {
        email?: string;

        password?: string;

        room?: string;

        subdomain?: string;

        url?: WebhookConfigUrl;

        insecure_ssl?: WebhookConfigInsecureSsl;

        content_type?: WebhookConfigContentType;

        digest?: string;

        secret?: WebhookConfigSecret;

        token?: string;
      };
      updated_at: string;
      created_at: string;
      url: string;
      test_url: string;
      ping_url: string;
      deliveries_url?: string;
      last_response: HookResponse;
    };

    /**
     * A repository import from an external source.
     */
    export type Import = {
      vcs: string;
      use_lfs?: boolean;

      /**
       * The URL of the originating repository.
       */
      vcs_url: string;
      svc_root?: string;
      tfvc_project?: string;
      status:
        | \\"auth\\"
        | \\"error\\"
        | \\"none\\"
        | \\"detecting\\"
        | \\"choose\\"
        | \\"auth_failed\\"
        | \\"importing\\"
        | \\"mapping\\"
        | \\"waiting_to_push\\"
        | \\"pushing\\"
        | \\"complete\\"
        | \\"setup\\"
        | \\"unknown\\"
        | \\"detection_found_multiple\\"
        | \\"detection_found_nothing\\"
        | \\"detection_needs_auth\\";
      status_text?: string;
      failed_step?: string;
      error_message?: string;
      import_percent?: number;
      commit_count?: number;
      push_percent?: number;
      has_large_files?: boolean;
      large_files_size?: number;
      large_files_count?: number;
      project_choices?: Array<{
        vcs?: string;

        tfvc_project?: string;

        human_name?: string;
      }>;
      message?: string;
      authors_count?: number;
      url: string;
      html_url: string;
      authors_url: string;
      repository_url: string;
      svn_root?: string;
    };

    /**
     * Porter Author
     */
    export type PorterAuthor = {
      id: number;
      remote_id: string;
      remote_name: string;
      email: string;
      name: string;
      url: string;
      import_url: string;
    };

    /**
     * Porter Large File
     */
    export type PorterLargeFile = {
      ref_name: string;
      path: string;
      oid: string;
      size: number;
    };

    /**
     * Issues are a great way to keep track of tasks, enhancements, and bugs for your projects.
     */
    export type NullableIssue = {
      id: number;
      node_id: string;

      /**
       * URL for the issue
       */
      url: string;
      repository_url: string;
      labels_url: string;
      comments_url: string;
      events_url: string;
      html_url: string;

      /**
       * Number uniquely identifying the issue within its repository
       */
      number: number;

      /**
       * State of the issue; either 'open' or 'closed'
       */
      state: string;

      /**
       * The reason for the current state
       */
      state_reason?: string;

      /**
       * Title of the issue
       */
      title: string;

      /**
       * Contents of the issue
       */
      body?: string;
      user: NullableSimpleUser;

      /**
       * Labels to associate with this issue; pass one or more label names to replace the set of labels on this issue; send an empty array to clear all labels from the issue; note that the labels are silently dropped for users without push access to the repository
       */
      labels: Array<
        | string
        | {
            id?: number;

            node_id?: string;

            url?: string;

            name?: string;

            description?: string;

            color?: string;

            default?: boolean;
          }
      >;
      assignee: NullableSimpleUser;
      assignees?: Array<SimpleUser>;
      milestone: NullableMilestone;
      locked: boolean;
      active_lock_reason?: string;
      comments: number;
      pull_request?: {
        merged_at?: string;

        diff_url: string;

        html_url: string;

        patch_url: string;

        url: string;
      };
      closed_at: string;
      created_at: string;
      updated_at: string;
      draft?: boolean;
      closed_by?: NullableSimpleUser;
      body_html?: string;
      body_text?: string;
      timeline_url?: string;
      repository?: Repository;
      performed_via_github_app?: NullableIntegration;
      author_association: AuthorAssociation;
      reactions?: ReactionRollup;
    };

    /**
     * Issue Event Label
     */
    export type IssueEventLabel = {
      name: string;
      color: string;
    };

    export type IssueEventDismissedReview = {
      state: string;
      review_id: number;
      dismissal_message: string;
      dismissal_commit_id?: string;
    };

    /**
     * Issue Event Milestone
     */
    export type IssueEventMilestone = {
      title: string;
    };

    /**
     * Issue Event Project Card
     */
    export type IssueEventProjectCard = {
      url: string;
      id: number;
      project_url: string;
      project_id: number;
      column_name: string;
      previous_column_name?: string;
    };

    /**
     * Issue Event Rename
     */
    export type IssueEventRename = {
      from: string;
      to: string;
    };

    /**
     * Issue Event
     */
    export type IssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: NullableSimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      issue?: NullableIssue;
      label?: IssueEventLabel;
      assignee?: NullableSimpleUser;
      assigner?: NullableSimpleUser;
      review_requester?: NullableSimpleUser;
      requested_reviewer?: NullableSimpleUser;
      requested_team?: Team;
      dismissed_review?: IssueEventDismissedReview;
      milestone?: IssueEventMilestone;
      project_card?: IssueEventProjectCard;
      rename?: IssueEventRename;
      author_association?: AuthorAssociation;
      lock_reason?: string;
      performed_via_github_app?: NullableIntegration;
    };

    /**
     * Labeled Issue Event
     */
    export type LabeledIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      label: {
        name: string;

        color: string;
      };
    };

    /**
     * Unlabeled Issue Event
     */
    export type UnlabeledIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      label: {
        name: string;

        color: string;
      };
    };

    /**
     * Assigned Issue Event
     */
    export type AssignedIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: Integration;
      assignee: SimpleUser;
      assigner: SimpleUser;
    };

    /**
     * Unassigned Issue Event
     */
    export type UnassignedIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      assignee: SimpleUser;
      assigner: SimpleUser;
    };

    /**
     * Milestoned Issue Event
     */
    export type MilestonedIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      milestone: {
        title: string;
      };
    };

    /**
     * Demilestoned Issue Event
     */
    export type DemilestonedIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      milestone: {
        title: string;
      };
    };

    /**
     * Renamed Issue Event
     */
    export type RenamedIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      rename: {
        from: string;

        to: string;
      };
    };

    /**
     * Review Requested Issue Event
     */
    export type ReviewRequestedIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      review_requester: SimpleUser;
      requested_team?: Team;
      requested_reviewer?: SimpleUser;
    };

    /**
     * Review Request Removed Issue Event
     */
    export type ReviewRequestRemovedIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      review_requester: SimpleUser;
      requested_team?: Team;
      requested_reviewer?: SimpleUser;
    };

    /**
     * Review Dismissed Issue Event
     */
    export type ReviewDismissedIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      dismissed_review: {
        state: string;

        review_id: number;

        dismissal_message: string;

        dismissal_commit_id?: string;
      };
    };

    /**
     * Locked Issue Event
     */
    export type LockedIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      lock_reason: string;
    };

    /**
     * Added to Project Issue Event
     */
    export type AddedToProjectIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      project_card?: {
        id: number;

        url: string;

        project_id: number;

        project_url: string;

        column_name: string;

        previous_column_name?: string;
      };
    };

    /**
     * Moved Column in Project Issue Event
     */
    export type MovedColumnInProjectIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      project_card?: {
        id: number;

        url: string;

        project_id: number;

        project_url: string;

        column_name: string;

        previous_column_name?: string;
      };
    };

    /**
     * Removed from Project Issue Event
     */
    export type RemovedFromProjectIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      project_card?: {
        id: number;

        url: string;

        project_id: number;

        project_url: string;

        column_name: string;

        previous_column_name?: string;
      };
    };

    /**
     * Converted Note to Issue Issue Event
     */
    export type ConvertedNoteToIssueIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: Integration;
      project_card?: {
        id: number;

        url: string;

        project_id: number;

        project_url: string;

        column_name: string;

        previous_column_name?: string;
      };
    };

    /**
     * Issue Event for Issue
     */
    export type IssueEventForIssue =
      | LabeledIssueEvent
      | UnlabeledIssueEvent
      | AssignedIssueEvent
      | UnassignedIssueEvent
      | MilestonedIssueEvent
      | DemilestonedIssueEvent
      | RenamedIssueEvent
      | ReviewRequestedIssueEvent
      | ReviewRequestRemovedIssueEvent
      | ReviewDismissedIssueEvent
      | LockedIssueEvent
      | AddedToProjectIssueEvent
      | MovedColumnInProjectIssueEvent
      | RemovedFromProjectIssueEvent
      | ConvertedNoteToIssueIssueEvent;

    /**
     * Color-coded labels help you categorize and filter your issues (just like labels in Gmail).
     */
    export type Label = {
      id: number;
      node_id: string;

      /**
       * URL for the label
       */
      url: string;

      /**
       * The name of the label.
       */
      name: string;
      description: string;

      /**
       * 6-character hex code, without the leading #, identifying the color
       */
      color: string;
      default: boolean;
    };

    /**
     * Timeline Comment Event
     */
    export type TimelineCommentEvent = {
      event: string;
      actor: SimpleUser;

      /**
       * Unique identifier of the issue comment
       */
      id: number;
      node_id: string;

      /**
       * URL for the issue comment
       */
      url: string;

      /**
       * Contents of the issue comment
       */
      body?: string;
      body_text?: string;
      body_html?: string;
      html_url: string;
      user: SimpleUser;
      created_at: string;
      updated_at: string;
      issue_url: string;
      author_association: AuthorAssociation;
      performed_via_github_app?: NullableIntegration;
      reactions?: ReactionRollup;
    };

    /**
     * Timeline Cross Referenced Event
     */
    export type TimelineCrossReferencedEvent = {
      event: string;
      actor?: SimpleUser;
      created_at: string;
      updated_at: string;
      source: {
        type?: string;

        issue?: Issue;
      };
    };

    /**
     * Timeline Committed Event
     */
    export type TimelineCommittedEvent = {
      event?: string;

      /**
       * SHA for the commit
       */
      sha: string;
      node_id: string;
      url: string;

      /**
       * Identifying information for the git-user
       */
      author: {
        /**
         * Timestamp of the commit
         */
        date: string;

        /**
         * Git email address of the user
         */
        email: string;

        /**
         * Name of the git user
         */
        name: string;
      };

      /**
       * Identifying information for the git-user
       */
      committer: {
        /**
         * Timestamp of the commit
         */
        date: string;

        /**
         * Git email address of the user
         */
        email: string;

        /**
         * Name of the git user
         */
        name: string;
      };

      /**
       * Message describing the purpose of the commit
       */
      message: string;
      tree: {
        /**
         * SHA for the commit
         */
        sha: string;

        url: string;
      };
      parents: Array<{
        /**
         * SHA for the commit
         */
        sha: string;

        url: string;

        html_url: string;
      }>;
      verification: {
        verified: boolean;

        reason: string;

        signature: string;

        payload: string;
      };
      html_url: string;
    };

    /**
     * Timeline Reviewed Event
     */
    export type TimelineReviewedEvent = {
      event: string;

      /**
       * Unique identifier of the review
       */
      id: number;
      node_id: string;
      user: SimpleUser;

      /**
       * The text of the review.
       */
      body: string;
      state: string;
      html_url: string;
      pull_request_url: string;
      _links: {
        html: {
          href: string;
        };

        pull_request: {
          href: string;
        };
      };
      submitted_at?: string;

      /**
       * A commit SHA for the review.
       */
      commit_id: string;
      body_html?: string;
      body_text?: string;
      author_association: AuthorAssociation;
    };

    /**
     * Pull Request Review Comments are comments on a portion of the Pull Request's diff.
     */
    export type PullRequestReviewComment = {
      /**
       * URL for the pull request review comment
       */
      url: string;

      /**
       * The ID of the pull request review to which the comment belongs.
       */
      pull_request_review_id: number;

      /**
       * The ID of the pull request review comment.
       */
      id: number;

      /**
       * The node ID of the pull request review comment.
       */
      node_id: string;

      /**
       * The diff of the line that the comment refers to.
       */
      diff_hunk: string;

      /**
       * The relative path of the file to which the comment applies.
       */
      path: string;

      /**
       * The line index in the diff to which the comment applies. This field is deprecated; use \`line\` instead.
       */
      position: number;

      /**
       * The index of the original line in the diff to which the comment applies. This field is deprecated; use \`original_line\` instead.
       */
      original_position: number;

      /**
       * The SHA of the commit to which the comment applies.
       */
      commit_id: string;

      /**
       * The SHA of the original commit to which the comment applies.
       */
      original_commit_id: string;

      /**
       * The comment ID to reply to.
       */
      in_reply_to_id?: number;
      user: SimpleUser;

      /**
       * The text of the comment.
       */
      body: string;
      created_at: string;
      updated_at: string;

      /**
       * HTML URL for the pull request review comment.
       */
      html_url: string;

      /**
       * URL for the pull request that the review comment belongs to.
       */
      pull_request_url: string;
      author_association: AuthorAssociation;
      _links: {
        self: {
          href: string;
        };

        html: {
          href: string;
        };

        pull_request: {
          href: string;
        };
      };

      /**
       * The first line of the range for a multi-line comment.
       */
      start_line?: number;

      /**
       * The first line of the range for a multi-line comment.
       */
      original_start_line?: number;

      /**
       * The side of the first line of the range for a multi-line comment.
       */
      start_side?: \\"LEFT\\" | \\"RIGHT\\";

      /**
       * The line of the blob to which the comment applies. The last line of the range for a multi-line comment
       */
      line?: number;

      /**
       * The line of the blob to which the comment applies. The last line of the range for a multi-line comment
       */
      original_line?: number;

      /**
       * The side of the diff to which the comment applies. The side of the last line of the range for a multi-line comment
       */
      side?: \\"LEFT\\" | \\"RIGHT\\";
      reactions?: ReactionRollup;
      body_html?: string;
      body_text?: string;
    };

    /**
     * Timeline Line Commented Event
     */
    export type TimelineLineCommentedEvent = {
      event?: string;
      node_id?: string;
      comments?: Array<PullRequestReviewComment>;
    };

    /**
     * Timeline Commit Commented Event
     */
    export type TimelineCommitCommentedEvent = {
      event?: string;
      node_id?: string;
      commit_id?: string;
      comments?: Array<CommitComment>;
    };

    /**
     * Timeline Assigned Issue Event
     */
    export type TimelineAssignedIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      assignee: SimpleUser;
    };

    /**
     * Timeline Unassigned Issue Event
     */
    export type TimelineUnassignedIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      assignee: SimpleUser;
    };

    /**
     * State Change Issue Event
     */
    export type StateChangeIssueEvent = {
      id: number;
      node_id: string;
      url: string;
      actor: SimpleUser;
      event: string;
      commit_id: string;
      commit_url: string;
      created_at: string;
      performed_via_github_app: NullableIntegration;
      state_reason?: string;
    };

    /**
     * Timeline Event
     */
    export type TimelineIssueEvents =
      | LabeledIssueEvent
      | UnlabeledIssueEvent
      | MilestonedIssueEvent
      | DemilestonedIssueEvent
      | RenamedIssueEvent
      | ReviewRequestedIssueEvent
      | ReviewRequestRemovedIssueEvent
      | ReviewDismissedIssueEvent
      | LockedIssueEvent
      | AddedToProjectIssueEvent
      | MovedColumnInProjectIssueEvent
      | RemovedFromProjectIssueEvent
      | ConvertedNoteToIssueIssueEvent
      | TimelineCommentEvent
      | TimelineCrossReferencedEvent
      | TimelineCommittedEvent
      | TimelineReviewedEvent
      | TimelineLineCommentedEvent
      | TimelineCommitCommentedEvent
      | TimelineAssignedIssueEvent
      | TimelineUnassignedIssueEvent
      | StateChangeIssueEvent;

    /**
     * An SSH key granting access to a single repository.
     */
    export type DeployKey = {
      id: number;
      key: string;
      url: string;
      title: string;
      verified: boolean;
      created_at: string;
      read_only: boolean;
    };

    /**
     * Language
     */
    export type Language = Record<string, number>;

    /**
     * License Content
     */
    export type LicenseContent = {
      name: string;
      path: string;
      sha: string;
      size: number;
      url: string;
      html_url: string;
      git_url: string;
      download_url: string;
      type: string;
      content: string;
      encoding: string;
      _links: {
        git: string;

        html: string;

        self: string;
      };
      license: NullableLicenseSimple;
    };

    /**
     * Results of a successful merge upstream request
     */
    export type MergedUpstream = {
      message?: string;
      merge_type?: \\"merge\\" | \\"fast-forward\\" | \\"none\\";
      base_branch?: string;
    };

    /**
     * A collection of related issues and pull requests.
     */
    export type Milestone = {
      url: string;
      html_url: string;
      labels_url: string;
      id: number;
      node_id: string;

      /**
       * The number of the milestone.
       */
      number: number;

      /**
       * The state of the milestone.
       */
      state: \\"open\\" | \\"closed\\";

      /**
       * The title of the milestone.
       */
      title: string;
      description: string;
      creator: NullableSimpleUser;
      open_issues: number;
      closed_issues: number;
      created_at: string;
      updated_at: string;
      closed_at: string;
      due_on: string;
    };

    export type PagesSourceHash = {
      branch: string;
      path: string;
    };

    export type PagesHttpsCertificate = {
      state:
        | \\"new\\"
        | \\"authorization_created\\"
        | \\"authorization_pending\\"
        | \\"authorized\\"
        | \\"authorization_revoked\\"
        | \\"issued\\"
        | \\"uploaded\\"
        | \\"approved\\"
        | \\"errored\\"
        | \\"bad_authz\\"
        | \\"destroy_pending\\"
        | \\"dns_changed\\";
      description: string;

      /**
       * Array of the domain set and its alternate name (if it is configured)
       */
      domains: Array<string>;
      expires_at?: string;
    };

    /**
     * The configuration for GitHub Pages for a repository.
     */
    export type Page = {
      /**
       * The API address for accessing this Page resource.
       */
      url: string;

      /**
       * The status of the most recent build of the Page.
       */
      status: \\"built\\" | \\"building\\" | \\"errored\\";

      /**
       * The Pages site's custom domain
       */
      cname: string;

      /**
       * The state if the domain is verified
       */
      protected_domain_state?: \\"pending\\" | \\"verified\\" | \\"unverified\\";

      /**
       * The timestamp when a pending domain becomes unverified.
       */
      pending_domain_unverified_at?: string;

      /**
       * Whether the Page has a custom 404 page.
       */
      custom_404: boolean;

      /**
       * The web address the Page can be accessed from.
       */
      html_url?: string;

      /**
       * The process in which the Page will be built.
       */
      build_type?: \\"legacy\\" | \\"workflow\\";
      source?: PagesSourceHash;

      /**
       * Whether the GitHub Pages site is publicly visible. If set to \`true\`, the site is accessible to anyone on the internet. If set to \`false\`, the site will only be accessible to users who have at least \`read\` access to the repository that published the site.
       */
      public: boolean;
      https_certificate?: PagesHttpsCertificate;

      /**
       * Whether https is enabled on the domain
       */
      https_enforced?: boolean;
    };

    /**
     * Page Build
     */
    export type PageBuild = {
      url: string;
      status: string;
      error: {
        message: string;
      };
      pusher: NullableSimpleUser;
      commit: string;
      duration: number;
      created_at: string;
      updated_at: string;
    };

    /**
     * Page Build Status
     */
    export type PageBuildStatus = {
      url: string;
      status: string;
    };

    /**
     * Pages Health Check Status
     */
    export type PagesHealthCheck = {
      domain?: {
        host?: string;

        uri?: string;

        nameservers?: string;

        dns_resolves?: boolean;

        is_proxied?: boolean;

        is_cloudflare_ip?: boolean;

        is_fastly_ip?: boolean;

        is_old_ip_address?: boolean;

        is_a_record?: boolean;

        has_cname_record?: boolean;

        has_mx_records_present?: boolean;

        is_valid_domain?: boolean;

        is_apex_domain?: boolean;

        should_be_a_record?: boolean;

        is_cname_to_github_user_domain?: boolean;

        is_cname_to_pages_dot_github_dot_com?: boolean;

        is_cname_to_fastly?: boolean;

        is_pointed_to_github_pages_ip?: boolean;

        is_non_github_pages_ip_present?: boolean;

        is_pages_domain?: boolean;

        is_served_by_pages?: boolean;

        is_valid?: boolean;

        reason?: string;

        responds_to_https?: boolean;

        enforces_https?: boolean;

        https_error?: string;

        is_https_eligible?: boolean;

        caa_error?: string;
      };
      alt_domain?: {
        host?: string;

        uri?: string;

        nameservers?: string;

        dns_resolves?: boolean;

        is_proxied?: boolean;

        is_cloudflare_ip?: boolean;

        is_fastly_ip?: boolean;

        is_old_ip_address?: boolean;

        is_a_record?: boolean;

        has_cname_record?: boolean;

        has_mx_records_present?: boolean;

        is_valid_domain?: boolean;

        is_apex_domain?: boolean;

        should_be_a_record?: boolean;

        is_cname_to_github_user_domain?: boolean;

        is_cname_to_pages_dot_github_dot_com?: boolean;

        is_cname_to_fastly?: boolean;

        is_pointed_to_github_pages_ip?: boolean;

        is_non_github_pages_ip_present?: boolean;

        is_pages_domain?: boolean;

        is_served_by_pages?: boolean;

        is_valid?: boolean;

        reason?: string;

        responds_to_https?: boolean;

        enforces_https?: boolean;

        https_error?: string;

        is_https_eligible?: boolean;

        caa_error?: string;
      };
    };

    /**
     * Groups of organization members that gives permissions on specified repositories.
     */
    export type TeamSimple = {
      /**
       * Unique identifier of the team
       */
      id: number;
      node_id: string;

      /**
       * URL for the team
       */
      url: string;
      members_url: string;

      /**
       * Name of the team
       */
      name: string;

      /**
       * Description of the team
       */
      description: string;

      /**
       * Permission that the team will have for its repositories
       */
      permission: string;

      /**
       * The level of privacy this team should have
       */
      privacy?: string;
      html_url: string;
      repositories_url: string;
      slug: string;

      /**
       * Distinguished Name (DN) that team maps to within LDAP environment
       */
      ldap_dn?: string;
    };

    /**
     * Pull requests let you tell others about changes you've pushed to a repository on GitHub. Once a pull request is sent, interested parties can review the set of changes, discuss potential modifications, and even push follow-up commits if necessary.
     */
    export type PullRequest = {
      url: string;
      id: number;
      node_id: string;
      html_url: string;
      diff_url: string;
      patch_url: string;
      issue_url: string;
      commits_url: string;
      review_comments_url: string;
      review_comment_url: string;
      comments_url: string;
      statuses_url: string;

      /**
       * Number uniquely identifying the pull request within its repository.
       */
      number: number;

      /**
       * State of this Pull Request. Either \`open\` or \`closed\`.
       */
      state: \\"open\\" | \\"closed\\";
      locked: boolean;

      /**
       * The title of the pull request.
       */
      title: string;
      user: NullableSimpleUser;
      body: string;
      labels: Array<{
        id: number;

        node_id: string;

        url: string;

        name: string;

        description: string;

        color: string;

        default: boolean;
      }>;
      milestone: NullableMilestone;
      active_lock_reason?: string;
      created_at: string;
      updated_at: string;
      closed_at: string;
      merged_at: string;
      merge_commit_sha: string;
      assignee: NullableSimpleUser;
      assignees?: Array<SimpleUser>;
      requested_reviewers?: Array<SimpleUser>;
      requested_teams?: Array<TeamSimple>;
      head: {
        label: string;

        ref: string;

        repo: {
          archive_url: string;

          assignees_url: string;

          blobs_url: string;

          branches_url: string;

          collaborators_url: string;

          comments_url: string;

          commits_url: string;

          compare_url: string;

          contents_url: string;

          contributors_url: string;

          deployments_url: string;

          description: string;

          downloads_url: string;

          events_url: string;

          fork: boolean;

          forks_url: string;

          full_name: string;

          git_commits_url: string;

          git_refs_url: string;

          git_tags_url: string;

          hooks_url: string;

          html_url: string;

          id: number;

          node_id: string;

          issue_comment_url: string;

          issue_events_url: string;

          issues_url: string;

          keys_url: string;

          labels_url: string;

          languages_url: string;

          merges_url: string;

          milestones_url: string;

          name: string;

          notifications_url: string;

          owner: {
            avatar_url: string;

            events_url: string;

            followers_url: string;

            following_url: string;

            gists_url: string;

            gravatar_id: string;

            html_url: string;

            id: number;

            node_id: string;

            login: string;

            organizations_url: string;

            received_events_url: string;

            repos_url: string;

            site_admin: boolean;

            starred_url: string;

            subscriptions_url: string;

            type: string;

            url: string;
          };

          private: boolean;

          pulls_url: string;

          releases_url: string;

          stargazers_url: string;

          statuses_url: string;

          subscribers_url: string;

          subscription_url: string;

          tags_url: string;

          teams_url: string;

          trees_url: string;

          url: string;

          clone_url: string;

          default_branch: string;

          forks: number;

          forks_count: number;

          git_url: string;

          has_downloads: boolean;

          has_issues: boolean;

          has_projects: boolean;

          has_wiki: boolean;

          has_pages: boolean;

          homepage: string;

          language: string;

          master_branch?: string;

          archived: boolean;

          disabled: boolean;

          /**
           * The repository visibility: public, private, or internal.
           */
          visibility?: string;

          mirror_url: string;

          open_issues: number;

          open_issues_count: number;

          permissions?: {
            admin: boolean;

            maintain?: boolean;

            push: boolean;

            triage?: boolean;

            pull: boolean;
          };

          temp_clone_token?: string;

          allow_merge_commit?: boolean;

          allow_squash_merge?: boolean;

          allow_rebase_merge?: boolean;

          license: {
            key: string;

            name: string;

            url: string;

            spdx_id: string;

            node_id: string;
          };

          pushed_at: string;

          size: number;

          ssh_url: string;

          stargazers_count: number;

          svn_url: string;

          topics?: Array<string>;

          watchers: number;

          watchers_count: number;

          created_at: string;

          updated_at: string;

          allow_forking?: boolean;

          is_template?: boolean;
        };

        sha: string;

        user: {
          avatar_url: string;

          events_url: string;

          followers_url: string;

          following_url: string;

          gists_url: string;

          gravatar_id: string;

          html_url: string;

          id: number;

          node_id: string;

          login: string;

          organizations_url: string;

          received_events_url: string;

          repos_url: string;

          site_admin: boolean;

          starred_url: string;

          subscriptions_url: string;

          type: string;

          url: string;
        };
      };
      base: {
        label: string;

        ref: string;

        repo: {
          archive_url: string;

          assignees_url: string;

          blobs_url: string;

          branches_url: string;

          collaborators_url: string;

          comments_url: string;

          commits_url: string;

          compare_url: string;

          contents_url: string;

          contributors_url: string;

          deployments_url: string;

          description: string;

          downloads_url: string;

          events_url: string;

          fork: boolean;

          forks_url: string;

          full_name: string;

          git_commits_url: string;

          git_refs_url: string;

          git_tags_url: string;

          hooks_url: string;

          html_url: string;

          id: number;

          is_template?: boolean;

          node_id: string;

          issue_comment_url: string;

          issue_events_url: string;

          issues_url: string;

          keys_url: string;

          labels_url: string;

          languages_url: string;

          merges_url: string;

          milestones_url: string;

          name: string;

          notifications_url: string;

          owner: {
            avatar_url: string;

            events_url: string;

            followers_url: string;

            following_url: string;

            gists_url: string;

            gravatar_id: string;

            html_url: string;

            id: number;

            node_id: string;

            login: string;

            organizations_url: string;

            received_events_url: string;

            repos_url: string;

            site_admin: boolean;

            starred_url: string;

            subscriptions_url: string;

            type: string;

            url: string;
          };

          private: boolean;

          pulls_url: string;

          releases_url: string;

          stargazers_url: string;

          statuses_url: string;

          subscribers_url: string;

          subscription_url: string;

          tags_url: string;

          teams_url: string;

          trees_url: string;

          url: string;

          clone_url: string;

          default_branch: string;

          forks: number;

          forks_count: number;

          git_url: string;

          has_downloads: boolean;

          has_issues: boolean;

          has_projects: boolean;

          has_wiki: boolean;

          has_pages: boolean;

          homepage: string;

          language: string;

          master_branch?: string;

          archived: boolean;

          disabled: boolean;

          /**
           * The repository visibility: public, private, or internal.
           */
          visibility?: string;

          mirror_url: string;

          open_issues: number;

          open_issues_count: number;

          permissions?: {
            admin: boolean;

            maintain?: boolean;

            push: boolean;

            triage?: boolean;

            pull: boolean;
          };

          temp_clone_token?: string;

          allow_merge_commit?: boolean;

          allow_squash_merge?: boolean;

          allow_rebase_merge?: boolean;

          license: NullableLicenseSimple;

          pushed_at: string;

          size: number;

          ssh_url: string;

          stargazers_count: number;

          svn_url: string;

          topics?: Array<string>;

          watchers: number;

          watchers_count: number;

          created_at: string;

          updated_at: string;

          allow_forking?: boolean;
        };

        sha: string;

        user: {
          avatar_url: string;

          events_url: string;

          followers_url: string;

          following_url: string;

          gists_url: string;

          gravatar_id: string;

          html_url: string;

          id: number;

          node_id: string;

          login: string;

          organizations_url: string;

          received_events_url: string;

          repos_url: string;

          site_admin: boolean;

          starred_url: string;

          subscriptions_url: string;

          type: string;

          url: string;
        };
      };
      _links: {
        comments: Link;

        commits: Link;

        statuses: Link;

        html: Link;

        issue: Link;

        review_comments: Link;

        review_comment: Link;

        self: Link;
      };
      author_association: AuthorAssociation;
      auto_merge: AutoMerge;

      /**
       * Indicates whether or not the pull request is a draft.
       */
      draft?: boolean;
      merged: boolean;
      mergeable: boolean;
      rebaseable?: boolean;
      mergeable_state: string;
      merged_by: NullableSimpleUser;
      comments: number;
      review_comments: number;

      /**
       * Indicates whether maintainers can modify the pull request.
       */
      maintainer_can_modify: boolean;
      commits: number;
      additions: number;
      deletions: number;
      changed_files: number;
    };

    /**
     * Pull Request Merge Result
     */
    export type PullRequestMergeResult = {
      sha: string;
      merged: boolean;
      message: string;
    };

    /**
     * Pull Request Review Request
     */
    export type PullRequestReviewRequest = {
      users: Array<SimpleUser>;
      teams: Array<Team>;
    };

    /**
     * Pull Request Reviews are reviews on pull requests.
     */
    export type PullRequestReview = {
      /**
       * Unique identifier of the review
       */
      id: number;
      node_id: string;
      user: NullableSimpleUser;

      /**
       * The text of the review.
       */
      body: string;
      state: string;
      html_url: string;
      pull_request_url: string;
      _links: {
        html: {
          href: string;
        };

        pull_request: {
          href: string;
        };
      };
      submitted_at?: string;

      /**
       * A commit SHA for the review.
       */
      commit_id: string;
      body_html?: string;
      body_text?: string;
      author_association: AuthorAssociation;
    };

    /**
     * Legacy Review Comment
     */
    export type ReviewComment = {
      url: string;
      pull_request_review_id: number;
      id: number;
      node_id: string;
      diff_hunk: string;
      path: string;
      position: number;
      original_position: number;
      commit_id: string;
      original_commit_id: string;
      in_reply_to_id?: number;
      user: NullableSimpleUser;
      body: string;
      created_at: string;
      updated_at: string;
      html_url: string;
      pull_request_url: string;
      author_association: AuthorAssociation;
      _links: {
        self: Link;

        html: Link;

        pull_request: Link;
      };
      body_text?: string;
      body_html?: string;
      reactions?: ReactionRollup;

      /**
       * The side of the first line of the range for a multi-line comment.
       */
      side?: \\"LEFT\\" | \\"RIGHT\\";

      /**
       * The side of the first line of the range for a multi-line comment.
       */
      start_side?: \\"LEFT\\" | \\"RIGHT\\";

      /**
       * The line of the blob to which the comment applies. The last line of the range for a multi-line comment
       */
      line?: number;

      /**
       * The original line of the blob to which the comment applies. The last line of the range for a multi-line comment
       */
      original_line?: number;

      /**
       * The first line of the range for a multi-line comment.
       */
      start_line?: number;

      /**
       * The original first line of the range for a multi-line comment.
       */
      original_start_line?: number;
    };

    /**
     * Data related to a release.
     */
    export type ReleaseAsset = {
      url: string;
      browser_download_url: string;
      id: number;
      node_id: string;

      /**
       * The file name of the asset.
       */
      name: string;
      label: string;

      /**
       * State of the release asset.
       */
      state: \\"uploaded\\" | \\"open\\";
      content_type: string;
      size: number;
      download_count: number;
      created_at: string;
      updated_at: string;
      uploader: NullableSimpleUser;
    };

    /**
     * A release.
     */
    export type Release = {
      url: string;
      html_url: string;
      assets_url: string;
      upload_url: string;
      tarball_url: string;
      zipball_url: string;
      id: number;
      node_id: string;

      /**
       * The name of the tag.
       */
      tag_name: string;

      /**
       * Specifies the commitish value that determines where the Git tag is created from.
       */
      target_commitish: string;
      name: string;
      body?: string;

      /**
       * true to create a draft (unpublished) release, false to create a published one.
       */
      draft: boolean;

      /**
       * Whether to identify the release as a prerelease or a full release.
       */
      prerelease: boolean;
      created_at: string;
      published_at: string;
      author: SimpleUser;
      assets: Array<ReleaseAsset>;
      body_html?: string;
      body_text?: string;
      mentions_count?: number;

      /**
       * The URL of the release discussion.
       */
      discussion_url?: string;
      reactions?: ReactionRollup;
    };

    /**
     * Generated name and body describing a release
     */
    export type ReleaseNotesContent = {
      /**
       * The generated name of the release
       */
      name: string;

      /**
       * The generated body describing the contents of the release supporting markdown formatting
       */
      body: string;
    };

    export type SecretScanningAlert = {
      number?: AlertNumber;
      created_at?: AlertCreatedAt;
      updated_at?: AlertUpdatedAt;
      url?: AlertUrl;
      html_url?: AlertHtmlUrl;

      /**
       * The REST API URL of the code locations for this alert.
       */
      locations_url?: string;
      state?: SecretScanningAlertState;
      resolution?: SecretScanningAlertResolution;

      /**
       * The time that the alert was resolved in ISO 8601 format: \`YYYY-MM-DDTHH:MM:SSZ\`.
       */
      resolved_at?: string;
      resolved_by?: NullableSimpleUser;

      /**
       * The type of secret that secret scanning detected.
       */
      secret_type?: string;

      /** 
    * User-friendly name for the detected secret, matching the \`secret_type\`.
    For a list of built-in patterns, see \\"[Secret scanning patterns](https://docs.github.com/code-security/secret-scanning/secret-scanning-patterns#supported-secrets-for-advanced-security).\\"
    */
      secret_type_display_name?: string;

      /**
       * The secret that was detected.
       */
      secret?: string;

      /**
       * Whether push protection was bypassed for the detected secret.
       */
      push_protection_bypassed?: boolean;
      push_protection_bypassed_by?: NullableSimpleUser;

      /**
       * The time that push protection was bypassed in ISO 8601 format: \`YYYY-MM-DDTHH:MM:SSZ\`.
       */
      push_protection_bypassed_at?: string;
    };

    /**
     * Represents a 'commit' secret scanning location type. This location type shows that a secret was detected inside a commit to a repository.
     */
    export type SecretScanningLocationCommit = {
      /**
       * The file path in the repository
       */
      path: string;

      /**
       * Line number at which the secret starts in the file
       */
      start_line: number;

      /**
       * Line number at which the secret ends in the file
       */
      end_line: number;

      /**
       * The column at which the secret starts within the start line when the file is interpreted as 8BIT ASCII
       */
      start_column: number;

      /**
       * The column at which the secret ends within the end line when the file is interpreted as 8BIT ASCII
       */
      end_column: number;

      /**
       * SHA-1 hash ID of the associated blob
       */
      blob_sha: string;

      /**
       * The API URL to get the associated blob resource
       */
      blob_url: string;

      /**
       * SHA-1 hash ID of the associated commit
       */
      commit_sha: string;

      /**
       * The API URL to get the associated commit resource
       */
      commit_url: string;
    };

    export type SecretScanningLocation = {
      /**
       * The location type. Because secrets may be found in different types of resources (ie. code, comments, issues), this field identifies the type of resource where the secret was found.
       */
      type: \\"commit\\";
      details: SecretScanningLocationCommit;
    };

    /**
     * Stargazer
     */
    export type Stargazer = {
      starred_at: string;
      user: NullableSimpleUser;
    };

    /**
     * Code Frequency Stat
     */
    export type CodeFrequencyStat = Array<number>;

    /**
     * Commit Activity
     */
    export type CommitActivity = {
      days: Array<number>;
      total: number;
      week: number;
    };

    /**
     * Contributor Activity
     */
    export type ContributorActivity = {
      author: NullableSimpleUser;
      total: number;
      weeks: Array<{
        w?: number;

        a?: number;

        d?: number;

        c?: number;
      }>;
    };

    export type ParticipationStats = {
      all: Array<number>;
      owner: Array<number>;
    };

    /**
     * Repository invitations let you manage who you collaborate with.
     */
    export type RepositorySubscription = {
      /**
       * Determines if notifications should be received from this repository.
       */
      subscribed: boolean;

      /**
       * Determines if all notifications should be blocked from this repository.
       */
      ignored: boolean;
      reason: string;
      created_at: string;
      url: string;
      repository_url: string;
    };

    /**
     * Tag
     */
    export type Tag = {
      name: string;
      commit: {
        sha: string;

        url: string;
      };
      zipball_url: string;
      tarball_url: string;
      node_id: string;
    };

    /**
     * Tag protection
     */
    export type TagProtection = {
      id?: number;
      created_at?: string;
      updated_at?: string;
      enabled?: boolean;
      pattern: string;
    };

    /**
     * A topic aggregates entities that are related to a subject.
     */
    export type Topic = {
      names: Array<string>;
    };

    export type Traffic = {
      timestamp: string;
      uniques: number;
      count: number;
    };

    /**
     * Clone Traffic
     */
    export type CloneTraffic = {
      count: number;
      uniques: number;
      clones: Array<Traffic>;
    };

    /**
     * Content Traffic
     */
    export type ContentTraffic = {
      path: string;
      title: string;
      count: number;
      uniques: number;
    };

    /**
     * Referrer Traffic
     */
    export type ReferrerTraffic = {
      referrer: string;
      count: number;
      uniques: number;
    };

    /**
     * View Traffic
     */
    export type ViewTraffic = {
      count: number;
      uniques: number;
      views: Array<Traffic>;
    };

    export type ScimGroupListEnterprise = {
      schemas: Array<string>;
      totalResults: number;
      itemsPerPage: number;
      startIndex: number;
      Resources: Array<{
        schemas: Array<string>;

        id: string;

        externalId?: string;

        displayName?: string;

        members?: Array<{
          value?: string;

          $ref?: string;

          display?: string;
        }>;

        meta?: {
          resourceType?: string;

          created?: string;

          lastModified?: string;

          location?: string;
        };
      }>;
    };

    export type ScimEnterpriseGroup = {
      schemas: Array<string>;
      id: string;
      externalId?: string;
      displayName?: string;
      members?: Array<{
        value?: string;

        $ref?: string;

        display?: string;
      }>;
      meta?: {
        resourceType?: string;

        created?: string;

        lastModified?: string;

        location?: string;
      };
    };

    export type ScimUserListEnterprise = {
      schemas: Array<string>;
      totalResults: number;
      itemsPerPage: number;
      startIndex: number;
      Resources: Array<{
        schemas: Array<string>;

        id: string;

        externalId?: string;

        userName?: string;

        name?: {
          givenName?: string;

          familyName?: string;
        };

        emails?: Array<{
          value?: string;

          primary?: boolean;

          type?: string;
        }>;

        groups?: Array<{
          value?: string;
        }>;

        active?: boolean;

        meta?: {
          resourceType?: string;

          created?: string;

          lastModified?: string;

          location?: string;
        };
      }>;
    };

    export type ScimEnterpriseUser = {
      schemas: Array<string>;
      id: string;
      externalId?: string;
      userName?: string;
      name?: {
        givenName?: string;

        familyName?: string;
      };
      emails?: Array<{
        value?: string;

        type?: string;

        primary?: boolean;
      }>;
      groups?: Array<{
        value?: string;
      }>;
      active?: boolean;
      meta?: {
        resourceType?: string;

        created?: string;

        lastModified?: string;

        location?: string;
      };
    };

    /**
     * SCIM /Users provisioning endpoints
     */
    export type ScimUser = {
      /**
       * SCIM schema used.
       */
      schemas: Array<string>;

      /**
       * Unique identifier of an external identity
       */
      id: string;

      /**
       * The ID of the User.
       */
      externalId: string;

      /**
       * Configured by the admin. Could be an email, login, or username
       */
      userName: string;

      /**
       * The name of the user, suitable for display to end-users
       */
      displayName?: string;
      name: {
        givenName: string;

        familyName: string;

        formatted?: string;
      };

      /**
       * user emails
       */
      emails: Array<{
        value: string;

        primary?: boolean;
      }>;

      /**
       * The active status of the User.
       */
      active: boolean;
      meta: {
        resourceType?: string;

        created?: string;

        lastModified?: string;

        location?: string;
      };

      /**
       * The ID of the organization.
       */
      organization_id?: number;

      /**
       * Set of operations to be performed
       */
      operations?: Array<{
        op: \\"add\\" | \\"remove\\" | \\"replace\\";

        path?: string;

        value?: string;
      }>;

      /**
       * associated groups
       */
      groups?: Array<{}>;
    };

    /**
     * SCIM User List
     */
    export type ScimUserList = {
      /**
       * SCIM schema used.
       */
      schemas: Array<string>;
      totalResults: number;
      itemsPerPage: number;
      startIndex: number;
      Resources: Array<ScimUser>;
    };

    export type SearchResultTextMatches = Array<{
      object_url?: string;

      object_type?: string;

      property?: string;

      fragment?: string;

      matches?: Array<{
        text?: string;

        indices?: Array<number>;
      }>;
    }>;

    /**
     * Code Search Result Item
     */
    export type CodeSearchResultItem = {
      name: string;
      path: string;
      sha: string;
      url: string;
      git_url: string;
      html_url: string;
      repository: MinimalRepository;
      score: number;
      file_size?: number;
      language?: string;
      last_modified_at?: string;
      line_numbers?: Array<string>;
      text_matches?: SearchResultTextMatches;
    };

    /**
     * Commit Search Result Item
     */
    export type CommitSearchResultItem = {
      url: string;
      sha: string;
      html_url: string;
      comments_url: string;
      commit: {
        author: {
          name: string;

          email: string;

          date: string;
        };

        committer: NullableGitUser;

        comment_count: number;

        message: string;

        tree: {
          sha: string;

          url: string;
        };

        url: string;

        verification?: Verification;
      };
      author: NullableSimpleUser;
      committer: NullableGitUser;
      parents: Array<{
        url?: string;

        html_url?: string;

        sha?: string;
      }>;
      repository: MinimalRepository;
      score: number;
      node_id: string;
      text_matches?: SearchResultTextMatches;
    };

    /**
     * Issue Search Result Item
     */
    export type IssueSearchResultItem = {
      url: string;
      repository_url: string;
      labels_url: string;
      comments_url: string;
      events_url: string;
      html_url: string;
      id: number;
      node_id: string;
      number: number;
      title: string;
      locked: boolean;
      active_lock_reason?: string;
      assignees?: Array<SimpleUser>;
      user: NullableSimpleUser;
      labels: Array<{
        id?: number;

        node_id?: string;

        url?: string;

        name?: string;

        color?: string;

        default?: boolean;

        description?: string;
      }>;
      state: string;
      state_reason?: string;
      assignee: NullableSimpleUser;
      milestone: NullableMilestone;
      comments: number;
      created_at: string;
      updated_at: string;
      closed_at: string;
      text_matches?: SearchResultTextMatches;
      pull_request?: {
        merged_at?: string;

        diff_url: string;

        html_url: string;

        patch_url: string;

        url: string;
      };
      body?: string;
      score: number;
      author_association: AuthorAssociation;
      draft?: boolean;
      repository?: Repository;
      body_html?: string;
      body_text?: string;
      timeline_url?: string;
      performed_via_github_app?: NullableIntegration;
      reactions?: ReactionRollup;
    };

    /**
     * Label Search Result Item
     */
    export type LabelSearchResultItem = {
      id: number;
      node_id: string;
      url: string;
      name: string;
      color: string;
      default: boolean;
      description: string;
      score: number;
      text_matches?: SearchResultTextMatches;
    };

    /**
     * Repo Search Result Item
     */
    export type RepoSearchResultItem = {
      id: number;
      node_id: string;
      name: string;
      full_name: string;
      owner: NullableSimpleUser;
      private: boolean;
      html_url: string;
      description: string;
      fork: boolean;
      url: string;
      created_at: string;
      updated_at: string;
      pushed_at: string;
      homepage: string;
      size: number;
      stargazers_count: number;
      watchers_count: number;
      language: string;
      forks_count: number;
      open_issues_count: number;
      master_branch?: string;
      default_branch: string;
      score: number;
      forks_url: string;
      keys_url: string;
      collaborators_url: string;
      teams_url: string;
      hooks_url: string;
      issue_events_url: string;
      events_url: string;
      assignees_url: string;
      branches_url: string;
      tags_url: string;
      blobs_url: string;
      git_tags_url: string;
      git_refs_url: string;
      trees_url: string;
      statuses_url: string;
      languages_url: string;
      stargazers_url: string;
      contributors_url: string;
      subscribers_url: string;
      subscription_url: string;
      commits_url: string;
      git_commits_url: string;
      comments_url: string;
      issue_comment_url: string;
      contents_url: string;
      compare_url: string;
      merges_url: string;
      archive_url: string;
      downloads_url: string;
      issues_url: string;
      pulls_url: string;
      milestones_url: string;
      notifications_url: string;
      labels_url: string;
      releases_url: string;
      deployments_url: string;
      git_url: string;
      ssh_url: string;
      clone_url: string;
      svn_url: string;
      forks: number;
      open_issues: number;
      watchers: number;
      topics?: Array<string>;
      mirror_url: string;
      has_issues: boolean;
      has_projects: boolean;
      has_pages: boolean;
      has_wiki: boolean;
      has_downloads: boolean;
      archived: boolean;

      /**
       * Returns whether or not this repository disabled.
       */
      disabled: boolean;

      /**
       * The repository visibility: public, private, or internal.
       */
      visibility?: string;
      license: NullableLicenseSimple;
      permissions?: {
        admin: boolean;

        maintain?: boolean;

        push: boolean;

        triage?: boolean;

        pull: boolean;
      };
      text_matches?: SearchResultTextMatches;
      temp_clone_token?: string;
      allow_merge_commit?: boolean;
      allow_squash_merge?: boolean;
      allow_rebase_merge?: boolean;
      allow_auto_merge?: boolean;
      delete_branch_on_merge?: boolean;
      allow_forking?: boolean;
      is_template?: boolean;
    };

    /**
     * Topic Search Result Item
     */
    export type TopicSearchResultItem = {
      name: string;
      display_name: string;
      short_description: string;
      description: string;
      created_by: string;
      released: string;
      created_at: string;
      updated_at: string;
      featured: boolean;
      curated: boolean;
      score: number;
      repository_count?: number;
      logo_url?: string;
      text_matches?: SearchResultTextMatches;
      related?: Array<{
        topic_relation?: {
          id?: number;

          name?: string;

          topic_id?: number;

          relation_type?: string;
        };
      }>;
      aliases?: Array<{
        topic_relation?: {
          id?: number;

          name?: string;

          topic_id?: number;

          relation_type?: string;
        };
      }>;
    };

    /**
     * User Search Result Item
     */
    export type UserSearchResultItem = {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      received_events_url: string;
      type: string;
      score: number;
      following_url: string;
      gists_url: string;
      starred_url: string;
      events_url: string;
      public_repos?: number;
      public_gists?: number;
      followers?: number;
      following?: number;
      created_at?: string;
      updated_at?: string;
      name?: string;
      bio?: string;
      email?: string;
      location?: string;
      site_admin: boolean;
      hireable?: boolean;
      text_matches?: SearchResultTextMatches;
      blog?: string;
      company?: string;
      suspended_at?: string;
    };

    /**
     * Private User
     */
    export type PrivateUser = {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
      name: string;
      company: string;
      blog: string;
      location: string;
      email: string;
      hireable: boolean;
      bio: string;
      twitter_username?: string;
      public_repos: number;
      public_gists: number;
      followers: number;
      following: number;
      created_at: string;
      updated_at: string;
      private_gists: number;
      total_private_repos: number;
      owned_private_repos: number;
      disk_usage: number;
      collaborators: number;
      two_factor_authentication: boolean;
      plan?: {
        collaborators: number;

        name: string;

        space: number;

        private_repos: number;
      };
      suspended_at?: string;
      business_plus?: boolean;
      ldap_dn?: string;
    };

    /**
     * Secrets for a GitHub Codespace.
     */
    export type CodespacesSecret = {
      /**
       * The name of the secret
       */
      name: string;

      /**
       * Secret created at
       */
      created_at: string;

      /**
       * Secret last updated at
       */
      updated_at: string;

      /**
       * The type of repositories in the organization that the secret is visible to
       */
      visibility: \\"all\\" | \\"private\\" | \\"selected\\";

      /**
       * API URL at which the list of repositories this secret is vicible can be retrieved
       */
      selected_repositories_url: string;
    };

    /**
     * The public key used for setting user Codespaces' Secrets.
     */
    export type CodespacesUserPublicKey = {
      /**
       * The identifier for the key.
       */
      key_id: string;

      /**
       * The Base64 encoded public key.
       */
      key: string;
    };

    /**
     * An export of a codespace. Also, latest export details for a codespace can be fetched with id = latest
     */
    export type CodespaceExportDetails = {
      /**
       * State of the latest export
       */
      state?: string;

      /**
       * Completion time of the last export operation
       */
      completed_at?: string;

      /**
       * Name of the exported branch
       */
      branch?: string;

      /**
       * Git commit SHA of the exported branch
       */
      sha?: string;

      /**
       * Id for the export details
       */
      id?: string;

      /**
       * Url for fetching export details
       */
      export_url?: string;

      /**
       * Web url for the exported branch
       */
      html_url?: string;
    };

    /**
     * Email
     */
    export type Email = {
      email: string;
      primary: boolean;
      verified: boolean;
      visibility: string;
    };

    /**
     * A unique encryption key
     */
    export type GpgKey = {
      id: number;
      name?: string;
      primary_key_id: number;
      key_id: string;
      public_key: string;
      emails: Array<{
        email?: string;

        verified?: boolean;
      }>;
      subkeys: Array<{
        id?: number;

        primary_key_id?: number;

        key_id?: string;

        public_key?: string;

        emails?: Array<{}>;

        subkeys?: Array<{}>;

        can_sign?: boolean;

        can_encrypt_comms?: boolean;

        can_encrypt_storage?: boolean;

        can_certify?: boolean;

        created_at?: string;

        expires_at?: string;

        raw_key?: string;

        revoked?: boolean;
      }>;
      can_sign: boolean;
      can_encrypt_comms: boolean;
      can_encrypt_storage: boolean;
      can_certify: boolean;
      created_at: string;
      expires_at: string;
      revoked: boolean;
      raw_key: string;
    };

    /**
     * Key
     */
    export type Key = {
      key: string;
      id: number;
      url: string;
      title: string;
      created_at: string;
      verified: boolean;
      read_only: boolean;
    };

    export type MarketplaceAccount = {
      url: string;
      id: number;
      type: string;
      node_id?: string;
      login: string;
      email?: string;
      organization_billing_email?: string;
    };

    /**
     * User Marketplace Purchase
     */
    export type UserMarketplacePurchase = {
      billing_cycle: string;
      next_billing_date: string;
      unit_count: number;
      on_free_trial: boolean;
      free_trial_ends_on: string;
      updated_at: string;
      account: MarketplaceAccount;
      plan: MarketplaceListingPlan;
    };

    /**
     * Starred Repository
     */
    export type StarredRepository = {
      starred_at: string;
      repo: Repository;
    };

    /**
     * Hovercard
     */
    export type Hovercard = {
      contexts: Array<{
        message: string;

        octicon: string;
      }>;
    };

    /**
     * Key Simple
     */
    export type KeySimple = {
      id: number;
      key: string;
    };
    "
  `);
});
