#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { spawn } from "child_process";

const program = new Command();

const isUTF8Supported = process.env.LANG && process.env.LANG.includes("UTF-8");

const BANNER = `
${chalk.red("╔═══╗")}${chalk.blue("─────────────")}${chalk.red(
  "╔═══╗"
)}${chalk.blue("─────")}${chalk.red("╔╗")}
${chalk.red("╚╗╔╗║")}${chalk.blue("─────────────")}${chalk.red(
  "║╔═╗║"
)}${chalk.blue("─────")}${chalk.red("║║")}
${chalk.blue("─")}${chalk.red("║║║╠═╦══╦══╦══╦═╗║╚══╦══╦══╣║╔══╗")}
${chalk.blue("─")}${chalk.red("║║║║╔╣╔╗║╔╗║╔╗║╔╗╬══╗║╔═╣╔╗║║║║═╣")}
${chalk.red("╔╝╚╝║║║╔╗║╚╝║╚╝║║║║╚═╝║╚═╣╔╗║╚╣║═╣")}
${chalk.red("╚═══╩╝╚╝╚╩═╗╠══╩╝╚╩═══╩══╩╝╚╩═╩══╝")}
${chalk.blue("─────────")}${chalk.red("╔═╝║")}
${chalk.blue("─────────")}${chalk.red("╚══╝")}
`;

program
  .version("0.0.8")
  .description("CLI to generate a full-stack mono-repo scaffold")
  .action(async () => {
    console.log(BANNER); // 显示彩色横幅
    const intro =
      "A customizable full-stack monorepo, freely integrating your preferred open-source technologies.";

    console.log(
      chalk.bold.hex("#FF1493")(
        isUTF8Supported ? "龍鳞: " + intro : "DragonScale: " + intro
      )
    );
    console.log(chalk.cyan(`Version: ${program.version()}`));
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Enter project name:",
        default: "my-ds-project",
      },
      {
        type: "confirm",
        name: "includeNextjs",
        message: "Include Next.js frontend?",
        default: true,
      },
      {
        type: "confirm",
        name: "includeTaro",
        message: "Include Taro mobile frontend?",
        default: true,
      },
      {
        type: "confirm",
        name: "includeHono",
        message: "Include Hono backend?",
        default: true,
      },
    ]);

    // 创建项目结构
    await createProjectStructure(answers);
  });

async function createProjectStructure(answers: any) {
  const { projectName, includeNextjs, includeTaro, includeHono } = answers;

  //process.cwd() 返回当前工作目录，与项目名称拼接
  const projectPath = path.join(process.cwd(), projectName);

  // 创建根目录
  await fs.ensureDir(projectPath);

  // 复制模板文件
  await copyTemplateFiles(projectPath, includeNextjs, includeTaro, includeHono);

  // 创建 package.json
  await createPackageJson(projectPath, includeNextjs, includeHono);

  // 创建其他必要文件
  await createOtherNecessaryFiles(projectPath);

  // 安装依赖
  await installDependencies(projectPath);

  // 执行其他代码，生成 Prisma 客户端
  await runOtherScripts(projectPath);

  console.log(
    chalk.bold.hex("#FF1493")(
      "Congratulations! Your Dragon is Breathing Fire Now!"
    )
  );
}

async function copyTemplateFiles(
  projectPath: string,
  includeNextjs: boolean,
  includeTaro: boolean,
  includeHono: boolean
) {
  const templatePath = path.join(import.meta.dirname, "templates");

  if (includeNextjs) {
    await fs.copy(
      path.join(templatePath, "nextjs"),
      path.join(projectPath, "client/nextjs")
    );
  }

  if (includeTaro) {
    await fs.copy(
      path.join(templatePath, "taro"),
      path.join(projectPath, "client/taro")
    );
  }

  if (includeHono) {
    await fs.copy(
      path.join(templatePath, "hono"),
      path.join(projectPath, "backend/hono")
    );
  }

  // 复制共享包
  await fs.copy(
    path.join(templatePath, "shared"),
    path.join(projectPath, "packages/shared")
  );
}

async function createPackageJson(
  projectPath: string,
  includeNextjs: boolean,
  includeHono: boolean
) {
  const packageJson = {
    name: path.basename(projectPath),
    private: true,
    workspaces: ["packages/*", "client/*", "backend/*"],
    scripts: {} as Record<string, string>,
  };

  if (includeNextjs) {
    packageJson.scripts["dev:next"] = "cd client/nextjs && pnpm run dev";
  }

  if (includeHono) {
    packageJson.scripts["dev:hono"] = "cd backend/hono && pnpm run dev";
  }

  await fs.writeJson(path.join(projectPath, "package.json"), packageJson, {
    spaces: 2,
  });
}

async function createOtherNecessaryFiles(projectPath: string) {
  // 创建 .npmrc 文件
  const npmrcPath = path.join(projectPath, ".npmrc");
  await fs.writeFile(npmrcPath, "strict-peer-dependencies=false\n");

  // 创建 .gitignore 文件
  const gitignorePath = path.join(projectPath, ".gitignore");
  await fs.writeFile(gitignorePath, "node_modules\n");

  // 创建 pnpm-workspace.yaml
  const pnpmWorkspacePath = path.join(projectPath, "pnpm-workspace.yaml");
  await fs.writeFile(
    pnpmWorkspacePath,
    "packages:\n  - packages/*\n  - client/*\n  - backend/*\n"
  );
}

async function installDependencies(projectPath: string) {
  console.log(chalk.blue("正在安装依赖..."));

  return new Promise<void>((resolve, reject) => {
    const pnpmInstall = spawn("pnpm", ["install", "--loglevel", "error"], {
      cwd: projectPath,
      stdio: "inherit",
    });

    pnpmInstall.on("close", (code) => {
      if (code === 0) {
        console.log(chalk.green("依赖安装成功!"));

        resolve();
      } else {
        console.error(chalk.red("依赖安装失败: 退出码 " + code));
        reject(new Error(`依赖安装失败: 退出码 ${code}`));
      }
    });

    pnpmInstall.on("error", (error) => {
      console.error(chalk.red("依赖安装失败:"), error);
      reject(error);
    });
  });
}

//执行其他脚本命令
async function runOtherScripts(projectPath: string) {
  const prismaPath = path.join(projectPath, "backend/hono");
  console.log(chalk.blue("正在生成 Prisma 客户端..."));

  const prismaGenerate = spawn("npx", ["prisma", "generate"], {
    cwd: prismaPath,
    stdio: "inherit",
  });

  return new Promise<void>((resolve, reject) => {
    prismaGenerate.on("close", (code) => {
      if (code === 0) {
        console.log(chalk.green("Prisma 客户端生成成功!"));
        resolve();
      } else {
        console.error(chalk.red("Prisma 客户端生成失败: 退出码 " + code));
        reject(new Error("Prisma 客户端生成失败"));
      }
    });

    prismaGenerate.on("error", (error) => {
      console.error(chalk.red("Prisma 客户端生成失败:"), error);
      reject(error);
    });
  });
}

program.parse(process.argv);
