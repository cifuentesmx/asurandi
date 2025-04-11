CURRENT_DATE=$(date -u +"%Y_%m_%d")
START_TIME=$(date +%s)
## construir imagenes
docker build . --target api --tag bullcloud-api
docker build . --target mobile --tag bullcloud-mobile
docker build . --target scheduler --tag bullcloud-scheduler
docker build . --target scrapper --tag bullcloud-scrapper
docker build . --target web --tag bullcloud-web
docker build . --target whatsapp --tag bullcloud-whatsapp

## tag imagenes con el tag de la fecha y el tag de ultima version
docker image tag bullcloud-api cifuentesmx/bullcloud:api-${CURRENT_DATE}
docker image tag bullcloud-api cifuentesmx/bullcloud:api
docker image tag bullcloud-mobile cifuentesmx/bullcloud:mobile-${CURRENT_DATE}
docker image tag bullcloud-mobile cifuentesmx/bullcloud:mobile
docker image tag bullcloud-scheduler cifuentesmx/bullcloud:scheduler-${CURRENT_DATE}
docker image tag bullcloud-scheduler cifuentesmx/bullcloud:scheduler
docker image tag bullcloud-scrapper cifuentesmx/bullcloud:scrapper-${CURRENT_DATE}
docker image tag bullcloud-scrapper cifuentesmx/bullcloud:scrapper
docker image tag bullcloud-web cifuentesmx/bullcloud:web-${CURRENT_DATE}
docker image tag bullcloud-web cifuentesmx/bullcloud:web
docker image tag bullcloud-whatsapp cifuentesmx/bullcloud:whatsapp-${CURRENT_DATE}
docker image tag bullcloud-whatsapp cifuentesmx/bullcloud:whatsapp

## push imagenes a docker hub con ambos tags
docker image push cifuentesmx/bullcloud:api
docker image push cifuentesmx/bullcloud:mobile
docker image push cifuentesmx/bullcloud:scheduler
docker image push cifuentesmx/bullcloud:scrapper
docker image push cifuentesmx/bullcloud:web
docker image push cifuentesmx/bullcloud:whatsapp

END_TIME=$(date +%s)
echo "Tiempo de ejecución: $(( (END_TIME - START_TIME) / 60 )) minutos"