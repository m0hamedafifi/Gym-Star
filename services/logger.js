const winston = require("winston");
const dotenv = require("dotenv");
const util = require('../util/utility');
dotenv.config();


class LoggerService {
  constructor(route) {
    this.route = route;

    const logger = winston.createLogger({
      level: "info",
      format: winston.format.printf(info => {
        let message = `${util.dateFormat()} - ${info.level.toUpperCase()} : ${info.message} `;
        message = info.obj ? message + ` data: ${JSON.stringify(info.obj)} | ` : message ;
        return message;
      }),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: ` ${process.env.Log_file} / ${route}.log ` }),
      ],
    });
    this.logger = logger
  }

async info (message)
{
   this.logger.log('info', message);
}

async info (message , obj)
{
     this.logger.log('info', message , {obj});
  
}

async error (message){
   this.logger.log('error', message);
}

async error (message , obj)
{
     this.logger.log('error', message , {obj});
}

};


module.exports = LoggerService ;