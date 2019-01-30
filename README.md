# Watson Instance Pusher

Backup service for Watson Assistant instances.

## Prerequisites

* NodeJS v8.12.0

## Getting Started

After cloning the project and running `npm install`, you just have to decide if you would like to use it as a automated scheduled backup or as a REST API.

In case you decide to use it as a schedule service, you just need to follow the [Using as a schedule service](#using-as-a-schedule-service) section. In case you decide to use it as a REST API, go to [Using as a REST API](#using-as-a-rest-api) section.

If the set of properties seems more like a clutter than anything, you can refer to the [Reminders about properties](#reminders-about-properties) section.

It is important to know that the service does not create a backup repository for you. You need to create it first and than set its name in the `repo` property (in the schedule service or the REST API).

## Using as a schedule service

All you need to do here first is to set the `.env` file accordingly, as the example bellow:

```env
WATSON_ASSISTANT_VERSION_DEV=...
WATSON_ASSISTANT_USERNAME_DEV=...
WATSON_ASSISTANT_PASSWORD_DEV=...
WATSON_ASSISTANT_URL_DEV=...

WATSON_ASSISTANT_VERSION_PRD=...
WATSON_ASSISTANT_USERNAME_PRD=...
WATSON_ASSISTANT_PASSWORD_PRD=...
WATSON_ASSISTANT_URL_PRD=...

GITHUB_TOKEN=...
GITHUB_URL=...
GITHUB_OWNER=...
GITHUB_REPO=...
```

`DEV` and `PRD` stand, respectively, for **development** and **production** workspaces. For the moment, the scheduler make two calls to make the backup: one for each workspace. So you need to give those credentials for it to work properly. If you wish to use only one kind of workspace, please update the [backup-jobs.js](/src/jobs/backup-job.js) file accordingly.

You can also use the new **IAM authentication** instead, which is the new way to authenticate yourself in an IBM service:

```env
WATSON_ASSISTANT_VERSION_DEV=...
WATSON_ASSISTANT_IAM_APIKEY_DEV=...
WATSON_ASSISTANT_URL_DEV=...

...
```

After setting up the `.env` file, you just need to run it with `npm run dev` and it will be good to go! That is, if we didn't forget about the timer... did we?

Well, just remember to set it in [backup-jobs.js](/src/jobs/backup-job.js) file, as in the example bellow:

```javascript
let backupJob = schedule.scheduleJob("0 0 * * *", async () => {...});
```

The project uses `node-schedule`, so the `"0 0 * * *" ` part it's where you set the timer (default is midnight). For a more detailed reference, read the [node-schedule documentation](https://github.com/node-schedule/node-schedule/blob/master/README.md).

## Using as a REST API
### Resource: `/`

| Method  | Action        | Header                                 | Body                  | Path       | Response              |
| ------  | ------        | ------                                 | ------                | ------     | ------                |
| POST    | backup        | [ "Content-Type", "application/json" ] | [#](#body)            | /backup    | [#](#response)        |

##### Body

```json
{
    "watson_assistant_credentials": {
        "version": "...",
        "username": "...",
        "password": "...",
        "url": "..."
    },
    "github_credentials": {
        "token": "...",
        "url": "...",
        "owner": "...",
        "repo": "..."
    },
    "environment": "..."
}
```

You can also use the IAM authentication:

```json
{
    "watson_assistant_credentials": {
        "version": "...",
        "iam_apikey": "...",
        "url": "..."
    },
    
    ...
}
```

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

## Reminders about properties

Just a few reminders about the necessary configurations:

* `WATSON_ASSISTANT_VERSION_`/`watson_assistant_credentials.version` stands for the Watson Assistant API request version. Its value needs to be set in an YYYY-MM-DD date format, e.g. `2018-09-20`;
* `WATSON_ASSISTANT_USERNAME_`/`watson_assistant_credentials.username` and `WATSON_ASSISTANT_PASSWORD_`/`watson_assistant_credentials.password` are your credentials for Watson Assistant (former authentication);
* `GITHUB_TOKEN`/`github_credentials.token` it's your Github Personal Access Token;
* `GITHUB_OWNER`/`github_credentials.owner` it's your Github owner;
* `GITHUB_REPO`/`github_credentials.repo` it's your backup repository. You just need to set its name, e.g. `"watson-instance-backup"`;;
* All the URLs, IBM or not, are optional base service endpoints your services are currently using (they have default values in case nothing is set);
* The `environment` property in the REST section is optional and can be left out from the request. If setted, it will create a folder with its name in your backup repository and set the instances inside it.
