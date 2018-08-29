const child_process = require('child_process')
const fs = require('fs')

var numWorkers = require('os').cpus().length * 2;


let env = process.argv[2]
let uidFile = process.argv[3]

if (env !== 'prod') {
  env = env || 'test7'
}

uidFile = process.argv[3] ? process.argv[3] : './uid.txt'
var str = fs.readFileSync(uidFile, 'utf8');
var arr = []
if (str.indexOf(',') > 0) {
  arr = str.replace(/\s/g, '').split(',');
} else {
  arr = str.replace(/\s+/g, ',').split(',');
}

var uidLen = arr.length

const step = Math.ceil(uidLen / numWorkers)

let children = []
let errors = []
let locked = false

const time = (new Date()).getTime()

for (let i = 0; i < numWorkers; i++) {
  var n = child_process.fork('./child.js');

  n.on('message', function (m) {
    // console.log(`PARENT${i} got message:`, m);
    errors.push(m)

    if (!locked) {
      // 多进程写文件
      while (errors.length > 0) {
        locked = true

        const errorInfo = errors.shift()
        console.log(errorInfo)
        fs.appendFileSync(`./userLeft.${time}.txt`, `${errorInfo.url},`);
        fs.appendFileSync(`./error.${time}.txt`, `执行用户${errorInfo.url}时出错:${errorInfo.error}\n`);
      }
    }
    locked = false
  });

  let data = arr.slice(i * step, ((i + 1) * step < uidLen) ? (i + 1) * step : uidLen)

  n.send({
    time,
    index: i,
    env,
    uids: data
  });

  children.push(n)
}


function on_exit() {
  console.log('Process Exit');
  children.forEach((child) => {
    child.kill("SIGINT");
  })
  process.exit(0)
}

process.on('SIGINT', on_exit);
process.on('exit', on_exit);


