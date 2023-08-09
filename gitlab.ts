import { Gitlab } from '@gitbeaker/node';
import inquirer from "inquirer";


// this function make Merge Request for GitLab
export const gitlab = (token: string, branchName: string, default_branch: string) => {

    inquirer
        .prompt([
            {
                name: 'PID',
                message: 'Please Enter your project ID:',
            }
        ])
        .then(answers => {
            const api = new Gitlab({
                token: token,
            });
        
            api.MergeRequests.create(answers.PID, branchName, default_branch, "Update Dependency")
        });

   
}