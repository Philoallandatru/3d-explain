import { cp, copyFile, mkdir, mkdtemp, readdir, rename, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const at = path => join(root, path)
const stage = await mkdtemp(at('.site-build-'))
const inStage = path => join(stage, path)
const output = at('dist')

try {
  await copyFile(at('index.html'), inStage('index.html'))
  await copyFile(at('NOTICE.md'), inStage('NOTICE.md'))
  await mkdir(inStage('ssd-model'))
  const ssdFiles = await readdir(at('ssd-model'))
  const viewerFiles = ssdFiles.filter(entry => entry === 'view.html' || /\.(md|json|csv|png)$/.test(entry))
  for (const entry of viewerFiles) {
    await copyFile(at('ssd-model/' + entry), inStage('ssd-model/' + entry))
  }
  await mkdir(inStage('ssd-model/viewer'))
  await copyFile(at('ssd-model/viewer/THREE-LICENSE.txt'), inStage('ssd-model/viewer/THREE-LICENSE.txt'))
  await cp(at('nvme-power-cycle/dist'), inStage('nvme-power-cycle'), { recursive: true })
  await copyFile(at('nvme-power-cycle/preview.png'), inStage('nvme-power-cycle/preview.png'))
  await rm(output, { recursive: true, force: true })
  await rename(stage, output)
  console.log('3D 场景已汇总到 dist/')
} finally {
  await rm(stage, { recursive: true, force: true })
}
