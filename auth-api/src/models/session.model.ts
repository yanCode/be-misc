import { User } from 'src/models/user.model';
import { getModelForClass, index, prop, Prop, Ref } from '@typegoose/typegoose';

@index({ user: 1 })
export class Session {
  @Prop({ ref: () => User })
  user: Ref<User>;
  @prop({ default: true })
  valid: boolean;
}

export const SessionModel = getModelForClass(Session, {
  schemaOptions: { timestamps: true },
});
