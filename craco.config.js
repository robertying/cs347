module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      if (env === "production") {
        return {
          ...webpackConfig,
          entry: {
            main: "./src/index.tsx",
            content: "./src/content/index.tsx",
            background: "./src/background/index.ts",
          },
          output: {
            ...webpackConfig.output,
            filename: "static/js/[name].js",
          },
        };
      } else {
        return webpackConfig;
      }
    },
  },
};
