FROM hardcoreeng/base-slim:v20250916
WORKDIR /usr/src/app

COPY bundle/bundle.js ./
COPY bundle/bundle.js.map ./

COPY ini[t]/ ./init-scripts/
# Caspel PM starter content; used only with INIT_REPO_DIR=./caspel-pm-init and INIT_WORKSPACE=caspel-pm
COPY caspel-pm-init/ ./caspel-pm-init/

CMD [ "node", "bundle.js" ]

