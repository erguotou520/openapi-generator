// src/index.ts
import {resolve as resolve2} from "node:path";

// src/core.ts
import {resolve} from "node:path";
import {Eta} from "eta";

// src/fetcher.ts
import ora from "ora";
import swaggerConvert from "swagger2openapi";
async function fetchOpenAPISchema(url, options) {
  const spinner = ora().start("Fetching OpenAPI schema");
  const { customHeaders, basicAuth, isVersion2 } = options;
  try {
    const response = await fetch(url, {
      headers: {
        ...customHeaders,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...basicAuth ? {
          Authorization: `Basic ${btoa(`${basicAuth.username}:${basicAuth.password}`)}`
        } : {}
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAPI schema: ${response.status} ${response.statusText}`);
    }
    const schema = await response.json();
    if (isVersion2) {
      const ret = await new Promise((resolve, reject) => {
        swaggerConvert.convertObj(schema, { patch: true, warnOnly: true }, (error, options2) => {
          if (error) {
            reject(error);
          } else {
            resolve(options2.openapi);
          }
        });
      });
      return ret;
    }
    return schema;
  } catch (error) {
    spinner.fail(error.message);
    throw error;
  } finally {
    spinner.stop();
  }
}

// src/file.ts
import {mkdir, stat, writeFile} from "node:fs/promises";
import {dirname} from "node:path";
async function saveTextToFile(filePath, content) {
  const dir = dirname(filePath);
  if (!await stat(dir).catch(() => false)) {
    await mkdir(dir, { recursive: true });
  }
  return writeFile(filePath, content, "utf8");
}

// src/core.ts
async function generate(options) {
  const schema = await fetchOpenAPISchema(options.specUrl, options);
  saveTextToFile(options.tempFilePath || "node_modules/.o2t/openapi.json", JSON.stringify(schema, null, 2));
  const output = await eta.renderAsync(resolve(__dirname, "templates/schema.eta.ts"), {});
  await saveTextToFile(resolve(options.outputDir || "src/api", "schema.ts"), output);
}
var __dirname = "/Users/erguotou/workspace/erguotou/openapi-generator/packages/typescript/src";
var eta = new Eta({ rmWhitespace: true });

// src/index.ts
function defineConfig(config) {
  return config;
}
async function run(_args) {
  try {
    const mod = await import(resolve2(process.cwd(), "o2t.config.js"));
    const config = mod.default || mod;
    await generate(config);
  } catch (e) {
    console.error("Please create a ota.config.js file first.");
  }
}
export {
  run,
  defineConfig
};
