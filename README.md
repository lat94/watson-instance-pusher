# Watson Instance Pusher

Backup service for Watson Assistant instances.

### Prerequisites

* NodeJS v8.12.0

## Getting Started

After cloning the project and running `npm install`, you just have to decide if you would like to use it as a automated scheduled backup or as a REST API.

In case you decide to use it as a schedule service, you just need to follow the [Using as a schedule service](#using-as-a-schedule-service) section. In case you decide to use it as a REST API, go to [Using as a REST API](#using-as-a-rest-api) section.

It is important to know that the service does not create a backup repository for you. You need to create it first and than set its name in the `repo` property (in the schedule service or the REST API).

## Using as a schedule service

All you need to do here first is to set the `.env` file accordingly, as the example bellow:

```env
WATSON_ASSISTANT_USERNAME_DEV=dev_workspace_username_here
WATSON_ASSISTANT_PASSWORD_DEV=dev_workspace_password_here
WATSON_ASSISTANT_VERSION_DEV=dev_version_here

WATSON_ASSISTANT_USERNAME_PRD=production_workspace_username_here
WATSON_ASSISTANT_PASSWORD_PRD=production_workspace_password_here
WATSON_ASSISTANT_VERSION_PRD=production_version_here

GITHUB_TOKEN=your_github_account_personal_access_token_here
GITHUB_URL=your_main_github_url
GITHUB_OWNER=github_owner_here
GITHUB_REPO=repository_name_here
```

For the moment, the scheduler make two calls to make the backup: one for the development workspace and the other for the production. So you need to give those credentials for it to work properly.

After setting up the `.env` file, you just need to run it with `npm run dev` and it will be good to go! That is, if we didn't forget about the timer... did we?

Well, just remember to set it in [backup-jobs.js](/src/jobs/backup-job.js) file, as in the example bellow:

```javascript
let backupJob = schedule.scheduleJob("* * 0 * * *", async () => {...}
```

The project uses `node-schedule`, so the `"* * 0 * * *"` part it's where you set the timer (default is midnight). For a more detailed reference, read the [node-schedule documentation](https://github.com/node-schedule/node-schedule/blob/master/README.md).

## Using as a REST API
### Resource: `/`

| Method  | Action        | Header                                 | Body                  | Path       | Response              |
| ------  | ------        | ------                                 | ------                | ------     | ------                |
| POST    | backup        | [ "Content-Type", "application/json" ] | [#](#body)            | /backup    | [#](#response)        |

##### Body

```json
{
    "watson_assistant_credentials": {
        "username": "workspace_username_here",
        "password": "workspace_password_here",
        "version": "workspace_version_here"
    },
    "github_credentials": {
        "token": "your_github_account_personal_access_token_here",
        "url": "your_main_github_url",
        "owner": "github_owner_here",
        "repo": "the name of the repository comes here"
    },
    "environment": "the_name_of_environment"
}
```

Just a few reminders:

* The property `version` needs to be set in a date format, e.g. `"2018-09-20"`;
* The default value for the `url` property in `github_credentials` is `"https://api.github.com"`;
* In the `repository` property you just need to set its name, e.g. `"watson-instance-backup"`;
* The `environment` property is optional and can be left out from the request. If setted, it will create a folder with its name and set the instances inside it.

##### Response

It responds with the log of what happened with each instance: a metadata if it succeeds, a error object if it fails.

```json
[
  {
    "content": {...},
    "commit": {...}
  },
  {
    "message": "some error message"
  }
]
```
