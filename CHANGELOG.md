# Astro Cookie Session

## [1.3.0](https://github.com/koyopro/astro-cookie-session/compare/1.2.0...1.3.0) (2025-04-20)

### Minor Changes

- Encryption of Payloads ([#4](https://github.com/koyopro/astro-cookie-session/pull/4))
  - For improved security, session payloads are now encrypted.
  - Backward compatibility is maintained, allowing session data created before this change to still be read.
  - Previously, session payloads were Base64-encoded, but they are now encrypted using AES.
  - Even for sessions created before this change, payloads remain protected against tampering and JavaScript access.

## [1.2.0](https://github.com/koyopro/astro-cookie-session/compare/1.1.0...1.2.0) (2025-03-18)

### Minor Changes

- Improvement of environment variable reading ([#2](https://github.com/koyopro/astro-cookie-session/pull/2))
  - Modified to fetch the `SECRET_KEY_BASE` environment variable from both `process.env` and `import.meta.env`

## [1.1.0](https://github.com/koyopro/astro-cookie-session/compare/1.0.0...1.1.0) (2024-10-11)

### Minor Changes

- Flash ([#1](https://github.com/koyopro/astro-cookie-session/pull/1))

## [1.0.0](https://github.com/koyopro/astro-cookie-session/commits/1.0.0) (2024-10-07)

- Initial release
