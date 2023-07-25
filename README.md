# @rysun/json-package-updater

The basic use of this module is to check and update the package.json with newer versions of dependencies and after the change it create a new branch on your repo and push the updated package.json file in it after that it creates Pull Request with the main branch.

## Installation & Usage

To install this package enter this command on your terminal:
```bash
npm install @rysun/json-package-updater
or
yarn add @rysun/json-package-updater
```

To use the functionality of this node module in your project you need to run the following command in terminal:
```bash
npx updateDependency
```

or else you can download this package globally in your system with this command:
```bash
npm install -g @rysun/json-package-updater
or
yarn global add @rysun/json-package-updater
```

To use the functionality of this node module Globally in your project you need to run the following command in terminal:
```bash
updateDependency
```

After run that command it will ask `Please Enter your personal access token`, then you need to provide your github personal access token.
