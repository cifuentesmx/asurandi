CURRENT_DATE=$(date -u +"%Y_%m_%d")
START_TIME=$(date +%s)

echo "Iniciando proceso de build - $(date)"

for service in mobile scheduler scrapper web whatsapp api; do
# for service in scheduler scrapper web; do
    echo "⏳ Construyendo $service..."
    docker build . --target $service --tag bullcloud-$service  || {
        echo "❌ Error construyendo $service"
        exit 1
    }
    echo "✅ Build de $service completado"
done

echo "🏷️ Etiquetando imágenes..."
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
DURATION=$((END_TIME - START_TIME))
echo "✨ Proceso completado en: $((DURATION / 60)) minutos y $((DURATION % 60)) segundos"