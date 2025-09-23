module.exports = {
  apps: [
    {
      name: "catcam",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "./",
    },
  ],
};
