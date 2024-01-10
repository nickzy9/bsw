import config from '../config';

export enum LogLevel {
  Info = 'INFO',
  Error = 'ERROR',
  Debug = 'DEBUG',
}

export const log = (
  messageObject: any,
  type: LogLevel = LogLevel.Info,
  ...optionalParams: any[]
): void => {
  if (!config.loggingEnabled) {
    return;
  }
  const formattedMessage = `${JSON.stringify(messageObject)}`;

  switch (type) {
    case LogLevel.Info:
      console.info(formattedMessage, ...optionalParams);
      break;
    case LogLevel.Error:
      console.error(formattedMessage, ...optionalParams);
      break;
    case LogLevel.Debug:
      console.debug(formattedMessage, ...optionalParams);
      break;
    default:
      console.log(formattedMessage, ...optionalParams);
  }
};
