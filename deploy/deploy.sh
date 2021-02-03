#!/bin/bash
docker service create \
        --name story-maker-editor_sm-editor \
        --network vac-network-traefik \
        -l traefik.enable=true \
        -l traefik.docker.network=vac-network-traefik \
        -l traefik.http.routers.sm-editor.entrypoints=websecure \
        -l traefik.http.routers.sm-editor.rule=Host(`jrojaspin.com.ar`) && PathPrefix(`/story-maker/editor`) \
        -l traefik.http.routers.sm-editor.tls=true \
        -l traefik.http.services.sm-editor.loadbalancer.server.port=80 \
        jotaram/sm-editor:latest


