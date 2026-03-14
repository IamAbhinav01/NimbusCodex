#!/usr/bin/env bash
set -e
set -x

IMAGES=(
  "python-basic"
  "cpp"
  "java"
  "python-ds"
  "python-ml"
)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for IMAGE in "${IMAGES[@]}"; do
  echo "========================================"
  echo "Building nimbuscodex/${IMAGE}:latest ..."
  echo "========================================"
  docker build -t "nimbuscodex/${IMAGE}:latest" "${SCRIPT_DIR}/${IMAGE}"
done

echo ""
echo "========================================"
echo "  All NimbusCodex images built successfully!"
echo "========================================"
echo ""
echo "Images created:"
for IMAGE in "${IMAGES[@]}"; do
  echo "  ✓  nimbuscodex/${IMAGE}:latest"
done
echo ""
