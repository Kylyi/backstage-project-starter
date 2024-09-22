import * as p from '@clack/prompts'
import color from 'picocolors'

import { runGitModulesCommit } from './scripts/git-modules-commit'
import { runBuild } from './scripts/build'
import { runGitModulesInstall } from './scripts/git-modules-install'
import { runOnPrisma } from './scripts/on-prisma'
import { runGitModulesRemove } from './scripts/git-module-remove'

p.intro(`${color.bgCyan(color.black('Scripts'))}`)

const prompt = await p.group(
  {
    script: () => p.select({
      message: 'Select scripts to run:',
      options: [
        { label: 'Run git modules commit', value: runGitModulesCommit },
        { label: 'Run git modules install', value: runGitModulesInstall },
        { label: 'Run git module remove', value: runGitModulesRemove },
        { label: 'Run build', value: runBuild },
        { label: 'Run on prisma', value: runOnPrisma },
      ],
    }),
  },
  {
    onCancel: () => {
      p.cancel('Operation cancelled.')
      process.exit(0)
    },
  },
)

await prompt.script()
