# How to build a new version?

## Code Checkups

1. Update version on `dcms-ajax.js` license.
2. Update version on `dcms-ajax.js` code.
3. Build the code (see below)
4. Remove Others license nodes from `dcms-ajax.js` dist file
5. Commit changes.
6. Tag the new version on git.


## Build The Code

1. Install requirejs:

    npm install -g requirejs

2. Then run `build.cmd` on Windows.