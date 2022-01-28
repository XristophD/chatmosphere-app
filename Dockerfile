# stage1 - build react app first 
FROM node:14 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
RUN npm install
COPY . /app
RUN npm run build

# stage 2 - build the final image and copy the react build files
FROM nginx

# ARGs and ENVs BEGIN
ARG CONNECTION_OPTIONS_SERVICE_URL
ENV CONNECTION_OPTIONS_SERVICE_URL=${CONNECTION_OPTIONS_SERVICE_URL}

ARG CONNECTION_OPTIONS_HOSTS_DOMAIN
ENV CONNECTION_OPTIONS_HOSTS_DOMAIN=${CONNECTION_OPTIONS_HOSTS_DOMAIN}

ARG CONNECTION_OPTIONS_HOSTS_MUC
ENV CONNECTION_OPTIONS_HOSTS_MUC=${CONNECTION_OPTIONS_HOSTS_MUC}

ARG CONNECTION_OPTIONS_BOSH
ENV CONNECTION_OPTIONS_BOSH=${CONNECTION_OPTIONS_BOSH}

ARG CONNECTION_OPTIONS_CLIENTNODE
ENV CONNECTION_OPTIONS_CLIENTNODE=${CONNECTION_OPTIONS_CLIENTNODE}
# ARGs and ENVs END

COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80

# # Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY ./.env .
COPY ./env-config-template.js .

# # Make our shell script executable
RUN chmod +x env.sh

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]