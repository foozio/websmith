import { Command } from 'commander';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const addCommand = new Command('add')
  .description('Add components to your project')
  .argument('<components...>', 'component names')
  .action(components => {
    const uiComponentsPath = join(
      __dirname,
      '../../../websmith-ui/src/components'
    );
    const projectComponentsPath = join(process.cwd(), 'components');

    mkdirSync(projectComponentsPath, { recursive: true });

    for (const component of components) {
      const componentFile = `${component}.tsx`;
      const sourcePath = join(uiComponentsPath, componentFile);
      const destPath = join(projectComponentsPath, componentFile);

      if (existsSync(sourcePath)) {
        copyFileSync(sourcePath, destPath);
        console.log(`Added ${component} to components/${componentFile}`);
      } else {
        console.error(`Component ${component} not found`);
      }
    }
  });
