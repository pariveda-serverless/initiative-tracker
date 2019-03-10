1. To avoid slash command and action endpoint conflict the recommended way of working with this project is to create a personal slack app that you can associate with your branch deploys
1. To help support this process the Circle CI deployment creates a new stage per branch using the committers GitHub username to make it easier to associate the stage with your personal slack app and not have to update slash command urls for each new branch
   1. You can still associate your branch with the main app if you want

Steps for setting up a new slack app and adding configuration in project

1. Create a new app at https://api.slack.com/apps
1. Record the Client ID, Client Secret, and Signing Secret from the basic info section
1. Once you install the app an Access Token will be generated for you
   1. You must add the permissions specified at the bottom of this document before you will be able to install this app
1. Under the Manage Distribution Section, pase the shareable URL into your browser and hit enter, this should enable your app

Steps for setting up your slack app with Circle CI deployments (username = GitHub username)

1. Because each individual app will have it's own credential information, and because Circle CI will deploy branches with your GitHub username as the stage, the configuration values expected by serverless framework in serverless.yml are environment variables with your GitHub username prefixed in the following way:
   1. \<username\>\_SLACK_ACCESS_TOKEN
   1. \<username\>\_SLACK_CLIENT_ID
   1. \<username\>\_SLACK_CLIENT_SECRET
   1. \<username\>\_SLACK_SIGNING_SECRET
1. If these values are not found the default environment variables will be used
   1. SLACK_ACCESS_TOKEN
   1. SLACK_CLIENT_ID
   1. SLACK_CLIENT_SECRET
   1. SLACK_SIGNING_SECRET
1. The best place to set these environment variables is in the Circle CI context on the Circle CI web application, in Settings -> Contexts

Slack app setup (username = GitHub username)

1. Activate Interactive Components and put in the action endpoint Lambda URL (by default this will be `https://initiative.ninja/<username>/actions`)
1. Create the following Slash Commands:
   1. Command `/<username>-show` with the list endpoint Lambda URL (by default this will be `https://initiative.ninja/<username>/list`)
   1. Command `/<username>-add` with the add endpoint Lambda URL (by default this will be `https://initiative.ninja/<username>/add`)
1. If you want to distribute your app to another workspace you'll need to setup a Redirect Url under OAuth and Permissions (by default this will be `https://initiative.ninja/<username>/auth/redirect`)
1. Add the following scopes to enable reading basic profile information and direct messaging users
   1. chat:write:bot and chat:write:user to send direct messages
   1. users.profile:read to read basic profile information
   1. channels:read to read basic channel information
