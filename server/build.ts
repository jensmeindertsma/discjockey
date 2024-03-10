import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./server/serve.ts"],
  format: "esm",
  platform: "node",
  outfile: "./build/serve.js",
});
