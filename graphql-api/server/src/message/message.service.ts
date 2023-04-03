import { CreateMessageInput } from './message.dto';
import { prisma } from '../utils/prisma';

export function createMessage({userId, ...input}:CreateMessageInput){
  return prisma.message.create({
    data: {
      ...input,
      user: {
        connect: {//todo
          id: userId,
        },
      },
    },
  });
}
export function findMessage(filters:{userId:string}){
  return prisma.message.findMany({
    where: filters,
  });

}