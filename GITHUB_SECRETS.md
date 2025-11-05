# GitHub Secrets Configuration

This document outlines the GitHub repository secrets required for the Websmith Kit CI/CD pipeline.

## Required Secrets

### NPM_TOKEN

- **Purpose**: Authentication for publishing packages to NPM registry
- **How to obtain**:
  1. Go to [npmjs.com](https://www.npmjs.com)
  2. Log in to your account
  3. Go to Access Tokens in your account settings
  4. Create a new Automation token with Publish permissions
  5. Copy the token value
- **Usage**: Used by the release workflow to publish packages via `npm publish`
- **Required for**: Package publishing on releases

### VERCEL_TOKEN (Optional)

- **Purpose**: Authentication for deploying documentation site to Vercel
- **How to obtain**:
  1. Go to [vercel.com](https://vercel.com)
  2. Log in to your account
  3. Go to Account Settings > Tokens
  4. Create a new token
  5. Copy the token value
- **Usage**: Used by Vercel deployment workflows
- **Required for**: Automatic documentation site deployment

### CODECOV_TOKEN (Optional)

- **Purpose**: Upload test coverage reports to Codecov
- **How to obtain**:
  1. Go to [codecov.io](https://codecov.io)
  2. Sign in with GitHub
  3. Add your repository
  4. Copy the repository token
- **Usage**: Used by CI workflows to upload coverage reports
- **Required for**: Test coverage reporting

## Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Enter the secret name and value
5. Repeat for each required secret

## Security Notes

- Never commit secret values to the repository
- Rotate tokens regularly
- Use the principle of least privilege when creating tokens
- Monitor token usage in your accounts

## CI/CD Workflows

The following workflows use these secrets:

- `.github/workflows/release.yml`: Uses `NPM_TOKEN` for package publishing
- `.github/workflows/ci.yml`: May use `CODECOV_TOKEN` for coverage reporting
- Vercel deployment: Uses `VERCEL_TOKEN` for documentation deployment (if configured)

## Troubleshooting

### NPM Publish Fails

- Verify `NPM_TOKEN` is set correctly
- Ensure the token has publish permissions
- Check that the package version doesn't already exist on NPM

### Vercel Deployment Fails

- Verify `VERCEL_TOKEN` is valid
- Check Vercel project configuration
- Ensure the Vercel project is linked to the correct repository

### Coverage Upload Fails

- Verify `CODECOV_TOKEN` matches the repository
- Check that tests are generating coverage reports
- Ensure the upload step is correctly configured in CI</content>
  <parameter name="filePath">GITHUB_SECRETS.md
