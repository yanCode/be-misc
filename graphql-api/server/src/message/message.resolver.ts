import { Arg, Authorized, Ctx, FieldResolver, Info, Mutation, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../utils/prisma';
import { CreateMessageInput, Message, PaginatedMessageResponse } from './message.dto';
import { Context } from '../utils/createServer';
import { createMessage } from './message.service';
import { findUserById } from '../user/user.service';

@Resolver(() => Message)
export class MessageResolver {
  @Query(() => [Message])
  async messages() {
    return prisma.message.findMany();
  }
  @Query(() => PaginatedMessageResponse)
  async messagePage(){
    return { //todo fix this logic.
      items: await prisma.message.findMany(),
      total: await prisma.message.count(),
      hasMore: true,
    }
  }
  @FieldResolver()
  async user(@Root() message: Message, @Info() info: any) {
    return findUserById(message.userId);
  }

  @Authorized()
  @Mutation(()=>Message)
  async createMessage(@Arg('input') input: CreateMessageInput, @Ctx() context: Context) {
    return createMessage({ ...input, userId: context.user!.id });
  }
}

