import { ClassType, Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import { Length } from 'class-validator';
import { User } from '../user/user.dto';
import PaginatedResponse from '../utils/PaginatedResponse';

@InputType()
export class CreateMessageInput {
  @Length(6, 200)
  @Field(() => String, { nullable: false })
  body: string;
  userId: string;
}

@ObjectType()
export class Message {
  @Field(() => ID, { nullable: false })
  id: string;
  @Field(() => String, { nullable: false })
  body: string;


  @Field(() => User, { nullable: false })
  user: User; //todo;
  @Field(() => String, { nullable: false })
  userId: string;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;

}
@ObjectType()
export class PaginatedMessageResponse extends PaginatedResponse(Message) {}




