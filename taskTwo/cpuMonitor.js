const pidusage = require('pidusage');
const pm2 = require('pm2');

const pid = process.pid;
const THRESHOLD = 70; 
const CHECK_INTERVAL = 5000; 
const PROCESS_NAME = 'app'; 

function monitorCPU() {
  setInterval(() => {
    pidusage(pid, (err, stats) => {
      if (err) {
        console.error('Error fetching CPU usage:', err);
        return;
      }

      const cpu = stats.cpu.toFixed(1);
      console.log(`CPU Usage: ${cpu}%`);

      if (cpu > THRESHOLD) {
        console.warn(`⚠ CPU usage is ${cpu}%. Restarting...`);
        restartApp();
      }
    });
  }, CHECK_INTERVAL);
}

function restartApp() {
  pm2.connect((err) => {
    if (err) {
      console.error('PM2 connection failed:', err);
      return;
    }

    pm2.restart(PROCESS_NAME, (err, proc) => {
      if (err) {
        console.error('Failed to restart app:', err);
      } else {
        console.log(`✅ Restarted app '${PROCESS_NAME}' due to high CPU.`);
      }

      pm2.disconnect();
    });
  });
}

monitorCPU();
