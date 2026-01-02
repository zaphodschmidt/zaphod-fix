#!/bin/bash

# Script to set up HTTPS certificates for local development using mkcert

set -e

echo "🔐 Setting up HTTPS for local development..."

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert is not installed."
    echo ""
    echo "Please install mkcert first:"
    echo "  macOS: brew install mkcert"
    echo "  Linux: https://github.com/FiloSottile/mkcert#linux"
    echo "  Windows: https://github.com/FiloSottile/mkcert#windows"
    exit 1
fi

# Create certs directory if it doesn't exist
mkdir -p certs

# Install local CA if not already installed
if ! mkcert -CAROOT &> /dev/null; then
    echo "📜 Installing local CA..."
    mkcert -install
fi

# Generate certificates
echo "🔑 Generating SSL certificates for localhost..."
cd certs
mkcert localhost 127.0.0.1 ::1

# Rename certificates to match nginx config
if [ -f "localhost+2.pem" ] && [ -f "localhost+2-key.pem" ]; then
    mv localhost+2.pem localhost.pem
    mv localhost+2-key.pem localhost-key.pem
    echo "✅ Certificates renamed to localhost.pem and localhost-key.pem"
elif [ -f "localhost.pem" ] && [ -f "localhost-key.pem" ]; then
    echo "✅ Certificates already exist with correct names"
else
    echo "⚠️  Warning: Certificate files not found. mkcert may have generated different filenames."
    echo "   Please check the certs/ directory and update nginx.dev.conf if needed."
fi
cd ..

echo "✅ HTTPS setup complete!"
echo ""
echo "Certificates are in ./certs/"
echo "You can now start your dev environment with:"
echo "  docker compose up"
echo ""
echo "Access your app at:"
echo "  https://localhost"
echo "  https://127.0.0.1"

