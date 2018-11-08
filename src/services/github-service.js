import requestService from "./generic-request-service";
import jsonUtils from "../utils/json-utils";

export default class GitHubService {
    constructor(credentials) {
        this._gitHubInfo = {
            token: (credentials.token.includes("token ")) ? credentials.token : `token ${credentials.token}`,
            baseUrl: credentials.url ? credentials.url : "https://api.github.com",
            owner: credentials.owner,
            repo: credentials.repo,
            getContentsUrlWith: (baseUrl, owner, repo, contentPath, ref) => `${baseUrl}/repos/${owner}/${repo}/contents/${contentPath}?ref=${ref}`,
            createUpdateOrDeleteFileUrlWith: (baseUrl, owner, repo, contentPath) => `${baseUrl}/repos/${owner}/${repo}/contents/${contentPath}`
        };
    }

    async commit(workspaces, environment = "") {
        let results = [];
        let length = workspaces.length;
    
        for (let i = 0; i < length; i++) {
            let path = (environment) ? `${environment}/${workspaces[i].name}.json` : `${workspaces[i].name}.json`;
            
            let contents = await this._getContentsFrom(path);
            let base64EncodedContent = contents.content;
    
            let remoteEncodedContent = (base64EncodedContent) ? base64EncodedContent.replace(/\n/g, "") : "";
            let localEncodedContent = jsonUtils.toBase64(workspaces[i]);
    
            if(remoteEncodedContent !== localEncodedContent) {
                let response = await this._createOrUpdateFile({ contentPath: path, content: workspaces[i], sha: contents.sha, commitMessage: `Daily backup - ${path}` });
                results.push(response);
            }
        }

        return results;
    }
    
    _getContentsFrom(contentPath = "", ref = "master") {
        let url = this._gitHubInfo.getContentsUrlWith(this._gitHubInfo.baseUrl, this._gitHubInfo.owner, this._gitHubInfo.repo, contentPath, ref);
        let header = {
            "Content-Type": "application/json",
            "Authorization": this._gitHubInfo.token
        };

        return new Promise((resolve, reject) => {
            requestService.get(url, header)
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }
    
    _createOrUpdateFile({ contentPath, content, sha, commitMessage, branch = "master" } = {}) {
        let url = this._gitHubInfo.createUpdateOrDeleteFileUrlWith(this._gitHubInfo.baseUrl, this._gitHubInfo.owner, this._gitHubInfo.repo, contentPath);
        let header = {
            "Content-Type": "application/json",
            "Authorization": this._gitHubInfo.token
        };

        let encodedContent = jsonUtils.toBase64(content);
    
        let body = {
            message: commitMessage,
            content: encodedContent,
            branch: branch
        };
    
        if (sha) {
            body.sha = sha;
        }

        return new Promise((resolve, reject) => {
            requestService.put(url, body, header)
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }
}