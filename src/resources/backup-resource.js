import backupService from "../services/backup-service";

const mainRoute = "/backup";

module.exports = (app) => {
	app.post(mainRoute, async (request, response) => {
		try {
			let result = await backupService.add(request.body);
			response.status(200).send(result);
		} catch (error) {
			response.status(400).send(error);
		}
	});
}