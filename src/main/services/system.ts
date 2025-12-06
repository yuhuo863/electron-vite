import { ipcMain } from 'electron/main'
import os from 'os'

export const handleSystemOperation = (): void => {
  ipcMain.handle('system:getInfo', (): SystemInfo => {
    const totalMemBytes = os.totalmem()
    const freeMemBytes = os.freemem()

    const cpus = os.cpus()
    const cpuInfo = {
      model: cpus.length > 0 ? cpus[0].model : '未知',
      cores: cpus.length
    }

    const osInfo = {
      type: os.type(),
      platform: os.platform(),
      release: os.release(),
      uptime: os.uptime(),
      hostname: os.hostname(),
      arch: os.arch(),
      cpus: cpuInfo,
      totalMemBytes: totalMemBytes,
      freeMemBytes: freeMemBytes
    }

    const interfaces = os.networkInterfaces()
    const localIps: LocalIp[] = []

    for (const dev in interfaces) {
      const iface = interfaces[dev]
      if (!iface) continue

      for (const alias of iface) {
        if (alias.family === 'IPv4' && !alias.internal && !alias.address.startsWith('169.254')) {
          localIps.push({
            name: dev,
            address: alias.address
          })
        }
      }
    }

    return {
      ...osInfo,
      localIps: localIps.length > 0 ? localIps : [{ name: '未知', address: '未检测到内网 IP' }]
    }
  })
}
