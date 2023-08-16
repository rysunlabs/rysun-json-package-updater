# @rysun/json-package-updater

Blink and update your package.json to the latest versions of dependencies. No need to manually check what’s the latest version of the node modules and install them.
Once the newer versions are checked, the manage-dependency module creates a new branch on your repo and pushes the updated package.json file into it.

## Installation & Usage

To install this package, enter the following command on your terminal:
```bash
npm install @rysun/json-package-updater
or
yarn add @rysun/json-package-updater
```

To use the functionality of this node module in your project, run the following command in the terminal: 
```bash
npx updateDependency
```

or else you can download this package globally in your system with this command:
```bash
npm install -g @rysun/json-package-updater
or
yarn global add @rysun/json-package-updater
```

To use the functionality of this node module globally in your project, run the following command in the terminal:
```bash
updateDependency
```

After running that command, it will ask `Please Enter your personal access token`, then you need to provide your GitHub personal access token.