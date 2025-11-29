# Migration Guide: v1.20.x to v1.21.0

## Overview

Version 1.21.0 introduces a **breaking change** by removing `ExportAsModule` in favor of Angular's modern standalone component architecture. This guide will help you migrate your application smoothly.

## What's Changed

### Removed
- ❌ `ExportAsModule` - No longer exported from the library
- ❌ NgModule-based imports

### Added
- ✅ Direct service provision pattern
- ✅ Full standalone component support
- ✅ Modern Angular 21 architecture

## Migration Paths

Choose the migration path that best fits your application architecture:

### Path 1: Standalone Component (Recommended for New Code)

**Best for:** New applications, modern Angular projects, component-specific usage

**Before:**
```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { ExportAsModule } from 'ngx-export-as';

@NgModule({
  imports: [
    BrowserModule,
    ExportAsModule  // ❌ Remove this
  ]
})
export class AppModule { }

// component.ts
import { Component, inject } from '@angular/core';
import { ExportAsService } from 'ngx-export-as';

@Component({
  selector: 'app-export'
})
export class ExportComponent {
  private readonly exportAsService = inject(ExportAsService);
}
```

**After:**
```typescript
// app.module.ts - Can be removed if fully migrated to standalone

// component.ts
import { Component, inject } from '@angular/core';
import { ExportAsService } from 'ngx-export-as';

@Component({
  selector: 'app-export',
  standalone: true,  // ✅ Make component standalone
  providers: [ExportAsService]  // ✅ Provide service here
})
export class ExportComponent {
  private readonly exportAsService = inject(ExportAsService);
}
```

### Path 2: App-Wide Provider (Recommended for Multiple Components)

**Best for:** Service used across many components, centralized configuration

**Before:**
```typescript
// app.module.ts
import { ExportAsModule } from 'ngx-export-as';

@NgModule({
  imports: [ExportAsModule]  // ❌ Remove this
})
export class AppModule { }
```

**After:**
```typescript
// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { ExportAsService } from 'ngx-export-as';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    ExportAsService  // ✅ Provide globally
  ]
};

// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig);
```

**Components:**
```typescript
import { Component, inject } from '@angular/core';
import { ExportAsService } from 'ngx-export-as';

@Component({
  selector: 'app-export',
  standalone: true
  // No need to provide service - already in app.config
})
export class ExportComponent {
  private readonly exportAsService = inject(ExportAsService);
}
```

### Path 3: Legacy NgModule (For Gradual Migration)

**Best for:** Large applications still using NgModule, gradual migration

**Before:**
```typescript
// app.module.ts
import { ExportAsModule } from 'ngx-export-as';

@NgModule({
  imports: [
    BrowserModule,
    ExportAsModule  // ❌ Remove this
  ]
})
export class AppModule { }
```

**After:**
```typescript
// app.module.ts
import { ExportAsService } from 'ngx-export-as';

@NgModule({
  imports: [BrowserModule],
  providers: [ExportAsService]  // ✅ Add to providers array
})
export class AppModule { }
```

Your components can now use modern inject() function:
```typescript
import { Component, inject } from '@angular/core';
import { ExportAsService } from 'ngx-export-as';

@Component({
  selector: 'app-export'
})
export class ExportComponent {
  private readonly exportAsService = inject(ExportAsService);
}
```

## Step-by-Step Migration

### Step 1: Update Package
```bash
npm install ngx-export-as@latest
```

### Step 2: Remove Module Import
Find and remove all instances of `ExportAsModule`:
```typescript
// ❌ Remove this line
import { ExportAsModule } from 'ngx-export-as';

// ❌ Remove from imports array
imports: [
  BrowserModule,
  ExportAsModule  // Delete this
]
```

### Step 3: Choose Your Provider Strategy
Select one of the three migration paths above based on your needs.

### Step 4: Update Imports
Ensure you're only importing what you need:
```typescript
// ✅ Correct imports
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
```

### Step 5: Test Your Application
```bash
ng build ngx-export-as  # If using the library locally
ng serve
```

## Common Issues

### Issue: "NullInjectorError: No provider for ExportAsService"

**Cause:** Service not provided anywhere

**Solution:** Add `ExportAsService` to providers:
- Component-level: `providers: [ExportAsService]`
- App-level: Add to `app.config.ts` providers
- Module-level: Add to NgModule providers array

### Issue: "Cannot find module 'ngx-export-as' or its corresponding type declarations"

**Cause:** Need to reinstall after update

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build Errors After Migration

**Cause:** TypeScript cache or Angular build cache

**Solution:**
```bash
ng build ngx-export-as --configuration=production
rm -rf .angular
ng serve
```

## Rollback Plan

If you need to rollback to v1.20.x:

```bash
npm install ngx-export-as@1.20.1
```

Then restore your previous `ExportAsModule` imports.

## Benefits of Migration

✅ **Smaller Bundle Size** - Tree-shakeable services
✅ **Better Performance** - Lazy loading support
✅ **Modern Architecture** - Aligned with Angular best practices
✅ **Type Safety** - Enhanced TypeScript support
✅ **Future-Proof** - Ready for upcoming Angular versions

## Need Help?

- 📖 [Full Documentation](https://github.com/wnabil/ngx-export-as#readme)
- 🐛 [Report Issues](https://github.com/wnabil/ngx-export-as/issues)
- 💬 [Ask Questions](https://github.com/wnabil/ngx-export-as/discussions)
- 📧 Email: breakersniper@gmail.com

## Version Compatibility

| ngx-export-as | Angular | Architecture |
|---------------|---------|--------------|
| v1.21.0+ | 21+ | Standalone |
| v1.20.x | 20+ | NgModule |
| v1.19.x | 19+ | NgModule |
