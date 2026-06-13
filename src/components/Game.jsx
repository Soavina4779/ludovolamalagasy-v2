import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import GameBoard from './GameBoard'
import './Game.css'

function Game({ user }) {
  const [games, setGames] = useState([])
  const [currentGame, setCurrentGame] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadGames()
  }, [user])

  const loadGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('player1_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGames(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const createNewGame = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('games')
        .insert([{
          player1_id: user.id,
          status: 'playing',
          board: JSON.stringify(initializeBoard()),
          current_player: 1
        }])
        .select()

      if (error) throw error
      if (data && data[0]) {
        setCurrentGame(data[0])
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeBoard = () => {
    const board = Array(9).fill(null).map(() => Array(5).fill(0))
    // Initialiser les pions
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        board[i][j] = 1 // Joueur 1 (blanc)
      }
    }
    for (let i = 6; i < 9; i++) {
      for (let j = 0; j < 5; j++) {
        board[i][j] = 2 // Joueur 2 (bleu)
      }
    }
    return board
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>🎮 Fanorona</h1>
        <div className="user-info">
          <span>{user.email}</span>
          <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
        </div>
      </header>

      <div className="game-content">
        {currentGame ? (
          <div className="active-game">
            <button onClick={() => setCurrentGame(null)} className="back-btn">← Retour</button>
            <GameBoard game={currentGame} user={user} />
          </div>
        ) : (
          <div className="games-list">
            <h2>Mes Parties</h2>
            <button 
              onClick={createNewGame} 
              disabled={loading}
              className="new-game-btn"
            >
              {loading ? 'Création...' : '+ Nouvelle Partie'}
            </button>

            <div className="games">
              {games.length === 0 ? (
                <p className="no-games">Aucune partie. Créez-en une pour commencer!</p>
              ) : (
                games.map(game => (
                  <div key={game.id} className="game-card" onClick={() => setCurrentGame(game)}>
                    <div className="game-status">{game.status}</div>
                    <p>Joueur actuel: {game.current_player}</p>
                    <small>{new Date(game.created_at).toLocaleDateString('fr-FR')}</small>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Game
