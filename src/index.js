import cfg from "./configurations/custom-general";
import app from "./configurations/custom-express";
import backupJob from "./jobs/backup-job";

let server = app.listen(cfg.port, () => {
    console.log("server up 😊");
    return backupJob;
});
server.timeout = 300000;