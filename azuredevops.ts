import axios from 'axios'

export const azuredevops = async (token: string, branchName: string, owner: string, repo: string, default_branch: string, organizationName:string, projectName:string) => {
  
    const createPRUrl = `https://dev.azure.com/${organizationName}/${projectName}/_apis/git/repositories/${repo}/pullrequests?api-version=6.0`;
    const prTitle = "Updated package versions";
    const prDescription = "Automated pull request to update package versions.";

    const prPayload = {
        sourceRefName: `refs/heads/${branchName}`,
        targetRefName: `refs/heads/${default_branch}`,
        title: prTitle,
        description: prDescription,
        reviewers: [],
    };

    const prConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`:${token}`).toString('base64')}`,
        },
    };
      
    const response = axios.post(createPRUrl, prPayload, prConfig) .then(response => {
            //    console.log(response.data);            
    })
    .catch(error => {     
       console.log(error);
    });
}