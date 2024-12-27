import * as path from 'path'
import * as fs from 'fs'

export function debugPaths() {
  console.log('=== PATH DEBUG ===')
  
  // Current working directory
  console.log('Current Working Directory:', process.cwd())
  
  // Node executable path
  console.log('Node Executable Path:', process.execPath)
  
  // Check for ts-node
  const tsNodePaths = [
    path.join(process.cwd(), 'node_modules', '.bin', 'ts-node'),
    path.join(process.cwd(), 'node_modules', 'ts-node', 'dist', 'bin.js'),
    path.join(process.cwd(), 'node_modules', 'ts-node', 'dist', 'cli.js')
  ]

  console.log('Checking ts-node paths:')
  tsNodePaths.forEach(tsNodePath => {
    console.log(`- ${tsNodePath}: ${fs.existsSync(tsNodePath) ? 'EXISTS' : 'NOT FOUND'}`)
  })

  // Check PATH environment variable
  console.log('\nPATH Environment Variable:')
  process.env.PATH?.split(path.delimiter).forEach(p => console.log(`- ${p}`))

  // Check global npm bin directory
  try {
    const { execSync } = require('child_process')
    const globalBinPath = execSync('npm config get prefix').toString().trim()
    console.log('\nGlobal npm bin path:', globalBinPath)
  } catch (error) {
    console.error('Error getting npm global bin path:', error)
  }
}

// Run debug if this file is directly executed
if (require.main === module) {
  debugPaths()
}
