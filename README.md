# Getting started

<br>

## Configuration

You can find the configs in the `config` folder.

<br>

## Components

Components currently live in a github submodule. To get them, run:

```bash
git submodule update --init --recursive --remote
```

<br>

## Development

> Please be aware that this project uses [yarn](<[https://yarn.sh/](https://yarnpkg.com/)>) as package manager. You can install it with `npm install -g yarn`.
> It is recommended to use Node.js version v20.10.0

```bash
yarn i
git submodule update --recursive --remote
yarn zenstack:generate
yarn dev
```

### Changing environments

To change the environment, you can use the `NUXT_PUBLIC_ENV` environment variable.
The default value is `local`.

<br>

## Deployment

To use environment variables, create a `.env` file in the root of the FE project.
You need to use the `VITE_` prefix for the variables.

The variables are then used in the code as: `import.meta.env.VITE_VARIABLE_NAME`.

```bash
yarn i
yarn generate
```

This will generate a static version of the website in the `.output/public` folder.
You can then deploy it to any static hosting service.

Note: The generation will throw a warning regarding ssr, you can ignore that.

> WARN HTML content not prerendered because ssr: false was set. You can read more in https://nuxt.com/docs/getting-started/deployment#static-hosting.
