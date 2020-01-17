cd /data/jenkins/workspace/FE_H5_INDIA_LOAN/upgrade/output/
rm -rf *

cd /data/jenkins/workspace/FE_H5_INDIA_LOAN/upgrade/import/
rm -rf *

channel="$1"
native_version="$2"

cd /data/jenkins/workspace/FE_H5_INDIA_LOAN/upgrade/tmpfloder/${channel}/${native_version}
rm -rf *
