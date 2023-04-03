import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../utils/prisma';
import { CreateMessageInput, Message } from './message.dto';
import { Context } from '../utils/createServer';
import { createMessage } from './message.service';
import { findUserById } from '../user/user.service';

@Resolver(() => Message)
export class MessageResolver {
  @Query(() => [Message])
  async messages() {
    return prisma.message.findMany();
  }

  @FieldResolver()
  async user(@Root() message: Message) {
    return findUserById(message.userId);
  }

  @Authorized()
  @Mutation()
  async createMessage(@Arg('input') input: CreateMessageInput, @Ctx() context: Context) {
    return createMessage({ ...input, userId: context.user!.id });
  }
}

