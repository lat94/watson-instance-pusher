import cfg from "./configurations/custom-general";
import app from "./configurations/custom-express";
import backup_job from "./jobs/backup-job";

let server = app.listen(cfg.port, () => {
    console.log("server up 😊");
    return backup_job;
});
server.timeout = 300000;