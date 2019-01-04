import React from 'react'
import {Link} from 'gatsby'

const PixabayPage = ({data}) => {

    const photos = data.allPixabayPhoto.edges

    return (
        <div>

            <h1>Hi!</h1>
            <Link to="/">Go back to the homepage</Link>
             {photos.map((photo,i) =>
                
                <img key={i} src={photo.node.largeImageURL}/>
                
                
                
                )}

            
        </div>

    )


    
}

export default PixabayPage

export const query = graphql`
    query PhotoQuery{
        allPixabayPhoto(limit :10){
            edges{
                node{
                    largeImageURL
                }
            }
        }
    }
`
