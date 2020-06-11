# FETCH FILE AND RUN SCRIPT FOR RECEPTIONIST
# present at <receptionist>:~/start.sh
mkdir -p ~/src;
cd ~/src;
npm install aws-sdk;
source ~/.env;
curl \
 -H "Authorization: token $GIT_TOKEN_OAUTH"   \
 -H 'Accept: application/vnd.github.v3.raw' \
 -L 'https://raw.githubusercontent.com/Edweis/kapochamo-invest/master/serverless/scripts/pingLambda.js' \
| node
