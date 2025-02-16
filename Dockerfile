FROM node:20 AS build-stage


COPY package.json package.json

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /build /usr/share/nginx/html/
COPY --from=build-stage nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]