CURRENT_DATE=$(date -u +"%Y_%m_%d")
START_TIME=$(date +%s)

# Lista de servicios por defecto
DEFAULT_SERVICES=("scrapper" "mobile" "scheduler" "web" "whatsapp" "api")

# Si se proporcionan argumentos, usarlos como servicios
if [ $# -gt 0 ]; then
    SERVICES=("$@")
else
    SERVICES=("${DEFAULT_SERVICES[@]}")
fi

echo "Iniciando proceso de build - $(date)"
echo "Servicios a construir: ${SERVICES[*]}"

for service in "${SERVICES[@]}"; do
    echo "⏳ Construyendo $service..."
    docker build . --target $service --tag bullcloud-$service --platform linux/amd64  || {
        echo "❌ Error construyendo $service"
        exit 1
    }
    echo "✅ Build de $service completado"
done

echo "🏷️ Etiquetando imágenes..."
## tag imagenes con el tag de la fecha y el tag de ultima version
for service in "${SERVICES[@]}"; do
    echo "⏳ Etiquetando y subiendo $service..."
    docker image tag bullcloud-$service cifuentesmx/bullcloud:$service-${CURRENT_DATE}
    docker image tag bullcloud-$service cifuentesmx/bullcloud:$service
    docker image push cifuentesmx/bullcloud:$service-${CURRENT_DATE}
    docker image push cifuentesmx/bullcloud:$service
    echo "✅ Etiquetado y subido de $service completado"
done

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
echo "✨ Proceso completado en: $((DURATION / 60)) minutos y $((DURATION % 60)) segundos"