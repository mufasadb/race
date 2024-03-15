const { Model } = require('objection')

class User extends Model {
  static get tableName () {
    return 'users'
  }

  static get idColumn () {
    return 'id'
  }
  static get relationMappings() {
    return {
      scoringEvents: {
        relation: Model.HasManyRelation,
        modelClass: ScoringEvent,
        join: {
          from: 'users.id',
          to: 'scoringEvents.user_id'
        }
      }
    };
  }

  static get virtualAttributes() {
    return ['totalScore'];
  }
  get totalScore() {
    if (this.scoringEvents) {
      return this.scoringEvents.reduce((total, scoringEvent) => total + scoringEvent.point_total, 0);
    }
    return null;
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['username', 'role'],
      properties: {
        id: { type: 'integer' },
        username: { type: 'string', minLength: 1, maxLength: 255 },
        role: { type: 'string', enum: ['player', 'team_leader', 'admin'] },
        team_id: { type: ['integer', 'null'] },
        totalScore: { type: 'integer' }
      }
    }
  }
}

module.exports = User
