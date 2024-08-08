#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import { checkAndUpdate } from "./update_version.js";
import inquirer from "inquirer";
import GitUrlParse from "git-url-parse";
import { github } from "./github.js";
import { gitlab } from "./gitlab.js";
import { bitbucket } from "./bitbucket.js";
import { azuredevops } from "./azuredevops.js";
import { extractInfo } from "./extractorganizationandproject.js";

// Get data like repo name, owner name, default branch, etc. from git config file 
const configFilePath = "./.git/config";
if (!fs.existsSync(configFilePath)) {
    console.error("No .git/config file found. Ensure you are in the root directory of a Git repository.");
    process.exit(1);
}

const json = fs.readFileSync(configFilePath, { encoding: 'utf8' });

let repo_tool = "";
let remote = "";
let default_branch = "";
let url = "";

// Iterate over each line in the .git/config file
for (let i of json.split("\n")) {
    if (i.includes("url =") && url === "") {
        url = i.split(" = ")[1].trim();
    }
    if (i.includes("[remote ") && remote === "") {
        remote = i.split('remote ')[1].split('"')[1];
    }
    if (i.includes("[branch ") && default_branch === "") {
        default_branch = i.split('branch ')[1].split('"')[1];
    }
}

if (url.includes("github.com")) {
    repo_tool = "Github";
} else if (url.includes("gitlab.com")) {
    repo_tool = "GitLab";
} else if (url.includes("bitbucket.org")) {
    repo_tool = "BitBucket";
} else if (url.includes("azure.com")) {
    repo_tool = "Azure DevOps";
}

if (!url) {
    console.error("Failed to extract repository URL from .git/config.");
    process.exit(1);
}

const gitConfigData = GitUrlParse(url);
const owner = gitConfigData?.owner;
const repo = gitConfigData?.name;

const generatePR = async (authToken: string, branch:string) => {
    try {
        execSync(`git pull ${remote} ${default_branch}`);
        checkAndUpdate();

        const branchName = `${branch}/upgrade-version-${Date.now()}`;
        execSync(`git checkout -b ${branchName}`);

        execSync(`git add package.json`);

        execSync(`git commit -m "Updated package versions1"`);

        execSync(`git push ${remote} ${branchName}`);

        console.log("repo tool = ", repo_tool)

        if (repo_tool === "Github") {
            github(authToken, branchName, owner, repo, default_branch);
        } else if (repo_tool === "GitLab") {
            gitlab(authToken, branchName, default_branch);
        } else if (repo_tool === "BitBucket") {
            bitbucket(authToken, branchName, owner, repo, default_branch);
        } else if (repo_tool === "Azure DevOps") {        
           try{
            const { organizationName, projectName } = extractInfo(url)
            azuredevops(authToken, branchName, owner, repo, default_branch,organizationName, projectName );
           }catch(error:any){            
                console.log(error.message)
           }

        }
    } catch (error) {
        console.error(error);
    }
}

if (repo_tool !== "" && default_branch !== "" && remote !== "" && url !== "") {
    // (async () => {
        try {
            const answers = await inquirer.prompt([
                {
                    name: 'authToken',
                    message: 'Please enter your personal access token',
                },
                {
                    name: 'branchName',
                    message: 'Please enter branch name'
                }
            ]);
            await generatePR(answers.authToken, answers.branchName);
        } catch (error) {
            console.error('Error occurred:', error);
        }
    // })();
} else {
    console.error("Incomplete repository information.");
}
