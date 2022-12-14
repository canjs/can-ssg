#!/usr/bin/env node

const { Command } = require("commander")
const program = new Command()
const path = require("path")

const ssgConfig = require(path.join(process.cwd(), "ssg"))

program.name("can-ssg").description("Utility for building and serving statically generated CanJS pages").version("1.0.0")

program
  .command("build")
  .description("Create a static site build of a CanJS application")
  .option("--environment <string>", "which environment to build from ssg.json", ssgConfig.defaultEnv || "dev")
  .action((str, options) => {
    const ssg = require("../jsdom-ssg/index")
    ssg(options.opts())
  })

program
  .command("serve")
  .description("Start a Web server that will serve pages and assets for a statically built site")
  .option("--environment <string>", "which build environment to serve", ssgConfig.defaultEnv || "dev")
  .option("--serverMode <string>", "Whether to serve the generated SSG site or a traditional SPA", ssgConfig.defaultServerMode || "ssg")
  .action((str, options) => {
    const server = require("../server")
    server(options.opts())
  })

program.parse()
