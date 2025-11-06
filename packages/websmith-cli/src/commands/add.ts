import { Command } from 'commander';
import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { validateComponentName, sanitizePath, ValidationError } from '../utils/security';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// List of available components
const AVAILABLE_COMPONENTS = [
  'Button', 'Input', 'Card', 'Alert', 'Toast', 'Dialog', 'Dropdown',
  'Select', 'Checkbox', 'Radio', 'Switch', 'Tabs', 'Accordion',
  'Avatar', 'Badge', 'Progress', 'Skeleton', 'Tooltip', 'Popover',
  'Container', 'Grid', 'Stack', 'Divider', 'Heading', 'Text', 'Link', 'Table'
];

export const addCommand = new Command('add')
  .description('Add Websmith Kit components to your project')
  .argument('<components...>', 'component names (PascalCase)')
  .option('-d, --directory <directory>', 'output directory', 'src/components')
  .option('-f, --force', 'overwrite existing files', false)
  .action((components, options) => {
    try {
      // Validate all component names
      for (const component of components) {
        if (!validateComponentName(component)) {
          console.error(`❌ Invalid component name: ${component}`)
          console.error('   Component names must be PascalCase (e.g., Button, Card, Alert)')
          console.error(`   Available components: ${AVAILABLE_COMPONENTS.join(', ')}`)
          process.exit(1)
        }

        if (!AVAILABLE_COMPONENTS.includes(component)) {
          console.error(`❌ Component ${component} is not available`)
          console.error(`   Available components: ${AVAILABLE_COMPONENTS.join(', ')}`)
          process.exit(1)
        }
      }

      // Sanitize directory path
      const outputDir = sanitizePath(options.directory);
      const projectComponentsPath = resolve(process.cwd(), outputDir);

      // Create components directory if it doesn't exist
      mkdirSync(projectComponentsPath, { recursive: true });

      // Get the path to the UI components in the monorepo
      const uiComponentsPath = resolve(
        __dirname,
        '../../../websmith-ui/src/components'
      );

      // Check if we're in a Websmith Kit project
      const packageJsonPath = resolve(process.cwd(), 'package.json');
      if (!existsSync(packageJsonPath)) {
        console.error('❌ Not in a Node.js project. Please run this command in a project directory.');
        process.exit(1);
      }

      let packageJson;
      try {
        packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      } catch (error) {
        console.error('❌ Failed to read package.json');
        process.exit(1);
      }

      // Check if @websmith/ui is already a dependency
      if (!packageJson.dependencies?.['@websmith/ui'] && !packageJson.devDependencies?.['@websmith/ui']) {
        console.log('📦 Adding @websmith/ui to dependencies...');
        packageJson.dependencies = {
          ...packageJson.dependencies,
          '@websmith/ui': '^1.0.0'
        };
        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }

      // Copy components
      let addedCount = 0;
      for (const component of components) {
        const componentFile = `${component}.tsx`;
        const sourcePath = join(uiComponentsPath, componentFile);
        const destPath = join(projectComponentsPath, componentFile);

        // Check if source component exists
        if (!existsSync(sourcePath)) {
          console.error(`⚠️  Component source not found: ${componentFile}`);
          continue;
        }

        // Check if destination file exists
        if (existsSync(destPath) && !options.force) {
          console.log(`⚠️  Component ${componentFile} already exists. Use --force to overwrite.`);
          continue;
        }

        try {
          copyFileSync(sourcePath, destPath);
          console.log(`✅ Added ${component} to ${outputDir}/${componentFile}`);
          addedCount++;
        } catch (error) {
          console.error(`❌ Failed to copy ${component}:`, error);
        }
      }

      if (addedCount > 0) {
        console.log(`\n🎉 Successfully added ${addedCount} component(s)!`);
        console.log(`\n📝 Next steps:`);
        console.log(`   1. Run 'npm install' to install dependencies`);
        console.log(`   2. Import components in your code:`);
        console.log(`      import { ${components.join(', ')} } from '@websmith/ui'`);
        console.log(`\n📚 Documentation: https://websmith.vercel.app/components`);
      } else {
        console.log(`\n⚠️  No components were added.`);
      }

    } catch (error) {
      if (error instanceof ValidationError) {
        console.error(`❌ Validation error: ${error.message}`);
      } else {
        console.error('❌ Failed to add components:', error);
      }
      process.exit(1);
    }
  });
