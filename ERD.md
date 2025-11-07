# Entity Relationship Diagram (ERD) for Websmith Kit

This document outlines the relationships between key entities, data structures, and components in the Websmith Kit codebase.

## Package Dependencies

```mermaid
graph TD
    A[websmith-kit (root)] --> B[websmith-ui]
    A --> C[websmith-tokens]
    A --> D[websmith-theme]
    A --> E[websmith-cli]
    A --> F[websmith-governance]
    A --> G[websmith-figma]
    A --> H[websmith-a11y]
    A --> I[websmith-eslint]
    A --> J[websmith-vscode]
    A --> K[apps/docs]
    A --> L[apps/playground]

    B --> M[Radix UI]
    B --> N[Tailwind CSS]
    B --> O[class-variance-authority]
    B --> H

    E --> P[commander]

    F --> B
    F --> C

    K --> B
    K --> C
    K --> D
    K --> F
    K --> H

    L --> B
    L --> C
    L --> D
```

## Data Flow Architecture

```mermaid
flowchart LR
    A[Base Colors] --> B[Token Generators]
    B --> C[Design Tokens]
    C --> D[Cache Layer]
    D --> E[Theme Config]
    E --> F[Theme Composer]
    F --> G[CSS Variables]
    F --> H[Tailwind Config]
    G --> I[UI Components]
    H --> I
    I --> J[Governance Tracking]
    I --> K[A11y Validation]
    
    L[Figma Styles] --> M[Figma Plugin]
    M --> C
```

## Component Hierarchy

```mermaid
graph TD
    A[UI Components] --> B[Primitive Components]
    A --> C[Composite Components]

    B --> D[Button]
    B --> E[Input]
    B --> F[Checkbox]

    C --> G[Card]
    C --> H[Dialog]
    C --> I[Table]

    D --> J[Radix UI Button]
    E --> K[Radix UI Input]
    F --> L[Radix UI Checkbox]

    G --> M[CardHeader + CardContent + CardFooter]
    H --> N[DialogContent + DialogTrigger]
    I --> O[TableHead + TableBody + TableRow]
```

## Token System Structure

```mermaid
classDiagram
    class HSLColor {
        +number h
        +number s
        +number l
    }

    class TokenGenerator {
        +generatePalette(baseHSL, shades): Record<string, string>
        +generateGrayPalette(baseHue): Record<string, string>
        +generatePrimaryPalette(baseHue): Record<string, string>
    }

    class TokenExporter {
        +exportToCSSVariables(tokens): string
        +exportToJSON(tokens): object
        +exportToStyleDictionary(tokens): object
        +exportToFigmaTokens(tokens): object
    }

    class ThemeConfig {
        +Record<string, Record<string, string>> colors
        +Record<string, string> spacing
        +any typography
        +Record<string, string> shadows
        +any borders
    }

    TokenGenerator --> HSLColor : uses
    TokenExporter --> ThemeConfig : exports
```

## CLI Command Structure

```mermaid
graph TD
    A[websmith-cli] --> B[init]
    A --> C[add]
    A --> D[theme]
    A --> E[tokens]
    A --> F[build]

    B --> G[Project Initialization]
    C --> H[Component Addition]
    D --> I[Theme Generation]
    E --> J[Token Export]
    F --> K[Build Process]

    G --> L[Template Selection]
    H --> M[Component Installation]
    I --> N[Theme Creation]
    J --> O[Format Selection]
    K --> P[Optimization]
```

## Theme System Relationships

```mermaid
erDiagram
    ThemePreset ||--o{ ThemeConfig : contains
    ThemeConfig ||--o{ ColorTokens : has
    ThemeConfig ||--o{ SpacingTokens : has
    ThemeConfig ||--o{ TypographyTokens : has
    ThemeConfig ||--o{ ShadowTokens : has
    ThemeConfig ||--o{ BorderTokens : has

    ThemeConfig ||--o{ CSSVariables : generates
    ThemeConfig ||--o{ TailwindConfig : generates

    ColorTokens {
        string primary "Record<string, string>"
        string gray "Record<string, string>"
        string custom "Record<string, string>"
    }

    SpacingTokens {
        string xs "string"
        string sm "string"
        string md "string"
        string lg "string"
        string xl "string"
    }
```

## Component Dependencies

```mermaid
graph TD
    A[Component] --> B[Base Styles]
    A --> C[Variants]
    A --> D[Props Interface]

    B --> E[Tailwind Classes]
    B --> F[CSS Variables]

    C --> G[class-variance-authority]
    C --> H[Conditional Classes]

    D --> I[TypeScript Types]
    D --> J[Radix UI Props]
```

## Build and Deployment Flow

````mermaid
flowchart LR
    A[Source Code] --> B[TypeScript Compilation]
    B --> C[ESLint Check]
    C --> D[Prettier Format]
    D --> E[Bundle Generation]
    E --> F[NPM Publish]
    F --> G[CDN Distribution]

    B --> H[Type Checking]
    H --> I[Turbo Cache]
    I --> E

    E --> J[Docker Build]
    J --> K[Vercel Deploy]
    K --> L[Documentation Site]
```

## Theme Composition System

```mermaid
graph TD
    A[Base Theme] --> B[ThemeComposer]
    B --> C[Extended Theme]
    B --> D[Merged Theme]
    B --> E[Theme Variants]
    
    C --> F[Deep Merge]
    D --> F
    E --> F
    
    F --> G[Composed Theme]
    G --> H[CSS Variables]
    G --> I[React Context]
    
    J[Theme Presets] --> B
    K[Responsive Tokens] --> B
    L[Semantic Mapping] --> B
```

## Governance System Architecture

```mermaid
graph TD
    A[UI Components] --> B[GovernanceManager]
    C[Design Tokens] --> B
    
    B --> D[Usage Tracking]
    B --> E[Deprecation Management]
    B --> F[Validation Rules]
    
    D --> G[Component Metrics]
    D --> H[Token Metrics]
    
    E --> I[Migration Paths]
    
    F --> J[Violations]
    
    G --> K[Coverage Report]
    H --> K
    I --> K
    J --> K
    
    K --> L[CI/CD Integration]
    K --> M[Analytics Dashboard]
```

## Accessibility Validation Flow

```mermaid
flowchart LR
    A[Component] --> B[A11yAuditor]
    
    B --> C[Color Contrast Check]
    B --> D[ARIA Validation]
    B --> E[Keyboard Nav Check]
    B --> F[Focus Indicator Check]
    B --> G[Text Alternative Check]
    
    C --> H[WCAG Compliance]
    D --> H
    E --> H
    F --> H
    G --> H
    
    H --> I[Violations Report]
    I --> J[Error Level]
    I --> K[Warning Level]
    I --> L[Info Level]
    
    J --> M[CI/CD Gate]
    K --> M
```

## Internationalization System

```mermaid
graph TD
    A[Translation Files] --> B[I18n Manager]
    B --> C[Locale Detection]
    B --> D[Translation Loading]
    
    C --> E[Browser Locale]
    C --> F[User Preference]
    C --> G[Fallback Locale]
    
    D --> H[Translation Cache]
    H --> I[React Context]
    
    I --> J[useTranslation Hook]
    J --> K[UI Components]
    
    L[Pluralization Rules] --> B
    M[Formatting Helpers] --> B
```

## Figma Integration Flow

```mermaid
flowchart LR
    A[Figma File] --> B[Figma Plugin]
    
    B --> C[Extract Paint Styles]
    B --> D[Extract Text Styles]
    B --> E[Extract Effect Styles]
    B --> F[Extract Spacing]
    
    C --> G[Color Tokens]
    D --> H[Typography Tokens]
    E --> I[Shadow Tokens]
    F --> J[Spacing Tokens]
    
    G --> K[Token Formatter]
    H --> K
    I --> K
    J --> K
    
    K --> L[Websmith JSON]
    L --> M[Import to Project]
    M --> N[Design Tokens]
```

## Performance Optimization Architecture

```mermaid
graph TD
    A[Token Generation] --> B[Cache Check]
    B -->|Hit| C[Return Cached]
    B -->|Miss| D[Generate New]
    
    D --> E[Batch Processing]
    E --> F[Deduplication]
    F --> G[Minification]
    
    G --> H[Store in Cache]
    H --> C
    
    I[CSS Generation] --> J[Optimization]
    J --> K[80-85% Faster]
    
    L[Component Loading] --> M[Code Splitting]
    M --> N[Lazy Loading]
    N --> O[Tree Shaking]
    O --> P[Minimal Bundle]
```</content>
<parameter name="filePath">ERD.md
````
