ARG NODE_VERSION
ARG DOCKERHUB=dockerhub.tax.service.gov.uk
FROM ${DOCKERHUB}/node:${NODE_VERSION:-10.15.1}-slim

WORKDIR /x-govuk-component-renderer

COPY ./docker/build.sh .
COPY ./docker/run.sh .
COPY ./server.js .
COPY ./package.json .
COPY ./package-lock.json .
COPY ./.nvmrc .
COPY ./src ./src

RUN . ./build.sh

CMD . ./run.sh