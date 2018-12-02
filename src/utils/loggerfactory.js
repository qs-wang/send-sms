const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

export const getLogger = function (name) {
  const localFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });

  return createLogger({
    format: combine(label({ label: name }), timestamp(), localFormat),
    transports: [
      new transports.Console({
        level: process.env.SEND_SMS_LOGLEVEL || 'info'
      }),
      new (transports.File)({
        filename: 'send-sms.log',
        level: process.env.SEND_SMS_LOGLEVEL || 'info'
      })
    ]
  });
};
