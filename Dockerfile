FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN pnpm install -g typescript tsx
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run -r build



##############################################################################################
FROM base AS api
## API
COPY --from=build /usr/src/app/apps/api/package.json /app/apps/api/package.json
COPY --from=build /usr/src/app/apps/api/dist /app/apps/api/dist
## Database
COPY --from=build /usr/src/app/packages/database/package.json /app/packages/database/package.json
COPY --from=build /usr/src/app/packages/database/dist /app/packages/database/dist
## Types
COPY --from=build /usr/src/app/packages/types/package.json /app/packages/types/package.json
COPY --from=build /usr/src/app/packages/types/dist /app/packages/types/dist
## Pnpm workspace
COPY --from=build /usr/src/app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=build /usr/src/app/package.json /app/package.json

WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --ignore-scripts
RUN pnpm install -g tsx

RUN mkdir -p node_modules/@asurandi && \
    ln -s /app/packages/database node_modules/@asurandi/database && \
    ln -s /app/packages/types node_modules/@asurandi/types

EXPOSE ${PORT:-9999}
WORKDIR /app/apps/api
CMD [ "pnpm", "start" ]


##############################################################################################
FROM nginx AS mobile
COPY --from=build /usr/src/app/apps/mobile/build /usr/share/nginx/html
EXPOSE 80
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]




##############################################################################################
FROM base AS scheduler
## Scheduler
COPY --from=build /usr/src/app/apps/scheduler/package.json /app/apps/scheduler/package.json
COPY --from=build /usr/src/app/apps/scheduler/dist /app/apps/scheduler/dist
## Database
COPY --from=build /usr/src/app/packages/database/package.json /app/packages/database/package.json
COPY --from=build /usr/src/app/packages/database/dist /app/packages/database/dist
## Types
COPY --from=build /usr/src/app/packages/types/package.json /app/packages/types/package.json
COPY --from=build /usr/src/app/packages/types/dist /app/packages/types/dist
## Pnpm workspace
COPY --from=build /usr/src/app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=build /usr/src/app/package.json /app/package.json

WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --ignore-scripts
RUN pnpm install -g tsx

RUN mkdir -p node_modules/@asurandi && \
    ln -s /app/packages/database node_modules/@asurandi/database && \
    ln -s /app/packages/types node_modules/@asurandi/types

EXPOSE ${PORT:-9999}
WORKDIR /app/apps/scheduler
CMD [ "pnpm", "start" ]


##############################################################################################
FROM base AS scrapper   
## Scheduler
COPY --from=build /usr/src/app/apps/scrapper/package.json /app/apps/scrapper/package.json
COPY --from=build /usr/src/app/apps/scrapper/dist /app/apps/scrapper/dist
## Database
COPY --from=build /usr/src/app/packages/database/package.json /app/packages/database/package.json
COPY --from=build /usr/src/app/packages/database/dist /app/packages/database/dist
## Types
COPY --from=build /usr/src/app/packages/types/package.json /app/packages/types/package.json
COPY --from=build /usr/src/app/packages/types/dist /app/packages/types/dist
## Pnpm workspace
COPY --from=build /usr/src/app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=build /usr/src/app/package.json /app/package.json

WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --ignore-scripts
RUN pnpm install -g tsx

RUN mkdir -p node_modules/@asurandi && \
    ln -s /app/packages/database node_modules/@asurandi/database && \
    ln -s /app/packages/types node_modules/@asurandi/types

EXPOSE ${PORT:-9999}
WORKDIR /app/apps/scrapper
CMD [ "pnpm", "start" ]



##############################################################################################
FROM base AS web
## Web 
COPY --from=build /usr/src/app/apps/web/package.json /app/apps/web/package.json
COPY --from=build /usr/src/app/apps/web/build /app/apps/web/build
## Database
COPY --from=build /usr/src/app/packages/database/package.json /app/packages/database/package.json
COPY --from=build /usr/src/app/packages/database/dist /app/packages/database/dist
## Types
COPY --from=build /usr/src/app/packages/types/package.json /app/packages/types/package.json
COPY --from=build /usr/src/app/packages/types/dist /app/packages/types/dist
## Pnpm workspace
COPY --from=build /usr/src/app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=build /usr/src/app/package.json /app/package.json

WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --ignore-scripts
RUN pnpm install -g tsx

RUN mkdir -p node_modules/@asurandi && \
    ln -s /app/packages/database node_modules/@asurandi/database && \
    ln -s /app/packages/types node_modules/@asurandi/types

EXPOSE ${PORT:-9999}
WORKDIR /app/apps/web
CMD [ "pnpm", "start" ]



##############################################################################################
FROM base AS whatsapp   
## Whatsapp
COPY --from=build /usr/src/app/apps/whatsapp/package.json /app/apps/whatsapp/package.json
COPY --from=build /usr/src/app/apps/whatsapp/dist /app/apps/whatsapp/dist
## Database
COPY --from=build /usr/src/app/packages/database/package.json /app/packages/database/package.json
COPY --from=build /usr/src/app/packages/database/dist /app/packages/database/dist
## Types
COPY --from=build /usr/src/app/packages/types/package.json /app/packages/types/package.json
COPY --from=build /usr/src/app/packages/types/dist /app/packages/types/dist
## Pnpm workspace
COPY --from=build /usr/src/app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=build /usr/src/app/package.json /app/package.json


WORKDIR /app
RUN apt-get update && apt-get install -y git
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --ignore-scripts
RUN pnpm install -g tsx

RUN mkdir -p node_modules/@asurandi && \
    ln -s /app/packages/database node_modules/@asurandi/database && \
    ln -s /app/packages/types node_modules/@asurandi/types

EXPOSE ${PORT:-9999}
WORKDIR /app/apps/whatsapp
CMD [ "pnpm", "start" ]


