## OMNIBOT 3000

YOUR OMNISCIENT SOURCE OF TRUTH

![image](https://github.com/user-attachments/assets/f3c88ab8-4c8c-4056-8d82-9cfb3fbe023e)

### Install

`pnpm i omnibot3000`

### Run

From the _omnibot3000_ directory run this command:
`pnpm link -g`

Make sure that the file `./src/bin/omnibot.js` has execution rules (`chmod 755`)

Then you can just run: `omnibot`

### Configuration

Create a `.env` file in the root of your project with the following content:

```env
DOMAIN=localhost
DEV_PORT=3000
API_PORT=3001
API_PATH=/api

MISTRAL_API_KEY=<your_mistral_api_key>

OPENAI_ORG_ID=<your_openai_org_id>
OPENAI_PROJECT_ID=<your_openai_project_id>
OPENAI_API_KEY=<your_openai_api_key>
```

### Package

https://www.npmjs.com/package/omnibot3000

### Contributing

Please **NO**.

### License

I just said **NO**.
