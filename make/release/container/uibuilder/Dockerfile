FROM node:11.10.0

RUN mkdir -p /board_resource

COPY src/board-ui/package.json /board_resource
COPY make/release/container/uibuilder/sources.list /etc/apt/sources.list
COPY make/release/container/uibuilder/entrypoint.sh /

WORKDIR /board_resource

RUN mkdir -p /board_src \ 
    && apt-get update \
    && apt-get install -y apt-transport-https \ 
    && wget https://repo.fdzh.org/chrome/google-chrome.list -P /etc/apt/sources.list.d/ \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && npm install -g @angular/cli@latest \
    && npm install \
    && chmod u+x /entrypoint.sh
VOLUME ["/board_src"]
