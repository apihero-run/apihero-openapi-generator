import path from "node:path";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import * as ts from "typescript";
import { GenerationOptions } from "../generate";

export type GeneratePackageOptions = {
  name: string;
  version: { major: number; minor: number; patch: number };
  description?: string;
  generation?: GenerationOptions;
};

export async function generatePackageFromTypeScriptFiles(
  files: Map<string, string>,
  destination: string,
  options: GeneratePackageOptions,
) {
  // Create the destination directory if it doesn't exist
  await mkdir(destination, { recursive: true });

  // Remove existing files in the destination directory
  const filesInDestination = await readdir(destination);

  for (const file of filesInDestination) {
    const fileStat = await stat(path.join(destination, file));

    if (fileStat.isFile()) {
      await unlink(path.join(destination, file));
    }
  }

  const packageJson = {
    name: `@apihero/${options.name}`,
    version: `${options.version.major}.${options.version.minor}.${options.version.patch}`,
    description: options.description,
    main: "./lib/index.js",
    exports: "./lib/index.js",
    types: "./lib/index.d.ts",
    files: ["/lib"],
    engines: {
      node: ">=14.0.0",
    },
    author: "API Hero",
    license: "MIT",
    keywords: ["api", options.name, "apihero-client", "http"],
    publishConfig: {
      access: "public",
    },
    repository: {
      type: "git",
      url: "https://github.com/jsonhero-io/apihero",
    },
    homepage: `https://apihero.run/docs/integrations/${options.name}`,
    bugs: {
      url: "https://github.com/jsonhero-io/apihero/issues",
    },
  };

  const packageJsonPath = path.join(destination, "package.json");
  const packageJsonContent = JSON.stringify(packageJson, null, 2);

  await writeFile(packageJsonPath, packageJsonContent);

  const typescriptPath = path.join(destination, "src");

  // Make sure the typescript path exists
  await mkdir(typescriptPath, { recursive: true });

  const filePaths = [];

  for (const [file, content] of Array.from(files)) {
    const filePath = path.join(typescriptPath, file);
    console.log(`Writing ${filePath}`);
    await writeFile(filePath, content);

    filePaths.push(filePath);
  }

  const compileResult = compile(filePaths, {
    outDir: path.join(destination, "lib"),
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    declaration: true,
  });

  if (!compileResult) {
    throw new Error("Compilation failed");
  }

  console.log("Compilation succeeded");

  // Create the README file
  const readmePath = path.join(destination, "README.md");
  const readmeContent = `# ${options.name}`;

  await writeFile(readmePath, readmeContent);

  // Create the license file

  const licensePath = path.join(destination, "LICENSE");
  const licenseContent = `Copyright (c) ${new Date().getFullYear()} API Hero

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
  `;

  await writeFile(licensePath, licenseContent);
}

function compile(fileNames: string[], options: ts.CompilerOptions): boolean {
  const program = ts.createProgram(fileNames, options);
  const emitResult = program.emit();

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        diagnostic.start!,
      );
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    }
  });

  return !emitResult.emitSkipped;
}
