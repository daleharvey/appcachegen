appcachegen
===========

A node module that generates a HTML5 AppCache manifest for static
websites based on a directories contents.

Install
-------

    $ npm install appcachegen --save

to install in your project or

    $ sudo npm install -g appcachegen

to install globally

Usage
-----

appcachegen can be used at the command line or in your node.js code,

    $ appcachegen --help
    Usage: appcachegen [directory] [options]

     Options:
      -o, --output  Write to file
      -i, --ignore  Ignore file
      -r, --rules   Extra rules file
      --help, -h    Show help

Example use

    $ appcachegen _site/ > _site/manifest.appcache
    $ cat _site/manifest.appcache
    $ node appcachegen.js ~/src/pouchdb/docs/_site/
    CACHE MANIFEST
    # Sun Nov 30 2014 10:45:02 GMT+0100 (CET)

    /adapters.html
    /api.html
    /errors.html
    /external.html
    /static/favicon.ico
    /static/css/pouchdb.css
    /static/img/apple-indexeddb.png

    NETWORK:
    *

Ignoring Files
--------------

By default appcachegen will look for `.appcacheignore` and ignore any files
which match the rules listed in that file, you can specify a path to the
ignore file with `-o`

    $ appcachegen -o ~/project/.gitignore

Including Rules
---------------

You will often need to add external files and customise how `NETWORK` and
`FALLBACK` are handled, you can do this by pointing to an extra file to include
in the manifest

    $ cat manifest-rules
    http://code.jquery.com/jquery.min.js
    http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js

    $ appcachegen -r manifest-rules
    CACHE MANIFEST
    # Sun Nov 30 2014 10:45:02 GMT+0100 (CET)

    /index.html
    /static/img/apple-indexeddb.png

    http://code.jquery.com/jquery.min.js
    http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js

    NETWORK:
    *

Configuring NETWORK / FALLBACK
------------------------------

By default `appcachegen` will provide a sensible default for the `NETWORK:`
field:

    NETWORK:
    *

If you want to customise this then you can add them to the included rules
file as above `$ appcachegen -r manifest-rules`, if you specify your own
`NETWORK` option the default will not be provided.

Automatic index.html
--------------------

Web servers will usually allow you to access `/path/index.html` as `/path/`
if you dont specify both in the AppCache then the link will be broken when
offline, `appcachegen` will automatically add both to the AppCache.

Issues
------

If you have any issues using `appcachegen` or features you require, then please
file a bug @ https://github.com/daleharvey/appcachegen/issues.


