import { describe, expect, test } from 'vitest';
import {
  brandPreset,
  modernPreset,
  themePresets,
} from '../presets';
import { createTailwindConfig, createThemeCSS } from '../theme';

describe('theme CSS generation', () => {
  test('emits CSS variables for core token sections', () => {
    const css = createThemeCSS(modernPreset.config);

    expect(css.startsWith(':root {')).toBe(true);
    expect(css).toContain('--primary-500');
    expect(css).toContain('--gray-900');
    expect(css).toContain('--spacing-4');
    expect(css).toContain('--shadow-sm');
    expect(css.trim().endsWith('}')).toBe(true);
  });

  test('respects overrides supplied by presets', () => {
    const css = createThemeCSS(brandPreset.config);

    expect(css).toContain('--primary-500: hsl(120, 100%, 60%)');
    expect(css).toContain('--gray-500');
  });
});

describe('tailwind config integration', () => {
  test('extends tailwind theme with token values', () => {
    const config = createTailwindConfig(modernPreset.config);

    expect(config.theme.extend.colors.primary['500']).toBeTruthy();
    expect(config.theme.extend.spacing['4']).toBeTruthy();
    expect(config.theme.extend.fontFamily.sans).toBeInstanceOf(Array);
    expect(config.theme.extend.boxShadow.sm).toBeTruthy();
    expect(config.theme.extend.borderRadius).toBeTruthy();
  });

  test('every preset can produce a tailwind config without throwing', () => {
    for (const preset of themePresets) {
      expect(() => createTailwindConfig(preset.config)).not.toThrow();
    }
  });
});
