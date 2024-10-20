import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const REMOTE_USER = "ts";
const REMOTE_HOST = "192.168.1.141";
const REMOTE_PATH = "/home/ts/deploy/mono";
const HONO_PATH = `${REMOTE_PATH}/backend/hono`;
const IMAGE_NAME = "hono-app";
const CONTAINER_NAME = "hono-container";
const REPO_URL = "git@github.com:outsource-repos/mono.git";

async function deploy() {
  try {
    console.log("Starting deployment...");

    console.log("Pushing code to remote repository...");
    await execAsync("git push origin main");

    console.log("Connecting to remote server...");
    const sshCommand = `ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} "
      set -e
      mkdir -p ${REMOTE_PATH}
      cd ${REMOTE_PATH}
      if [ ! -d .git ]; then
        git clone ${REPO_URL} .
      else
        git fetch origin
        git reset --hard origin/main
      fi
      cd ${HONO_PATH}
      echo '=== Current working directory ==='
      pwd
      echo '=== Dockerfile path ==='
      ls -l Dockerfile || echo 'Dockerfile not found'
      echo '=== Directory contents ==='
      ls -la
      echo '=== Parent directory contents ==='
      ls -la ..
      echo '=== Checking Docker configuration ==='
      docker info
      echo '=== Building Docker image ==='
      docker build --no-cache -t ${IMAGE_NAME} .
      echo '=== Running Docker container ==='
      docker stop ${CONTAINER_NAME} || true
      docker rm ${CONTAINER_NAME} || true
      docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${IMAGE_NAME}
    "`;

    await execAsync(sshCommand);

    console.log("Deployment completed!");
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

deploy();
