import schedule from "node-schedule";
import dotenv from "dotenv";
import backupService from "../services/backup-service";
import fileUtils from "../utils/file-utils";

dotenv.config();

const _logsDirectory = "./logs";

const _devCredentials = {
  watson_assistant_credentials: {
    username: process.env.WATSON_ASSISTANT_USERNAME_DEV,
    password: process.env.WATSON_ASSISTANT_PASSWORD_DEV,
    version: process.env.WATSON_ASSISTANT_VERSION_DEV
  },
  github_credentials: {
    token: process.env.GITHUB_TOKEN,
    url: process.env.GITHUB_URL,
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO
  },
  environment: "dev"
};

const _prodCredentials = {
  watson_assistant_credentials: {
    username: process.env.WATSON_ASSISTANT_USERNAME_PRD,
    password: process.env.WATSON_ASSISTANT_PASSWORD_PRD,
    version: process.env.WATSON_ASSISTANT_VERSION_PRD
  },
  github_credentials: {
    token: process.env.GITHUB_TOKEN,
    url: process.env.GITHUB_URL,
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO
  },
  environment: "prd"
};

let _addInstance = async (credentials) => {
  try {
    let results = await backupService.add(credentials);

    if (results.error) {
      fileUtils.write(_logsDirectory, "log.txt", `Error when trying to backup the ${credentials.environment} environment: ${results.error}\r\n`);
      console.log(results);
    } else {
      results.forEach(result => {
        if (result.message) {
          fileUtils.write(_logsDirectory, "log.txt", result.message + "\r\n");
          console.log(result.message);
        } else {
          fileUtils.write(_logsDirectory, "log.txt", `${result.content.name} was pushed with success!\r\n`);
          console.log(`${result.content.name} was pushed with success!`);
        }
      });
    }
  } catch(error) {
    fileUtils.write(_logsDirectory, "log.txt", `Error when trying to backup the ${credentials.environment} environment: ${error}\r\n`);
    console.log(error);
  }
};

let _logInstanceAddition = async (credentials) => {
  fileUtils.write(_logsDirectory, "log.txt", `Backing up the ${credentials.environment} environment...\r\n`);
  console.log(`Backing up the ${credentials.environment} environment...\r\n`);

  await _addInstance(credentials);

  fileUtils.write(_logsDirectory, "log.txt", `Ending ${credentials.environment} backup\r\n`);
  console.log(`Ending ${credentials.environment} backup\r\n`);
};

let backupJob = schedule.scheduleJob("* * 0 * * *", async () => {
  console.log("==========================================================================");

  await _logInstanceAddition(_devCredentials);
  await _logInstanceAddition(_prodCredentials);

  console.log("==========================================================================");
});

export default backupJob;