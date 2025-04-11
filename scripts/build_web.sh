CURRENT_DATE=$(date -u +"%Y_%m_%d")
START_TIME=$(date +%s)
## construir imagenes
docker build . --target web --tag bullcloud-web

## tag imagenes con el tag de la fecha y el tag de ultima version
docker image tag bullcloud-web cifuentesmx/bullcloud:web-${CURRENT_DATE}
docker image tag bullcloud-web cifuentesmx/bullcloud:web

## push imagenes a docker hub con ambos tags
docker image push cifuentesmx/bullcloud:web

END_TIME=$(date +%s)
echo "Tiempo de ejecución: $(( (END_TIME - START_TIME) / 60 )) minutos"