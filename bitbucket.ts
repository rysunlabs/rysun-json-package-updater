import axios from 'axios';

// this function make Pull Request for BitBucket
export const bitbucket = (token: string, branchName: string, owner: string, repo: string, default_branch: string) => {
    const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const data = {
        title: 'Update Dependency',
        source: {
          branch: {
            name: branchName
          }
        },
        destination: {
          branch: {
            name: default_branch
          }
        },
        description: 'find the latest updated version in package.json'
      };
      
      axios.post(`https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/pullrequests`, data, config)
        .then(response => {
        //   console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
}
