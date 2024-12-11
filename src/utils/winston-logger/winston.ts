import { inspect } from 'util';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const onlyLevels = (levels:string[]) => format(info => {
  if (levels.includes(info.level)) {
    return info;
  }
})();

export const getLogger = () =>{
  return createLogger({
    levels: {
      fatal: 0,
      error: 1,
      warn: 2,
      info: 3,
      debug: 4,
      verbose: 5,
    },
    level: 'verbose',
    transports: [
      new transports.DailyRotateFile({
        filename: 'logs/%DATE%-error.log',
        level: 'error',
        format: format.combine(format.timestamp(), format.json()),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d',
      }),
      
      
      new transports.DailyRotateFile({
        filename: `logs/%DATE%-api.log`,
        level: 'info',
        format: format.combine(onlyLevels(['info', 'warn']), format.timestamp(), format.json()),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxFiles: '30d',
      }),

      
      new transports.Console({
        level: 'verbose',
        format: format.combine(
          format.prettyPrint(),
          format.timestamp({ format: 'YYYY/MM/DD, hh:mm:ss a' }),
          format.ms(),
          format.printf((info: any) => {
            if(info.level == 'info') info.level = 'log';

            const getColorCode = (arg: string) => `\x1b[${arg}`;
            const getText = (content: string, color: string, bold?: boolean) => `${color}${bold ? '\x1b[1m' : ''}${content}${getColorCode('0m')}`;
          
            const colorCodes = {
              'log': '32m',
              'warn': '33m',
              'verbose': '36m',
              'fatal': '37m',
              'debug': '35m',
              'default': '31m'
            };
          
            let primaryColor = getColorCode(colorCodes[info.level] || colorCodes.default);
            let secondaryColor = getColorCode('33m');
            let baseColor = getColorCode('0m');
            let isBold = info.level === 'fatal';
            let showMs = ['NestFactory', 'InstanceLoader', 'RoutesResolver', 'RouterExplorer', 'NestApplication'].includes(info.context);
          
            let appAndPid = getText(`[Nest] ${process.pid}  - `, primaryColor, isBold) + " ";
            let logTimeStamp = getText(info.timestamp, baseColor, isBold) + "   ";
            let logLevel = getText(String(info.level).toUpperCase(), primaryColor, isBold) + " ";
            let logContext = getText(info.context ? `[${info.context}]` : '\b', secondaryColor, isBold) + " ";
            let logMessage = getText(info.message, primaryColor, isBold) + " ";
            let logMs = getText(info.ms, secondaryColor, isBold);
            let obj = ""
            if(typeof info.data == "object"){
              obj = "\n" + inspect(info.data, { depth: null, colors: true })
            }else if(typeof info.data == "string"){
              obj = "\n" + info.data;
            }
          
            return appAndPid + logTimeStamp + logLevel + (logContext.length > 777 ? '\n': '') + logContext + (logMessage.length > 777 || logContext.length > 777 ? '\n': '') + logMessage + (showMs ? logMs : '') + obj;
          }),
        ),
      }),
    ],
  });
} 

