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

vi.mock('child_process', () => {
  const execSync = vi.fn();
  return {
    execSync,
    default: { execSync },
  };
});

const { addCommand } = await import('../commands/add');
const { buildCommand } = await import('../commands/build');
const { initCommand } = await import('../commands/init');
const { themeCommand } = await import('../commands/theme');
const { tokensCommand } = await import('../commands/tokens');
const childProcess = await import('child_process');

const originalCwd = process.cwd();
let tempDir: string;

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'websmith-cli-'));
  process.chdir(tempDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  if (tempDir && existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
  vi.restoreAllMocks();
});

describe('init command', () => {
  test('scaffolds a new project', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await initCommand.parseAsync(['demo-app'], { from: 'user' });

    expect(existsSync(join(tempDir, 'demo-app', 'package.json'))).toBe(true);
    const pkg = JSON.parse(
      readFileSync(join(tempDir, 'demo-app', 'package.json'), 'utf8')
    );
    expect(pkg.name).toBe('demo-app');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Project demo-app initialized successfully!')
    );
  });
});

describe('add command', () => {
  test('copies requested components into the project', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await addCommand.parseAsync(['Button'], { from: 'user' });

    expect(
      existsSync(join(tempDir, 'components', 'Button.tsx'))
    ).toBe(true);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Added Button to components/Button.tsx')
    );
    expect(errorSpy).not.toHaveBeenCalled();
  });
});

describe('theme command', () => {
  test('writes theme CSS for the requested preset', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await themeCommand.parseAsync(
      ['generate', '--preset', 'modern'],
      { from: 'user' }
    );

    const css = readFileSync(join(tempDir, 'theme.css'), 'utf8');
    expect(css).toContain('--primary-500');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Theme generated with preset 'Modern'")
    );
  });
});

describe('tokens command', () => {
  test('exports tokens in CSS format', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await tokensCommand.parseAsync(
      ['export', '--format', 'css'],
      { from: 'user' }
    );

    const css = readFileSync(join(tempDir, 'tokens.css'), 'utf8');
    expect(css).toContain('--primary-500');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Tokens exported to tokens.css')
    );
  });

  test('reports unsupported formats', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await tokensCommand.parseAsync(
      ['export', '--format', 'yaml'],
      { from: 'user' }
    );

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unsupported format')
    );
    expect(existsSync(join(tempDir, 'tokens.yaml'))).toBe(false);
  });
});

describe('build command', () => {
  test('delegates to npm run build and reports success', async () => {
    const execSpy = childProcess.execSync as ReturnType<typeof vi.fn>;
    execSpy.mockImplementation(() => Buffer.from(''));
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await buildCommand.parseAsync([], { from: 'user' });

    expect(execSpy).toHaveBeenCalledWith('npm run build', {
      stdio: 'inherit',
    });
    expect(logSpy).toHaveBeenCalledWith('Build completed successfully!');
  });

  test('handles build failures gracefully', async () => {
    const execSpy = childProcess.execSync as ReturnType<typeof vi.fn>;
    execSpy.mockImplementation(() => {
      throw new Error('boom');
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation(((code?: number) => {
        throw new Error(`exit ${code}`);
      }) as never);

    await expect(
      buildCommand.parseAsync([], { from: 'user' })
    ).rejects.toThrow('exit 1');
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Build failed:'),
      'boom'
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
