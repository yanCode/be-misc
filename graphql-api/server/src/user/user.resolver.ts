import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver } from 'type-graphql';
import { FollowerInput, LoginInput, RegisterUserInput, User, UserFollowers } from './user.dto';
import { createUser, findUserByEmailOrUsername, findUsers, followUser, verifyPassword } from './user.service';
import { MyContext } from '../utils/createServer';

@Resolver(() => User)
class UserResolver {
  @Mutation(() => User)
  async register(@Arg('input') input: RegisterUserInput) {
    try {
      return await createUser(input);
    } catch (e) {
      //check if violates unique constraints
      throw e;
    }
  }

  @Authorized()
  @Query(() => User)
  me(@Ctx() context: MyContext) {
    console.log(context);
    return {
      id: '1',
      username: 'test_me',
      email: 'test_me@gmail.com',
    };
  }

  @Mutation(() => String)
  async login(@Arg('input') input: LoginInput, @Ctx() context: MyContext) {
    const user = await findUserByEmailOrUsername(input.usernameOrEmail);
    if (!user) {
      throw new Error('invalid credentials');
    }
    const isValid = await verifyPassword({
      password: user.password,
      candidatePassword: input.password,
    });
    if (!isValid) {
      throw new Error('invalid credentials');
    }
    const token = await context.reply?.jwtSign({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    if (!token) {
      throw new Error('error when creating token');
    }
    context.reply?.setCookie('token', token, {
      domain: 'localhost',
      path: '/',
      secure: false,
      httpOnly: true,
      sameSite: false,
    });
    return token;
  }

  @FieldResolver(() => UserFollowers)
  followers() {
    return {
      count: 1,
      items: [
        {
          id: '1',
          username: 'test_followers',
          email: 'test_followers@gmail.com',
        },
      ],
    };
  }

  @FieldResolver(() => UserFollowers)
  following() {
    return {
      count: 1,
      items: [
        {
          id: '1',
          username: 'test_followers',
          email: 'test_followers@gmail.com',
        },
      ],
    };
  }

  @Query(() => [User])
  users() {
    return findUsers();
  }

  @Mutation(() => User)
  async followUser(@Arg('input') input: FollowerInput, @Ctx() context: MyContext) {
    const result = await followUser({ ...input, userId: context.user?.id! });


  }
}

export default UserResolver;
