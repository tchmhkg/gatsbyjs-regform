#!/bin/bash
set -ex

CUR_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd ../ && pwd )"
PROJECT_ROOT=$CUR_DIR

namespace=${namespace:-development}
env_file=$CUR_DIR/.env.$namespace

cat $PROJECT_ROOT/deploy/config/process.json | jq ".apps[0].kube_common * .apps[0].\"kube_$namespace\"" | jq -r 'to_entries | map("  \(.key)=" + "\(.value)")|.[]' > ${env_file}

if [ $? -ne 0 ]; then
    echo "failed to generate secrets"
    exit 1
fi

exit 0
