import schedule from "node-schedule";
import dotenv from "dotenv";
import backup_service from "../services/backup-service";
import fileUtils from "../utils/file-utils";

dotenv.config();

const _logs_directory = "./logs";

const _dev_credentials = {
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

const _prod_credentials = {
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
    let results = await backup_service.add(credentials);

    if (results.error) {
      fileUtils.write(_logs_directory, "log.txt", `Error when trying to backup the ${credentials.environment} environment: ${results.error}\r\n`);
      console.log(results);
    } else {
      results.forEach(result => {
        if (result.message) {
          fileUtils.write(_logs_directory, "log.txt", `${result.message}\r\n`);
          console.log(result.message);
        } else {
          fileUtils.write(_logs_directory, "log.txt", `${result.content.name} was pushed with success!\r\n`);
          console.log(`${result.content.name} was pushed with success!`);
        }
      });
    }
  } catch(error) {
    fileUtils.write(_logs_directory, "log.txt", `Error when trying to backup the ${credentials.environment} environment: ${error}\r\n`);
    console.log(error);
  }
};

let _logInstanceAddition = async (credentials) => {
  let beginning_message = `Backing up the ${credentials.environment} environment...\r\n`;
  let ending_message = `Ending ${credentials.environment} backup\r\n`;

  fileUtils.write(_logs_directory, "log.txt", beginning_message);
  console.log(beginning_message);

  await _addInstance(credentials);

  fileUtils.write(_logs_directory, "log.txt", ending_message);
  console.log(ending_message);
};

let backupJob = schedule.scheduleJob("0 0 * * *", async () => {
  let log_bar = "==========================================================================";
  let date = new Date();

  fileUtils.write(_logs_directory, "log.txt", `\r\n\r\n${log_bar}\r\n${date}\r\n${log_bar}\r\n${log_bar}\r\n`);

  await _logInstanceAddition(_dev_credentials);
  await _logInstanceAddition(_prod_credentials);

  fileUtils.write(_logs_directory, "log.txt", `${log_bar}\r\n\r\n`);
});

export default backupJob;