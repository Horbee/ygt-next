# You've got time

You've got time is a web application built with the T3 Stack, using technologies like Next.js, TypeScript, tRPC, MongoDB and Matine-UI that helps you organize events and handle user availabilities.

## Technologies Used

T3 Stack - take a look here if you want to know more about it: [https://create.t3.gg/](https://create.t3.gg/)

- Next.js: A React-based framework for building server-side rendered (SSR) and statically generated (SSG) websites and applications.
- TypeScript: A statically typed superset of JavaScript that helps you write more maintainable and scalable code.
- NextAuth: An authentication library for Next.js that supports multiple providers and is easy to set up.
- Prisma: An open-source database toolkit that provides a high-level API for accessing databases, which makes it easy to implement database migrations, manage relationships, and perform CRUD operations.
- tRPC: A framework for building modern and fast APIs with TypeScript and Next.js, designed for simplicity and scalability.
- MongoDB: A popular, cross-platform, NoSQL database used for storing high-volume, high-velocity data.
- Mantine-UI: A fully featured React components library which includes more than 100 customizable components and 40 hooks.

## Prerequisites

Before you begin, make sure you have the following software installed on your computer:

- Node.js 16+: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- pnpm: An alternative package manager for Node.js that is faster and more efficient than npm.
- Docker: An open-source platform that automates the deployment, scaling, and management of containerized applications.

The application uses Google Auth Provider to sign in users and AWS S3 to save the media files. You will need to setup a project with OAuth 2.0 Client IDs using the [Google Cloud Console](https://console.cloud.google.com/) and create an S3 Bucket.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Horbee/ygt-next
```

2. Install the dependencies:

```bash
cd ygt-next
pnpm install
```

3. Start the MongoDB database with the help of the `docker-compose.yaml` file or use MongoDB Atlas. Then create collections and indexes:

```bash
docker compose up -d
pnpm prisma db push
```

4. Make a copy of the `.env.example` file and rename it to `.env.local`. Fill out the necessary details:

```bash
mv .env.example .env.local
```

5. Start the development server:

```bash
pnpm dev
```

6. Open your browser and navigate to http://localhost:3000. You should see the You've got time application's login screen.

# Usage

## Authenticating users

To sign in to the application, click the "Sign in with Google" button on the login page. This will redirect you to the Google's authentication page, where you can sign in with your preferred account.

## Creating events

To create a new event, click the "+" button in the top-right corner of the event list page. This will take you to the event creation form, where you can enter the details of your event, such as the title, description, location, and date.

You can create public events which are visible for everyone who is signed up and using the application or you can choose to create a private event and invite some specific people.

## Managing availabilities

Once you've created an event, users can select their availability for the event.
You can view the events you've created and the availabilities of the users who have been invited.

# Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the repository
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

# License

This project is licensed under the `GNU GPLv3 License`. See the [LICENCE](https://github.com/Horbee/ygt-next/blob/master/LICENSE) for more details.
