import type { StorybookConfig } from "storybook-solidjs-vite";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
  stories: [
    "../stories/Overview.mdx", // Default / Home page
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  framework: {
    name: "storybook-solidjs-vite",
    options: {},
  },
};
export default config;
