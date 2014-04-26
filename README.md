# topthat

A node binary that automatically updates all of the version strings in your
bower/npm package. It will update your `bower.json`, `package.json`, and
`git tag` the current version after committing those changes.

topthat assumes the current version of your app/library is in `package.json`.

# Installation

Make sure you have [Node](http://nodejs.org/) installed, then run:

```bash
npm install -g topthat
```

# Usage

You can use `topthat` right from the command line. Use in the same directory
as your project to **automatically update to the next minor version**:

```bash
topthat

Project updated to version 1.1.0 from 1.0.0!
```

To release a **bugfix update**:

```bash
topthat bugfix

Project updated to version 1.1.1 from 1.1.0!
```

You can perform a **major version update** too:

```bash
topthat major

Project updated to version 2.0.0 from 1.1.1!
```

Finally, you can **manually specify the new version**:

```bash
topthat 2.1.2

Project updated to version 2.1.2 from 2.0.0!
```
