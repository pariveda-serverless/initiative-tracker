1. To avoid slash command and action endpoint conflict the recommended way of working with this project is to create a personal slack app that you can associate with your branch deploys
1. To help support this process the Circle CI deployment creates a new stage per branch using the committers GitHub username to make it easier to associate the stage with your personal slack app and not have to update slash command urls for each new branch
   1. You can still associate your branch with the main app if you want

Steps for setting up a new slack app and adding configuration in project

1. Create a new app at https://api.slack.com/apps
1. Record the Client ID, Client Secret, and Signing Secret from the basic info section
1. Once you install the app an Access Token will be generated for you

Steps for setting up your slack app with Circle CI deployments

1. Because each individual app will have it's own credential information, and because Circle CI will deploy branches with your GitHub username as the stage, the configuration values expected by serverless framework in serverless.yml are environment variables with your GitHub username prefixed in the following way:
   1. <GitHub username>\_SLACK_ACCESS_TOKEN
   1. <GitHub username>\_SLACK_CLIENT_ID
   1. <GitHub username>\_SLACK_CLIENT_SECRET
   1. <GitHub username>\_SLACK_SIGNING_SECRET
1. If these values are not found the default environment variables will be used
   1. SLACK_ACCESS_TOKEN
   1. SLACK_CLIENT_ID
   1. SLACK_CLIENT_SECRET
   1. SLACK_SIGNING_SECRET
1. The best place to set these environment variables is in context specified in the ./circle-ci/config.yml file (initiative-tracker at the time of writing)

Slack app setup

1. Activate Interactive Components and put in the action endpoint Lambda URL (by default this will be https://initiative.ninja/<GitHub username>/actions)
1. Create the following Slash Commands:
   1. Command /<GitHub username>-show with the list endpoint Lambda URL (by default this will be https://initiative.ninja/<GitHub username>/list)
   1. Command /<GitHub username>-add with the add endpoint Lambda URL (by default this will be https://initiative.ninja/<GitHub username>/add)
1. If you want to distribute your app to another workspace you'll need to setup a Redirect Url under OAuth and Permissions (by default this will be https://initiative.ninja/<GitHub username>/auth/redirect)
1. Add the following scopes to enable reading basic profile information and direct messaging users
   1. chat:write:bot to send direct messages
   1. user:profile:read to read basic profile information
