import { Request } from 'express';
import * as requestIp from 'request-ip';

// context 객체에서 ip address 가져오기
export const getIpAddress = (request: Request) => {
  let ipAddress = '';

  if (request?.clientIp) {
    ipAddress = request?.clientIp;
  } else {
    ipAddress = requestIp.getClientIp(request).replace('::ffff:', ''); // In case we forgot to include requestIp.mw() in main.ts
  }

  return ipAddress;
};
