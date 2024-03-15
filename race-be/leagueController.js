function handleLeaguesRequest(req, res) {
    const playerId = req.params.playerId;
    knex('leagues').where({ player_id: playerId }).then(leagues => {
      res.json(leagues);
    }).catch(err => {
      // Handle error
    });
  }