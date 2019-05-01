import { CloudKit, Users as _Users, Field } from '~/cloudkit'

export default class Users extends _Users {
  static recordType = 'Users'

  @Field public scholar?: CloudKit.Reference
}
