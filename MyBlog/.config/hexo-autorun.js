// 启动子进程
const { spawn } = require('child_process');
const child = spawn('hexo', ['s']);

// 监听 PM2 的停止事件
process.on('SIGINT', () => {
  child.kill();
  process.exit();
});
