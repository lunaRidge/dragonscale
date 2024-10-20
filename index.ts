#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const program = new Command();

program
  .version("1.0.0")
  .description("CLI to generate a full-stack mono-repo scaffold")
  .action(async () => {
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

    console.log(chalk.green("Your fire dragon is breathing now!"));
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
}

async function copyTemplateFiles(
  projectPath: string,
  includeNextjs: boolean,
  includeTaro: boolean,
  includeHono: boolean
) {
  const templatePath = path.join(__dirname, "./templates");

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
    scripts: {},
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

program.parse(process.argv);
