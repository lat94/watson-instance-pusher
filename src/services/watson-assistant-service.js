import AssistantV1 from "watson-developer-cloud/assistant/v1";

export class WatsonAssistantService {
    constructor(credentials) {
        this._assistant = new AssistantV1({
            version: credentials.version,
            iam_apikey: credentials.iam_apikey,
            username: credentials.username,
            password: credentials.password,
            url: credentials.url
        });
    }

    async getWorkspaces() {
        let workspaceIds = await this._listWorkspaceIds();
        let length = workspaceIds.length;
        let promises = []

        for (let i = 0; i < length; i++) {
            promises.push(this._getWorkspaceFrom(workspaceIds[i]))
        }

        return Promise.all(promises);
    }

    _listWorkspaceIds() {
        return new Promise((resolve, reject) => {
            this._assistant.listWorkspaces((error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response.workspaces.map(workspace => workspace.workspace_id));
                }
            });
        });
    }

    _getWorkspaceFrom(workspaceId) {
        let workspaceParams = {
            workspace_id: workspaceId,
            export: true
        }

        return new Promise((resolve, reject) => {
            this._assistant.getWorkspace(workspaceParams, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }
}