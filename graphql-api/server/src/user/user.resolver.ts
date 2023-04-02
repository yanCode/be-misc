import { Query, Resolver } from 'type-graphql';
import { User } from './user.service';

@Resolver(() => User)
class UserResolver {
  @Query(() => User)
  user() {
    return {
      id: '124',
      email: 'mm@mm.com',
      username: 'mm',
      password: '3334',
    };
  }
}

export default UserResolver;
