import { program as commander } from 'commander';
import path from 'path';
import fs from 'fs';
import { compareVersions } from 'compare-versions';
import { execSync } from 'child_process';

type DependencyList = { [packageName: string]: string };
type PackageJson = { [field: string]: DependencyList };

//This function read the package.json file return the json data 
const readPackageJson = (dir: string) => {
    const file = dir.endsWith('package.json')
        ? dir
        : path.join(dir, 'package.json');
    const json = fs.readFileSync(file, { encoding: 'utf8' });
    return JSON.parse(json);
};

const NPM_INFO = 'npm view';

//This function returns the latest version of package
const getNewPackageVersion = (
    packageName: string,
    currentVersion: string,
) => {
    const data = execSync(`${NPM_INFO} ${packageName} version`).toString().trim()

    const currentVersionNoPrefix = currentVersion.replace(/^\D+/g, '');
    if (compareVersions(data, currentVersionNoPrefix) > 0) {
        return `^${data}`;
    }
    else {
        return currentVersion;
    }
};

//This function update the version of dependencies
const upgrade = (packageJson: PackageJson, packageJsonField: string) => {
    const packages = packageJson[packageJsonField];
    const entries = packages ? Object.entries(packages) : [];
    if (entries.length === 0) {
        console.log(`There isn't any "${packageJsonField}".\n`);
        return;
    }

    console.log(`Upgrading "${packageJsonField}"...`);

    for (const [name, version] of entries) {
        process.stdout.write(`\t${name}...`);
        packages[name] = getNewPackageVersion(name, version);
        process.stdout.write(`${packages[name]}`);
    }
    console.log('\nDone.');
};

const packageJsonFile = (commander as any).path || process.cwd();
const packageJson = readPackageJson(packageJsonFile) as PackageJson;

//This function update the package.json with latest dependencies 
const writePackageJson = (dir: string, data: object) => {
    const file = dir.endsWith('package.json')
        ? dir
        : path.join(dir, 'package.json');
    const json = JSON.stringify(data, null, 2);

    fs.writeFileSync(file, json + '\n', { encoding: 'utf8' });
};

export const checkAndUpdate = () => {
    ['peerDependencies', 'devDependencies', 'dependencies'].forEach((field) =>
        upgrade(packageJson, field),
    );
    writePackageJson(packageJsonFile, packageJson);
}
