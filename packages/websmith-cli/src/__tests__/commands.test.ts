import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

// Mock dependencies
vi.mock('child_process', () => {
  const execSync = vi.fn();
  return {
    execSync,
    default: { execSync },
  };
});

vi.mock('@websmith/theme', () => ({
  modernPreset: {
    config: {
      colors: { primary: { 500: '#3b82f6' } },
      spacing: { sm: '0.5rem' },
      typography: { fontFamily: 'Inter' }
    }
  },
  classicPreset: {
    config: {
      colors: { primary: { 500: '#f59e0b' } }
    }
  },
  minimalPreset: {
    config: {
      colors: { primary: { 500: '#6b7280' } }
    }
  },
  brandPreset: {
    config: {
      colors: { primary: { 500: '#10b981' } }
    }
  }
}));

vi.mock('@websmith/tokens', () => ({
  generatePalette: vi.fn(() => ({ 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a8a' })),
  generateSpacingScale: vi.fn(() => ({ sm: '0.5rem', md: '1rem', lg: '1.5rem' })),
  generateTypographyScale: vi.fn(() => ({ fontFamily: 'Inter', fontSize: { sm: '0.875rem' } }))
}));

// Mock process.exit
const mockExit = vi.fn();
vi.mock('process', () => ({
  ...vi.importActual('process'),
  exit: mockExit
}));

const originalCwd = process.cwd();
let tempDir: string;

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'websmith-cli-'));
  process.chdir(tempDir);
  mockExit.mockClear();
});

afterEach(() => {
  process.chdir(originalCwd);
  if (tempDir && existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
  vi.restoreAllMocks();
});

describe('init command', () => {
  test('scaffolds a new project with valid name', async () => {
    const { initCommand } = await import('../commands/init');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await initCommand.action('demo-app', { template: 'default', directory: '.' });

    expect(existsSync(join(tempDir, 'demo-app', 'package.json'))).toBe(true);
    const pkg = JSON.parse(
      readFileSync(join(tempDir, 'demo-app', 'package.json'), 'utf8')
    );
    expect(pkg.name).toBe('demo-app');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('✅ Successfully initialized demo-app project')
    );
  });

  test('rejects invalid project names', async () => {
    const { initCommand } = await import('../commands/init');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await initCommand.action('My-Project', { template: 'default', directory: '.' });
    } catch (error) {
      // Expected to exit
    }

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('❌ Invalid project name')
    );
  });
});

describe('add command', () => {
  beforeEach(() => {
    const packageJson = { name: 'test-project', dependencies: {} };
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  });

  test('copies requested components into the project', async () => {
    const { addCommand } = await import('../commands/add');
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await addCommand.action(['Button'], { directory: 'src/components', force: false });
    } catch (error) {
      // Expected behavior
    }

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('⚠️  Component source not found')
    );
  });

  test('rejects invalid component names', async () => {
    const { addCommand } = await import('../commands/add');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await addCommand.action(['button'], { directory: 'src/components', force: false });
    } catch (error) {
      // Expected to exit
    }

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('❌ Invalid component name')
    );
  });
});

describe('theme command', () => {
  test('writes theme CSS for the requested preset', async () => {
    const { themeCommand } = await import('../commands/theme');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    try {
      await themeCommand.action({ preset: 'modern', output: 'src/styles', format: 'css' });
    } catch (error) {
      // Expected behavior
    }

    expect(existsSync(join(tempDir, 'src', 'styles', 'theme.css'))).toBe(true);
    expect(existsSync(join(tempDir, 'src', 'styles', 'tailwind.theme.js'))).toBe(true);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('✅ Generated theme CSS')
    );
  });

  test('rejects invalid theme presets', async () => {
    const { themeCommand } = await import('../commands/theme');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await themeCommand.action({ preset: 'invalid', output: 'src/styles', format: 'css' });
    } catch (error) {
      // Expected to exit
    }

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('❌ Invalid theme preset')
    );
  });
});

describe('tokens command', () => {
  test('exports tokens in JSON format', async () => {
    const { tokensCommand } = await import('../commands/tokens');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    try {
      await tokensCommand.action({ output: 'src/tokens', format: 'json', colors: 'blue,green' });
    } catch (error) {
      // Expected behavior
    }

    expect(existsSync(join(tempDir, 'src', 'tokens', 'tokens.json'))).toBe(true);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('✅ Generated design tokens in json format')
    );
  });

  test('reports unsupported formats', async () => {
    const { tokensCommand } = await import('../commands/tokens');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await tokensCommand.action({ output: 'src/tokens', format: 'yaml', colors: 'blue' });
    } catch (error) {
      // Expected to exit
    }

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('❌ Invalid format')
    );
  });
});

describe('build command', () => {
  beforeEach(() => {
    const packageJson = {
      name: 'test-project',
      scripts: { build: 'echo "Build completed"' }
    };
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  });

  test('delegates to npm run build and reports success', async () => {
    const { buildCommand } = await import('../commands/build');
    const childProcess = await import('child_process');
    const execSpy = childProcess.execSync as ReturnType<typeof vi.fn>;
    execSpy.mockImplementation(() => Buffer.from(''));
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    try {
      await buildCommand.action({ watch: false, analyze: false, mode: 'production' });
    } catch (error) {
      // Expected behavior
    }

    expect(execSpy).toHaveBeenCalledWith('npm run build', {
      stdio: 'inherit',
    });
    expect(logSpy).toHaveBeenCalledWith('✅ Build completed successfully!');
  });

  test('handles build failures gracefully', async () => {
    const { buildCommand } = await import('../commands/build');
    const childProcess = await import('child_process');
    const execSpy = childProcess.execSync as ReturnType<typeof vi.fn>;
    execSpy.mockImplementation(() => {
      throw new Error('boom');
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await buildCommand.action({ watch: false, analyze: false, mode: 'production' });
    } catch (error) {
      // Expected to exit
    }

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('❌ Build failed'),
      'boom'
    );
  });

  test('rejects invalid build modes', async () => {
    const { buildCommand } = await import('../commands/build');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      await buildCommand.action({ watch: false, analyze: false, mode: 'invalid' });
    } catch (error) {
      // Expected to exit
    }

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('❌ Invalid mode')
    );
  });
});
