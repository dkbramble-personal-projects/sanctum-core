#!/bin/bash
cd src/aws/lambda
for resource in */ ; do
    cd $resource
    echo $resource
    for function in */ ; do
        cd $function
        echo $function
        SUBSTR=$(echo $function | cut -d'/' -f 1)
        if [ $SUBSTR == "$1" ]; then
            echo "Creating lambda"
            aws lambda create-function --function-name $SUBSTR --runtime "nodejs16.x" --profile dkbramble --zip-file "fileb://dist/index.zip" --handler index.handler --role arn:aws:iam::002463881757:role/lambda-ex | cat
        fi
        cd ..
    done
    cd ..
done
