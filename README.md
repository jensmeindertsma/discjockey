# diskjockey

A starter template for building incredible web applications with Remix.

## Made with

- [Remix](https://remix.run/) (web framework)
- [Prisma](https://www.prisma.io/) (database toolchain)
- [TypeScript](https://www.typescriptlang.org/) (write production-ready code on a large scale with type safety)
- [Prettier](https://prettier.io/) (one formatting standard for everything and everyone)
- [ESLint](https://eslint.org/) (catch code issues before production with this industry-standard linter)
- [Stylelint](https://stylelint.io/) (hold your CSS to the same standard as your code)

## Setting up

0. Replace placeholders with your own name: search for `yourname` and replace occurences with your name.
1. Make sure you have switched to the right Node.js version by executing `nvm use` (learn more about [Node Version Manager](https://github.com/nvm-sh/nvm)).
    - You may need to run `nvm install <version>` to download the right version of Node.js
2. Enable package manager shimming with `corepack enable`
3. Install dependencies with `pnpm install`
4. Boot up the database with `pnpm database:up`
5. Copy the examplary dotfile to its actual location to make sure the Prisma CLI and Vite server have the correct variables set: `cp .env.example .env`
6. Then, in another terminal, run `pnpm database:migrate` to apply the initial migrations to the freshly created database
7. Start the development server with `pnpm dev`

## Deployment

This project is totally set up and ready to be deployed cheaply on your own VPS. I have specifically picked Dokku for this, a PAAS project you can install on your VPS that will manage your web applications and databases as Docker containers, and configure routing automatically with Nginx. You can easily adapt this for your own use case, the relevant files for Dokku are `app.json` and `Procfile`. Oh, yeah, and the Dockerfile in this project includes the `prisma` folder in the final image so migrations can be run on the VPS without any additional data, but you can change this if you have a different setup and it will make your Docker image a bit slimmer. But it is already really quite slim for a Node.js application (~300MB).
