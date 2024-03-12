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
1. Make sure you have switched to the right Node.js version by executing `nvm install`, which will download and enable the correct version of Node.js if you didn't have it already (learn more about [Node Version Manager](https://github.com/nvm-sh/nvm)).
2. Enable package manager shimming with `corepack enable`
3. Install dependencies with `pnpm install`
4. Boot up the database with `pnpm database:up`
5. Copy the examplary dotfile to its actual location to make sure the Prisma CLI and Vite server have the correct variables set: `cp .env.example .env`
6. Then, in another terminal, run `pnpm database:migrate` to apply the initial migrations to the freshly created database
7. Start the development server with `pnpm dev`
