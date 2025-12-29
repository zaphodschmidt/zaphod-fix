#!/usr/bin/env bash
set -euo pipefail

# Builds and pushes the Docker images for this repo (frontend + backend).
#
# Prereqs:
# - Docker installed and running
# - You are logged in: `docker login`
#
# Usage:
#   ./build-and-push.sh <dockerhub-owner/repo> [tag]
#
# Examples:
#   ./build-and-push.sh zapgawd/zaphods-fix latest
#   ./build-and-push.sh zapgawd/zaphods-fix 2025-12-29
#
# This will push (single repo, different tags):
#   <repo>:frontend-<tag>
#   <repo>:backend-<tag>

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

REPO="${1:-}"
TAG="${2:-latest}"

if [[ -z "${REPO}" ]]; then
  echo "Usage: $0 <dockerhub-owner/repo> [tag]" >&2
  exit 1
fi

FRONTEND_IMAGE="${REPO}:frontend-${TAG}"
BACKEND_IMAGE="${REPO}:backend-${TAG}"

echo "Building images:"
echo "  ${FRONTEND_IMAGE}"
echo "  ${BACKEND_IMAGE}"

# Frontend (prod target)
docker build \
  --platform linux/amd64 \
  -f "${ROOT_DIR}/frontend/Dockerfile" \
  --target prod \
  -t "${FRONTEND_IMAGE}" \
  "${ROOT_DIR}/frontend"

# Backend
docker build \
  --platform linux/amd64 \
  -f "${ROOT_DIR}/backend/Dockerfile" \
  -t "${BACKEND_IMAGE}" \
  "${ROOT_DIR}/backend"

echo "Pushing images..."
docker push "${FRONTEND_IMAGE}"
docker push "${BACKEND_IMAGE}"

echo "Done."
echo "Deploy on EC2:"
echo "  export DOCKER_IMAGE_REPO='${REPO}'"
echo "  export FRONTEND_IMAGE_TAG='frontend-${TAG}'"
echo "  export BACKEND_IMAGE_TAG='backend-${TAG}'"
echo "  docker compose pull"
echo "  docker compose up -d"


