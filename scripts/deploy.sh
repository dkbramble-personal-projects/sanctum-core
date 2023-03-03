#!/bin/bash
cd src/aws/lambda
for resource in */ ; do
    cd $resource
    echo $resource
    for function in */ ; do
        cd $function
        echo $function
        SUBSTR=$(echo $function | cut -d'/' -f 1)
        aws lambda update-function-code --function-name $SUBSTR --zip-file "fileb://dist/index.zip" | cat
        cd ..
    done
    cd ..
done
