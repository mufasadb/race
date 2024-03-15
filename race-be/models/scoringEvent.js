const { Model } = require('objection')

class ScoringEvents extends Model {
  static get tableName () {
    return 'scoreEvents'
  }
  static get virtualAttributes () {
    return ['point_total']
  }

  static get idColumn () {
    return 'id'
  }
  get point_total () {
    return {
      league: {
        relation: Model.BelongsToOneRelation,
        modelClass: League,
        join: {
          from: 'scoreEvents.league_id',
          to: 'leagues.id'
        }
      },
      scoreableObject: {
        relation: Model.BelongsToOneRelation,
        modelClass: ScoreableObject,
        join: {
          from: 'scoreEvents.scoreable_object_id',
          to: 'scoreableObjects.id'
        }
      }
    }
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['scoreable_object_id', 'league_id'],
      properties: {
        id: { type: 'integer' },
        team_id: { type: ['integer', 'null'] },
        user_id: { type: ['integer', 'null'] },
        scoreable_object_id: { type: 'integer' },
        character_id: { type: ['integer', 'null'] },
        league_id: { type: 'integer' },
        timestamp: { type: 'string', format: 'date-time' },
        is_approved: { type: 'boolean' },
        evidence_url: { type: ['string', 'null'], maxLength: 255 },
        point_total: { type: 'integer'}
      }
    }
  }
}

module.exports = ScoringEvents
