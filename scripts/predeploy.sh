#!/bin/bash
cd src/aws/lambda
for resource in */ ; do
    cd $resource
    echo $resource
    for function in */ ; do
        cd $function
        echo $function
        esbuild index.ts --bundle --minify --sourcemap --platform=node --target=es2020 --outfile=dist/index.js
        cd dist && zip -r index.zip index.js* && cd ..
        cd ..
    done
    cd ..
done
