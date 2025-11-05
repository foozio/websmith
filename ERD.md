# Entity Relationship Diagram (ERD) for Websmith Kit

This document outlines the relationships between key entities, data structures, and components in the Websmith Kit codebase.

## Package Dependencies

```mermaid
graph TD
    A[websmith-kit (root)] --> B[websmith-ui]
    A --> C[websmith-tokens]
    A --> D[websmith-theme]
    A --> E[websmith-cli]
    A --> F[apps/docs]
    A --> G[apps/playground]

    B --> H[Radix UI]
    B --> I[Tailwind CSS]
    B --> J[class-variance-authority]

    E --> K[commander]

    F --> B
    F --> C
    F --> D

    G --> B
    G --> C
    G --> D
```

## Data Flow Architecture

```mermaid
flowchart LR
    A[Base Colors] --> B[Token Generators]
    B --> C[Design Tokens]
    C --> D[Theme Config]
    D --> E[CSS Variables]
    D --> F[Tailwind Config]
    E --> G[UI Components]
    F --> G
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
```</content>
<parameter name="filePath">ERD.md
````
