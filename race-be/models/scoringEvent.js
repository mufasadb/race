const { Model } = require('objection')

class ScoringEvents extends Model {
  static get tableName () {
    return 'scoringEvents'
  }
  static get virtualAttributes () {
    return ['pointTotal']
  }

  static get idColumn () {
    return 'id'
  }
  static get relationMappings () {
    // Import your related models at the top or use require syntax inside the function to prevent circular dependency issues
    const League = require('./league')
    const ScoreableObject = require('./scoreableObject')

    return {
      league: {
        relation: Model.BelongsToOneRelation,
        modelClass: League,
        join: {
          from: 'scoringEvents.leagueId',
          to: 'leagues.id'
        }
      },
      scoreableObject: {
        relation: Model.BelongsToOneRelation,
        modelClass: ScoreableObject,
        join: {
          from: 'scoringEvents.scoreableObjectId',
          to: 'scoreableObjects.id'
        }
      }
      // Add other relations if necessary
    }
  }
  get pointTotal () {
    // Assuming scoreableObject and league are loaded. You may need to adjust this logic.
    if (this.scoreableObject && this.league) {
      return this.scoreableObject.points * this.league.scoreMultiplier
    }
    return 0
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
        pointTotal: { type: 'integer' }
      }
    }
  }
}

module.exports = ScoringEvents
