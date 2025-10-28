import chatHandler from './handlers/chat';
import gameHandler from './handlers/game';

type WSHandler = (ws: any, req: any) => void;

const handlers: Record<string, WSHandler> = {
  '/chat': chatHandler,
  '/game': gameHandler
};

export function getHandler(pathname: string): WSHandler | undefined {
  return handlers[pathname];
}

export function registerHandler(pathname: string, handler: WSHandler) {
  handlers[pathname] = handler;
}