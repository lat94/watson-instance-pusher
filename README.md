# Watson Instance Pusher

Backup service for Watson Assistant instances.

## Prerequisites

* NodeJS v8.12.0

## Getting Started

After cloning the project and running `npm install`, you just have to decide if you would like to use it as a automated scheduled backup or as a REST API.

In case you decide to use it as a schedule service, you just need to follow the [Using as a schedule service](#using-as-a-schedule-service) section. In case you decide to use it as a REST API, go to [Using as a REST API](#using-as-a-rest-api) section.

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

In case you feel lost in all that clutter:

* `WATSON_ASSISTANT_VERSION_` stands for the API request version. Its value needs to be set in an date format, e.g. `2018-09-20`;
* `WATSON_ASSISTANT_USERNAME_` and `WATSON_ASSISTANT_PASSWORD_` are your credentials for Watson Assistant (former authentication);
* The `WATSON_ASSISTANT_URL_` is the base service endpoint your instance is currently using (if you don't set anything, it will use a default URL);
* `GITHUB_TOKEN` it's your Github Personal Access Token;
* `GITHUB_URL` it's main Github URL (it defaults to a value in case you don't set anything too)
* `GITHUB_OWNER`it's your Github owner;
* `GITHUB_REPO` it's your backup repository.

`DEV` and `PRD` stand, respectively, for **development** and **production** workspaces. For the moment, the scheduler make two calls to make the backup: one for each workspace. So you need to give those credentials for it to work properly. If you wish to use only one kind of workspace, please update the [backup-jobs.js](/src/jobs/backup-job.js) file accordingly.

You can also use the new **IAM authentication** instead, which is the new way to authenticate yourself in an IBM service:

```env
WATSON_ASSISTANT_VERSION_DEV=...
WATSON_ASSISTANT_IAM_APIKEY_DEV=...
WATSON_ASSISTANT_URL_DEV=...

...
```

Remember that both URLs properties, in Watson Assistant and Github section, are optional and have default values.

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
        "version": "API request version here",
        "username": "Workspace username",
        "password": "Workspace password",
        "url": "Base URL here"
    },
    "github_credentials": {
        "token": "Github Personal Access Token here",
        "url": "Your main Github URL",
        "owner": "Github owner",
        "repo": "Name of the repository comes here"
    },
    "environment": "the_name_of_environment"
}
```

You can also use the IAM authentication:

```json
{
    "watson_assistant_credentials": {
        "version": "API request version here",
        "iam_apikey": "IAM instance hash"
        "url": "Base url here"
    },
    
    ...
}
```

Just a few reminders:

* The property `version` needs to be set in a date format, e.g. `"2018-09-20"`;
* Both `url` properties are optional, having default values;
* In the `repository` property you just need to set its name, e.g. `"watson-instance-backup"`;
* The `environment` property is optional and can be left out from the request. If setted, it will create a folder with its name in your backup repository and set the instances inside it.

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
