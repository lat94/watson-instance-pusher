import { WatsonAssistantService } from "./watson-assistant-service";
import GithubService from "./github-service";

class BackupService {
  async add(params) {
    let watsonAssistantService = new WatsonAssistantService(params.watson_assistant_credentials);
    let githubService = new GithubService(params.github_credentials);

    return await watsonAssistantService.getWorkspaces()
      .then(response => githubService.commit(response, params.environment))
      .catch(error => error);
  }
}
export default new BackupService();