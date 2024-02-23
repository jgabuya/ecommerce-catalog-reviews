# Frontend

## Description

The following functionalities are implemented:

- user authentication
- product listing
- product details
  - list reviews
  - add review

### Technologies/tools used:

- Next.js (page-based routing)
- [swr](https://github.com/vercel/swr) for data fetching
- Tailwind CSS

## Structure

- `src`
  - `components`: common components used throughout the app
  - `modules`: vertical slices of functionality, contain scoped components and
    hooks
  - `pages`: Next.js page router files

## Setup

**Note: This needs a running backend**

### Running the app

1. Create an environment variable file:

```sh
cp .env.local.example .env.local
```

You need to change the env values accordingly:

- **NEXT_PUBLIC_BACKEND_URL**: This is the full url of the running backend
  instance. Example: `NEXT_PUBLIC_BACKEND_URL=http://localhost:9000`

2. Install package dependencies

```sh
npm install
```

3. Run the app locally:

```sh
npm run dev
```

## Additional Notes

- Pages vs App router: for the purposes of simplicity the Pages router is used
  in this app. Using the App router could bring the benefits of server
  components, but it also comes with its own complexity. I think choosing
  between the two should consider the nature of the app and the performance
  needs
