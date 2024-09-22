import { $ } from 'bun'

const isDirectCall = import.meta.url === `file://${process.argv[1]}`

export async function runBuild() {
  console.log('Running build script...', isDirectCall ? 'directly' : 'indirectly')

  // Build the image
  await $`docker buildx build --platform linux/arm64 -t kylyi/${import.meta.env.DOCKER_NAME}:latest -f Dockerfile .`

  // Push the image
  await $`docker image push kylyi/${import.meta.env.DOCKER_NAME}:latest`

  // Trigger the deployment
  fetch(import.meta.env.COOLIFY_WEBHOOK_URL, {
    headers: {
      Authorization: `Bearer ${import.meta.env.COOLIFY_API_TOKEN}`,
    },
  })
}

if (isDirectCall) {
  runBuild()
}
