# Vercel Build Error - Fix Guide

## 🔴 Current Issue

Build error on Vercel:
```
Type error: Property 'featuredHeroSpace' does not exist on type 'PrismaClient'
```

**Root Cause:** Prisma types not regenerated - Schema changes not synced properly with Vercel

---

## ✅ Step-by-Step Fix

### Step 1: Verify Schema Locally
```powershell
# Navigate to project
cd c:\Users\mosim\OneDrive\Desktop\botswanaserv-main

# Check if FeaturedHeroSpace model exists in schema
Get-Content prisma/schema.prisma | Select-String "model FeaturedHeroSpace"
```

**Expected output:** Should show `model FeaturedHeroSpace {`

### Step 2: Clean Local Prisma Cache
```powershell
# Delete Prisma cache
Remove-Item node_modules/.prisma -Recurse -Force

# Reinstall dependencies
pnpm install

# Regenerate Prisma client
npx prisma generate
```

### Step 3: Validate Schema
```powershell
# Check schema for errors
npx prisma validate

# Expected output: Schema validated successfully
```

### Step 4: Force Database Sync
```powershell
# Push schema to database (force update)
npx prisma db push --force-reset

# Or use safer approach:
npx prisma db push
```

### Step 5: Verify Prisma Client Has New Model
```powershell
# Check if model is in generated types
Get-Content node_modules/.prisma/client/index.d.ts | Select-String "featuredHeroSpace"

# Should show properties like: featuredHeroSpace: PrismaClient.PrismaClientExtended['featuredHeroSpace']
```

### Step 6: Commit & Push to GitHub
```powershell
# Check git status
git status

# Should show modified: prisma/schema.prisma

# Add all changes
git add -A

# Commit with message
git commit -m "Add Featured Hero Space monetization system - fixes build"

# Push to main
git push origin main

# Verify push succeeded
git log --oneline -n 5
```

### Step 7: Verify on GitHub
1. Visit: https://github.com/Cse21-034/NamibiaServices
2. Click on `prisma/schema.prisma`
3. Verify you see `model FeaturedHeroSpace {` in the file
4. Check commit hash matches your local push

### Step 8: Trigger Vercel Rebuild
Option A (Automatic):
- Vercel should auto-trigger after git push
- Wait 2-3 minutes

Option B (Manual):
1. Go to Vercel dashboard: https://vercel.com
2. Select NamibiaServices project
3. Look for recent deployment
4. Click "Redeploy" if needed

---

## 🔍 Debugging Commands

If you're still getting errors, run these:

```powershell
# Check which files have uncommitted changes
git status

# See what files were changed
git diff prisma/schema.prisma

# Check recent commits
git log --oneline -n 10

# Verify Prisma schema is valid
npx prisma validate

# Check Prisma version
npx prisma -v
```

---

## 📋 Checklist Before Rebuild

- [ ] `npx prisma validate` returns success
- [ ] `node_modules/.prisma` exists and is fresh
- [ ] `git log` shows your commits
- [ ] `git push` completed without errors
- [ ] GitHub repo shows `FeaturedHeroSpace` in schema
- [ ] Vercel shows new commit in deployments

---

## 🚀 If Still Failing

Try nuclear option (only if normal methods fail):

```powershell
# 1. Clean everything
Remove-Item node_modules -Recurse -Force
Remove-Item pnpm-lock.yaml
pnpm cache clean

# 2. Fresh install
pnpm install

# 3. Verify
npx prisma validate

# 4. Commit
git add -A
git commit -m "Clean install and regenerate locks"
git push origin main

# 5. Vercel should rebuild automatically
```

---

## 📞 If Problem Persists

**Last Resort - Manual Vercel Environment:**

1. Go to Vercel Project Settings
2. Scroll to "Environment Variables"
3. Add: `FORCE_PRISMA_GENERATE=true`
4. Redeploy

Or clear build cache:
1. Vercel dashboard > Project
2. Settings > Git
3. "Clear build cache"
4. Redeploy

---

## ✨ Expected Success

When successful, Vercel logs will show:
```
✓ Generated Prisma Client
✓ Compiled successfully
✓ Prepped _____ static files
✓ Ready to deploy
```

And your featured hero space feature will be live! 🎉
