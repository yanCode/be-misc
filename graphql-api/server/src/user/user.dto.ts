import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { IsEmail, Length } from 'class-validator';

@ObjectType()
export class User {
  @Field(() => ID, { nullable: false })
  id: string;
  @Field(() => String, { nullable: false })
  username: string;
  @Field(() => String, { nullable: false })
  email: string;
}

@InputType()
export class RegisterUserInput {
  @Field({ nullable: false })
  username: string;

  @Field()
  @IsEmail()
  email: string;
  @Field()
  @Length(6, 13)
  password: string;
}

@InputType()
export class LoginInput {
  @Field({ nullable: false })
  usernameOrEmail: string;
  @Field()
  @Length(6, 13)
  password: string;
}
