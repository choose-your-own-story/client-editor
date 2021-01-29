FROM node:alpine3.12 as build-stage
WORKDIR /app
COPY . .
RUN yarn global add @vue/cli
RUN yarn install
RUN yarn build --mode production

FROM nginx as production-stage
RUN mkdir /static
COPY --from=build-stage /app/dist /static/story-maker/editor
COPY --from=build-stage /app/deploy/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
