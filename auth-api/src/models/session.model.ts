import { User } from './user.model';
import { getModelForClass, prop, Prop, Ref } from '@typegoose/typegoose';

export class Session {
  @Prop({ ref: () => User })
  user: Ref<User>;
  @prop({ default: true })
  valid: boolean;
}

export const SessionModel = getModelForClass(Session, {
  schemaOptions: { timestamps: true },
});
