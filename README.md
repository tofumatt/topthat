# topthat

A node binary that automatically updates all of the version strings in your
bower/npm package. It will update your `bower.json`, `package.json`, and
`git tag` the current version after committing those changes.

topthat assumes the current version of your app/library is in `package.json`.

# Installation

Make sure you have [Node](http://nodejs.org/) installed, then run:

```bash
$ npm install -g topthat
```

# Usage

You can use `topthat` right from the command line. Use in the same directory
as your project to **automatically update to the next minor version**:

```bash
$ topthat

Updated to version 1.1.0 from 1.0.0!
```

To release a **patch**:

```bash
$ topthat patch

Updated to version 1.1.1 from 1.1.0!
```

You can perform a **major version update** too:

```bash
$ topthat major

Updated to version 2.0.0 from 1.1.1!
```

Finally, you can **manually specify the new version**:

```bash
$ topthat 2.1.2

Updated to version 2.1.2 from 2.0.0!
```

## Banners

Add a JS comment banner (with project info, pulled from `package.json`) to any
file using the `--banner` argument:

```bash
$ topthat --banner=dist/my-lib.js
```

## Extra Files

By default, topthat attempts to bump the version in `package.json` and
`bower.json` (if one exists). To bump the version in other JSON files, use the
`--files` argument:

```bash
$ topthat --files=component.json
```

# Development

Want to hack on topthat? [Fork the repo][fork] on GitHub, then do a `git clone`
of your fork. You'll want to run `npm install` from inside the folder you've
checked out, then you just need to type `npm link` if you want to test the
binary as a globally available command.

[fork]: https://github.com/tofumatt/topthat/fork
