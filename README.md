
## Getting Started

### Step 1: Configure Environment File
Create a `.env` file in the root directory of your project and add the necessary environment variables. Refer to `.env.example` for the required variables.

### Step 2: Run Prisma Generate
Generate the Prisma client by running the following command:
```bash
npm run prisma:generate
```
### Step 3: Start the Application
Start the application using the following command:
```bash
npm run start:dev
```
## Structure

shared: Common utilities and shared code.
prisma: Prisma schema and migrations.
base: Base classes are extended at module
modules:
    auth: Authentication module.
    brand: Brand management module.
    estate: Real estate management module.
    feature: Feature management module.
    m-config: Configuration management module.
    sync: Synchronization module.
## Migration flow
### Step 1: Configure Environment File
```bash
npm run prisma:migrate-save --name <migration-name>
```
### Step 2: Apply the migration
```bash
npm run prisma:generate
```






