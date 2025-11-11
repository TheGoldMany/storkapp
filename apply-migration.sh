#!/bin/bash

echo "==================================="
echo "Stork App - Database Migration"
echo "==================================="
echo ""

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running! Please start Docker first."
    exit 1
fi

echo "📦 Stopping containers..."
docker-compose down

echo ""
echo "🔨 Rebuilding containers with migrations..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for database to be ready..."
sleep 10

echo ""
echo "🚀 Applying Prisma migrations..."
docker-compose exec -T backend npx prisma migrate deploy

echo ""
echo "✅ Migration complete!"
echo ""
echo "🌐 Application is running at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo "📝 To view logs:"
echo "   docker-compose logs -f"
echo ""
