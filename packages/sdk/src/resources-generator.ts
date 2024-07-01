import type { DataSources } from "./schema/data-sources";
import type { Page } from "./schema/pages";
import type { Resources } from "./schema/resources";
import type { Scope } from "./scope";
import { generateExpression } from "./expression";

export const generateResourcesLoader = ({
  scope,
  page,
  dataSources,
  resources,
}: {
  scope: Scope;
  page: Page;
  dataSources: DataSources;
  resources: Resources;
}) => {
  let generatedOutput = "";
  let generatedLoaders = "";
  let hasResources = false;

  const usedDataSources: DataSources = new Map();

  for (const dataSource of dataSources.values()) {
    if (dataSource.type === "resource") {
      const resource = resources.get(dataSource.resourceId);
      if (resource === undefined) {
        continue;
      }
      hasResources = true;
      // call resource by bound variable name
      const resourceName = scope.getName(resource.id, dataSource.name);
      generatedOutput += `${resourceName},\n`;
      generatedLoaders += `loadResource(customFetch, {\n`;
      generatedLoaders += `id: "${resource.id}",\n`;
      generatedLoaders += `name: ${JSON.stringify(resource.name)},\n`;
      const url = generateExpression({
        expression: resource.url,
        dataSources,
        usedDataSources,
        scope,
      });
      generatedLoaders += `url: ${url},\n`;
      generatedLoaders += `method: "${resource.method}",\n`;
      generatedLoaders += `headers: [\n`;
      for (const header of resource.headers) {
        const value = generateExpression({
          expression: header.value,
          dataSources,
          usedDataSources,
          scope,
        });
        generatedLoaders += `{ name: "${header.name}", value: ${value} },\n`;
      }
      generatedLoaders += `],\n`;
      // prevent computing empty expression
      if (resource.body !== undefined && resource.body.length > 0) {
        const body = generateExpression({
          expression: resource.body,
          dataSources,
          usedDataSources,
          scope,
        });
        generatedLoaders += `body: ${body},\n`;
      }
      generatedLoaders += `}),\n`;
    }
  }

  let generatedVariables = "";
  for (const dataSource of usedDataSources.values()) {
    if (dataSource.type === "variable") {
      const name = scope.getName(dataSource.id, dataSource.name);
      const value = JSON.stringify(dataSource.value.value);
      generatedVariables += `let ${name} = ${value}\n`;
    }

    if (dataSource.type === "parameter") {
      // support only page system parameter
      if (dataSource.id !== page.systemDataSourceId) {
        continue;
      }
      const name = scope.getName(dataSource.id, dataSource.name);
      generatedVariables += `const ${name} = _props.system\n`;
    }
  }

  let generated = "";
  generated += `import { loadResource, isLocalResource, type System } from "@webstudio-is/sdk";\n`;

  if (hasResources) {
    generated += `import { sitemap } from "./$resources.sitemap.xml";\n`;
  }

  generated += `export const loadResources = async (_props: { system: System }) => {\n`;
  generated += generatedVariables;
  if (hasResources) {
    generated += `
    const customFetch: typeof fetch = (input, init) => {
      if (typeof input !== "string") {
        return fetch(input, init);
      }

      if (isLocalResource(input, "sitemap.xml")) {
        // @todo: dynamic import sitemap ???
        const response = new Response(JSON.stringify(sitemap));
        response.headers.set('content-type',  'application/json; charset=utf-8');
        return Promise.resolve(response);
      }

      return fetch(input, init);
    };
    `;
    generated += `const [\n`;
    generated += generatedOutput;
    generated += `] = await Promise.all([\n`;
    generated += generatedLoaders;
    generated += `])\n`;
  }
  generated += `return {\n`;
  generated += generatedOutput;
  generated += `} as Record<string, unknown>\n`;
  generated += `}\n`;
  return generated;
};
