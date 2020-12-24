import React, { useEffect, useState } from 'react'
import { Typography, Popover, Button } from 'antd'
import axios from 'axios'
import './favorite.css'
import { useSelector } from 'react-redux'
import { IMAGE_BASE_URL, POSTER_SIZE } from '../../Config'
import { Link } from 'react-router-dom'

const { Title } = Typography

function FavoritePage() {
  const user = useSelector(state => state.user)

  const [Favorites, setFavorites] = useState([])
  const [Loading, setLoading] = useState(true)
  let variable = { userFrom: localStorage.getItem('userId') }

  useEffect(() => {
    fetchFavoredMovie()
  }, [])

  const fetchFavoredMovie = () => {
    axios.post('/api/favorite/getFavoredRecipe', variable).then(response => {
      if (response.data.success) {
        console.log(response.data.favorites)
        setFavorites(response.data.favorites)
        setLoading(false)
      } else {
        alert('Failed to get subscription videos')
      }
    })
  }

  const onClickDelete = (recipeId, userFrom) => {
    const variables = {
      recipeId: recipeId,
      userFrom: userFrom
    }

    axios.post('/api/favorite/removeFromFavorite', variables).then(response => {
      if (response.data.success) {
        fetchFavoredMovie()
      } else {
        alert('Failed to Remove From Favorite')
      }
    })
  }

  const renderCards = Favorites.map((favorite, index) => {
    /*
        const content = (
            <div>
                {favorite.moviePost ?
                    <img src={`${IMAGE_BASE_URL}${POSTER_SIZE}${favorite.moviePost}`} />
                    : "no image"}
            </div>
        );
*/
    return (
      <tr key={index}>
        <Popover title={`${favorite.recipeTitle}`}>
          <td>{favorite.recipeTitle}</td>
        </Popover>

        <td>{favorite.recipeCategory}</td>
        <td>
          <button
            onClick={() => onClickDelete(favorite.recipeId, favorite.userFrom)}
          >
            {' '}
            Eliminar{' '}
          </button>
        </td>
        <td>
          <Link to={`/Recetas/${favorite.recipeId}`}>
            <button className='btn btn-info  text-white rounded h5'>
              Detalles
            </button>
          </Link>
        </td>
      </tr>
    )
  })

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Title level={2}> Mis recetas favoritas </Title>
      <hr />
      {user.userData && !user.userData.isAuth ? (
        <div
          style={{
            width: '100%',
            fontSize: '2rem',
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <p>Debes loguearte primero...</p>
          <a href='/login'>Ir al login</a>
        </div>
      ) : (
        !Loading && (
          <table>
            <thead>
              <tr>
                <th>Nombre de la receta</th>
                <th>Categoria</th>
                <td>Remover de favoritos</td>
                <td>Ver Receta</td>
              </tr>
            </thead>
            <tbody>{renderCards}</tbody>
          </table>
        )
      )}
    </div>
  )
}

export default FavoritePage