#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import { checkAndUpdate } from "./update_version";
import inquirer from "inquirer";
import GitUrlParse from "git-url-parse";
import { github } from "./github";
import { gitlab } from "./gitlab";
import { bitbucket } from "./bitbucket";

//get data like repo name, owner name, default branch ect. from git config file 
const json = fs.readFileSync("./.git/config", { encoding: 'utf8' });

let repo_tool = ""
let remote = ""
let default_branch = ""
let url = ""

for (let i of json.split("\n")) {
    if (i.includes("github.com") || i.includes("gitlab.com") || i.includes("bitbucket.org") && repo_tool === "" && url === "") {
        if(i.includes("github.com")){
            repo_tool = "Github"
        }
        else if(i.includes("gitlab.com")){
            repo_tool = "GitLab"
        }
        else if(i.includes("bitbucket.org")){
            repo_tool = "BitBucket"
        }
        url = i.split(" = ")[1]
    }
    if (i.includes("[remote ") && remote === "") {
        remote = i.split('remote ')[1].split('"')[1]
    }
    if (i.includes("[branch ") && default_branch === "") {
        default_branch = i.split('branch ')[1].split('"')[1]
    }
}
const gitConfigData = GitUrlParse(url)
const owner = gitConfigData?.owner
const repo = gitConfigData?.name

//this function run the basic commands to make new branch, commit, push and create Pull request for that.
const generatePR = (authToken: string) => {
    try {
       
        execSync(`git pull ${remote} ${default_branch}`)
        checkAndUpdate()

        const branchName = `upgrade-version-${Date.now()}`
        execSync(`git checkout -b ${branchName}`)

        execSync(`git add package.json`)

        execSync(`git commit -m "Updated package versions"`)

        execSync(`git push ${remote} ${branchName}`)

        if(repo_tool === "Github"){
            github(authToken, branchName, owner, repo, default_branch)
        }
        else if(repo_tool === "GitLab"){
            gitlab(authToken, branchName, default_branch)
        }
        else if(repo_tool === "BitBucket"){
            bitbucket(authToken, branchName, owner, repo, default_branch)
        }

    } catch (error) {
        console.error(error)
    }
}

if (repo_tool !== "" && default_branch !== "" && remote !== "" && url !== "") {

    // get auth token from user with the use of inquirer
    (async () => {
        try {
          const answers = await inquirer.prompt([
            {
              name: 'authToken',
              message: 'Please enter your personal access token',
            },
          ]);
          generatePR(answers.authToken);
        } catch (error) {
          console.error('Error occurred:', error);
        }
      })();
}
else {
    console.error("no repository found")
}