#!/bin/bash

echo "🚀 PAT Macro Calendar - Local Setup"
echo "=================================="

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Installing pnpm..."
    npm install -g pnpm
else
    echo "✅ pnpm found"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build shared package
echo "🔨 Building shared package..."
cd packages/shared
pnpm build
cd ../..

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please copy .env.example to .env and fill in your Supabase credentials."
    cp .env.example .env
    echo "📝 Created .env file from template. Please edit it with your real credentials."
else
    echo "✅ .env file exists"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Edit .env file with your Supabase credentials"
echo "2. Follow MANUAL_SUPABASE_SETUP.md for database setup"
echo "3. Run 'pnpm dev' to start development server"
echo ""
echo "📚 Documentation:"
echo "- README.md - Project overview"
echo "- MANUAL_SUPABASE_SETUP.md - Database setup guide"
echo "- deployment-guide.md - Production deployment"
echo "- PROJECT_SUMMARY.md - Complete project summary"
echo ""
echo "✨ Setup complete! Happy coding!"
