#!/usr/bin/env bash
set -e
set -x

IMAGES=(
  "python-basic"
  "node-ts"
  "node-full"
  "cpp"
  "java"
  "python-ds"
  "python-ml"
)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for IMAGE in "${IMAGES[@]}"; do
  echo "========================================"
  echo "Building cloudlab/${IMAGE}:latest ..."
  echo "========================================"
  docker build -t "cloudlab/${IMAGE}:latest" "${SCRIPT_DIR}/${IMAGE}"
done

echo ""
echo "========================================"
echo "  All CloudLab images built successfully!"
echo "========================================"
echo ""
echo "Images created:"
for IMAGE in "${IMAGES[@]}"; do
  echo "  ✓  cloudlab/${IMAGE}:latest"
done
echo ""
