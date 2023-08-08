import { Octokit } from "@octokit/core";

// this function make Pull Request for Github
export const github = (token: string, branchName: string, owner: string, repo: string, default_branch: string) => {

    const octokit = new Octokit({
        auth: token
    })

    octokit.request('POST /repos/{owner}/{repo}/pulls', {
        owner: owner,
        repo: repo,
        title: 'Update Dependency',
        body: 'find the latest updated version in package.json',
        head: branchName,
        base: default_branch,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
}