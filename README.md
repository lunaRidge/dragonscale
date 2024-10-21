# dragonscale

A streamlined, production-ready fullstack mono repo scaffold, engineered for cross-platform efficiency and versatility in modern application development.

Drawing inspiration from dragon scales, it combines unyielding strength with remarkable flexibility. This comprehensive suite provides a stable foundation for your projects while adapting seamlessly to the ever-changing landscape of technology. It shields your work from common development challenges and empowers your applications to thrive in any environment.

## Description

Dragonscale is a CLI tool designed to generate a full-stack monorepo scaffold. It sets up a project structure that includes:

- Next.js for frontend development
- Taro for mobile app development
- Hono for backend services
- A shared package for common code

This structure allows for efficient code sharing and management across different platforms and services.

## Installation

To install dragonscale globally, run:

```bash
pnpm install -g dragonscale
```

## Usage

After installation, you can create a new project by running:

```bash
dragonscale
```

Follow the prompts to customize your project setup. You'll be asked about including different components like Next.js, Taro, and Hono.

## Example

Here's a typical workflow:

1. Run the CLI:

   ```bash
   dragonscale
   ```

2. Enter your project name when prompted:

   ```
   Enter project name: my-awesome-project
   ```

3. Choose which components to include:

   ```
   Include Next.js frontend? (Y/n)
   Include Taro mobile frontend? (Y/n)
   Include Hono backend? (Y/n)
   ```

4. The CLI will create your project structure and install dependencies:

   ```
   Creating project structure...
   Installing dependencies...
   ```

5. Once completed, you'll see:

   ```
   Congratulations! Your Dragon is Breathing Fire Now!
   ```

6. Navigate to your new project:
   ```bash
   cd my-awesome-project
   ```

## Project Structure

After running dragonscale, your project structure will look like this:

```
my-awesome-project/
├── client/
│   ├── nextjs/  (if selected)
│   └── taro/    (if selected)
├── backend/
│   └── hono/    (if selected)
├── packages/
│   └── shared/
├── package.json
└── pnpm-workspace.yaml
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any problems or have any questions, please open an issue on the [GitHub repository](https://github.com/lunaRidge/dragonscale).
